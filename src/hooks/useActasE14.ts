import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  obtenerActas,
  obtenerActaPorId,
  obtenerActaPorMesa,
  obtenerActasPorEstado,
  crearActa,
  actualizarActa,
  enviarActa,
  verificarActa,
  corregirActa,
  eliminarActa,
  obtenerEstadisticas,
  obtenerEstadoPuesto,
} from "@/servicios/actas-e14";
import type { ActaE14, EstadoActa } from "@/types";

const ACTAS_KEY = "actas";

export function useActas() {
  return useQuery({
    queryKey: [ACTAS_KEY],
    queryFn: obtenerActas,
  });
}

export function useActa(id: string) {
  return useQuery({
    queryKey: [ACTAS_KEY, id],
    queryFn: () => obtenerActaPorId(id),
    enabled: !!id,
  });
}

export function useActaPorMesa(mesaId: string, version?: number) {
  return useQuery({
    queryKey: [ACTAS_KEY, "mesa", mesaId, version],
    queryFn: () => obtenerActaPorMesa(mesaId, version),
    enabled: !!mesaId,
  });
}

export function useActasPorEstado(estado: EstadoActa) {
  return useQuery({
    queryKey: [ACTAS_KEY, "estado", estado],
    queryFn: () => obtenerActasPorEstado(estado),
  });
}

export function useActasPorEstadoPuesto(puestoId: string, estado?: EstadoActa) {
  return useQuery({
    queryKey: [ACTAS_KEY, "estado", estado, puestoId],
    queryFn: () => obtenerEstadoPuesto(puestoId, estado),
    enabled: false,
  });
}

export function useCrearActa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (acta: Partial<ActaE14>) => crearActa(acta),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACTAS_KEY] });
    },
  });
}

export function useActualizarActa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, acta }: { id: string; acta: Partial<ActaE14> }) =>
      actualizarActa(id, acta),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [ACTAS_KEY] });
      queryClient.invalidateQueries({ queryKey: [ACTAS_KEY, variables.id] });
    },
  });
}

export function useEnviarActa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: enviarActa,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [ACTAS_KEY] });
      queryClient.invalidateQueries({ queryKey: [ACTAS_KEY, id] });
    },
  });
}

export function useVerificarActa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verificarActa,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [ACTAS_KEY] });
      queryClient.invalidateQueries({ queryKey: [ACTAS_KEY, id] });
    },
  });
}

export function useCorregirActa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: corregirActa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACTAS_KEY] });
    },
  });
}

export function useEliminarActa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eliminarActa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACTAS_KEY] });
    },
  });
}

export function useEstadisticas() {
  return useQuery({
    queryKey: [ACTAS_KEY, "estadisticas"],
    queryFn: obtenerEstadisticas,
  });
}
