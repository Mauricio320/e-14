"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { actaE14Schema, type ActaE14Input } from "@/lib/validations/schemas";
import { BloqueIdentificacion } from "./BloqueIdentificacion";
import { BloqueConteo } from "./BloqueConteo";
import { BloqueEvidencia } from "./BloqueEvidencia";
import { EstadosActa } from "./EstadosActa";
import {
  useCrearActa,
  useActualizarActa,
  useEnviarActa,
  useVerificarActa,
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

  const handleAlertaChange = useCallback(
    (codigo: string, activa: boolean, descripcion?: string) => {
      setAlertas((prev) => {
        const next = new Map(prev);
        if (activa && descripcion) {
          next.set(codigo, descripcion);
        } else {
          next.delete(codigo);
        }
        return next;
      });
    },
    [],
  );

  const alertasArray = useMemo(
    () =>
      Array.from(alertas.entries()).map(([codigo, descripcion]) => ({
        codigo,
        descripcion,
      })),
    [alertas],
  );

  useEffect(() => {
    onAlertasChange?.(alertasArray);
  }, [alertasArray, onAlertasChange]);

  const crearActa = useCrearActa();
  const actualizarActa = useActualizarActa();
  const enviarActa = useEnviarActa();
  const verificarActaMutation = useVerificarActa();
  const upsertVotos = useUpsertVotos();
  const upsertVotosLista = useUpsertVotosLista();
  const upsertAlertas = useUpsertAlertas();
  const { showBlockUI, updateMessage, updateProgress, hideBlockUI } =
    useBlockUI();

  const partidosUnicos = useMemo(
    () =>
      candidatos.reduce(
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
      ),
    [candidatos],
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

  const { fields } = useFieldArray({ control, name: "votos" });
  const { fields: listaFields } = useFieldArray({
    control,
    name: "votosPorLista",
  });

  const puedeEditar = !actaExistente;
  const estaEnviado = actaExistente?.estado === "enviado";

  const hideBlockUIDelayed = useCallback(() => {
    setTimeout(() => hideBlockUI(), 1000);
  }, [hideBlockUI]);

  function prepararDatosEnvio(data: ActaE14Input) {
    const totalVotosPorLista = data.votosPorLista.reduce(
      (sum, v) => sum + (v.votos || 0),
      0,
    );
    const totalVotosMesa =
      totalVotosPorLista +
      (data.votosNulos || 0) +
      (data.tarjetasNoMarcadas || 0) +
      (data.votosEnBlanco || 0);
    const totalVotosValidos = totalVotosPorLista + (data.votosEnBlanco || 0);

    return {
      ...data,
      totalVotosLista: totalVotosPorLista,
      totalVotosMesa,
      totalVotosValidos,
    };
  }

  function mapearDatosActa(datos: ReturnType<typeof prepararDatosEnvio>) {
    return {
      total_volantes_e11: datos.totalVolantesE11,
      total_votos_urna: datos.totalVotosUrna,
      total_votos_incinerados: datos.totalVotosIncinerados,
      votos_en_blanco: datos.votosEnBlanco,
      votos_nulos: datos.votosNulos,
      tarjetas_no_marcadas: datos.tarjetasNoMarcadas,
      total_votos_validos: datos.totalVotosValidos,
      total_votos_mesa: datos.totalVotosMesa,
      total_votos_lista: datos.totalVotosLista,
      total_sufragantes: datos.totalSufragantes,
      observaciones: datos.observaciones,
      tiene_tachaduras: datos.tieneTachaduras,
      hubo_reconteo: datos.huboReconteo,
      hubo_reclamacion: datos.huboReclamacion,
      tipo_reclamacion: datos.tipoReclamacion,
    } as const;
  }

  async function enviarActaFinal(data: ActaE14Input) {
    try {
      setIsSubmitting(true);
      showBlockUI("Preparando envío del acta...");

      const datosConTotales = prepararDatosEnvio(data);
      const camposActa = mapearDatosActa(datosConTotales);

      let actaId = actaExistente?.id;

      if (!actaId) {
        updateMessage("Creando acta...");
        const acta = await crearActa.mutateAsync({
          mesa_id: datosConTotales.mesaId,
          estado: "enviado",
          ...camposActa,
        });
        actaId = acta.id;
      } else {
        updateMessage("Actualizando acta...");
        await actualizarActa.mutateAsync({
          id: actaId,
          acta: { estado: "enviado", ...camposActa },
        });
        // Llamar al hook de enviar para triggers adicionales si los hay
        await enviarActa.mutateAsync(actaId);
      }

      // A partir de aquí actaId siempre existe — sin necesidad de aserción !
      const safeActaId = actaId;

      updateMessage("Guardando votos...");
      await upsertVotos.mutateAsync(
        datosConTotales.votos.map((v) => ({
          actaId: safeActaId,
          candidatoId: v.candidatoId,
          votos: v.votos,
        })),
      );

      await upsertVotosLista.mutateAsync(
        datosConTotales.votosPorLista.map((v) => ({
          actaId: safeActaId,
          partidoId: v.partidoId,
          votos: v.votos,
        })),
      );

      if (alertasArray.length > 0) {
        await upsertAlertas.mutateAsync(
          alertasArray.map((a) => ({
            acta_id: safeActaId,
            codigo: a.codigo,
            descripcion: a.descripcion,
          })),
        );
      }

      if (fotos.length > 0) {
        updateMessage(
          `Preparando ${fotos.length} foto${fotos.length > 1 ? "s" : ""}...`,
        );
        updateProgress(0, fotos.length);
        try {
          await subirMultiplesFotos(
            fotos,
            safeActaId,
            (current, total) => updateProgress(current, total),
            (step) => updateMessage(step),
          );
          setFotos([]);
        } catch (errorFotos) {
          console.error("Error al subir fotos:", errorFotos);
        }
      }

      updateMessage("¡Acta enviada exitosamente!");
      onSuccess?.();
      hideBlockUIDelayed();
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

      const base = prepararDatosEnvio(data);
      const datosVerificacion = {
        ...mapearDatosActa(base),
        observaciones_revisor: observacionesRevisor,
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
      hideBlockUIDelayed();
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
      <EstadosActa
        estado={actaExistente?.estado || "borrador"}
        version={actaExistente?.version || 1}
        modoRevisor={modoRevisor}
      />

      <BloqueIdentificacion mesa={mesa} />

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
          (actaExistente && !modoRevisor) ||
          actaExistente?.estado === "verificado"
        }
        totales={{
          totalVotosValidos: watch("totalVotosValidos"),
          totalSufragantes: watch("totalSufragantes"),
        }}
        onAlertaChange={handleAlertaChange}
      />

      <BloqueEvidencia
        actaId={actaExistente?.id}
        fotos={fotos}
        setFotos={setFotos}
        disabled={!!actaExistente}
        fotosExistentes={actaExistente?.fotos}
        isRevisor={modoRevisor}
      />

      {(puedeEditar || (estaEnviado && modoRevisor)) && (
        <div className="mt-8 pt-6 border-t border-gray-200">
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
