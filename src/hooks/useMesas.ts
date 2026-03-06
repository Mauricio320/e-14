import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  obtenerMesas,
  obtenerMesaPorId,
  obtenerMesasPorPuesto,
  obtenerMesasPorTestigo,
  crearMesa,
  actualizarMesa,
  eliminarMesa,
  asignarTestigoAMesa,
  desasignarTestigoDeMesa,
  obtenerAsignacionesPorPuesto,
  obtenerMesasConActasPorPuesto,
  confirmarTestigoEnMesa,
} from "@/servicios/mesas";
import type { Mesa } from "@/types";

const MESAS_KEY = "mesas";

export function useMesas() {
  return useQuery({
    queryKey: [MESAS_KEY],
    queryFn: obtenerMesas,
  });
}

export function useMesa(id: string) {
  return useQuery({
    queryKey: [MESAS_KEY, id],
    queryFn: () => obtenerMesaPorId(id),
    enabled: !!id,
  });
}

export function useMesasPorPuesto(puestoId: string) {
  return useQuery({
    queryKey: [MESAS_KEY, "puesto", puestoId],
    queryFn: () => obtenerMesasPorPuesto(puestoId),
    enabled: !!puestoId,
  });
}

export function useMesasConActasPorPuesto(puestoId: string) {
  return useQuery({
    queryKey: [MESAS_KEY, "puesto", puestoId, "con_actas"],
    queryFn: () => obtenerMesasConActasPorPuesto(puestoId),
    enabled: false, // Se dispara manualmente con refetch
  });
}

export function useMesasPorTestigo(testigoId: string) {
  return useQuery({
    queryKey: [MESAS_KEY, "testigo", testigoId],
    queryFn: () => obtenerMesasPorTestigo(testigoId),
    enabled: !!testigoId,
    staleTime: 0,
    gcTime: 0,
  });
}

export function useCrearMesa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mesa: Partial<Mesa>) => crearMesa(mesa),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MESAS_KEY] });
    },
  });
}

export function useActualizarMesa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, mesa }: { id: string; mesa: Partial<Mesa> }) =>
      actualizarMesa(id, mesa),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [MESAS_KEY] });
      queryClient.invalidateQueries({ queryKey: [MESAS_KEY, variables.id] });
    },
  });
}

export function useEliminarMesa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eliminarMesa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MESAS_KEY] });
    },
  });
}

export function useAsignarTestigoAMesa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      testigoId,
      mesaId,
    }: {
      testigoId: string;
      mesaId: string;
    }) => asignarTestigoAMesa(testigoId, mesaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MESAS_KEY] });
    },
  });
}

export function useDesasignarTestigoDeMesa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      testigoId,
      mesaId,
    }: {
      testigoId: string;
      mesaId: string;
    }) => desasignarTestigoDeMesa(testigoId, mesaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MESAS_KEY] });
    },
  });
}

export function useAsignacionesPorPuesto(puestoId: string) {
  return useQuery({
    queryKey: [MESAS_KEY, "asignaciones", puestoId],
    queryFn: () => obtenerAsignacionesPorPuesto(puestoId),
    enabled: !!puestoId,
  });
}

export function useConfirmarTestigoMesa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      mesaId,
      confirmado,
      confirmadoPor,
    }: {
      mesaId: string;
      confirmado: boolean;
      confirmadoPor: string;
    }) => confirmarTestigoEnMesa(mesaId, confirmado, confirmadoPor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MESAS_KEY] });
    },
  });
}
