import { createClient } from "@/lib/supabase/client";
import type { Mesa, MesaConRelaciones, TestigoMesa, Profile } from "@/types";

const supabase = createClient();

export interface TestigoMesaConTestigo extends TestigoMesa {
  testigo: Profile;
}

export async function obtenerMesas(): Promise<MesaConRelaciones[]> {
  const { data, error } = await supabase
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
    .order("numero_mesa");

  if (error) throw error;
  return (data as MesaConRelaciones[]) || [];
}

export async function obtenerMesaPorId(
  id: string,
): Promise<MesaConRelaciones | null> {
  const { data, error } = await supabase
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
    .eq("id", id)
    .single();

  if (error) return null;
  return data as MesaConRelaciones;
}

export async function obtenerMesasPorPuesto(
  puestoId: string,
): Promise<MesaConRelaciones[]> {
  const { data, error } = await supabase
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
    .eq("puesto_id", puestoId)
    .order("numero_mesa");

  if (error) throw error;
  return (data as MesaConRelaciones[]) || [];
}

export async function obtenerMesasPorTestigo(
  testigoId: string,
): Promise<MesaConRelaciones[]> {
  const { data, error } = await supabase
    .from("testigo_mesas")
    .select(
      `
      mesa:mesa_id (
        *,
        puesto:puesto_id (
          *,
          municipio:municipio_id (*)
        ),
        actas_e14(estado),
        afluencia_votantes(cantidad, hora_corte)
      )
    `,
    )
    .eq("testigo_id", testigoId);

  if (error) throw error;

  return (
    (data as unknown as Array<{ mesa: MesaConRelaciones }>).map(
      (item) => item.mesa,
    ) || []
  );
}

export async function crearMesa(mesa: Partial<Mesa>): Promise<Mesa> {
  const { data, error } = await supabase
    .from("mesas")
    .insert(mesa as never)
    .select()
    .single();

  if (error) throw error;
  return data as Mesa;
}

export async function actualizarMesa(
  id: string,
  mesa: Partial<Mesa>,
): Promise<Mesa> {
  const { data, error } = await supabase
    .from("mesas")
    .update(mesa as never)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Mesa;
}

export async function eliminarMesa(id: string): Promise<void> {
  const { error } = await supabase.from("mesas").delete().eq("id", id);

  if (error) throw error;
}

export async function asignarTestigoAMesa(
  testigoId: string,
  mesaId: string,
): Promise<TestigoMesa> {
  const { data: userData } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("testigo_mesas")
    .insert({
      testigo_id: testigoId,
      mesa_id: mesaId,
      asignado_por: userData.user?.id,
    } as never)
    .select()
    .single();

  if (error) throw error;
  return data as TestigoMesa;
}

export async function desasignarTestigoDeMesa(
  testigoId: string,
  mesaId: string,
): Promise<void> {
  const { error } = await supabase
    .from("testigo_mesas")
    .delete()
    .eq("testigo_id", testigoId)
    .eq("mesa_id", mesaId);

  if (error) throw error;
}

export async function obtenerAsignacionesPorPuesto(
  puestoId: string,
): Promise<TestigoMesaConTestigo[]> {
  const { data, error } = await supabase
    .from("testigo_mesas")
    .select(
      `
      *,
      mesa:mesa_id (*),
      testigo:testigo_id (*)
    `,
    )
    .eq("mesa.puesto_id", puestoId);

  if (error) throw error;
  return (data as unknown as TestigoMesaConTestigo[]) || [];
}

export async function obtenerMesasConActasPorPuesto(
  puestoId: string,
): Promise<MesaConRelaciones[]> {
  const { data, error } = await supabase
    .from("mesas")
    .select(
      `
      *,
      puesto:puesto_id (
        *,
        municipio:municipio_id (*)
      ),
      actas_e14 (
        *,
        registradoPor:registrado_por (*),
        verificadoPor:verificado_por (*)
      ),
      afluencia_votantes (
        cantidad,
        hora_corte
      )
    `,
    )
    .eq("puesto_id", puestoId)
    .order("numero_mesa");

  if (error) throw error;
  return (data as MesaConRelaciones[]) || [];
}

export async function confirmarTestigoEnMesa(
  mesaId: string,
  confirmado: boolean,
  confirmadoPor: string,
): Promise<Mesa> {
  const { data, error } = await supabase
    .from("mesas")
    .update({
      testigo_confirmado: confirmado,
      testigo_confirmado_por: confirmadoPor,
      testigo_confirmado_en: confirmado ? new Date().toISOString() : null,
    } as never)
    .eq("id", mesaId)
    .select()
    .single();

  if (error) throw error;
  return data as Mesa;
}
