'use client'

import { useActasPorEstado } from '@/hooks/useActasE14'
import type { Profile, ActaConRelaciones } from '@/types'
import Link from 'next/link'

interface DashboardRevisorProps {
  profile: Profile
}

export function DashboardRevisor({ profile }: DashboardRevisorProps) {
  const { data: actasPendientes, isLoading } = useActasPorEstado('enviado')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Panel de Revisión
        </h1>
        <p className="text-gray-600">
          Bienvenido, {profile.full_name}
        </p>
      </div>

      {/* Resumen */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-800 font-medium">
              Actas Pendientes de Verificación
            </p>
            <p className="text-2xl font-bold text-blue-900">
              {isLoading ? '...' : actasPendientes?.length || 0}
            </p>
          </div>
          <Link
            href="/revisor"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver Actas
          </Link>
        </div>
      </div>

      {/* Lista de actas pendientes */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Actas Pendientes
          </h2>
        </div>
        <div className="p-4">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              Cargando actas...
            </div>
          ) : actasPendientes?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay actas pendientes de verificación
            </div>
          ) : (
            <div className="space-y-3">
              {actasPendientes?.slice(0, 5).map((acta) => (
                <ActaPendienteCard key={acta.id} acta={acta} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ActaPendienteCard({ acta }: { acta: ActaConRelaciones }) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
      <div>
        <p className="font-medium text-gray-900">
          Mesa {acta.mesa?.numero_mesa} - {acta.mesa?.puesto?.nombre}
        </p>
        <p className="text-sm text-gray-500">
          {acta.mesa?.puesto?.municipio?.nombre} • Enviado: {new Date(acta.enviado_en || '').toLocaleString()}
        </p>
        <p className="text-sm text-gray-500">
          Por: {acta.registradoPor?.full_name}
        </p>
      </div>
      <Link
        href={`/mesa/${acta.mesa_id}`}
        className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
      >
        Revisar
      </Link>
    </div>
  )
}
