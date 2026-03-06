import { useQuery } from '@tanstack/react-query'
import {
  obtenerVotosCandidatoPorMunicipio,
  obtenerVotosListaPorMunicipio,
  obtenerVotosCandidatoTodosMunicipios,
  obtenerVotosListaTodosMunicipios,
  obtenerTotalesVotosPorMunicipio,
  type ConsolidadoVotosCandidatoMunicipio,
  type ConsolidadoVotosListaMunicipio,
} from '@/servicios/consolidados-votos'

const CONSOLIDADOS_VOTOS_KEY = 'consolidados-votos'

export function useVotosCandidatoMunicipio(municipioId: string) {
  return useQuery<ConsolidadoVotosCandidatoMunicipio[]>({
    queryKey: [CONSOLIDADOS_VOTOS_KEY, 'candidatos', municipioId],
    queryFn: () => obtenerVotosCandidatoPorMunicipio(municipioId),
    enabled: !!municipioId,
  })
}

export function useVotosListaMunicipio(municipioId: string) {
  return useQuery<ConsolidadoVotosListaMunicipio[]>({
    queryKey: [CONSOLIDADOS_VOTOS_KEY, 'lista', municipioId],
    queryFn: () => obtenerVotosListaPorMunicipio(municipioId),
    enabled: !!municipioId,
  })
}

export function useVotosCandidatoTodosMunicipios() {
  return useQuery<ConsolidadoVotosCandidatoMunicipio[]>({
    queryKey: [CONSOLIDADOS_VOTOS_KEY, 'candidatos', 'todos'],
    queryFn: obtenerVotosCandidatoTodosMunicipios,
  })
}

export function useVotosListaTodosMunicipios() {
  return useQuery<ConsolidadoVotosListaMunicipio[]>({
    queryKey: [CONSOLIDADOS_VOTOS_KEY, 'lista', 'todos'],
    queryFn: obtenerVotosListaTodosMunicipios,
  })
}

export function useTotalesVotosPorMunicipio(municipioId: string) {
  return useQuery({
    queryKey: [CONSOLIDADOS_VOTOS_KEY, 'totales', municipioId],
    queryFn: () => obtenerTotalesVotosPorMunicipio(municipioId),
    enabled: !!municipioId,
  })
}
