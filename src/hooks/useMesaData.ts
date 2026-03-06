"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type {
  MesaConRelaciones,
  ActaConRelaciones,
  CandidatoConPartido,
} from "@/types";

const supabase = createClient();

interface MesaData {
  mesa: MesaConRelaciones;
  acta: ActaConRelaciones | null;
  candidatos: CandidatoConPartido[];
}

async function fetchMesaData(mesaId: string): Promise<MesaData> {
  // Obtener la mesa con sus relaciones
  const { data: mesa, error: mesaError } = await supabase
    .from("mesas")
    .select(
      `
      *,
      puesto:puesto_id (
        *,
        municipio:municipio_id (*)
      )
    `,
    )
    .eq("id", mesaId)
    .single();

  if (mesaError) throw mesaError;
  if (!mesa) throw new Error("Mesa no encontrada");

  // Obtener el acta existente para esta mesa
  const { data: acta, error: actaError } = await supabase
    .from("actas_e14")
    .select(
      `
      *,
      votos:votos_candidato (*),
      votosLista:votos_lista (*),
      fotos:fotos_acta (*),
      alertas:alertas_acta (*)
    `,
    )
    .eq("mesa_id", mesaId)
    .order("version", { ascending: true })
    .maybeSingle();

  if (actaError) throw actaError;

  // Obtener todos los candidatos activos
  const { data: candidatos, error: candidatosError } = await supabase
    .from("candidatos")
    .select(
      `
      *,
      partido:partido_id (*)
    `,
    )
    .eq("activo", true)
    .order("numero_lista", { ascending: true });

  if (candidatosError) throw candidatosError;

  return {
    mesa: mesa as MesaConRelaciones,
    acta: acta as ActaConRelaciones | null,
    candidatos: (candidatos || []) as CandidatoConPartido[],
  };
}

export function useMesaData(mesaId: string) {
  return useQuery({
    queryKey: ["mesa", mesaId],
    queryFn: () => fetchMesaData(mesaId),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}
