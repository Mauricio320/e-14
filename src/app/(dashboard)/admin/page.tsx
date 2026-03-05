'use client'

import { useState } from 'react'
import { useProfiles, useCambiarRol, useActivarUsuario, useDesactivarUsuario, useCrearUsuario } from '@/hooks/useProfiles'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { crearUsuarioSchema, type CrearUsuarioInput } from '@/lib/validations/schemas'
import { useMunicipios } from '@/hooks/useMunicipios'
import { usePuestos } from '@/hooks/usePuestosVotacion'
import { useMesas, useMesasPorPuesto, useAsignarTestigoAMesa, useDesasignarTestigoDeMesa, useAsignacionesPorPuesto } from '@/hooks/useMesas'
import { useCrearPuesto, useEliminarPuesto } from '@/hooks/usePuestosVotacion'
import { useCrearMesa, useEliminarMesa } from '@/hooks/useMesas'
import { useTestigos } from '@/hooks/useProfiles'
import type { Profile, Role } from '@/types'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'usuarios' | 'puestos' | 'mesas' | 'asignaciones'>('usuarios')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Panel de Administración
        </h1>
        <p className="text-gray-600">
          Gestión de usuarios, puestos y mesas
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab('usuarios')}
            className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'usuarios'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Usuarios
          </button>
          <button
            onClick={() => setActiveTab('puestos')}
            className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'puestos'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Puestos
          </button>
          <button
            onClick={() => setActiveTab('mesas')}
            className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'mesas'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Mesas
          </button>
          <button
            onClick={() => setActiveTab('asignaciones')}
            className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'asignaciones'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Asignaciones
          </button>
        </nav>
      </div>

      {/* Contenido */}
      {activeTab === 'usuarios' && <UsuariosTab />}
      {activeTab === 'puestos' && <PuestosTab />}
      {activeTab === 'mesas' && <MesasTab />}
      {activeTab === 'asignaciones' && <AsignacionesTab />}
    </div>
  )
}

