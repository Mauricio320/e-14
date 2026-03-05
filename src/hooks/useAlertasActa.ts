import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  upsertAlertas,
  eliminarAlertasPorActa,
  eliminarAlertasPorCodigos,
  obtenerAlertasPorActa,
  type AlertaInput,
} from "@/servicios/alertas-acta";

const ALERTAS_KEY = "alertas_acta";

export function useAlertasPorActa(actaId: string | undefined) {
  return useQuery({
    queryKey: [ALERTAS_KEY, actaId],
    queryFn: () => obtenerAlertasPorActa(actaId!),
    enabled: !!actaId,
  });
}

export function useUpsertAlertas() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (alertas: AlertaInput[]) => upsertAlertas(alertas),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ALERTAS_KEY] });
    },
  });
}

export function useEliminarAlertasPorActa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (actaId: string) => eliminarAlertasPorActa(actaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ALERTAS_KEY] });
    },
  });
}

export function useEliminarAlertasPorCodigos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ actaId, codigos }: { actaId: string; codigos: string[] }) =>
      eliminarAlertasPorCodigos(actaId, codigos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ALERTAS_KEY] });
    },
  });
}
