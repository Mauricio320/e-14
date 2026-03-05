'use client'

import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { actaE14Schema, type ActaE14Input } from '@/lib/validations/schemas'
import { BloqueIdentificacion } from './BloqueIdentificacion'
import { BloqueConteo } from './BloqueConteo'
import { BloqueEvidencia } from './BloqueEvidencia'
import { EstadosActa } from './EstadosActa'
import { useCrearActa, useActualizarActa, useEnviarActa } from '@/hooks/useActasE14'
import { useUpsertVotos } from '@/hooks/useVotosCandidato'
import { subirMultiplesFotos } from '@/servicios/fotos-acta'
import { useBlockUI } from '@/contexts/BlockUIContext'
import type { MesaConRelaciones, ActaConRelaciones, CandidatoConPartido } from '@/types'

interface FormularioE14Props {
  mesa: MesaConRelaciones
  actaExistente?: ActaConRelaciones | null
  candidatos: CandidatoConPartido[]
  modoRevisor?: boolean
  onSuccess?: () => void
}

export function FormularioE14({
  mesa,
  actaExistente,
  candidatos,
  modoRevisor = false,
  onSuccess,
}: FormularioE14Props) {
  const [fotos, setFotos] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [mostrarMensaje, setMostrarMensaje] = useState(false)

  const crearActa = useCrearActa()
  const actualizarActa = useActualizarActa()
  const enviarActa = useEnviarActa()
  const upsertVotos = useUpsertVotos()
  const { showBlockUI, updateMessage, updateProgress, hideBlockUI } = useBlockUI()

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ActaE14Input>({
    resolver: zodResolver(actaE14Schema),
    defaultValues: {
      mesaId: mesa.id,
      votos: candidatos.map((c) => ({
        candidatoId: c.id,
        votos: actaExistente?.votos?.find((v) => v.candidato_id === c.id)?.votos || 0,
      })),
      totalVolantesE11: actaExistente?.total_volantes_e11 || 0,
      totalVotosUrna: actaExistente?.total_votos_urna || 0,
      totalVotosIncinerados: actaExistente?.total_votos_incinerados || 0,
      votosEnBlanco: actaExistente?.votos_en_blanco || 0,
      votosNulos: actaExistente?.votos_nulos || 0,
      tarjetasNoMarcadas: actaExistente?.tarjetas_no_marcadas || 0,
      totalVotosValidos: actaExistente?.total_votos_validos || 0,
      totalVotosMesa: actaExistente?.total_votos_mesa || 0,
      totalSufragantes: actaExistente?.total_sufragantes || 0,
      observaciones: actaExistente?.observaciones || '',
    },
  })

  const { fields } = useFieldArray({
    control,
    name: 'votos',
  })

  // Los campos totalVotosValidos y totalSufragantes se diligencian manualmente
  // No se calculan automáticamente para permitir el ingreso manual del testigo

  // Auto-ocultar mensaje después de 3 segundos
  useEffect(() => {
    if (mensaje) {
      setMostrarMensaje(true)
      const timer = setTimeout(() => {
        setMostrarMensaje(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [mensaje])

  const puedeEditar = !actaExistente
  const estaEnviado = actaExistente?.estado === 'enviado'
  const estaVerificado = actaExistente?.estado === 'verificado'

  // Mostrar errores de validación
  function mostrarErroresValidacion(errors: Record<string, unknown>) {
    const mensajes: string[] = []

    // Recorrer errores recursivamente
    function extraerMensajes(obj: Record<string, unknown>, path = '') {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key

        if (value && typeof value === 'object') {
          if ('message' in value && typeof value.message === 'string') {
            mensajes.push(value.message)
          } else {
            extraerMensajes(value as Record<string, unknown>, currentPath)
          }
        }
      }
    }

    extraerMensajes(errors)

    if (mensajes.length > 0) {
      setMensaje(`Errores de validación: ${mensajes.join(', ')}`)
    } else {
      setMensaje('Hay errores en el formulario. Verifique los campos.')
    }

    // Mostrar errores en consola para debugging
    console.log('Errores de validación:', errors)
  }

  // Preparar datos para envío - sin cálculos automáticos
  // Los totales se ingresan manualmente por el testigo
  function prepararDatosEnvio(data: ActaE14Input) {
    return {
      ...data,
    }
  }

  async function enviarActaFinal(data: ActaE14Input) {
    try {
      setIsSubmitting(true)
      setMensaje('')

      // Mostrar BlockUI inicial
      showBlockUI('Preparando envío del acta...')

      // Preparar datos para envío (sin cálculos automáticos)
      const datosConTotales = prepararDatosEnvio(data)

      let actaId = actaExistente?.id

      if (!actaId) {
        updateMessage('Creando acta...')
        // Crear nueva acta directamente como enviada
        const acta = await crearActa.mutateAsync({
          mesa_id: datosConTotales.mesaId,
          estado: 'enviado',
          total_volantes_e11: datosConTotales.totalVolantesE11,
          total_votos_urna: datosConTotales.totalVotosUrna,
          total_votos_incinerados: datosConTotales.totalVotosIncinerados,
          votos_en_blanco: datosConTotales.votosEnBlanco,
          votos_nulos: datosConTotales.votosNulos,
          tarjetas_no_marcadas: datosConTotales.tarjetasNoMarcadas,
          total_votos_validos: datosConTotales.totalVotosValidos,
          total_votos_mesa: datosConTotales.totalVotosMesa,
          total_sufragantes: datosConTotales.totalSufragantes,
          observaciones: datosConTotales.observaciones,
        })
        actaId = acta.id
      } else {
        updateMessage('Actualizando acta...')
        // Actualizar acta existente y enviar
        await actualizarActa.mutateAsync({
          id: actaId,
          acta: {
            estado: 'enviado',
            total_volantes_e11: datosConTotales.totalVolantesE11,
            total_votos_urna: datosConTotales.totalVotosUrna,
            total_votos_incinerados: datosConTotales.totalVotosIncinerados,
            votos_en_blanco: datosConTotales.votosEnBlanco,
            votos_nulos: datosConTotales.votosNulos,
            tarjetas_no_marcadas: datosConTotales.tarjetasNoMarcadas,
            total_votos_validos: datosConTotales.totalVotosValidos,
            total_votos_mesa: datosConTotales.totalVotosMesa,
            total_sufragantes: datosConTotales.totalSufragantes,
            observaciones: datosConTotales.observaciones,
          },
        })
        // Llamar al hook de enviar para triggers adicionales si los hay
        await enviarActa.mutateAsync(actaId)
      }

      updateMessage('Guardando votos...')
      // Guardar votos
      await upsertVotos.mutateAsync(
        datosConTotales.votos.map((v) => ({
          actaId,
          candidatoId: v.candidatoId,
          votos: v.votos,
        }))
      )

      // Subir fotos si hay
      if (fotos.length > 0 && actaId) {
        updateMessage(`Preparando ${fotos.length} foto${fotos.length > 1 ? 's' : ''}...`)
        updateProgress(0, fotos.length)

        try {
          await subirMultiplesFotos(
            fotos,
            actaId,
            (current, total) => {
              updateProgress(current, total)
            },
            (step) => {
              updateMessage(step)
            }
          )
          setFotos([]) // Limpiar fotos después de subir
        } catch (errorFotos) {
          console.error('Error al subir fotos:', errorFotos)
          // No fallamos todo el envío si las fotos fallan
        }
      }

      updateMessage('¡Acta enviada exitosamente!')
      setMensaje('Acta enviada correctamente')

      // Dar tiempo para mostrar el mensaje de éxito antes de cerrar
      setTimeout(() => {
        hideBlockUI()
        // Llamar onSuccess para recargar los datos del formulario
        onSuccess?.()
      }, 1000)
    } catch (error) {
      hideBlockUI()
      setMensaje('Error al enviar el acta')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-6">
      {/* Toast de mensajes */}
      {mostrarMensaje && mensaje && (
        <div
          className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg transition-all ${
            mensaje.includes('Error')
              ? 'bg-red-500 text-white'
              : 'bg-green-500 text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            {mensaje.includes('Error') ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            <span className="font-medium">{mensaje}</span>
          </div>
        </div>
      )}

      {/* Estado del acta */}
      <EstadosActa
        estado={actaExistente?.estado || 'borrador'}
        version={actaExistente?.version || 1}
        modoRevisor={modoRevisor}
      />

      {/* Bloque de identificación */}
      <BloqueIdentificacion mesa={mesa} />

      {/* Errores de validación */}
      {Object.keys(errors).length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-medium text-red-800">Hay errores en el formulario:</h4>
              <ul className="mt-2 text-sm text-red-700 space-y-1">
                {errors.votos?.message && (
                  <li>• {errors.votos.message}</li>
                )}
                {errors.totalVotosValidos?.message && (
                  <li>• {errors.totalVotosValidos.message}</li>
                )}
                {errors.mesaId?.message && (
                  <li>• {errors.mesaId.message}</li>
                )}
                {Object.entries(errors).map(([key, error]) => {
                  if (key === 'votos' || key === 'totalVotosValidos' || key === 'mesaId') return null
                  if (error?.message) {
                    return <li key={key}>• {String(error.message)}</li>
                  }
                  return null
                })}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Bloque de conteo */}
      <BloqueConteo
        control={control}
        register={register}
        fields={fields}
        candidatos={candidatos}
        errors={errors}
        disabled={!puedeEditar && !modoRevisor}
        totales={{
          totalVotosValidos: watch('totalVotosValidos'),
          totalSufragantes: watch('totalSufragantes'),
        }}
      />

      {/* Bloque de evidencia */}
      <BloqueEvidencia
        actaId={actaExistente?.id}
        fotos={fotos}
        setFotos={setFotos}
        disabled={!puedeEditar}
        fotosExistentes={actaExistente?.fotos}
      />

      {/* Acciones - Sticky en mobile */}
      {(puedeEditar || (estaEnviado && modoRevisor)) && (
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 -mx-4 lg:static lg:p-0 lg:border-0 lg:mx-0">
          {puedeEditar && (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleSubmit(enviarActaFinal, (errors) => mostrarErroresValidacion(errors))}
                disabled={isSubmitting}
                className="w-full min-h-[48px] px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Acta'}
              </button>
            </div>
          )}

          {estaEnviado && modoRevisor && (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                className="flex-1 min-h-[48px] px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Verificar Acta
              </button>
              <button
                type="button"
                className="flex-1 min-h-[48px] px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
              >
                Solicitar Corrección
              </button>
            </div>
          )}
        </div>
      )}
    </form>
  )
}
