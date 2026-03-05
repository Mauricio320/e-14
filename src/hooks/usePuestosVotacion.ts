import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  obtenerPuestos,
  obtenerPuestoPorId,
  obtenerPuestosPorMunicipio,
  obtenerPuestoConMesas,
  crearPuesto,
  actualizarPuesto,
  eliminarPuesto,
  obtenerEstadisticasPuesto,
} from '@/servicios/puestos-votacion'
import type { PuestoVotacion } from '@/types'

const PUESTOS_KEY = 'puestos'

export function usePuestos() {
  return useQuery({
    queryKey: [PUESTOS_KEY],
    queryFn: obtenerPuestos,
  })
}

export function usePuesto(id: string) {
  return useQuery({
    queryKey: [PUESTOS_KEY, id],
    queryFn: () => obtenerPuestoPorId(id),
    enabled: !!id,
  })
}

export function usePuestoConMesas(id: string) {
  return useQuery({
    queryKey: [PUESTOS_KEY, id, 'mesas'],
    queryFn: () => obtenerPuestoConMesas(id),
    enabled: !!id,
  })
}

export function usePuestosPorMunicipio(municipioId: string) {
  return useQuery({
    queryKey: [PUESTOS_KEY, 'municipio', municipioId],
    queryFn: () => obtenerPuestosPorMunicipio(municipioId),
    enabled: !!municipioId,
  })
}

export function useCrearPuesto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (puesto: Partial<PuestoVotacion>) => crearPuesto(puesto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PUESTOS_KEY] })
    },
  })
}

export function useActualizarPuesto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, puesto }: { id: string; puesto: Partial<PuestoVotacion> }) =>
      actualizarPuesto(id, puesto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [PUESTOS_KEY] })
      queryClient.invalidateQueries({ queryKey: [PUESTOS_KEY, variables.id] })
    },
  })
}

export function useEliminarPuesto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: eliminarPuesto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PUESTOS_KEY] })
    },
  })
}

export function useEstadisticasPuesto(puestoId: string) {
  return useQuery({
    queryKey: [PUESTOS_KEY, puestoId, 'estadisticas'],
    queryFn: () => obtenerEstadisticasPuesto(puestoId),
    enabled: !!puestoId,
  })
}
