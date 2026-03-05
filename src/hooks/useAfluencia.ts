import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  obtenerAfluenciaPorMesa,
  upsertAfluencia,
  type AfluenciaInput,
} from "@/servicios/afluencia";

const AFLUENCIA_KEY = "afluencia";

export function useAfluenciasPorMesa(mesaId: string) {
  return useQuery({
    queryKey: [AFLUENCIA_KEY, mesaId],
    queryFn: () => obtenerAfluenciaPorMesa(mesaId),
    enabled: !!mesaId,
  });
}

export function useUpsertAfluencia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (afluencia: AfluenciaInput) => upsertAfluencia(afluencia),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [AFLUENCIA_KEY, variables.mesa_id],
      });
    },
  });
}
