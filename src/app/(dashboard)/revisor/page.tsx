'use client'

import { useState } from 'react'
import { useActasPorEstado } from '@/hooks/useActasE14'
import { useVerificarActa, useCorregirActa } from '@/hooks/useActasE14'
import { useMunicipios } from '@/hooks/useMunicipios'
import { usePuestos } from '@/hooks/usePuestosVotacion'
import type { ActaConRelaciones } from '@/types'
import Link from 'next/link'

export default function RevisorPage() {
  const { data: actasPendientes, isLoading } = useActasPorEstado('enviado')
  const { data: municipios } = useMunicipios()
  const { data: puestos } = usePuestos()

  const [filtroMunicipio, setFiltroMunicipio] = useState('')
  const [filtroPuesto, setFiltroPuesto] = useState('')

  const verificarActa = useVerificarActa()
  const corregirActa = useCorregirActa()

  // Filtrar actas
  const actasFiltradas = actasPendientes?.filter((acta) => {
    const cumpleMunicipio = !filtroMunicipio ||
      acta.mesa?.puesto?.municipio_id === filtroMunicipio
    const cumplePuesto = !filtroPuesto ||
      acta.mesa?.puesto_id === filtroPuesto
    return cumpleMunicipio && cumplePuesto
  })

  async function handleVerificar(actaId: string) {
    if (!confirm('¿Está seguro de verificar este acta?')) return
    await verificarActa.mutateAsync(actaId)
  }

  async function handleCorregir(actaId: string) {
    if (!confirm('¿Está seguro de solicitar corrección para este acta? Se creará una nueva versión.')) return
    await corregirActa.mutateAsync(actaId)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Revisión de Actas
        </h1>
        <p className="text-gray-600">
          Verificación y corrección de actas E-14
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Municipio
            </label>
            <select
              value={filtroMunicipio}
              onChange={(e) => setFiltroMunicipio(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los municipios</option>
              {municipios?.map((m) => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Puesto de Votación
            </label>
            <select
              value={filtroPuesto}
              onChange={(e) => setFiltroPuesto(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los puestos</option>
              {puestos
                ?.filter((p) => !filtroMunicipio || p.municipio_id === filtroMunicipio)
                ?.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de actas */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Actas Pendientes de Verificación
          </h2>
          <span className="text-sm text-gray-500">
            {actasFiltradas?.length || 0} actas
          </span>
        </div>

        <div className="p-4">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              Cargando actas...
            </div>
          ) : actasFiltradas?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-2">No hay actas pendientes de verificación</p>
              <p className="text-sm text-gray-400">
                Todas las actas han sido verificadas
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {actasFiltradas?.map((acta) => (
                <ActaCard
                  key={acta.id}
                  acta={acta}
                  onVerificar={() => handleVerificar(acta.id)}
                  onCorregir={() => handleCorregir(acta.id)}
                  isVerifying={verificarActa.isPending}
                  isCorrecting={corregirActa.isPending}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface ActaCardProps {
  acta: ActaConRelaciones
  onVerificar: () => void
  onCorregir: () => void
  isVerifying: boolean
  isCorrecting: boolean
}

function ActaCard({ acta, onVerificar, onCorregir, isVerifying, isCorrecting }: ActaCardProps) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
              Enviado
            </span>
            <span className="text-sm text-gray-500">
              Versión {acta.version}
            </span>
          </div>
          <p className="font-medium text-gray-900 mt-2">
            Mesa {acta.mesa?.numero_mesa} - {acta.mesa?.puesto?.nombre}
          </p>
          <p className="text-sm text-gray-500">
            {acta.mesa?.puesto?.municipio?.nombre}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Enviado: {new Date(acta.enviado_en || '').toLocaleString()} • Por: {acta.registradoPor?.full_name}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Total votos: {acta.total_votos_validos?.toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/mesa/${acta.mesa_id}`}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Ver detalle
          </Link>
          <button
            onClick={onVerificar}
            disabled={isVerifying || isCorrecting}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {isVerifying ? 'Verificando...' : 'Verificar'}
          </button>
          <button
            onClick={onCorregir}
            disabled={isVerifying || isCorrecting}
            className="px-4 py-2 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-colors"
          >
            {isCorrecting ? 'Creando...' : 'Corregir'}
          </button>
        </div>
      </div>
    </div>
  )
}
