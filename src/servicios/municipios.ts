import { createClient } from "@/lib/supabase/client";
import type {
  Municipio,
  MunicipioConRelaciones,
  PuestoVotacion,
} from "@/types";
import type { ConsolidadoMunicipio } from "./consolidados";

const supabase = createClient();

export async function obtenerMunicipios(): Promise<Municipio[]> {
  const { data, error } = await supabase
    .from("municipios")
    .select("*")
    .order("nombre");

  if (error) throw error;
  return (data as Municipio[]) || [];
}

export async function obtenerMunicipioPorId(
  id: string,
): Promise<Municipio | null> {
  const { data, error } = await supabase
    .from("municipios")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Municipio;
}

export async function obtenerMunicipioConPuestos(
  id: string,
): Promise<MunicipioConRelaciones | null> {
  const { data, error } = await supabase
    .from("municipios")
    .select(
      `
      *,
      puestos:puestos_votacion (
        *,
        mesas:mesas (count)
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error) return null;

  return {
    ...(data as unknown as MunicipioConRelaciones),
    actas_count: 0,
  };
}

export async function crearMunicipio(
  municipio: Partial<Municipio>,
): Promise<Municipio> {
  const { data, error } = await supabase
    .from("municipios")
    .insert(municipio as never)
    .select()
    .single();

  if (error) throw error;
  return data as Municipio;
}

export async function actualizarMunicipio(
  id: string,
  municipio: Partial<Municipio>,
): Promise<Municipio> {
  const { data, error } = await supabase
    .from("municipios")
    .update(municipio as never)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Municipio;
}

export async function eliminarMunicipio(id: string): Promise<void> {
  const { error } = await supabase.from("municipios").delete().eq("id", id);

  if (error) throw error;
}

export async function obtenerEstadisticasMunicipio(
  municipioId: string,
): Promise<{
  totalPuestos: number;
  totalMesas: number;
  mesasReportadas: number;
  porcentajeReportado: number;
}> {
  // Usar la tabla consolidada para obtener estadísticas pre-calculadas
  const { data: consolidado, error } = await supabase
    .from("consolidados_municipio")
    .select("*")
    .eq("municipio_id", municipioId)
    .single();

  if (error) {
    // Si no existe consolidado, retornar valores en cero
    return {
      totalPuestos: 0,
      totalMesas: 0,
      mesasReportadas: 0,
      porcentajeReportado: 0,
    };
  }

  return {
    totalPuestos: (consolidado as any).total_puestos,
    totalMesas: (consolidado as any).total_mesas,
    mesasReportadas: (consolidado as any).mesas_reportadas,
    porcentajeReportado: (consolidado as any).porcentaje_reportado,
  };
}

export async function obtenerMunicipioConConsolidado(
  id: string,
): Promise<(Municipio & { consolidado: ConsolidadoMunicipio | null }) | null> {
  const { data: municipio, error: errorMunicipio } = await supabase
    .from("municipios")
    .select("*")
    .eq("id", id)
    .single();

  if (errorMunicipio || !municipio) return null;

  const { data: consolidado, error: errorConsolidado } = await supabase
    .from("consolidados_municipio")
    .select("*")
    .eq("municipio_id", id)
    .single();

  return {
    ...(municipio as Municipio),
    consolidado: errorConsolidado
      ? null
      : (consolidado as ConsolidadoMunicipio),
  };
}