function UsuariosTab() {
  const { data: profiles, isLoading } = useProfiles()
  const cambiarRol = useCambiarRol()
  const activar = useActivarUsuario()
  const desactivar = useDesactivarUsuario()
  const crearUsuario = useCrearUsuario()
  const [showForm, setShowForm] = useState(false)
  const [nuevoUsuarioCreado, setNuevoUsuarioCreado] = useState<{ email: string; password: string } | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CrearUsuarioInput>({
    resolver: zodResolver(crearUsuarioSchema),
  })

  const roleLabels: Record<Role, string> = {
    maestro: 'Administrador',
    revisor: 'Revisor',
    coordinador_municipal: 'Coord. Municipal',
    coordinador_puesto: 'Coord. Puesto',
    testigo: 'Testigo',
  }

  async function onSubmit(data: CrearUsuarioInput) {
    try {
      const result = await crearUsuario.mutateAsync(data)
      console.log(result);
      
      if (result.success) {
        setNuevoUsuarioCreado({ email: data.email, password: data.password })
        setShowForm(false)
        reset()
      }
    } catch (error) {
      console.error('Error creando usuario:', error)
    }
  }

  function generarPasswordTemporal() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%'
    let password = ''
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setValue('password', password)
  }

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Cargando usuarios...</div>
  }

  return (
    <div className="space-y-4">
      {/* Boton para mostrar formulario */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Gestion de Usuarios</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancelar' : 'Nuevo Usuario'}
        </button>
      </div>

      {/* Modal de credenciales generadas */}
      {nuevoUsuarioCreado && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Usuario creado exitosamente</h3>
          <p className="text-sm text-green-700 mb-2">Guarde estas credenciales y compartalas con el usuario:</p>
          <div className="bg-white rounded p-3 space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-600">Email:</span>
              <code className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded">{nuevoUsuarioCreado.email}</code>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Contraseña temporal:</span>
              <code className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded">{nuevoUsuarioCreado.password}</code>
            </div>
          </div>
          <button
            onClick={() => setNuevoUsuarioCreado(null)}
            className="mt-3 text-sm text-green-700 underline"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Formulario de creacion */}
      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
              <input
                {...register('fullName')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Nombre del usuario"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="usuario@ejemplo.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <select
                {...register('role')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {Object.entries(roleLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <div className="flex gap-2">
                <input
                  {...register('password')}
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Minimo 6 caracteres"
                />
                <button
                  type="button"
                  onClick={generarPasswordTemporal}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                >
                  Generar
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>
          {crearUsuario.error && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-sm text-red-600">{crearUsuario.error.message}</p>
            </div>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={crearUsuario.isPending}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {crearUsuario.isPending ? 'Creando...' : 'Crear Usuario'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nombre</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Rol</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Estado</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {profiles?.map((profile) => (
                <tr key={profile.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{profile.full_name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{profile.email}</td>
                  <td className="px-4 py-3 text-sm">
                    <select
                      value={profile.role}
                      onChange={(e) => cambiarRol.mutate({ id: profile.id, rol: e.target.value as Role })}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      {Object.entries(roleLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      profile.activo
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {profile.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {profile.activo ? (
                      <button
                        onClick={() => desactivar.mutate(profile.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Desactivar
                      </button>
                    ) : (
                      <button
                        onClick={() => activar.mutate(profile.id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        Activar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function PuestosTab() {
  const { data: puestos, isLoading } = usePuestos()
  const { data: municipios } = useMunicipios()
  const crearPuesto = useCrearPuesto()
  const eliminarPuesto = useEliminarPuesto()

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    municipio_id: '',
    nombre: '',
    direccion: '',
    zona: 'urbana' as 'urbana' | 'rural',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await crearPuesto.mutateAsync(formData)
    setShowForm(false)
    setFormData({ municipio_id: '', nombre: '', direccion: '', zona: 'urbana' })
  }

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Cargando puestos...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Puestos de Votación</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancelar' : 'Nuevo Puesto'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Municipio</label>
              <select
                value={formData.municipio_id}
                onChange={(e) => setFormData({ ...formData, municipio_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Seleccione...</option>
                {municipios?.map((m) => (
                  <option key={m.id} value={m.id}>{m.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zona</label>
              <select
                value={formData.zona}
                onChange={(e) => setFormData({ ...formData, zona: e.target.value as 'urbana' | 'rural' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="urbana">Urbana</option>
                <option value="rural">Rural</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={crearPuesto.isPending}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {crearPuesto.isPending ? 'Guardando...' : 'Guardar Puesto'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nombre</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Municipio</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Zona</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {puestos?.map((puesto) => (
                <tr key={puesto.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{puesto.nombre}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{puesto.municipio?.nombre}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 capitalize">{puesto.zona}</td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => eliminarPuesto.mutate(puesto.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function MesasTab() {
  const { data: mesas, isLoading } = useMesas()
  const { data: puestos } = usePuestos()
  const crearMesa = useCrearMesa()
  const eliminarMesa = useEliminarMesa()

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    puesto_id: '',
    numero_mesa: 1,
    potencial_electoral: 0,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await crearMesa.mutateAsync({
      puesto_id: formData.puesto_id,
      numero_mesa: formData.numero_mesa,
      potencial_electoral: formData.potencial_electoral,
    })
    setShowForm(false)
    setFormData({ puesto_id: '', numero_mesa: 1, potencial_electoral: 0 })
  }

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Cargando mesas...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Mesas</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancelar' : 'Nueva Mesa'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Puesto</label>
              <select
                value={formData.puesto_id}
                onChange={(e) => setFormData({ ...formData, puesto_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Seleccione...</option>
                {puestos?.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número de Mesa</label>
              <input
                type="number"
                min="1"
                value={formData.numero_mesa}
                onChange={(e) => setFormData({ ...formData, numero_mesa: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Potencial Electoral</label>
              <input
                type="number"
                min="0"
                value={formData.potencial_electoral}
                onChange={(e) => setFormData({ ...formData, potencial_electoral: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={crearMesa.isPending}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {crearMesa.isPending ? 'Guardando...' : 'Guardar Mesa'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Número</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Puesto</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Municipio</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Potencial</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mesas?.map((mesa) => (
                <tr key={mesa.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{mesa.numero_mesa}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{mesa.puesto?.nombre}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{mesa.puesto?.municipio?.nombre}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{mesa.potencial_electoral}</td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => eliminarMesa.mutate(mesa.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function AsignacionesTab() {
  const [puestoId, setPuestoId] = useState<string>('')
  const [mesaEnEdicion, setMesaEnEdicion] = useState<string | null>(null)
  const [testigoSeleccionado, setTestigoSeleccionado] = useState<string>('')

  const { data: puestos } = usePuestos()
  const { data: municipios } = useMunicipios()
  const { data: testigos } = useTestigos()
  const { data: mesas, isLoading: mesasLoading } = useMesasPorPuesto(puestoId)
  const { data: asignaciones, isLoading: asignacionesLoading } = useAsignacionesPorPuesto(puestoId)

  const asignar = useAsignarTestigoAMesa()
  const desasignar = useDesasignarTestigoDeMesa()

  const getMunicipioNombre = (municipioId: string) => {
    return municipios?.find(m => m.id === municipioId)?.nombre || 'Desconocido'
  }

  const getTestigoAsignado = (mesaId: string) => {
    const asignacion = asignaciones?.find(a => a.mesa_id === mesaId)
    return asignacion?.testigo || null
  }

  const handleAsignar = async (mesaId: string) => {
    if (!testigoSeleccionado) return
    await asignar.mutateAsync({ testigoId: testigoSeleccionado, mesaId })
    setMesaEnEdicion(null)
    setTestigoSeleccionado('')
  }

  const handleDesasignar = async (mesaId: string, testigoId: string) => {
    await desasignar.mutateAsync({ testigoId, mesaId })
  }

  const iniciarEdicion = (mesaId: string, testigoActualId?: string) => {
    setMesaEnEdicion(mesaId)
    setTestigoSeleccionado(testigoActualId || '')
  }

  const cancelarEdicion = () => {
    setMesaEnEdicion(null)
    setTestigoSeleccionado('')
  }

  const isLoading = mesasLoading || asignacionesLoading

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Asignación de Testigos a Mesas</h2>
      </div>

      {/* Selector de Puesto */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Seleccione un puesto de votación
        </label>
        <select
          value={puestoId}
          onChange={(e) => {
            setPuestoId(e.target.value)
            setMesaEnEdicion(null)
            setTestigoSeleccionado('')
          }}
          className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Seleccione un puesto de votación...</option>
          {puestos?.map((puesto) => (
            <option key={puesto.id} value={puesto.id}>
              {puesto.nombre} - {getMunicipioNombre(puesto.municipio_id)}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla de Mesas */}
      {!puestoId ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500">Seleccione un puesto de votación para ver sus mesas</p>
        </div>
      ) : isLoading ? (
        <div className="text-center py-8 text-gray-500">Cargando mesas...</div>
      ) : mesas?.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500">Este puesto no tiene mesas registradas</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Número de Mesa</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Potencial Electoral</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Testigo Asignado</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mesas?.map((mesa) => {
                  const testigoAsignado = getTestigoAsignado(mesa.id)
                  const estaEnEdicion = mesaEnEdicion === mesa.id

                  return (
                    <tr key={mesa.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                        Mesa {mesa.numero_mesa}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {mesa.potencial_electoral} votantes
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {testigoAsignado ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {testigoAsignado.full_name}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            Sin asignar
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {estaEnEdicion ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={testigoSeleccionado}
                              onChange={(e) => setTestigoSeleccionado(e.target.value)}
                              className="text-sm border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="">Seleccione testigo...</option>
                              {testigos?.map((testigo) => (
                                <option key={testigo.id} value={testigo.id}>
                                  {testigo.full_name}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleAsignar(mesa.id)}
                              disabled={!testigoSeleccionado || asignar.isPending}
                              className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50"
                            >
                              {asignar.isPending ? '...' : 'Guardar'}
                            </button>
                            <button
                              onClick={cancelarEdicion}
                              className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : testigoAsignado ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => iniciarEdicion(mesa.id, testigoAsignado.id)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Cambiar
                            </button>
                            <button
                              onClick={() => handleDesasignar(mesa.id, testigoAsignado.id)}
                              disabled={desasignar.isPending}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remover
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => iniciarEdicion(mesa.id)}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                          >
                            Asignar
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
