import { createClient } from '@/lib/supabase/client'
import type { VotoLista } from '@/types'

const supabase = createClient()

export async function obtenerVotosListaPorActa(actaId: string): Promise<VotoLista[]> {
  const { data, error } = await supabase
    .from('votos_lista')
    .select(`
      *,
      partido:partido_id (*)
    `)
    .eq('acta_id', actaId)

  if (error) throw error
  return data as VotoLista[] || []
}

export async function crearVotoLista(voto: Partial<VotoLista>): Promise<VotoLista> {
  const { data, error } = await supabase
    .from('votos_lista')
    .insert(voto as never)
    .select()
    .single()

  if (error) throw error
  return data as VotoLista
}

export async function actualizarVotoLista(
  id: string,
  votos: number
): Promise<VotoLista> {
  const { data, error } = await supabase
    .from('votos_lista')
    .update({ votos } as never)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as VotoLista
}

export async function upsertVotosLista(
  votos: Array<{
    actaId: string
    partidoId: string
    votos: number
  }>
): Promise<void> {
  const registros = votos.map(v => ({
    acta_id: v.actaId,
    partido_id: v.partidoId,
    votos: v.votos,
  }))

  const { error } = await supabase
    .from('votos_lista')
    .upsert(registros as never, {
      onConflict: 'acta_id,partido_id',
    })

  if (error) throw error
}

export async function eliminarVotosListaPorActa(actaId: string): Promise<void> {
  const { error } = await supabase
    .from('votos_lista')
    .delete()
    .eq('acta_id', actaId)

  if (error) throw error
}
