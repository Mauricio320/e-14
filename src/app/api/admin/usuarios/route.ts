import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { crearUsuarioSchema } from '@/lib/validations/schemas'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validar datos de entrada
    const result = crearUsuarioSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const { email, password, fullName, role } = result.data

    // Verificar que el usuario actual es admin (maestro)
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Obtener el perfil del usuario actual
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!currentProfile || (currentProfile as { role: string }).role !== 'maestro') {
      return NextResponse.json(
        { error: 'Solo los administradores pueden crear usuarios' },
        { status: 403 }
      )
    }

    // Crear el usuario usando el admin client con SERVICE_ROLE_KEY
    // Esto permite crear usuarios sin confirmación de email
    const adminClient = createAdminClient()

    // Paso 1: Crear usuario auth
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirma el email para que el usuario pueda iniciar sesión inmediatamente
      user_metadata: {
        full_name: fullName,
        role: role,
      },
    })

    if (authError) {
      console.error('Error creando usuario auth:', authError)
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'No se pudo crear el usuario' },
        { status: 500 }
      )
    }

    // Paso 2: Crear perfil explícitamente (el trigger puede estar fallando)
    const { error: profileError } = await adminClient
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        full_name: fullName,
        role: role,
        activo: true,
      })

    // Paso 3: Rollback si falla la creación del perfil
    if (profileError) {
      console.error('Error creando perfil:', profileError)

      // Eliminar el usuario auth para mantener consistencia
      const { error: deleteError } = await adminClient.auth.admin.deleteUser(authData.user.id)
      if (deleteError) {
        console.error('Error eliminando usuario auth durante rollback:', deleteError)
      }

      return NextResponse.json(
        { error: 'Error creando perfil: ' + profileError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        fullName,
        role,
      },
      message: 'Usuario creado exitosamente',
    })
  } catch (error) {
    console.error('Error creando usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
