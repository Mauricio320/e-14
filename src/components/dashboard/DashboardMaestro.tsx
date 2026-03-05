'use client'

import { useEstadisticas } from '@/hooks/useActasE14'
import { useMunicipios } from '@/hooks/useMunicipios'
import type { Profile } from '@/types'
import Link from 'next/link'

interface DashboardMaestroProps {
  profile: Profile
}

export function DashboardMaestro({ profile }: DashboardMaestroProps) {
  const { data: estadisticas, isLoading: loadingStats } = useEstadisticas()
  const { data: municipios, isLoading: loadingMunicipios } = useMunicipios()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Panel de Administración
        </h1>
        <p className="text-gray-600">
          Bienvenido, {profile.full_name}
        </p>
      </div>

      {/* Estadísticas Globales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total de Mesas"
          value={estadisticas?.totalMesas || 0}
          loading={loadingStats}
          icon="mesas"
        />
        <StatCard
          title="Mesas Reportadas"
          value={estadisticas?.mesasReportadas || 0}
          loading={loadingStats}
          icon="reportadas"
        />
        <StatCard
          title="Porcentaje Reportado"
          value={`${estadisticas?.porcentajeReportado || 0}%`}
          loading={loadingStats}
          icon="porcentaje"
        />
      </div>

      {/* Acciones Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ActionCard
          href="/admin"
          title="Gestión de Usuarios"
          description="Crear, editar y asignar roles"
          icon="users"
        />
        <ActionCard
          href="/admin#puestos"
          title="Puestos de Votación"
          description="Configurar puestos y mesas"
          icon="location"
        />
        <ActionCard
          href="/revisor"
          title="Revisión de Actas"
          description="Verificar y corregir actas"
          icon="review"
        />
        <ActionCard
          href="/admin#reportes"
          title="Reportes"
          description="Exportar datos y estadísticas"
          icon="report"
        />
      </div>

      {/* Municipios */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Municipios
          </h2>
        </div>
        <div className="p-4">
          {loadingMunicipios ? (
            <div className="text-center py-8 text-gray-500">
              Cargando municipios...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {municipios?.map((municipio) => (
                <Link
                  key={municipio.id}
                  href={`/municipio/${municipio.id}`}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <p className="font-medium text-gray-900">{municipio.nombre}</p>
                  <p className="text-sm text-gray-500">
                    Código DANE: {municipio.codigo_dane}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  loading: boolean
  icon: string
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

interface ActionCardProps {
  href: string
  title: string
  description: string
  icon: string
}

function ActionCard({ href, title, description }: ActionCardProps) {
  return (
    <Link
      href={href}
      className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-sm transition-all"
    >
      <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </Link>
  )
}
