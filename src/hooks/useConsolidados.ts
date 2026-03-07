import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  obtenerConsolidados,
  obtenerConsolidadoPorMunicipio,
  obtenerEstadisticasGlobales,
  type ConsolidadoMunicipio,
} from "@/servicios/consolidados";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const CONSOLIDADOS_KEY = "consolidados";

export function useConsolidados() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  useEffect(() => {
    // Suscribirse a cambios en la tabla actas_e14
    const channel = supabase
      .channel("realtime-resultados3")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "actas_e14",
        },
        () => {
          setTimeout(() => {
            queryClient.invalidateQueries({
              queryKey: [CONSOLIDADOS_KEY],
            });
          }, 1500);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, supabase]);
  return useQuery<ConsolidadoMunicipio[]>({
    queryKey: [CONSOLIDADOS_KEY],
    queryFn: obtenerConsolidados,
  });
}

export function useConsolidadoMunicipio(municipioId: string) {
  return useQuery<ConsolidadoMunicipio | null>({
    queryKey: [CONSOLIDADOS_KEY, municipioId],
    queryFn: () => obtenerConsolidadoPorMunicipio(municipioId),
    enabled: !!municipioId,
  });
}

export function useEstadisticasGlobales() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  useEffect(() => {
    // Suscribirse a cambios en la tabla actas_e14
    const channel = supabase
      .channel("realtime-resultados2")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "actas_e14",
        },
        () => {
          setTimeout(() => {
            queryClient.invalidateQueries({
              queryKey: [CONSOLIDADOS_KEY],
            });
          }, 1500);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, supabase]);
  return useQuery({
    queryKey: [CONSOLIDADOS_KEY, "globales"],
    queryFn: obtenerEstadisticasGlobales,
  });
}
