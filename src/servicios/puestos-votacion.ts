import { createClient } from '@/lib/supabase/client'
import type { PuestoVotacion, PuestoConRelaciones, Mesa, ActaE14 } from '@/types'

const supabase = createClient()

export async function obtenerPuestos(): Promise<PuestoConRelaciones[]> {
  const { data, error } = await supabase
    .from('puestos_votacion')
    .select(`
      *,
      municipio:municipio_id (*)
    `)
    .order('nombre')

  if (error) throw error
  return data as PuestoConRelaciones[] || []
}

export async function obtenerPuestoPorId(id: string): Promise<PuestoConRelaciones | null> {
  const { data, error } = await supabase
    .from('puestos_votacion')
    .select(`
      *,
      municipio:municipio_id (*)
    `)
    .eq('id', id)
    .single()

  if (error) return null
  return data as PuestoConRelaciones
}

export async function obtenerPuestosPorMunicipio(municipioId: string): Promise<PuestoConRelaciones[]> {
  const { data, error } = await supabase
    .from('puestos_votacion')
    .select(`
      *,
      municipio:municipio_id (*)
    `)
    .eq('municipio_id', municipioId)
    .order('nombre')

  if (error) throw error
  return data as PuestoConRelaciones[] || []
}

export async function obtenerPuestoConMesas(id: string): Promise<PuestoConRelaciones | null> {
  const { data, error } = await supabase
    .from('puestos_votacion')
    .select(`
      *,
      municipio:municipio_id (*),
      mesas:mesas (
        *,
        actas:actas_e14 (*)
      )
    `)
    .eq('id', id)
    .single()

  if (error || !data) return null

  const puesto = data as unknown as PuestoConRelaciones & {
    mesas: Array<any>
  }

  // Contar actas reportadas
  const mesasReportadas = puesto.mesas?.filter((m: any) =>
    m.actas?.some((a: any) => ['enviado', 'verificado', 'corregido'].includes(a.estado))
  ).length || 0

  return {
    ...puesto,
    actas_count: mesasReportadas,
  }
}

export async function crearPuesto(puesto: Partial<PuestoVotacion>): Promise<PuestoVotacion> {
  const { data, error } = await supabase
    .from('puestos_votacion')
    .insert(puesto as never)
    .select()
    .single()

  if (error) throw error
  return data as PuestoVotacion
}

export async function actualizarPuesto(
  id: string,
  puesto: Partial<PuestoVotacion>
): Promise<PuestoVotacion> {
  const { data, error } = await supabase
    .from('puestos_votacion')
    .update(puesto as never)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as PuestoVotacion
}

export async function eliminarPuesto(id: string): Promise<void> {
  const { error } = await supabase
    .from('puestos_votacion')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function obtenerEstadisticasPuesto(puestoId: string): Promise<{
  totalMesas: number
  mesasReportadas: number
  porcentajeReportado: number
  totalVotos: number
}> {
  // Obtener mesas del puesto
  const { data: mesas, error: errorMesas } = await supabase
    .from('mesas')
    .select('id')
    .eq('puesto_id', puestoId)

  if (errorMesas) throw errorMesas

  const mesaIds = (mesas as { id: string }[] | null)?.map(m => m.id) || []

  // Contar actas reportadas
  const { data: actas, error: errorActas } = await supabase
    .from('actas_e14')
    .select('*')
    .in('estado', ['enviado', 'verificado', 'corregido'])
    .in('mesa_id', mesaIds.length > 0 ? mesaIds : [''])

  if (errorActas) throw errorActas

  const totalVotos = (actas as ActaE14[] | null)?.reduce((sum, acta) =>
    sum + (acta.total_votos_validos || 0), 0
  ) || 0

  const total = (mesas as Mesa[] | null)?.length || 0
  const reportadas = (actas as ActaE14[] | null)?.length || 0

  return {
    totalMesas: total,
    mesasReportadas: reportadas,
    porcentajeReportado: total > 0 ? Math.round((reportadas / total) * 100) : 0,
    totalVotos,
  }
}
