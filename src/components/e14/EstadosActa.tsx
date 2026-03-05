import type { EstadoActa } from '@/types'

interface EstadosActaProps {
  estado: EstadoActa
  version: number
  modoRevisor?: boolean
}

export function EstadosActa({ estado, version, modoRevisor = false }: EstadosActaProps) {
  const configEstados: Record<EstadoActa, { label: string; color: string; bg: string; icon: string }> = {
    borrador: {
      label: 'Pendiente',
      color: 'text-gray-700',
      bg: 'bg-gray-100 border-gray-300',
      icon: '📝',
    },
    enviado: {
      label: 'Enviado',
      color: 'text-yellow-700',
      bg: 'bg-yellow-50 border-yellow-300',
      icon: '📤',
    },
    verificado: {
      label: 'Verificado',
      color: 'text-green-700',
      bg: 'bg-green-50 border-green-300',
      icon: '✅',
    },
    corregido: {
      label: 'Corregido',
      color: 'text-blue-700',
      bg: 'bg-blue-50 border-blue-300',
      icon: '🔧',
    },
  }

  const config = configEstados[estado]

  return (
    <div className={`p-4 rounded-lg border ${config.bg}`}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{config.icon}</span>
          <div>
            <p className={`text-sm font-medium ${config.color}`}>
              Estado del Acta
            </p>
            <p className={`text-xl font-bold ${config.color}`}>
              {config.label}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Versión</p>
            <p className="text-lg font-semibold text-gray-700">
              {version}
            </p>
          </div>

          {modoRevisor && estado === 'enviado' && (
            <div className="px-4 py-2 bg-white rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">
                Pendiente de revisión
              </p>
            </div>
          )}
        </div>
      </div>

      {estado === 'borrador' && (
        <p className="mt-3 text-sm text-gray-600">
          Complete el formulario y envíe el acta. Una vez enviada no podrá editarla.
        </p>
      )}

      {estado === 'enviado' && (
        <p className="mt-3 text-sm text-yellow-700">
          El acta ha sido enviada y está pendiente de verificación por un revisor.
        </p>
      )}

      {estado === 'verificado' && (
        <p className="mt-3 text-sm text-green-700">
          El acta ha sido verificada y aprobada.
        </p>
      )}

      {estado === 'corregido' && (
        <p className="mt-3 text-sm text-blue-700">
          Se ha creado una nueva versión del acta con correcciones.
        </p>
      )}
    </div>
  )
}
