import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export interface Afluencia {
  id: string;
  mesa_id: string;
  hora_corte: string;
  cantidad: number;
  registrado_por: string;
  creado_en: string;
}

export interface AfluenciaInput {
  mesa_id: string;
  hora_corte: string;
  cantidad: number;
  registrado_por: string;
}

/**
 * Obtiene todos los reportes de afluencia para una mesa específica.
 */
export async function obtenerAfluenciaPorMesa(
  mesaId: string,
): Promise<Afluencia[]> {
  const { data, error } = await supabase
    .from("afluencia_votantes")
    .select("*")
    .eq("mesa_id", mesaId)
    .order("hora_corte", { ascending: true });

  if (error) throw error;
  return (data as Afluencia[]) || [];
}

/**
 * Inserta o actualiza un registro de afluencia para una hora de corte.
 */
export async function upsertAfluencia(
  afluencia: AfluenciaInput,
): Promise<Afluencia> {
  const { data, error } = await supabase
    .from("afluencia_votantes")
    .upsert(afluencia as never, { onConflict: "mesa_id,hora_corte" })
    .select()
    .single();

  if (error) throw error;
  return data as Afluencia;
}
