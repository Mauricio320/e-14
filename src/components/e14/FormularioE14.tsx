"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { actaE14Schema, type ActaE14Input } from "@/lib/validations/schemas";
import { BloqueIdentificacion } from "./BloqueIdentificacion";
import { BloqueConteo } from "./BloqueConteo";
import { BloqueEvidencia } from "./BloqueEvidencia";
import { EstadosActa } from "./EstadosActa";
import { PanelAlertas } from "./PanelAlertas";
import {
  useCrearActa,
  useActualizarActa,
  useEnviarActa,
  useVerificarActa,
  useCorregirActa,
} from "@/hooks/useActasE14";
import { useUpsertVotos } from "@/hooks/useVotosCandidato";
import { useUpsertVotosLista } from "@/hooks/useVotosLista";
import { useUpsertAlertas } from "@/hooks/useAlertasActa";
import { subirMultiplesFotos } from "@/servicios/fotos-acta";
import { useBlockUI } from "@/contexts/BlockUIContext";
import type {
  MesaConRelaciones,
  ActaConRelaciones,
  CandidatoConPartido,
} from "@/types";

interface FormularioE14Props {
  mesa: MesaConRelaciones;
  actaExistente?: ActaConRelaciones | null;
  candidatos: CandidatoConPartido[];
  modoRevisor?: boolean;
  onSuccess?: () => void;
  onAlertasChange?: (
    alertas: { codigo: string; descripcion: string }[],
  ) => void;
}

