'use client'

import { useEstadisticasPuesto, usePuesto } from '@/hooks/usePuestosVotacion'
import { useMesasPorPuesto } from '@/hooks/useMesas'
import type { Profile, MesaConRelaciones } from '@/types'
import Link from 'next/link'

interface DashboardCoordinadorPuestoProps {
  profile: Profile
}

export function DashboardCoordinadorPuesto({ profile }: DashboardCoordinadorPuestoProps) {
  const puestoId = profile.puesto_id

  const { data: puesto } = usePuesto(puestoId || '')
  const { data: estadisticas, isLoading: loadingStats } = useEstadisticasPuesto(
    puestoId || ''
  )
  const { data: mesas, isLoading: loadingMesas } = useMesasPorPuesto(
    puestoId || ''
  )

  if (!puestoId) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">
          No tiene un puesto de votación asignado. Contacte al administrador.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {puesto?.nombre}
        </h1>
        <p className="text-gray-600">
          Coordinador de Puesto: {profile.full_name}
        </p>
        <p className="text-sm text-gray-500">
          {puesto?.municipio?.nombre} • {puesto?.direccion}
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Mesas"
          value={estadisticas?.totalMesas || 0}
          loading={loadingStats}
        />
        <StatCard
          title="Mesas Reportadas"
          value={estadisticas?.mesasReportadas || 0}
          loading={loadingStats}
        />
        <StatCard
          title="Progreso"
          value={`${estadisticas?.porcentajeReportado || 0}%`}
          loading={loadingStats}
        />
        <StatCard
          title="Total Votos"
          value={estadisticas?.totalVotos || 0}
          loading={loadingStats}
        />
      </div>

      {/* Barra de progreso */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progreso de Reporte
          </span>
          <span className="text-sm font-medium text-gray-700">
            {estadisticas?.porcentajeReportado || 0}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all"
            style={{ width: `${estadisticas?.porcentajeReportado || 0}%` }}
          />
        </div>
      </div>

      {/* Mesas */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Mesas
          </h2>
          <span className="text-sm text-gray-500">
            {mesas?.length || 0} mesas en total
          </span>
        </div>
        <div className="p-4">
          {loadingMesas ? (
            <div className="text-center py-8 text-gray-500">
              Cargando mesas...
            </div>
          ) : mesas?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay mesas configuradas en este puesto
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {mesas?.map((mesa) => (
                <MesaCard key={mesa.id} mesa={mesa} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MesaCard({ mesa }: { mesa: MesaConRelaciones }) {
  // Determinar el estado del acta basado en los datos
  const tieneActa = false // Esto se calcularía con los datos reales
  const estadoActa = mesa.puesto?.zona === 'urbana' ? 'borrador' : 'enviado'

  const estadoColors: Record<string, string> = {
    borrador: 'bg-gray-100 border-gray-300',
    enviado: 'bg-yellow-50 border-yellow-300',
    verificado: 'bg-green-50 border-green-300',
    corregido: 'bg-blue-50 border-blue-300',
  }

  const estadoLabels: Record<string, string> = {
    borrador: 'Sin reportar',
    enviado: 'Enviada',
    verificado: 'Verificada',
    corregido: 'Corregida',
  }

  return (
    <Link
      href={`/mesa/${mesa.id}`}
      className={`p-4 border rounded-lg transition-colors ${
        estadoColors[estadoActa] || 'bg-gray-100 border-gray-300'
      } hover:shadow-sm`}
    >
      <p className="text-2xl font-bold text-gray-900 text-center">
        {mesa.numero_mesa}
      </p>
      <p className="text-xs text-center text-gray-600 mt-1">
        {estadoLabels[estadoActa] || 'Sin reportar'}
      </p>
      <p className="text-xs text-center text-gray-400 mt-1">
        Potencial: {mesa.potencial_electoral}
      </p>
    </Link>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  loading: boolean
}

function StatCard({ title, value, loading }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      {loading ? (
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
      ) : (
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      )}
    </div>
  )
}
