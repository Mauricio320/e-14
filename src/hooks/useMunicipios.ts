import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  obtenerMunicipios,
  obtenerMunicipioPorId,
  obtenerMunicipioConPuestos,
  obtenerMunicipioConConsolidado,
  crearMunicipio,
  actualizarMunicipio,
  eliminarMunicipio,
  obtenerEstadisticasMunicipio,
} from '@/servicios/municipios'
import type { Municipio } from '@/types'

const MUNICIPIOS_KEY = 'municipios'

export function useMunicipios() {
  return useQuery({
    queryKey: [MUNICIPIOS_KEY],
    queryFn: obtenerMunicipios,
  })
}

export function useMunicipio(id: string) {
  return useQuery({
    queryKey: [MUNICIPIOS_KEY, id],
    queryFn: () => obtenerMunicipioPorId(id),
    enabled: !!id,
  })
}

export function useMunicipioConPuestos(id: string) {
  return useQuery({
    queryKey: [MUNICIPIOS_KEY, id, 'puestos'],
    queryFn: () => obtenerMunicipioConPuestos(id),
    enabled: !!id,
  })
}

export function useMunicipioConConsolidado(id: string) {
  return useQuery({
    queryKey: [MUNICIPIOS_KEY, id, 'consolidado'],
    queryFn: () => obtenerMunicipioConConsolidado(id),
    enabled: !!id,
  })
}

export function useCrearMunicipio() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (municipio: Partial<Municipio>) => crearMunicipio(municipio),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MUNICIPIOS_KEY] })
    },
  })
}

export function useActualizarMunicipio() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, municipio }: { id: string; municipio: Partial<Municipio> }) =>
      actualizarMunicipio(id, municipio),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [MUNICIPIOS_KEY] })
      queryClient.invalidateQueries({ queryKey: [MUNICIPIOS_KEY, variables.id] })
    },
  })
}

export function useEliminarMunicipio() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: eliminarMunicipio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MUNICIPIOS_KEY] })
    },
  })
}

export function useEstadisticasMunicipio(municipioId: string) {
  return useQuery({
    queryKey: [MUNICIPIOS_KEY, municipioId, 'estadisticas'],
    queryFn: () => obtenerEstadisticasMunicipio(municipioId),
    enabled: !!municipioId,
  })
}