export function FormularioE14({
  mesa,
  actaExistente,
  candidatos,
  modoRevisor = false,
  onSuccess,
  onAlertasChange,
}: FormularioE14Props) {
  const [fotos, setFotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [observacionesRevisor, setObservacionesRevisor] = useState(
    actaExistente?.observaciones_revisor || "",
  );

  const [alertas, setAlertas] = useState<Map<string, string>>(new Map());

  const handleAlertaChange = (
    codigo: string,
    activa: boolean,
    descripcion?: string,
  ) => {
    setAlertas((prev) => {
      const next = new Map(prev);
      if (activa && descripcion) {
        next.set(codigo, descripcion);
      } else {
        next.delete(codigo);
      }
      return next;
    });
  };

  // Usar useMemo para evitar recrear el array en cada render
  const alertasArray = useMemo(
    () =>
      Array.from(alertas.entries()).map(([codigo, descripcion]) => ({
        codigo,
        descripcion,
      })),
    [alertas],
  );

  // Notificar al padre cuando cambien las alertas calculadas
  useEffect(() => {
    onAlertasChange?.(alertasArray);
  }, [alertasArray, onAlertasChange]);

  const crearActa = useCrearActa();
  const actualizarActa = useActualizarActa();
  const enviarActa = useEnviarActa();
  const verificarActaMutation = useVerificarActa();
  const corregirActaMutation = useCorregirActa();
  const upsertVotos = useUpsertVotos();
  const upsertVotosLista = useUpsertVotosLista();
  const upsertAlertas = useUpsertAlertas();
  const { showBlockUI, updateMessage, updateProgress, hideBlockUI } =
    useBlockUI();

  // Obtener partidos únicos de los candidatos
  const partidosUnicos = candidatos.reduce(
    (acc, candidato) => {
      if (
        candidato.partido &&
        !acc.find((p) => p?.id === candidato.partido_id)
      ) {
        acc.push(candidato.partido);
      }
      return acc;
    },
    [] as (typeof candidatos)[0]["partido"][],
  );

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ActaE14Input>({
    resolver: zodResolver(actaE14Schema),
    defaultValues: {
      mesaId: mesa.id,
      votos: candidatos.map((c) => ({
        candidatoId: c.id,
        votos:
          actaExistente?.votos?.find((v) => v.candidato_id === c.id)?.votos ||
          0,
      })),
      votosPorLista: partidosUnicos.map((p) => ({
        partidoId: p?.id || "",
        votos:
          actaExistente?.votosLista?.find((v) => v.partido_id === p?.id)
            ?.votos || 0,
      })),
      totalVolantesE11: actaExistente?.total_volantes_e11 || 0,
      totalVotosUrna: actaExistente?.total_votos_urna || 0,
      totalVotosIncinerados: actaExistente?.total_votos_incinerados || 0,
      votosEnBlanco: actaExistente?.votos_en_blanco || 0,
      votosNulos: actaExistente?.votos_nulos || 0,
      tarjetasNoMarcadas: actaExistente?.tarjetas_no_marcadas || 0,
      totalVotosValidos: actaExistente?.total_votos_validos || 0,
      totalVotosMesa: actaExistente?.total_votos_mesa || 0,
      totalVotosLista: actaExistente?.total_votos_lista || 0,
      totalSufragantes: actaExistente?.total_sufragantes || 0,
      observaciones: actaExistente?.observaciones || "",
      tieneTachaduras: actaExistente?.tiene_tachaduras || false,
      huboReconteo: actaExistente?.hubo_reconteo || false,
      huboReclamacion: actaExistente?.hubo_reclamacion || false,
      tipoReclamacion:
        (actaExistente?.tipo_reclamacion as
          | "error_aritmetico"
          | "firmas_insuficientes"
          | "sufragantes_excede_habilitados"
          | undefined) || undefined,
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "votos",
  });

  const { fields: listaFields } = useFieldArray({
    control,
    name: "votosPorLista",
  });

  const puedeEditar = !actaExistente;
  const estaEnviado = actaExistente?.estado === "enviado";

  // Preparar datos para envío - calcular totales automáticamente
  function prepararDatosEnvio(data: ActaE14Input) {
    // Calcular totales basados en los votos ingresados
    const totalVotosPorLista = data.votosPorLista.reduce(
      (sum, v) => sum + (v.votos || 0),
      0
    );

    const totalVotosMesa =
      totalVotosPorLista +
      (data.votosNulos || 0) +
      (data.tarjetasNoMarcadas || 0) +
      (data.votosEnBlanco || 0);

    // Total Votos Válidos = Total Votos Lista + Votos en Blanco
    const totalVotosValidos = totalVotosPorLista + (data.votosEnBlanco || 0);

    return {
      ...data,
      totalVotosLista: totalVotosPorLista,
      totalVotosMesa: totalVotosMesa,
      totalVotosValidos: totalVotosValidos,
    };
  }

  async function enviarActaFinal(data: ActaE14Input) {
    try {
      setIsSubmitting(true);
      // Mostrar BlockUI inicial
      showBlockUI("Preparando envío del acta...");

      // Preparar datos para envío (sin cálculos automáticos)
      const datosConTotales = prepararDatosEnvio(data);

      let actaId = actaExistente?.id;

      if (!actaId) {
        updateMessage("Creando acta...");
        // Crear nueva acta directamente como enviada
        const acta = await crearActa.mutateAsync({
          mesa_id: datosConTotales.mesaId,
          estado: "enviado",
          total_volantes_e11: datosConTotales.totalVolantesE11,
          total_votos_urna: datosConTotales.totalVotosUrna,
          total_votos_incinerados: datosConTotales.totalVotosIncinerados,
          votos_en_blanco: datosConTotales.votosEnBlanco,
          votos_nulos: datosConTotales.votosNulos,
          tarjetas_no_marcadas: datosConTotales.tarjetasNoMarcadas,
          total_votos_validos: datosConTotales.totalVotosValidos,
          total_votos_mesa: datosConTotales.totalVotosMesa,
          total_votos_lista: datosConTotales.totalVotosLista,
          total_sufragantes: datosConTotales.totalSufragantes,
          observaciones: datosConTotales.observaciones,
          tiene_tachaduras: datosConTotales.tieneTachaduras,
          hubo_reconteo: datosConTotales.huboReconteo,
          hubo_reclamacion: datosConTotales.huboReclamacion,
          tipo_reclamacion: datosConTotales.tipoReclamacion,
        });
        actaId = acta.id;
      } else {
        updateMessage("Actualizando acta...");
        // Actualizar acta existente y enviar
        await actualizarActa.mutateAsync({
          id: actaId,
          acta: {
            estado: "enviado",
            total_volantes_e11: datosConTotales.totalVolantesE11,
            total_votos_urna: datosConTotales.totalVotosUrna,
            total_votos_incinerados: datosConTotales.totalVotosIncinerados,
            votos_en_blanco: datosConTotales.votosEnBlanco,
            votos_nulos: datosConTotales.votosNulos,
            tarjetas_no_marcadas: datosConTotales.tarjetasNoMarcadas,
            total_votos_validos: datosConTotales.totalVotosValidos,
            total_votos_mesa: datosConTotales.totalVotosMesa,
            total_votos_lista: datosConTotales.totalVotosLista,
            total_sufragantes: datosConTotales.totalSufragantes,
            observaciones: datosConTotales.observaciones,
            tiene_tachaduras: datosConTotales.tieneTachaduras,
            hubo_reconteo: datosConTotales.huboReconteo,
            hubo_reclamacion: datosConTotales.huboReclamacion,
            tipo_reclamacion: datosConTotales.tipoReclamacion,
          },
        });
        // Llamar al hook de enviar para triggers adicionales si los hay
        await enviarActa.mutateAsync(actaId);
      }

      updateMessage("Guardando votos...");
      // Guardar votos de candidatos
      await upsertVotos.mutateAsync(
        datosConTotales.votos.map((v) => ({
          actaId,
          candidatoId: v.candidatoId,
          votos: v.votos,
        })),
      );

      // Guardar votos por lista
      await upsertVotosLista.mutateAsync(
        datosConTotales.votosPorLista.map((v) => ({
          actaId,
          partidoId: v.partidoId,
          votos: v.votos,
        })),
      );

      // Guardar alertas activas (si las hay)
      if (alertasArray.length > 0 && actaId) {
        await upsertAlertas.mutateAsync(
          alertasArray.map((a) => ({
            acta_id: actaId!,
            codigo: a.codigo,
            descripcion: a.descripcion,
          })),
        );
      }

      // Subir fotos si hay
      if (fotos.length > 0 && actaId) {
        updateMessage(
          `Preparando ${fotos.length} foto${fotos.length > 1 ? "s" : ""}...`,
        );
        updateProgress(0, fotos.length);

        try {
          await subirMultiplesFotos(
            fotos,
            actaId,
            (current, total) => {
              updateProgress(current, total);
            },
            (step) => {
              updateMessage(step);
            },
          );
          setFotos([]); // Limpiar fotos después de subir
        } catch (errorFotos) {
          console.error("Error al subir fotos:", errorFotos);
          // No fallamos todo el envío si las fotos fallan
        }
      }

      updateMessage("¡Acta enviada exitosamente!");
      onSuccess?.();
      // Dar tiempo para mostrar el mensaje de éxito antes de cerrar
      setTimeout(() => {
        hideBlockUI();
      }, 1000);
    } catch (error) {
      hideBlockUI();
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerificarActa(data: ActaE14Input) {
    if (!actaExistente?.id) return;

    try {
      setIsSubmitting(true);
      showBlockUI("Verificando acta...");

      // Preparar datos para verificación
      const datosVerificacion = {
        total_volantes_e11: data.totalVolantesE11,
        total_votos_urna: data.totalVotosUrna,
        total_votos_incinerados: data.totalVotosIncinerados,
        votos_en_blanco: data.votosEnBlanco,
        votos_nulos: data.votosNulos,
        tarjetas_no_marcadas: data.tarjetasNoMarcadas,
        total_votos_validos: data.totalVotosValidos,
        total_votos_mesa: data.totalVotosMesa,
        total_votos_lista: data.totalVotosLista,
        total_sufragantes: data.totalSufragantes,
        observaciones: data.observaciones,
        tiene_tachaduras: data.tieneTachaduras,
        hubo_reconteo: data.huboReconteo,
        hubo_reclamacion: data.huboReclamacion,
        tipo_reclamacion: data.tipoReclamacion,
        votos: data.votos.map((v) => ({
          candidato_id: v.candidatoId,
          votos: v.votos,
        })),
        votosLista: data.votosPorLista.map((v) => ({
          partido_id: v.partidoId,
          votos: v.votos,
        })),
      };

      updateMessage("Guardando datos y verificando acta...");
      await verificarActaMutation.mutateAsync({
        id: actaExistente.id,
        datos: datosVerificacion,
      });

      updateMessage("¡Acta verificada exitosamente!");
      onSuccess?.();
      setTimeout(() => {
        hideBlockUI();
      }, 1000);
    } catch (error) {
      hideBlockUI();
      console.error("Error al verificar acta:", error);
      alert("Error al verificar el acta. Por favor intente nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(enviarActaFinal)} className="space-y-6">
      {/* Estado del acta */}
      <EstadosActa
        estado={actaExistente?.estado || "borrador"}
        version={actaExistente?.version || 1}
        modoRevisor={modoRevisor}
      />
      {/* Bloque de identificación */}
      <BloqueIdentificacion mesa={mesa} />

      {/* Bloque de conteo */}
      <BloqueConteo
        control={control}
        register={register}
        watch={watch}
        fields={fields}
        listaFields={listaFields}
        candidatos={candidatos}
        errors={errors}
        isRevisor={modoRevisor}
        disabled={
          (!puedeEditar && !modoRevisor) ||
          actaExistente?.estado === "verificado"
        }
        totales={{
          totalVotosValidos: watch("totalVotosValidos"),
          totalSufragantes: watch("totalSufragantes"),
        }}
        onAlertaChange={handleAlertaChange}
      />

      {/* Bloque de evidencia */}
      <BloqueEvidencia
        actaId={actaExistente?.id}
        fotos={fotos}
        setFotos={setFotos}
        disabled={!puedeEditar || actaExistente?.["estado"] === "verificado"}
        fotosExistentes={actaExistente?.fotos}
        isRevisor={modoRevisor}
      />

      {/* Acciones - Sticky en mobile */}
      {(puedeEditar || (estaEnviado && modoRevisor)) && (
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 -mx-4 lg:static lg:p-0 lg:border-0 lg:mx-0">
          {puedeEditar && !modoRevisor && (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleSubmit(enviarActaFinal)}
                disabled={isSubmitting}
                className="w-full cursor-pointer min-h-[48px] px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
              >
                {isSubmitting ? "Enviando..." : "Enviar Acta"}
              </button>
            </div>
          )}

          {modoRevisor && (
            <div className="flex flex-col gap-4">
              {/* Observaciones del Revisor */}
              <div className="space-y-2">
                <label
                  htmlFor="observaciones-revisor"
                  className="block text-sm font-medium text-gray-700"
                >
                  Observaciones del Revisor{" "}
                  <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <textarea
                  id="observaciones-revisor"
                  rows={3}
                  value={observacionesRevisor}
                  onChange={(e) => setObservacionesRevisor(e.target.value)}
                  placeholder="Ingrese sus observaciones sobre la verificación..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>

              <button
                hidden={modoRevisor && !estaEnviado}
                type="button"
                onClick={handleSubmit(handleVerificarActa)}
                disabled={isSubmitting || verificarActaMutation.isPending}
                className="flex-1 min-h-[48px] px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors font-medium"
              >
                {verificarActaMutation.isPending
                  ? "Verificando..."
                  : "Verificar Acta"}
              </button>
            </div>
          )}
        </div>
      )}
    </form>
  );
}
