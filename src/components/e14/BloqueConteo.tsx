import { useEffect, useRef } from "react";
import type {
  Control,
  UseFormRegister,
  FieldArrayWithId,
  FieldErrors,
  UseFormWatch,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import type { CandidatoConPartido, Partido } from "@/types";
import type { ActaE14Input } from "@/lib/validations/schemas";
import { PartidoCandidatos } from "./PartidoCandidatos";
import { SiNoToggle } from "@/components/ui/SiNoToggle";

interface BloqueConteoProps {
  control: Control<ActaE14Input>;
  register: UseFormRegister<ActaE14Input>;
  watch: UseFormWatch<ActaE14Input>;
  fields: FieldArrayWithId<ActaE14Input, "votos", "id">[];
  listaFields: FieldArrayWithId<ActaE14Input, "votosPorLista", "id">[];
  candidatos: CandidatoConPartido[];
  errors: FieldErrors<ActaE14Input>;
  disabled?: boolean;
  isRevisor?: boolean;
  totales: {
    totalVotosValidos: number;
    totalSufragantes: number;
  };
  onAlertaChange?: (
    codigo: string,
    activa: boolean,
    descripcion?: string,
  ) => void;
}

export function BloqueConteo({
  control,
  register,
  watch,
  fields,
  listaFields,
  candidatos,
  errors,
  disabled = false,
  totales,
  onAlertaChange,
  isRevisor,
}: BloqueConteoProps) {
  // Agrupar candidatos por partido
  const candidatosPorPartido = candidatos.reduce(
    (acc, candidato) => {
      const partidoId = candidato.partido_id;
      if (!acc[partidoId]) {
        acc[partidoId] = {
          partido: candidato.partido,
          candidatos: [],
        };
      }
      acc[partidoId].candidatos.push(candidato);
      return acc;
    },
    {} as Record<
      string,
      { partido: Partido | undefined; candidatos: CandidatoConPartido[] }
    >,
  );

  // Valores observados para alertas E-11 e UI
  const totalVolantesE11 = watch("totalVolantesE11") ?? 0;
  const totalVotosUrna = watch("totalVotosUrna") ?? 0;
  const totalVotosIncinerados = watch("totalVotosIncinerados") ?? 0;
  const votosNulos = watch("votosNulos") ?? 0;
  const tarjetasNoMarcadas = watch("tarjetasNoMarcadas") ?? 0;
  const votosEnBlanco = watch("votosEnBlanco") ?? 0;

  const totalVotosPorLista =
    watch("votosPorLista")?.reduce((sum, v) => sum + (v.votos || 0), 0) || 0;

  const totalVotosPorCandidato =
    watch("votos")?.reduce((sum, voto) => sum + (voto.votos || 0), 0) || 0;

  const totalVotosMesa =
    totalVotosPorLista + votosNulos + tarjetasNoMarcadas + votosEnBlanco;

  // Total Votos Válidos = Total Votos Lista + Votos en Blanco
  const totalVotosValidosCalculado = totalVotosPorLista + votosEnBlanco;

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!onAlertaChange) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      // Alerta 1: E11 < (Urna - Incinerados)
      const totalVotos = totalVotosUrna - totalVotosIncinerados;
      const condicion1 =
        totalVolantesE11 < totalVotosUrna - totalVotosIncinerados;
      if (condicion1 && totalVotosUrna > 0) {
        onAlertaChange(
          "E11_MENOR_QUE_URNA_MENOS_INCINERADOS",
          true,
          `Nivelación de Mesa: El total de volantes E-11 (${totalVolantesE11}) es menor que los votos en la urna menos los incinerados (${totalVotosUrna} - ${totalVotosIncinerados} = ${
            totalVotos
          }).`,
        );
      } else {
        onAlertaChange("E11_MENOR_QUE_URNA_MENOS_INCINERADOS", false);
      }

      // Alerta 2: E11 !== Total Votos Mesa
      const condicion2 = totalVolantesE11 !== totalVotos;
      if (condicion2 && (totalVolantesE11 > 0 || totalVotos > 0)) {
        onAlertaChange(
          "E11_DIFERENTE_TOTAL_MESA",
          true,
          `Totalizaciones: El total de volantes E-11 (${totalVolantesE11}) no coincide con el total de votos en la mesa (${totalVotos}).`,
        );
      } else {
        onAlertaChange("E11_DIFERENTE_TOTAL_MESA", false);
      }
    }, 800);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [
    totalVolantesE11,
    totalVotosUrna,
    totalVotosIncinerados,
    totalVotosMesa,
    onAlertaChange,
  ]);

  return (
    <div className="space-y-6">
      {/* Nivelación de la Mesa - según formato E-14 */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h3 className="font-medium text-gray-900">Nivelación de la Mesa</h3>
        </div>

        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Volantes Formulario E-11
            </label>
            <input
              {...register("totalVolantesE11", { valueAsNumber: true })}
              type="number"
              min="0"
              inputMode="numeric"
              pattern="[0-9]*"
              disabled={disabled}
              className="w-full min-h-[48px] px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Votos de Cámara en la Urna
            </label>
            <input
              {...register("totalVotosUrna", { valueAsNumber: true })}
              type="number"
              min="0"
              inputMode="numeric"
              pattern="[0-9]*"
              disabled={disabled}
              className="w-full min-h-[48px] px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Votos Incinerados
            </label>
            <input
              {...register("totalVotosIncinerados", { valueAsNumber: true })}
              type="number"
              min="0"
              inputMode="numeric"
              pattern="[0-9]*"
              disabled={disabled}
              className="w-full min-h-[48px] px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              placeholder="0"
            />
          </div>
        </div>
      </div>
      {/* Votos por partido y candidato */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h3 className="font-medium text-gray-900">
            Votos por Partido / Candidato
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {Object.entries(candidatosPorPartido)
            .sort(([, a], [, b]) => {
              const nameA = a.partido?.nombre || "";
              const nameB = b.partido?.nombre || "";
              return nameA.localeCompare(nameB);
            })
            .map(([partidoId, { partido, candidatos: cands }]) => (
              <PartidoCandidatos
                key={partidoId}
                partido={partido}
                candidatos={cands.sort(
                  (a, b) => (b.numero_lista || 0) - (a.numero_lista || 0),
                )}
                fields={fields}
                listaFields={listaFields}
                register={register}
                watch={watch}
                disabled={disabled}
                onAlertaChange={onAlertaChange}
              />
            ))}
        </div>
      </div>

      {/* Otros votos - Grid responsive */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h3 className="font-medium text-gray-900">Totales del Acta</h3>
        </div>

        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votos nulos
            </label>
            <input
              {...register("votosNulos", { valueAsNumber: true })}
              type="number"
              min="0"
              inputMode="numeric"
              pattern="[0-9]*"
              disabled={disabled}
              className="w-full min-h-[48px] px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              votos no marcados
            </label>
            <input
              {...register("tarjetasNoMarcadas", { valueAsNumber: true })}
              type="number"
              min="0"
              inputMode="numeric"
              pattern="[0-9]*"
              disabled={disabled}
              className="w-full min-h-[48px] px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votos en blanco
            </label>
            <input
              {...register("votosEnBlanco", { valueAsNumber: true })}
              type="number"
              min="0"
              inputMode="numeric"
              pattern="[0-9]*"
              disabled={disabled}
              className="w-full min-h-[48px] px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <div
        className="bg-white rounded-lg border border-gray-200 overflow-hidden"
        hidden={!isRevisor}
      >
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h3 className="font-medium text-gray-900">Conteo del sistema</h3>
        </div>

        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votos por partidos
            </label>
            <div className="w-full h-[48px] px-4 flex items-center text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100">
              <span className="text-1xl text-gray-700">
                {totalVotosPorCandidato}
              </span>
            </div>
          </div>

          {/* Total Votos Lista - Calculado automáticamente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Votos Lista
            </label>
            <div className="w-full h-[48px] px-4 flex items-center text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100">
              <span className="text-1xl text-gray-700">
                {totalVotosPorLista}
              </span>
            </div>
          </div>

          {/* Total de votos en la mesa - Calculado automáticamente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total de votos
            </label>
            <div className="w-full h-[48px] px-4 flex items-center text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100">
              <span className="text-1xl text-gray-700">{totalVotosMesa}</span>
            </div>
          </div>

          {/* Total Votos Válidos - Calculado automáticamente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Votos Válidos
            </label>
            <div className="w-full h-[48px] px-4 flex items-center text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 bg-green-50">
              <span className="text-1xl font-semibold text-green-700">
                {totalVotosValidosCalculado}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Total Votos Lista + Votos en Blanco
            </p>
          </div>
        </div>
      </div>

      {/* Observaciones de la Mesa */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h3 className="font-medium text-gray-900">
            Observaciones de la Mesa
          </h3>
        </div>

        <div className="p-4 space-y-6">
          {/* Tachaduras o enmendaduras */}
          <Controller
            name="tieneTachaduras"
            control={control}
            render={({ field }) => (
              <SiNoToggle
                label="¿Hubo tachaduras o enmendaduras?"
                value={field.value || false}
                onChange={field.onChange}
                disabled={disabled}
              />
            )}
          />

          {/* Reconteo */}
          <Controller
            name="huboReconteo"
            control={control}
            render={({ field }) => (
              <SiNoToggle
                label="¿Hubo reconteo?"
                value={field.value || false}
                onChange={field.onChange}
                disabled={disabled}
              />
            )}
          />

          {/* Reclamación */}
          <Controller
            name="huboReclamacion"
            control={control}
            render={({ field }) => (
              <SiNoToggle
                label="¿Se presentó reclamación en la mesa?"
                value={field.value || false}
                onChange={field.onChange}
                disabled={disabled}
              />
            )}
          />

          {/* Tipo de reclamación - Solo visible si hubo reclamación */}
          {watch("huboReclamacion") && (
            <div className="animate-in slide-in-from-top-2 duration-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de reclamación
              </label>
              <select
                {...register("tipoReclamacion")}
                disabled={disabled}
                className="w-full min-h-[48px] px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 bg-white"
              >
                <option value="">Seleccione el tipo de reclamación...</option>
                <option value="error_aritmetico">
                  Error aritmético en el conteo
                </option>
                <option value="firmas_insuficientes">
                  Actas firmadas por menos de dos jurados
                </option>
                <option value="sufragantes_excede_habilitados">
                  Número de sufragantes excede a ciudadanos habilitados para el
                  voto en mesa
                </option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Observaciones adicionales */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h3 className="font-medium text-gray-900">
            Observaciones Adicionales
          </h3>
        </div>

        <div className="p-4">
          <textarea
            {...register("observaciones")}
            rows={4}
            disabled={disabled}
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            placeholder="Ingrese cualquier observación relevante sobre el acta..."
          />
        </div>
      </div>

      {errors.votos && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{errors.votos.message}</p>
        </div>
      )}
    </div>
  );
}
