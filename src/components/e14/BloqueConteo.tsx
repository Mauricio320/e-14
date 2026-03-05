import type {
  Control,
  UseFormRegister,
  FieldArrayWithId,
  FieldErrors,
} from "react-hook-form";
import type { CandidatoConPartido, Partido } from "@/types";
import type { ActaE14Input } from "@/lib/validations/schemas";

interface BloqueConteoProps {
  control: Control<ActaE14Input>;
  register: UseFormRegister<ActaE14Input>;
  fields: FieldArrayWithId<ActaE14Input, "votos", "id">[];
  candidatos: CandidatoConPartido[];
  errors: FieldErrors<ActaE14Input>;
  disabled?: boolean;
  totales: {
    totalVotosValidos: number;
    totalSufragantes: number;
  };
}

export function BloqueConteo({
  register,
  fields,
  candidatos,
  errors,
  disabled = false,
  totales,
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
          {Object.entries(candidatosPorPartido).map(
            ([partidoId, { partido, candidatos: cands }]) => (
              <div key={partidoId} className="p-4">
                {/* Cabecera del partido */}
                <div
                  className="flex items-center gap-3 mb-4 p-3 rounded-lg"
                  style={{ backgroundColor: `${partido?.color_hex}15` }}
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: partido?.color_hex }}
                  />
                  <h4 className="font-semibold text-gray-900">
                    {partido?.nombre}
                  </h4>
                  <span className="text-sm text-gray-500">
                    ({partido?.codigo})
                  </span>
                </div>

                {/* Candidatos - Grid mobile-first */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cands.map((candidato) => {
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
                            <span className="font-medium text-gray-900">
                              Voto al Partido
                            </span>
                          ) : (
                            <>
                              <span className="font-medium text-gray-900">
                                {candidato.nombre}
                              </span>
                              {candidato.numero_lista && (
                                <span className="text-gray-500 ml-1 text-sm">
                                  (Partido {candidato.numero_lista})
                                </span>
                              )}
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
                          {...register(
                            `votos.${fieldIndex}.candidatoId` as const,
                          )}
                          type="hidden"
                          value={candidato.id}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Otros votos - Grid responsive */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h3 className="font-medium text-gray-900">Totales del Acta</h3>
        </div>

        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votos por partidos
            </label>
            <input
              {...register("totalVotosValidos", { valueAsNumber: true })}
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
              Total de votos en la mesa
            </label>
            <input
              {...register("totalVotosMesa", { valueAsNumber: true })}
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

      {/* Observaciones */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h3 className="font-medium text-gray-900">Observaciones</h3>
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
