import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  subirFoto,
  obtenerFotosPorActa,
  eliminarFoto,
  subirMultiplesFotos,
} from '@/servicios/fotos-acta'
import type { FotoActa } from '@/types'

const FOTOS_KEY = 'fotos'

export function useSubirFoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ file, actaId }: { file: File; actaId: string }) =>
      subirFoto(file, actaId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [FOTOS_KEY, variables.actaId],
      })
    },
  })
}

export function useSubirMultiplesFotos() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      files,
      actaId,
      onProgress,
    }: {
      files: File[]
      actaId: string
      onProgress?: (progresoActual: number, total: number) => void
    }) => subirMultiplesFotos(files, actaId, onProgress),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [FOTOS_KEY, variables.actaId],
      })
    },
  })
}

export function useEliminarFoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: eliminarFoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FOTOS_KEY] })
    },
  })
}
