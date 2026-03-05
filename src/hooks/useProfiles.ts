import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  obtenerProfile,
  obtenerProfilePorId,
  obtenerProfiles,
  obtenerProfilesPorRol,
  obtenerTestigos,
  obtenerCoordinadoresPuesto,
  obtenerCoordinadoresMunicipio,
  obtenerRevisores,
  actualizarProfile,
  cambiarRol,
  activarUsuario,
  desactivarUsuario,
  asignarMunicipio,
  asignarPuesto,
  buscarProfiles,
  crearUsuario,
} from '@/servicios/profiles'
import type { Profile, Role } from '@/types'

const PROFILES_KEY = 'profiles'

export function useProfile() {
  return useQuery({
    queryKey: [PROFILES_KEY, 'me'],
    queryFn: obtenerProfile,
  })
}

export function useProfilePorId(id: string) {
  return useQuery({
    queryKey: [PROFILES_KEY, id],
    queryFn: () => obtenerProfilePorId(id),
    enabled: !!id,
  })
}

export function useProfiles() {
  return useQuery({
    queryKey: [PROFILES_KEY],
    queryFn: obtenerProfiles,
  })
}

export function useProfilesPorRol(rol: Role) {
  return useQuery({
    queryKey: [PROFILES_KEY, 'rol', rol],
    queryFn: () => obtenerProfilesPorRol(rol),
  })
}

export function useTestigos() {
  return useQuery({
    queryKey: [PROFILES_KEY, 'rol', 'testigo'],
    queryFn: obtenerTestigos,
  })
}

export function useCoordinadoresPuesto() {
  return useQuery({
    queryKey: [PROFILES_KEY, 'rol', 'coordinador_puesto'],
    queryFn: obtenerCoordinadoresPuesto,
  })
}

export function useCoordinadoresMunicipio() {
  return useQuery({
    queryKey: [PROFILES_KEY, 'rol', 'coordinador_municipal'],
    queryFn: obtenerCoordinadoresMunicipio,
  })
}

export function useRevisores() {
  return useQuery({
    queryKey: [PROFILES_KEY, 'rol', 'revisor'],
    queryFn: obtenerRevisores,
  })
}

export function useBuscarProfiles(query: string) {
  return useQuery({
    queryKey: [PROFILES_KEY, 'buscar', query],
    queryFn: () => buscarProfiles(query),
    enabled: query.length >= 2,
  })
}

export function useActualizarProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, profile }: { id: string; profile: Partial<Profile> }) =>
      actualizarProfile(id, profile),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [PROFILES_KEY] })
      queryClient.invalidateQueries({ queryKey: [PROFILES_KEY, variables.id] })
    },
  })
}

export function useCambiarRol() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, rol }: { id: string; rol: Role }) => cambiarRol(id, rol),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [PROFILES_KEY] })
      queryClient.invalidateQueries({ queryKey: [PROFILES_KEY, variables.id] })
    },
  })
}

export function useActivarUsuario() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: activarUsuario,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [PROFILES_KEY] })
      queryClient.invalidateQueries({ queryKey: [PROFILES_KEY, id] })
    },
  })
}

export function useDesactivarUsuario() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: desactivarUsuario,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [PROFILES_KEY] })
      queryClient.invalidateQueries({ queryKey: [PROFILES_KEY, id] })
    },
  })
}

export function useAsignarMunicipio() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, municipioId }: { id: string; municipioId: string | null }) =>
      asignarMunicipio(id, municipioId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [PROFILES_KEY] })
      queryClient.invalidateQueries({ queryKey: [PROFILES_KEY, variables.id] })
    },
  })
}

export function useAsignarPuesto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, puestoId }: { id: string; puestoId: string | null }) =>
      asignarPuesto(id, puestoId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [PROFILES_KEY] })
      queryClient.invalidateQueries({ queryKey: [PROFILES_KEY, variables.id] })
    },
  })
}

export function useCrearUsuario() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: crearUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROFILES_KEY] })
    },
  })
}
