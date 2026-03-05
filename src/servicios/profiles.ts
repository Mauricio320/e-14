import { createClient } from '@/lib/supabase/client'
import type { Profile, Role } from '@/types'

const supabase = createClient()

export async function obtenerProfile(): Promise<Profile | null> {
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      municipio:municipio_id (*),
      puesto:puesto_id (*)
    `)
    .eq('id', userData.user.id)
    .single()

  if (error) return null
  return data as Profile
}

export async function obtenerProfilePorId(id: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      municipio:municipio_id (*),
      puesto:puesto_id (*)
    `)
    .eq('id', id)
    .single()

  if (error) return null
  return data as Profile
}

export async function obtenerProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      municipio:municipio_id (*),
      puesto:puesto_id (*)
    `)
    .order('full_name')

  if (error) throw error
  return data as Profile[] || []
}

export async function obtenerProfilesPorRol(rol: Role): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      municipio:municipio_id (*),
      puesto:puesto_id (*)
    `)
    .eq('role', rol)
    .eq('activo', true)
    .order('full_name')

  if (error) throw error
  return data as Profile[] || []
}

export async function obtenerTestigos(): Promise<Profile[]> {
  return obtenerProfilesPorRol('testigo')
}

export async function obtenerCoordinadoresPuesto(): Promise<Profile[]> {
  return obtenerProfilesPorRol('coordinador_puesto')
}

export async function obtenerCoordinadoresMunicipio(): Promise<Profile[]> {
  return obtenerProfilesPorRol('coordinador_municipal')
}

export async function obtenerRevisores(): Promise<Profile[]> {
  return obtenerProfilesPorRol('revisor')
}

export async function actualizarProfile(
  id: string,
  profile: Partial<Profile>
): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update(profile as never)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Profile
}

export async function cambiarRol(id: string, rol: Role): Promise<Profile> {
  return actualizarProfile(id, { role: rol })
}

export async function activarUsuario(id: string): Promise<Profile> {
  return actualizarProfile(id, { activo: true })
}

export async function desactivarUsuario(id: string): Promise<Profile> {
  return actualizarProfile(id, { activo: false })
}

export async function asignarMunicipio(id: string, municipioId: string | null): Promise<Profile> {
  return actualizarProfile(id, { municipio_id: municipioId })
}

export async function asignarPuesto(id: string, puestoId: string | null): Promise<Profile> {
  return actualizarProfile(id, { puesto_id: puestoId })
}

export async function buscarProfiles(query: string): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      municipio:municipio_id (*),
      puesto:puesto_id (*)
    `)
    .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
    .order('full_name')

  if (error) throw error
  return data as Profile[] || []
}

// Función para verificar si el usuario actual tiene un rol específico
export async function tieneRol(roles: Role[]): Promise<boolean> {
  const profile = await obtenerProfile()
  if (!profile) return false
  return roles.includes(profile.role)
}

// Función para verificar si el usuario actual es maestro
export async function esMaestro(): Promise<boolean> {
  return tieneRol(['maestro'])
}

// Función para verificar si el usuario actual es revisor
export async function esRevisor(): Promise<boolean> {
  return tieneRol(['revisor', 'maestro'])
}

// Función para crear un nuevo usuario (solo admin)
export interface CrearUsuarioData {
  email: string
  password: string
  fullName: string
  role: Role
}

export interface CrearUsuarioResponse {
  success: boolean
  user?: {
    id: string
    email: string
    fullName: string
    role: Role
  }
  message?: string
  error?: string
}

export async function crearUsuario(data: CrearUsuarioData): Promise<CrearUsuarioResponse> {
  const response = await fetch('/api/admin/usuarios', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const result = await response.json()
console.log(result);

  if (!response.ok) {
    throw new Error(result.error || 'Error al crear el usuario')
  }

  return result
}
