import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export interface AlertaActa {
  id: string;
  acta_id: string;
  codigo: string;
  descripcion: string;
  creado_en: string;
}

export interface AlertaInput {
  acta_id: string;
  codigo: string;
  descripcion: string;
}

/**
 * Upserta un lote de alertas para un acta.
 * Usa ON CONFLICT (acta_id, codigo) para actualizar la descripción si ya existe.
 */
export async function upsertAlertas(alertas: AlertaInput[]): Promise<void> {
  if (alertas.length === 0) return;

  const { error } = await supabase
    .from("alertas_acta")
    .upsert(alertas as never[], { onConflict: "acta_id,codigo" });

  if (error) throw error;
}

/**
 * Elimina todas las alertas de un acta (útil para limpiar alertas resueltas).
 */
export async function eliminarAlertasPorActa(actaId: string): Promise<void> {
  const { error } = await supabase
    .from("alertas_acta")
    .delete()
    .eq("acta_id", actaId);

  if (error) throw error;
}

/**
 * Elimina alertas específicas por sus codigos.
 */
export async function eliminarAlertasPorCodigos(
  actaId: string,
  codigos: string[],
): Promise<void> {
  if (codigos.length === 0) return;

  const { error } = await supabase
    .from("alertas_acta")
    .delete()
    .eq("acta_id", actaId)
    .in("codigo", codigos);

  if (error) throw error;
}

export async function obtenerAlertasPorActa(
  actaId: string,
): Promise<AlertaActa[]> {
  const { data, error } = await supabase
    .from("alertas_acta")
    .select("*")
    .eq("acta_id", actaId)
    .order("creado_en", { ascending: true });

  if (error) throw error;
  return (data as AlertaActa[]) || [];
}
