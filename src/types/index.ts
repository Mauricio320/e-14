import type { Database } from './database'

export type Role = Database['public']['Enums']['role_enum']
export type EstadoActa = Database['public']['Enums']['estado_enum']
export type Zona = Database['public']['Enums']['zona_enum']

// Tipos de tablas
export type Municipio = Database['public']['Tables']['municipios']['Row']
export type PuestoVotacion = Database['public']['Tables']['puestos_votacion']['Row']
export type Mesa = Database['public']['Tables']['mesas']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Partido = Database['public']['Tables']['partidos']['Row']
export type Candidato = Database['public']['Tables']['candidatos']['Row']
export type ActaE14 = Database['public']['Tables']['actas_e14']['Row']
export type VotoCandidato = Database['public']['Tables']['votos_candidato']['Row']
export type VotoLista = Database['public']['Tables']['votos_lista']['Row']
export type FotoActa = Database['public']['Tables']['fotos_acta']['Row']
export type AuditoriaCambio = Database['public']['Tables']['auditoria_cambios']['Row']
export type TestigoMesa = Database['public']['Tables']['testigo_mesas']['Row']
export type RevisorAsignacion = Database['public']['Tables']['revisor_asignaciones']['Row']

// Tipos con relaciones
export type CandidatoConPartido = Candidato & { partido?: Partido }

// Tipos extendidos con relaciones
export interface MesaConRelaciones extends Mesa {
  puesto?: PuestoVotacion & { municipio?: Municipio }
}

export interface ActaConRelaciones extends ActaE14 {
  mesa?: MesaConRelaciones
  registradoPor?: Profile
  verificadoPor?: Profile
  votos?: (VotoCandidato & { candidato?: Candidato & { partido?: Partido } })[]
  votosLista?: (VotoLista & { partido?: Partido })[]
  fotos?: FotoActa[]
}

export interface PuestoConRelaciones extends PuestoVotacion {
  municipio?: Municipio
  mesas?: Mesa[]
  actas_count?: number
}

export interface MunicipioConRelaciones extends Municipio {
  puestos?: PuestoVotacion[]
  actas_count?: number
}

// Tipos para formularios
export interface VotoFormData {
  candidatoId: string
  votos: number
}

export interface ActaFormData {
  mesaId: string
  votos: VotoFormData[]
  totalVotosUrna: number
  totalVotosIncinerados: number
  votosEnBlanco: number
  votosNulos: number
  tarjetasNoMarcadas: number
  totalVotosValidos: number
  totalSufragantes: number
  observaciones?: string
}

// Tipos para filtros
export interface FiltrosActa {
  estado?: EstadoActa
  municipioId?: string
  puestoId?: string
  mesaId?: string
  fechaDesde?: string
  fechaHasta?: string
}

// Tipos para estadísticas
export interface EstadisticasDashboard {
  totalMesas: number
  mesasReportadas: number
  porcentajeReportado: number
  totalVotos: number
}
