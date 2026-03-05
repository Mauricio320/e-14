'use client'

import { useBlockUI } from '@/contexts/BlockUIContext'

export function BlockUI() {
  const { state } = useBlockUI()

  if (!state.isVisible) return null

  const progressPercentage = state.progress
    ? Math.round((state.progress.current / state.progress.total) * 100)
    : 0

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Overlay con backdrop blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Contenedor principal */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
        {/* Spinner animado */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Círculo exterior */}
            <div className="w-16 h-16 rounded-full border-4 border-blue-100" />
            {/* Círculo animado */}
            <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
            {/* Icono de check (opcional, se puede mostrar al finalizar) */}
          </div>
        </div>

        {/* Mensaje de estado */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Procesando...
          </h3>
          <p className="text-gray-600">
            {state.message}
          </p>
        </div>

        {/* Barra de progreso (solo si hay progreso definido) */}
        {state.progress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progreso</span>
              <span>
                {state.progress.current} de {state.progress.total}
                {' '}
                ({progressPercentage}%)
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Indicador de actividad sin progreso definido */}
        {!state.progress && (
          <div className="flex justify-center gap-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}

        {/* Nota informativa */}
        <p className="mt-6 text-xs text-center text-gray-500">
          Por favor no cierre esta ventana hasta que el proceso termine
        </p>
      </div>
    </div>
  )
}
