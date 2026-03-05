'use client'

import { useRouter } from 'next/navigation'
import { FormularioE14 } from '@/components/e14/FormularioE14'
import { useMesaData } from '@/hooks/useMesaData'
import { useUserRole } from '@/hooks/useUserRole'

interface MesaPageClientProps {
  mesaId: string
}

export function MesaPageClient({ mesaId }: MesaPageClientProps) {
  const router = useRouter()
  const { data, isLoading, error, refetch } = useMesaData(mesaId)
  const { role } = useUserRole()

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">Error al cargar los datos de la mesa</p>
          <button
            onClick={() => refetch()}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  const { mesa, acta, candidatos } = data

  const puedeEditar = role === 'maestro' ||
    role === 'coordinador_puesto' ||
    role === 'testigo'

  const esRevisor = role === 'revisor' || role === 'maestro'

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4 lg:mb-6">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
          Acta E-14 - Mesa {mesa.numero_mesa}
        </h1>
        <p className="text-sm lg:text-base text-gray-600 mt-1">
          {mesa.puesto?.nombre} • {mesa.puesto?.municipio?.nombre}
        </p>
      </div>

      <FormularioE14
        mesa={mesa}
        actaExistente={acta}
        candidatos={candidatos}
        modoRevisor={esRevisor && !puedeEditar}
        onSuccess={() => router.push('/')}
      />
    </div>
  )
}
