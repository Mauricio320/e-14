"use client";

import { useMesasConActasPorPuesto } from "@/hooks/useMesas";
import { useAsignacionesPorRevisor } from "@/hooks/useRevisores";
import type { Profile, MesaConRelaciones } from "@/types";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";

interface DashboardRevisorProps {
  profile: Profile;
}

export function DashboardRevisor({ profile }: DashboardRevisorProps) {
  const router = useRouter();
  const [selectedPuestoId, setSelectedPuestoId] = useState<string>("");
  const [selectedEstado, setSelectedEstado] = useState<string>("");

  const {
    data: mesas,
    isLoading: isLoadingMesas,
    refetch,
  } = useMesasConActasPorPuesto(selectedPuestoId);

  const { data: asignaciones, isLoading: isLoadingAsignaciones } =
    useAsignacionesPorRevisor(profile.id);

  useEffect(() => {
    if ((asignaciones ?? []).length > 0) {
      setSelectedPuestoId((asignaciones ?? [])[0].puesto_id || "");
    }
  }, [asignaciones]);

  useEffect(() => {
    if (selectedPuestoId) {
      refetch();
    }
  }, [selectedPuestoId]);

  const mesasA_Mostrar = useMemo(() => {
    if (!mesas) return [];
    if (!selectedEstado) return mesas;

    return mesas.filter((mesa) => {
      const estadoActa = mesa.actas_e14?.[0]?.estado;
      return estadoActa === selectedEstado;
    });
  }, [mesas, selectedEstado]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Panel de Revisión</h1>
        <p className="text-gray-600">Bienvenido, {profile.full_name}</p>
      </div>

      {/* Filtros de Búsqueda */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Selector de Puesto */}
          <div>
            <label
              htmlFor="puesto-select"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Puesto de Votación
            </label>
            <select
              id="puesto-select"
              value={selectedPuestoId}
              onChange={(e) => setSelectedPuestoId(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-gray-700"
              disabled={isLoadingAsignaciones || !asignaciones?.length}
            >
              <option value="">Todos mis puestos</option>
              {asignaciones?.map((asignacion) => (
                <option key={asignacion.id} value={asignacion.puesto_id || ""}>
                  {asignacion.puesto?.nombre}{" "}
                  {asignacion.puesto?.municipio?.nombre
                    ? `(${asignacion.puesto.municipio.nombre})`
                    : ""}
                </option>
              ))}
            </select>
            {!isLoadingAsignaciones && asignaciones?.length === 0 && (
              <p className="text-sm text-yellow-600 mt-2">
                No tienes puestos asignados actualmente.
              </p>
            )}
          </div>

          {/* Selector de Estado */}
          <div>
            <label
              htmlFor="estado-select"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Estado de Acta E-14
            </label>
            <select
              id="estado-select"
              value={selectedEstado}
              onChange={(e) => setSelectedEstado(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-gray-700"
            >
              <option value="">Todos los estados</option>
              <option value="enviado">Enviado</option>
              <option value="verificado">Verificado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de mesas */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Mesas del Puesto
          </h2>
        </div>
        <div className="p-4">
          {isLoadingMesas ? (
            <div className="text-center py-8 text-gray-500">
              Cargando mesas...
            </div>
          ) : mesasA_Mostrar.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay mesas para el puesto seleccionado
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mesasA_Mostrar.map((mesa) => (
                <MesaCard
                  key={mesa.id}
                  mesa={mesa}
                  inSend={mesa?.actas_e14?.[0]?.estado === "enviado"}
                  onClick={() => router.push(`/revicion-mesa/${mesa.id}`)}
                  isRevisor={true}
                  status={mesa?.actas_e14?.[0]?.estado}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MesaCard({
  mesa,
  inSend,
  onClick,
  isRevisor,
  status,
}: {
  mesa: MesaConRelaciones;
  inSend?: boolean;
  onClick: () => void;
  isRevisor?: boolean;
  status?: string;
}) {
  const totalAfluencia =
    mesa.afluencia_votantes?.reduce((acc, a) => acc + (a.cantidad || 0), 0) ||
    0;
  const cortesReportados = mesa.afluencia_votantes?.length || 0;

  return (
    <button
      onClick={onClick}
      className={`w-full cursor-pointer text-left p-6 border rounded-lg hover:shadow-sm transition-all flex flex-col justify-between h-full ${
        isRevisor
          ? status === "verificado"
            ? "bg-orange-50 border-orange-200 hover:border-orange-500"
            : status === "enviado"
              ? "bg-green-50 border-green-200 hover:border-green-500"
              : ""
          : inSend
            ? "bg-green-50 border-green-200 hover:border-green-500"
            : "bg-white border-gray-200 hover:border-blue-500"
      }`}
    >
      <div className="flex items-start justify-between w-full">
        <div>
          <p
            className={`text-3xl font-bold ${inSend ? "text-gray-900" : "text-gray-900"}`}
          >
            Mesa {mesa.numero_mesa}
          </p>
          <p className="text-sm text-gray-600 mt-1">{mesa.puesto?.nombre}</p>
          <p className="text-sm text-gray-500">
            {mesa.puesto?.municipio?.nombre}
          </p>
          {(inSend || isRevisor) && (
            <span className="inline-flex capitalize items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-2">
              {mesa?.actas_e14?.[0]?.estado}
            </span>
          )}
        </div>
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            inSend ? "bg-green-100" : "bg-blue-100"
          }`}
        >
          <svg
            className={`w-5 h-5 ${inSend ? "text-green-600" : "text-blue-600"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
      </div>

      {/* Afluencia Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between w-full">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Afluencia Total
          </p>
          <p className="text-lg font-bold text-gray-900">
            {totalAfluencia}{" "}
            <span className="text-sm font-normal text-gray-500">votantes</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Reportes
          </p>
          <div className="flex items-center gap-1.5 focus:outline-none justify-end">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i <= cortesReportados ? "bg-purple-500" : "bg-gray-200"
                }`}
              />
            ))}
            <span className="text-xs font-medium text-gray-600 ml-1">
              {cortesReportados}/3
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
