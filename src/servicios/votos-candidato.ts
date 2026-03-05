import { createClient } from '@/lib/supabase/client'
import type { VotoCandidato } from '@/types'

const supabase = createClient()

export async function obtenerVotosPorActa(actaId: string): Promise<VotoCandidato[]> {
  const { data, error } = await supabase
    .from('votos_candidato')
    .select(`
      *,
      candidato:candidato_id (
        *,
        partido:partido_id (*)
      )
    `)
    .eq('acta_id', actaId)

  if (error) throw error
  return data as VotoCandidato[] || []
}

export async function crearVoto(voto: Partial<VotoCandidato>): Promise<VotoCandidato> {
  const { data, error } = await supabase
    .from('votos_candidato')
    .insert(voto as never)
    .select()
    .single()

  if (error) throw error
  return data as VotoCandidato
}

export async function actualizarVoto(
  id: string,
  votos: number
): Promise<VotoCandidato> {
  const { data, error } = await supabase
    .from('votos_candidato')
    .update({ votos } as never)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as VotoCandidato
}

export async function upsertVotos(
  votos: Array<{
    actaId: string
    candidatoId: string
    votos: number
  }>
): Promise<void> {
  const registros = votos.map(v => ({
    acta_id: v.actaId,
    candidato_id: v.candidatoId,
    votos: v.votos,
  }))

  const { error } = await supabase
    .from('votos_candidato')
    .upsert(registros as never, {
      onConflict: 'acta_id,candidato_id',
    })

  if (error) throw error
}

export async function eliminarVotosPorActa(actaId: string): Promise<void> {
  const { error } = await supabase
    .from('votos_candidato')
    .delete()
    .eq('acta_id', actaId)

  if (error) throw error
}
