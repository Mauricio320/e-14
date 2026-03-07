import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  obtenerResultadosElectorales,
  type ResultadosElectorales,
} from "@/servicios/resultados-electorales";

const RESULTADOS_KEY = "resultados-electorales";

export function useResultadosElectorales(municipioId?: string) {
  const queryClient = useQueryClient();
  const supabase = createClient();

  useEffect(() => {
    // Suscribirse a cambios en la tabla actas_e14
    const channel = supabase
      .channel("realtime-resultados")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "actas_e14",
        },
        () => {
          // Cuando hay un cambio en un acta, invalidamos la caché
          // Esto forzará a React Query a volver a ejecutar queryFn
          queryClient.invalidateQueries({
            queryKey: [RESULTADOS_KEY],
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, supabase]);

  return useQuery<ResultadosElectorales>({
    queryKey: [RESULTADOS_KEY, municipioId || "todos"],
    queryFn: () => obtenerResultadosElectorales(municipioId),
  });
}
