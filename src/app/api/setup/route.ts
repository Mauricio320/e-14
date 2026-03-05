import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json()

    if (!email || !password || password.length < 6) {
      return NextResponse.json(
        { error: 'Email y contraseña (min 6 caracteres) son requeridos' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Verificar si ya existen usuarios
    let userCount = 0
    try {
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      if (countError) {
        console.error('Error al contar profiles:', countError)
        // Si hay error al consultar, asumimos que no hay usuarios (permite crear el primero)
        userCount = 0
      } else {
        userCount = count || 0
      }
    } catch (err) {
      console.error('Excepción al verificar usuarios:', err)
      userCount = 0
    }

    // Si ya hay usuarios, no permitir setup
    if (userCount > 0) {
      return NextResponse.json(
        { error: 'Setup ya completado. Usa el panel admin para crear usuarios.' },
        { status: 403 }
      )
    }

    // Crear el primer usuario admin
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || 'Administrador',
          role: 'maestro',
        },
      },
    })

    if (authError) {
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

    // Asegurar que el perfil tenga rol maestro
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        full_name: fullName || 'Administrador',
        role: 'maestro',
        activo: true,
      } as never)
      .eq('id', authData.user.id)

    if (profileError) {
      console.error('Error actualizando perfil:', profileError)
    }

    return NextResponse.json({
      success: true,
      message: 'Primer usuario administrador creado exitosamente',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: 'maestro',
      },
    })
  } catch (error) {
    console.error('Error en setup:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
