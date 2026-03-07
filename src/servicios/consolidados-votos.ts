import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

const supabase = createClient();

export type ConsolidadoVotosCandidatoMunicipio =
  Database["public"]["Tables"]["consolidado_votos_candidato_municipio"]["Row"] & {
    candidato?: {
      id: string;
      nombre: string;
      partido?: {
        id: string;
        nombre: string;
        codigo: string;
        color_hex: string;
      };
    };
  };

export type ConsolidadoVotosListaMunicipio =
  Database["public"]["Tables"]["consolidado_votos_lista_municipio"]["Row"] & {
    partido?: {
      id: string;
      nombre: string;
      codigo: string;
      color_hex: string;
    };
  };

export async function obtenerVotosCandidatoPorMunicipio(
  municipioId: string,
): Promise<ConsolidadoVotosCandidatoMunicipio[]> {
  const { data, error } = await supabase
    .from("consolidado_votos_candidato_municipio")
    .select(
      `
      *,
      candidato:candidato_id (
        id,
        nombre,
        partido:partido_id (
          id,
          nombre,
          codigo,
          color_hex
        )
      )
    `,
    )
    .eq("municipio_id", municipioId)
    .order("votos", { ascending: false });

  if (error) throw error;
  return (data as ConsolidadoVotosCandidatoMunicipio[]) || [];
}

export async function obtenerVotosListaPorMunicipio(
  municipioId: string,
): Promise<ConsolidadoVotosListaMunicipio[]> {
  const { data, error } = await supabase
    .from("consolidado_votos_lista_municipio")
    .select(
      `
      *,
      partido:partido_id (
        id,
        nombre,
        codigo,
        color_hex
      )
    `,
    )
    .eq("municipio_id", municipioId)
    .order("votos_lista", { ascending: false });

  if (error) throw error;
  return (data as ConsolidadoVotosListaMunicipio[]) || [];
}

export async function obtenerVotosCandidatoTodosMunicipios(): Promise<
  ConsolidadoVotosCandidatoMunicipio[]
> {
  const { data, error } = await supabase
    .from("consolidado_votos_candidato_municipio")
    .select(
      `
      *,
      candidato:candidato_id (
        id,
        nombre,
        partido:partido_id (
          id,
          nombre,
          codigo,
          color_hex
        )
      )
    `,
    )
    .order("votos", { ascending: false });

  if (error) throw error;
  return (data as ConsolidadoVotosCandidatoMunicipio[]) || [];
}

export async function obtenerVotosListaTodosMunicipios(): Promise<
  ConsolidadoVotosListaMunicipio[]
> {
  const { data, error } = await supabase
    .from("consolidado_votos_lista_municipio")
    .select(
      `
      *,
      partido:partido_id (
        id,
        nombre,
        codigo,
        color_hex
      )
    `,
    )
    .order("votos_lista", { ascending: false });

  if (error) throw error;
  return (data as ConsolidadoVotosListaMunicipio[]) || [];
}

export async function obtenerTotalesVotosPorMunicipio(
  municipioId: string,
): Promise<{
  totalVotosCandidatos: number;
  totalVotosLista: number;
  totalCandidatos: number;
  totalPartidos: number;
}> {
  const { data: candidatos, error: errorCandidatos } = await supabase
    .from("consolidado_votos_candidato_municipio")
    .select("votos")
    .eq("municipio_id", municipioId);

  if (errorCandidatos) throw errorCandidatos;

  const { data: listas, error: errorListas } = await supabase
    .from("consolidado_votos_lista_municipio")
    .select("votos_lista")
    .eq("municipio_id", municipioId);

  if (errorListas) throw errorListas;

  const totalVotosCandidatos =
    candidatos?.reduce((sum, c) => sum + (c.votos || 0), 0) || 0;
  const totalVotosLista =
    listas?.reduce((sum, l) => sum + (l.votos_lista || 0), 0) || 0;

  return {
    totalVotosCandidatos,
    totalVotosLista,
    totalCandidatos: candidatos?.length || 0,
    totalPartidos: listas?.length || 0,
  };
}
