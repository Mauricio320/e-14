import { createClient } from '@/lib/supabase/client'
import type { ActaE14, ActaConRelaciones, EstadoActa } from '@/types'

const supabase = createClient()

export async function obtenerActas(): Promise<ActaConRelaciones[]> {
  const { data, error } = await supabase
    .from('actas_e14')
    .select(`
      *,
      mesa:mesa_id (
        *,
        puesto:puesto_id (
          *,
          municipio:municipio_id (*)
        )
      ),
      registradoPor:registrado_por (*),
      verificadoPor:verificado_por (*),
      votos:votos_candidato (
        *,
        candidato:candidato_id (
          *,
          partido:partido_id (*)
        )
      ),
      fotos:fotos_acta (*)
    `)
    .order('creado_en', { ascending: false })

  if (error) throw error
  return data as ActaConRelaciones[] || []
}

export async function obtenerActaPorId(id: string): Promise<ActaConRelaciones | null> {
  const { data, error } = await supabase
    .from('actas_e14')
    .select(`
      *,
      mesa:mesa_id (
        *,
        puesto:puesto_id (
          *,
          municipio:municipio_id (*)
        )
      ),
      registradoPor:registrado_por (*),
      verificadoPor:verificado_por (*),
      votos:votos_candidato (
        *,
        candidato:candidato_id (
          *,
          partido:partido_id (*)
        )
      ),
      fotos:fotos_acta (*)
    `)
    .eq('id', id)
    .single()

  if (error) return null
  return data as ActaConRelaciones
}

export async function obtenerActaPorMesa(mesaId: string, version?: number): Promise<ActaConRelaciones | null> {
  let query = supabase
    .from('actas_e14')
    .select(`
      *,
      mesa:mesa_id (
        *,
        puesto:puesto_id (
          *,
          municipio:municipio_id (*)
        )
      ),
      registradoPor:registrado_por (*),
      verificadoPor:verificado_por (*),
      votos:votos_candidato (
        *,
        candidato:candidato_id (
          *,
          partido:partido_id (*)
        )
      ),
      fotos:fotos_acta (*)
    `)
    .eq('mesa_id', mesaId)

  if (version !== undefined) {
    query = query.eq('version', version)
  } else {
    query = query.order('version', { ascending: false })
  }

  const { data, error } = await query.maybeSingle()

  if (error || !data) return null
  return data as unknown as ActaConRelaciones
}

export async function obtenerActasPorEstado(estado: EstadoActa): Promise<ActaConRelaciones[]> {
  const { data, error } = await supabase
    .from('actas_e14')
    .select(`
      *,
      mesa:mesa_id (
        *,
        puesto:puesto_id (
          *,
          municipio:municipio_id (*)
        )
      ),
      registradoPor:registrado_por (*),
      verificadoPor:verificado_por (*)
    `)
    .eq('estado', estado)
    .order('enviado_en', { ascending: false })

  if (error) throw error
  return data as ActaConRelaciones[] || []
}

export async function crearActa(acta: Partial<ActaE14>): Promise<ActaE14> {
  // Obtener el usuario actual para incluir registrado_por
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) {
    throw new Error('No hay usuario autenticado')
  }

  const actaConRegistradoPor = {
    ...acta,
    registrado_por: userData.user.id,
  }

  const { data, error } = await supabase
    .from('actas_e14')
    .insert(actaConRegistradoPor as never)
    .select()
    .single()

  if (error) throw error
  return data as ActaE14
}

export async function actualizarActa(
  id: string,
  acta: Partial<ActaE14>
): Promise<ActaE14> {
  const { data, error } = await supabase
    .from('actas_e14')
    .update({
      ...acta,
      actualizado_en: new Date().toISOString(),
    } as never)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as ActaE14
}

export async function enviarActa(id: string): Promise<ActaE14> {
  const { data, error } = await supabase
    .from('actas_e14')
    .update({
      estado: 'enviado',
      enviado_en: new Date().toISOString(),
      actualizado_en: new Date().toISOString(),
    } as never)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as ActaE14
}

export async function verificarActa(id: string): Promise<ActaE14> {
  const { data: userData } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('actas_e14')
    .update({
      estado: 'verificado',
      verificado_por: userData.user?.id,
      verificado_en: new Date().toISOString(),
      actualizado_en: new Date().toISOString(),
    } as never)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as ActaE14
}

export async function corregirActa(actaId: string): Promise<ActaE14> {
  // Obtener la acta actual
  const actaActual = await obtenerActaPorId(actaId)
  if (!actaActual) throw new Error('Acta no encontrada')

  // Crear nueva versión
  const { data: userData } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('actas_e14')
    .insert({
      mesa_id: actaActual.mesa_id,
      registrado_por: userData.user?.id,
      version: actaActual.version + 1,
      estado: 'borrador',
      total_votos_urna: actaActual.total_votos_urna,
      total_votos_incinerados: actaActual.total_votos_incinerados,
      votos_en_blanco: actaActual.votos_en_blanco,
      votos_nulos: actaActual.votos_nulos,
      tarjetas_no_marcadas: actaActual.tarjetas_no_marcadas,
      total_votos_validos: actaActual.total_votos_validos,
      total_sufragantes: actaActual.total_sufragantes,
      observaciones: actaActual.observaciones,
    } as never)
    .select()
    .single()

  if (error) throw error
  const actaNueva = data as ActaE14

  // Copiar los votos de la versión anterior
  if (actaActual.votos && actaActual.votos.length > 0) {
    const nuevosVotos = actaActual.votos.map(v => ({
      acta_id: actaNueva.id,
      candidato_id: v.candidato_id,
      votos: v.votos,
    }))

    const { error: errorVotos } = await supabase
      .from('votos_candidato')
      .insert(nuevosVotos as never)

    if (errorVotos) throw errorVotos
  }

  return data as ActaE14
}

export async function eliminarActa(id: string): Promise<void> {
  const { error } = await supabase
    .from('actas_e14')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function obtenerEstadisticas(): Promise<{
  totalMesas: number
  mesasReportadas: number
  porcentajeReportado: number
}> {
  const { data: totalMesas, error: errorTotal } = await supabase
    .from('mesas')
    .select('*', { count: 'exact', head: true })

  const { data: mesasReportadas, error: errorReportadas } = await supabase
    .from('actas_e14')
    .select('*', { count: 'exact', head: true })
    .in('estado', ['enviado', 'verificado', 'corregido'])

  if (errorTotal || errorReportadas) throw errorTotal || errorReportadas

  const total = totalMesas?.length || 0
  const reportadas = mesasReportadas?.length || 0

  return {
    totalMesas: total,
    mesasReportadas: reportadas,
    porcentajeReportado: total > 0 ? Math.round((reportadas / total) * 100) : 0,
  }
}
