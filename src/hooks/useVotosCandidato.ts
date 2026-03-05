import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  obtenerVotosPorActa,
  crearVoto,
  actualizarVoto,
  upsertVotos,
  eliminarVotosPorActa,
} from '@/servicios/votos-candidato'
import type { VotoCandidato } from '@/types'

const VOTOS_KEY = 'votos'

export function useVotosPorActa(actaId: string) {
  return useQuery({
    queryKey: [VOTOS_KEY, actaId],
    queryFn: () => obtenerVotosPorActa(actaId),
    enabled: !!actaId,
  })
}

export function useCrearVoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (voto: Partial<VotoCandidato>) => crearVoto(voto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [VOTOS_KEY, variables.acta_id],
      })
    },
  })
}

export function useActualizarVoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, votos }: { id: string; votos: number }) =>
      actualizarVoto(id, votos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VOTOS_KEY] })
    },
  })
}

export function useUpsertVotos() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: upsertVotos,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VOTOS_KEY] })
    },
  })
}

export function useEliminarVotosPorActa() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: eliminarVotosPorActa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VOTOS_KEY] })
    },
  })
}
