import { createClient } from '@/lib/supabase/client'
import type { Municipio, MunicipioConRelaciones, PuestoVotacion } from '@/types'

const supabase = createClient()

export async function obtenerMunicipios(): Promise<Municipio[]> {
  const { data, error } = await supabase
    .from('municipios')
    .select('*')
    .order('nombre')

  if (error) throw error
  return data as Municipio[] || []
}

export async function obtenerMunicipioPorId(id: string): Promise<Municipio | null> {
  const { data, error } = await supabase
    .from('municipios')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data as Municipio
}

export async function obtenerMunicipioConPuestos(id: string): Promise<MunicipioConRelaciones | null> {
  const { data, error } = await supabase
    .from('municipios')
    .select(`
      *,
      puestos:puestos_votacion (
        *,
        mesas:mesas (count)
      )
    `)
    .eq('id', id)
    .single()

  if (error) return null

  return {
    ...(data as unknown as MunicipioConRelaciones),
    actas_count: 0,
  }
}

export async function crearMunicipio(municipio: Partial<Municipio>): Promise<Municipio> {
  const { data, error } = await supabase
    .from('municipios')
    .insert(municipio as never)
    .select()
    .single()

  if (error) throw error
  return data as Municipio
}

export async function actualizarMunicipio(
  id: string,
  municipio: Partial<Municipio>
): Promise<Municipio> {
  const { data, error } = await supabase
    .from('municipios')
    .update(municipio as never)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Municipio
}

export async function eliminarMunicipio(id: string): Promise<void> {
  const { error } = await supabase
    .from('municipios')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function obtenerEstadisticasMunicipio(municipioId: string): Promise<{
  totalPuestos: number
  totalMesas: number
  mesasReportadas: number
  porcentajeReportado: number
}> {
  // Obtener puestos del municipio
  const { data: puestos, error: errorPuestos } = await supabase
    .from('puestos_votacion')
    .select('id')
    .eq('municipio_id', municipioId)

  if (errorPuestos) throw errorPuestos

  const puestoIds = (puestos as { id: string }[] | null)?.map(p => p.id) || []

  // Contar mesas
  const { count: totalMesas, error: errorMesas } = await supabase
    .from('mesas')
    .select('*', { count: 'exact', head: true })
    .in('puesto_id', puestoIds.length > 0 ? puestoIds : [''])

  // Obtener IDs de mesas
  const { data: mesasData } = await supabase
    .from('mesas')
    .select('id')
    .in('puesto_id', puestoIds.length > 0 ? puestoIds : [''])

  const mesaIds = (mesasData as { id: string }[] | null)?.map(m => m.id) || []

  // Contar actas reportadas
  const { count: mesasReportadas, error: errorReportadas } = await supabase
    .from('actas_e14')
    .select('*', { count: 'exact', head: true })
    .in('estado', ['enviado', 'verificado', 'corregido'])
    .in('mesa_id', mesaIds.length > 0 ? mesaIds : [''])

  if (errorMesas || errorReportadas) throw errorMesas || errorReportadas

  const total = totalMesas || 0
  const reportadas = mesasReportadas || 0

  return {
    totalPuestos: puestos?.length || 0,
    totalMesas: total,
    mesasReportadas: reportadas,
    porcentajeReportado: total > 0 ? Math.round((reportadas / total) * 100) : 0,
  }
}
