import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { PuestoConRelaciones, MesaConRelaciones } from '@/types'

interface MunicipioPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function MunicipioPage({ params }: MunicipioPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Obtener el municipio
  const { data: municipio } = await supabase
    .from('municipios')
    .select('*')
    .eq('id', id)
    .single() as { data: { id: string; nombre: string } | null }

  if (!municipio) {
    redirect('/')
  }

  // Obtener puestos del municipio
  const { data: puestos } = await supabase
    .from('puestos_votacion')
    .select(`
      *,
      mesas:mesas (*)
    `)
    .eq('municipio_id', id)
    .order('nombre') as { data: Array<PuestoConRelaciones & { mesas: MesaConRelaciones[] }> | null }

  // Obtener actas para todas las mesas
  const { data: actas } = await supabase
    .from('actas_e14')
    .select('mesa_id, estado') as { data: Array<{ mesa_id: string; estado: string }> | null }

  const actasPorMesa = new Map(actas?.map(a => [a.mesa_id, a.estado]) || [])

  // Calcular estadísticas
  let totalMesas = 0
  let mesasReportadas = 0

  const puestosConStats = puestos?.map(puesto => {
    const mesasDelPuesto = puesto.mesas || []
    const totalMesasPuesto = mesasDelPuesto.length
    const mesasReportadasPuesto = mesasDelPuesto.filter(m => {
      const estado = actasPorMesa.get(m.id)
      return estado && ['enviado', 'verificado', 'corregido'].includes(estado)
    }).length

    totalMesas += totalMesasPuesto
    mesasReportadas += mesasReportadasPuesto

    return {
      ...puesto,
      totalMesas: totalMesasPuesto,
      mesasReportadas: mesasReportadasPuesto,
      porcentaje: totalMesasPuesto > 0 ? Math.round((mesasReportadasPuesto / totalMesasPuesto) * 100) : 0
    }
  })

  const porcentajeTotal = totalMesas > 0 ? Math.round((mesasReportadas / totalMesas) * 100) : 0

  return (
    <div className="space-y-6">
      <div>
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← Volver al dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">
          {municipio.nombre}
        </h1>
        <p className="text-gray-600">
          Departamento de Casanare
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Puestos de Votación</p>
          <p className="text-3xl font-bold text-gray-900">{puestos?.length || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total Mesas</p>
          <p className="text-3xl font-bold text-gray-900">{totalMesas}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Mesas Reportadas</p>
          <p className="text-3xl font-bold text-gray-900">{mesasReportadas}</p>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progreso de Reporte</span>
          <span className="text-sm font-medium text-gray-900">{porcentajeTotal}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${porcentajeTotal}%` }}
          />
        </div>
      </div>

      {/* Puestos */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Puestos de Votación</h2>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {puestosConStats?.map((puesto) => (
              <Link
                key={puesto.id}
                href={`/puesto/${puesto.id}`}
                className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{puesto.nombre}</h3>
                    <p className="text-sm text-gray-600">{puesto.direccion}</p>
                    <p className="text-sm text-gray-500 capitalize">Zona {puesto.zona}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {puesto.mesasReportadas}/{puesto.totalMesas}
                    </p>
                    <p className="text-sm text-gray-600">mesas reportadas</p>
                    <div className="mt-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        puesto.porcentaje === 100
                          ? 'bg-green-100 text-green-800'
                          : puesto.porcentaje > 50
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {puesto.porcentaje}%
                      </span>
                    </div>
                  </div>
                </div>
                {/* Mini barra de progreso */}
                <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${
                      puesto.porcentaje === 100 ? 'bg-green-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${puesto.porcentaje}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
