import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  obtenerVotosListaPorActa,
  crearVotoLista,
  actualizarVotoLista,
  upsertVotosLista,
  eliminarVotosListaPorActa,
} from '@/servicios/votos-lista'
import type { VotoLista } from '@/types'

const VOTOS_LISTA_KEY = 'votos-lista'

export function useVotosListaPorActa(actaId: string) {
  return useQuery({
    queryKey: [VOTOS_LISTA_KEY, actaId],
    queryFn: () => obtenerVotosListaPorActa(actaId),
    enabled: !!actaId,
  })
}

export function useCrearVotoLista() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (voto: Partial<VotoLista>) => crearVotoLista(voto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [VOTOS_LISTA_KEY, variables.acta_id],
      })
    },
  })
}

export function useActualizarVotoLista() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, votos }: { id: string; votos: number }) =>
      actualizarVotoLista(id, votos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VOTOS_LISTA_KEY] })
    },
  })
}

export function useUpsertVotosLista() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: upsertVotosLista,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VOTOS_LISTA_KEY] })
    },
  })
}

export function useEliminarVotosListaPorActa() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: eliminarVotosListaPorActa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VOTOS_LISTA_KEY] })
    },
  })
}
