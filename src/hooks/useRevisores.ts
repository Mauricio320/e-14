import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  obtenerAsignacionesRevisorPorMunicipio,
  asignarRevisorAPuesto,
  desasignarRevisorDePuesto,
  obtenerAsignacionesPorRevisor,
} from "@/servicios/revisores";

const REVISORES_KEY = "revisores_asignaciones";

export function useAsignacionesRevisorPorMunicipio(municipioId: string) {
  return useQuery({
    queryKey: [REVISORES_KEY, "municipio", municipioId],
    queryFn: () => obtenerAsignacionesRevisorPorMunicipio(municipioId),
    enabled: !!municipioId,
  });
}

export function useAsignacionesPorRevisor(revisorId: string) {
  return useQuery({
    queryKey: [REVISORES_KEY, "revisor", revisorId],
    queryFn: () => obtenerAsignacionesPorRevisor(revisorId),
    enabled: !!revisorId,
  });
}

export function useAsignarRevisorAPuesto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      revisorId,
      puestoId,
    }: {
      revisorId: string;
      puestoId: string;
    }) => asignarRevisorAPuesto(revisorId, puestoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REVISORES_KEY] });
    },
  });
}

export function useDesasignarRevisorDePuesto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      revisorId,
      puestoId,
    }: {
      revisorId: string;
      puestoId: string;
    }) => desasignarRevisorDePuesto(revisorId, puestoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REVISORES_KEY] });
    },
  });
}
