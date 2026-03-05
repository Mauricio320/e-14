import { useEffect, useRef } from "react";
import type {
  UseFormRegister,
  FieldArrayWithId,
  UseFormWatch,
} from "react-hook-form";
import type { CandidatoConPartido, Partido } from "@/types";
import type { ActaE14Input } from "@/lib/validations/schemas";

interface PartidoCandidatosProps {
  partido: Partido | undefined;
  candidatos: CandidatoConPartido[];
  fields: FieldArrayWithId<ActaE14Input, "votos", "id">[];
  listaFields: FieldArrayWithId<ActaE14Input, "votosPorLista", "id">[];
  register: UseFormRegister<ActaE14Input>;
  watch: UseFormWatch<ActaE14Input>;
  disabled?: boolean;
  /** Callback que notifica al padre cuando la alerta de discrepancia cambia */
  onAlertaChange?: (
    codigo: string,
    activa: boolean,
    descripcion?: string,
  ) => void;
}

export function PartidoCandidatos({
  partido,
  candidatos,
  fields,
  listaFields,
  register,
  watch,
  disabled = false,
  onAlertaChange,
}: PartidoCandidatosProps) {
  // Encontrar el índice del campo de votos por lista para este partido
  const listaFieldIndex = listaFields.findIndex(
    (f) => f.partidoId === partido?.id,
  );

  // Obtener los valores actuales de los votos
  const votosValues = watch("votos");
  const votosPorListaValues = watch("votosPorLista");

  // Calcular suma de votos de candidatos + voto por partido
  const sumaCandidatos = candidatos.reduce((sum, candidato) => {
    const votoEntry = votosValues?.find((v) => v.candidatoId === candidato.id);
    return sum + (votoEntry?.votos || 0);
  }, 0);

  // Votos ingresados en el campo "Total votos por la lista"
  const votosPorLista =
    listaFieldIndex >= 0
      ? (votosPorListaValues?.[listaFieldIndex]?.votos ?? 0)
      : null;

  // Hay discrepancia si el campo lista existe y su valor ≠ suma de candidatos
  const hayDiscrepancia =
    votosPorLista !== null && votosPorLista !== sumaCandidatos;

  // Debounce: esperar ~800 ms antes de notificar para no disparar en cada tecla
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!onAlertaChange || listaFieldIndex < 0) return;

    const codigo = `LISTA_DISCREPANCIA__${partido?.id ?? "unknown"}`;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (hayDiscrepancia) {
        const nombrePartido = partido?.nombre ?? "Partido";
        const descripcion = `${nombrePartido}: la suma de los candidatos da ${sumaCandidatos}, pero el total ingresado por lista es ${votosPorLista}.`;
        onAlertaChange(codigo, true, descripcion);
      } else {
        onAlertaChange(codigo, false);
      }
    }, 800);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hayDiscrepancia, sumaCandidatos, votosPorLista]);

  return (
    <div className="p-4">
      {/* Cabecera del partido */}
      <div
        className="flex items-center gap-3 mb-4 p-3 rounded-lg"
        style={{ backgroundColor: `${partido?.color_hex}15` }}
      >
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: partido?.color_hex }}
        />
        <h4 className="font-semibold text-gray-900">{partido?.nombre}</h4>
      </div>

      {/* Candidatos - Grid mobile-first */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {candidatos.map((candidato) => {
          const fieldIndex = fields.findIndex(
            (f) => f.candidatoId === candidato.id,
          );

          return (
            <div
              key={candidato.id}
              className="p-4 border border-gray-200 rounded-lg bg-white"
            >
              <label className="block text-base text-gray-700 mb-3">
                {candidato.es_partido ? (
                  <span className="font-bold text-gray-900">
                    Voto por partido
                  </span>
                ) : (
                  <>
                    <span className="font-bold text-[18px] text-gray-900">
                      {candidato.numero_lista}
                    </span>
                  </>
                )}
              </label>
              <input
                {...register(`votos.${fieldIndex}.votos` as const, {
                  valueAsNumber: true,
                })}
                type="number"
                min="0"
                inputMode="numeric"
                pattern="[0-9]*"
                disabled={disabled}
                className="w-full min-h-[48px] px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                placeholder="0"
              />
              <input
                {...register(`votos.${fieldIndex}.candidatoId` as const)}
                type="hidden"
                value={candidato.id}
              />
            </div>
          );
        })}

        {/* Total votos por lista - Mismo estilo que los demás */}
        {listaFieldIndex >= 0 && (
          <div className="p-4 border border-gray-200 rounded-lg bg-white">
            <label className="flex justify-between items-center text-base text-gray-700 mb-3">
              <span className="font-bold text-gray-900">
                Total votos por la lista
              </span>
              <div className="bg-blue-600 text-white text-sm font-bold px-3 py-1.5 rounded-full min-w-[40px] text-center">
                {sumaCandidatos}
              </div>
            </label>
            <input
              {...register(`votosPorLista.${listaFieldIndex}.votos` as const, {
                valueAsNumber: true,
              })}
              type="number"
              min="0"
              inputMode="numeric"
              pattern="[0-9]*"
              disabled={disabled}
              className="w-full min-h-[48px] px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              placeholder="0"
            />

            <input
              {...register(
                `votosPorLista.${listaFieldIndex}.partidoId` as const,
              )}
              type="hidden"
              value={partido?.id}
            />
          </div>
        )}
      </div>
    </div>
  );
}
