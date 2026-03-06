"use client";

import { useMesasConActasPorPuesto } from "@/hooks/useMesas";
import { useAsignacionesPorRevisor } from "@/hooks/useRevisores";
import type { Profile, MesaConRelaciones } from "@/types";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { MesaCard } from "./MesaCard";

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
