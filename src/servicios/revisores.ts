import { createClient } from "@/lib/supabase/client";
import type {
  RevisorAsignacion,
  Profile,
  PuestoVotacion,
  Municipio,
} from "@/types";

const supabase = createClient();

export interface PuestoConMunicipio extends PuestoVotacion {
  municipio?: Municipio;
}

export interface RevisorAsignacionConDetalles extends RevisorAsignacion {
  revisor: Profile;
  puesto: PuestoConMunicipio;
}

export async function obtenerAsignacionesPorRevisor(
  revisorId: string,
): Promise<RevisorAsignacionConDetalles[]> {
  const { data, error } = await supabase
    .from("revisor_asignaciones")
    .select(
      `
      *,
      puesto:puesto_id (*, municipio:municipio_id (*))
    `,
    )
    .eq("revisor_id", revisorId);

  if (error) throw error;
  return (data as unknown as RevisorAsignacionConDetalles[]) || [];
}

export async function obtenerAsignacionesRevisorPorMunicipio(
  municipioId: string,
): Promise<RevisorAsignacionConDetalles[]> {
  // Primero obtenemos los puestos del municipio
  const { data: puestos } = await supabase
    .from("puestos_votacion")
    .select("id")
    .eq("municipio_id", municipioId);

  if (!puestos || puestos.length === 0) return [];
  const puestoIds = (puestos as { id: string }[]).map((p) => p.id);

  // Luego obtenemos las asignaciones de esos puestos
  const { data, error } = await supabase
    .from("revisor_asignaciones")
    .select(
      `
      *,
      revisor:revisor_id (*),
      puesto:puesto_id (*, municipio:municipio_id (*))
    `,
    )
    .in("puesto_id", puestoIds);

  if (error) throw error;
  return (data as unknown as RevisorAsignacionConDetalles[]) || [];
}

export async function asignarRevisorAPuesto(
  revisorId: string,
  puestoId: string,
): Promise<RevisorAsignacion> {
  const { data: userData } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("revisor_asignaciones")
    .insert({
      revisor_id: revisorId,
      puesto_id: puestoId,
      asignado_por: userData.user?.id,
    } as never)
    .select()
    .single();

  if (error) throw error;
  return data as RevisorAsignacion;
}

export async function desasignarRevisorDePuesto(
  revisorId: string,
  puestoId: string,
): Promise<void> {
  const { error } = await supabase
    .from("revisor_asignaciones")
    .delete()
    .eq("revisor_id", revisorId)
    .eq("puesto_id", puestoId);

  if (error) throw error;
}
