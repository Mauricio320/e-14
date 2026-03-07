import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

const supabase = createClient();

export type ConsolidadoMunicipio =
  Database["public"]["Tables"]["consolidados_municipio"]["Row"] & {
    municipio?: {
      id: string;
      nombre: string;
      codigo_dane: string;
    };
  };

export async function obtenerConsolidados(): Promise<ConsolidadoMunicipio[]> {
  const { data, error } = await supabase
    .from("consolidados_municipio")
    .select(
      `
      *,
      municipio:municipio_id (
        id,
        nombre,
        codigo_dane
      )
    `,
    )
    .order("porcentaje_reportado", { ascending: false });

  if (error) throw error;
  return (data as ConsolidadoMunicipio[]) || [];
}

export async function obtenerConsolidadoPorMunicipio(
  municipioId: string,
): Promise<ConsolidadoMunicipio | null> {
  const { data, error } = await supabase
    .from("consolidados_municipio")
    .select(
      `
      *,
      municipio:municipio_id (
        id,
        nombre,
        codigo_dane
      )
    `,
    )
    .eq("municipio_id", municipioId)
    .single();

  if (error) return null;
  return data as ConsolidadoMunicipio;
}

export async function obtenerEstadisticasGlobales(): Promise<{
  totalMunicipios: number;
  totalPuestos: number;
  totalMesas: number;
  mesasReportadas: number;
  porcentajeReportado: number;
  totalSufragantes: number;
  totalVotosValidos: number;
  totalVotosNulos: number;
  totalVotosBlanco: number;
}> {
  const { data, error } = await supabase
    .from("consolidados_municipio")
    .select("*");

  if (error) throw error;
  const consolidados = (data as any[]) || [];

  const totalMunicipios = consolidados.length;
  const totalPuestos = consolidados.reduce(
    (sum, c) => sum + (c.total_puestos || 0),
    0,
  );
  const totalMesas = consolidados.reduce(
    (sum, c) => sum + (c.total_mesas || 0),
    0,
  );
  const mesasReportadas = consolidados.reduce(
    (sum, c) => sum + (c.mesas_reportadas || 0),
    0,
  );
  const totalSufragantes = consolidados.reduce(
    (sum, c) => sum + (c.total_sufragantes || 0),
    0,
  );
  const totalVotosValidos = consolidados.reduce(
    (sum, c) => sum + (c.total_votos_validos || 0),
    0,
  );
  const totalVotosNulos = consolidados.reduce(
    (sum, c) => sum + (c.votos_nulos || 0),
    0,
  );
  const totalVotosBlanco = consolidados.reduce(
    (sum, c) => sum + (c.votos_en_blanco || 0),
    0,
  );

  const porcentajeReportado =
    totalMesas > 0 ? Math.round((mesasReportadas / totalMesas) * 100) : 0;

  return {
    totalMunicipios,
    totalPuestos,
    totalMesas,
    mesasReportadas,
    porcentajeReportado,
    totalSufragantes,
    totalVotosValidos,
    totalVotosNulos,
    totalVotosBlanco,
  };
}
