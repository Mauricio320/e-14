import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { MesaConRelaciones, PuestoConRelaciones } from '@/types'

interface PuestoPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PuestoPage({ params }: PuestoPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Obtener el puesto
  const { data: puesto } = await supabase
    .from('puestos_votacion')
    .select(`
      *,
      municipio:municipio_id (*)
    `)
    .eq('id', id)
    .single() as { data: PuestoConRelaciones | null }

  if (!puesto) {
    redirect('/')
  }

  // Obtener mesas del puesto
  const { data: mesas } = await supabase
    .from('mesas')
    .select(`
      *,
      actas:actas_e14 (*)
    `)
    .eq('puesto_id', id)
    .order('numero_mesa') as { data: Array<MesaConRelaciones & { actas: any[] }> | null }

  // Calcular estadísticas
  const mesasConEstado = mesas?.map(mesa => {
    const acta = mesa.actas?.[0]
    return {
      ...mesa,
      estado: acta?.estado || 'pendiente',
    }
  })

  const totalMesas = mesas?.length || 0
  const mesasReportadas = mesasConEstado?.filter(m =>
    ['enviado', 'verificado', 'corregido'].includes(m.estado)
  ).length || 0
  const porcentaje = totalMesas > 0 ? Math.round((mesasReportadas / totalMesas) * 100) : 0

  return (
    <div className="space-y-6">
      <div>
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← Volver al dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">
          {puesto.nombre}
        </h1>
        <p className="text-gray-600">
          {puesto.municipio?.nombre} • {puesto.direccion}
        </p>
        <p className="text-sm text-gray-500 capitalize">
          Zona {puesto.zona}
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total Mesas</p>
          <p className="text-3xl font-bold text-gray-900">{totalMesas}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Mesas Reportadas</p>
          <p className="text-3xl font-bold text-gray-900">{mesasReportadas}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Progreso</p>
          <p className="text-3xl font-bold text-gray-900">{porcentaje}%</p>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${porcentaje}%` }}
          />
        </div>
      </div>

      {/* Mesas */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Mesas</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mesasConEstado?.map((mesa) => {
              const estadoColors: Record<string, string> = {
                pendiente: 'bg-gray-100 border-gray-300',
                borrador: 'bg-yellow-50 border-yellow-300',
                enviado: 'bg-blue-50 border-blue-300',
                verificado: 'bg-green-50 border-green-300',
                corregido: 'bg-purple-50 border-purple-300',
              }

              const estadoLabels: Record<string, string> = {
                pendiente: 'Pendiente',
                borrador: 'Borrador',
                enviado: 'Enviada',
                verificado: 'Verificada',
                corregido: 'Corregida',
              }

              return (
                <Link
                  key={mesa.id}
                  href={`/mesa/${mesa.id}`}
                  className={`p-4 border rounded-lg transition-all hover:shadow-sm ${
                    estadoColors[mesa.estado] || 'bg-gray-100 border-gray-300'
                  }`}
                >
                  <p className="text-2xl font-bold text-gray-900 text-center">
                    {mesa.numero_mesa}
                  </p>
                  <p className="text-xs text-center text-gray-600 mt-1">
                    {estadoLabels[mesa.estado] || 'Pendiente'}
                  </p>
                  <p className="text-xs text-center text-gray-400 mt-1">
                    Potencial: {mesa.potencial_electoral}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
