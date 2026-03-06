import { useQuery } from '@tanstack/react-query'
import {
  obtenerConsolidados,
  obtenerConsolidadoPorMunicipio,
  obtenerEstadisticasGlobales,
  type ConsolidadoMunicipio,
} from '@/servicios/consolidados'

const CONSOLIDADOS_KEY = 'consolidados'

export function useConsolidados() {
  return useQuery<ConsolidadoMunicipio[]>({
    queryKey: [CONSOLIDADOS_KEY],
    queryFn: obtenerConsolidados,
  })
}

export function useConsolidadoMunicipio(municipioId: string) {
  return useQuery<ConsolidadoMunicipio | null>({
    queryKey: [CONSOLIDADOS_KEY, municipioId],
    queryFn: () => obtenerConsolidadoPorMunicipio(municipioId),
    enabled: !!municipioId,
  })
}

export function useEstadisticasGlobales() {
  return useQuery({
    queryKey: [CONSOLIDADOS_KEY, 'globales'],
    queryFn: obtenerEstadisticasGlobales,
  })
}
