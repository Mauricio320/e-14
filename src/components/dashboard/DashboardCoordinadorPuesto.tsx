"use client";

import { useEstadisticasPuesto, usePuesto } from "@/hooks/usePuestosVotacion";
import {
  useMesasConActasPorPuesto,
  useConfirmarTestigoMesa,
} from "@/hooks/useMesas";
import type { Profile, MesaConRelaciones } from "@/types";
import { MesaCard } from "./MesaCard";
import { useEffect, useState } from "react";
import { ModalAfluencia } from "./ModalAfluencia";
import { ModalOpcionesMesa } from "./ModalOpcionesMesa";
import { ModalConfirmarTestigo } from "./ModalConfirmarTestigo";

interface DashboardCoordinadorPuestoProps {
  profile: Profile;
}

export function DashboardCoordinadorPuesto({
  profile,
}: DashboardCoordinadorPuestoProps) {
  const puestoId = profile.puesto_id;

  const { data: puesto } = usePuesto(puestoId || "");
  const { data: estadisticas, isLoading: loadingStats } = useEstadisticasPuesto(
    puestoId || "",
  );

  const {
    data: mesas,
    isLoading: loadingMesas,
    refetch,
  } = useMesasConActasPorPuesto(puestoId || "");

  const [mesaSeleccionada, setMesaSeleccionada] =
    useState<MesaConRelaciones | null>(null);
  const [modalType, setModalType] = useState<
    "opciones" | "afluencia" | "confirmar_testigo" | null
  >(null);

  const confirmarTestigo = useConfirmarTestigoMesa();

  useEffect(() => {
    if (puestoId) {
      refetch();
    }
  }, [puestoId]);

  const handleMesaClick = (mesa: MesaConRelaciones) => {
    setMesaSeleccionada(mesa);
    setModalType("opciones");
  };

  const closeModals = () => {
    setModalType(null);
    setTimeout(() => setMesaSeleccionada(null), 200); // Dar tiempo a la animación de cierre
  };

  const openAfluencia = () => {
    setModalType("afluencia");
  };

  const openConfirmarTestigo = () => {
    setModalType("confirmar_testigo");
  };

  const handleConfirmarTestigo = async () => {
    if (!mesaSeleccionada) return;

    try {
      await confirmarTestigo.mutateAsync({
        mesaId: mesaSeleccionada.id,
        confirmado: true,
        confirmadoPor: profile.id,
      });
      // Refetch para actualizar el listado de mesas
      await refetch();
      closeModals();
    } catch (error) {
      console.error("Error confirmando testigo:", error);
    }
  };

  if (!puestoId) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">
          No tiene un puesto de votación asignado. Contacte al administrador.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{puesto?.nombre}</h1>
        <p className="text-gray-600">
          Coordinador de Puesto: {profile.full_name}
        </p>
        <p className="text-sm text-gray-500">
          {puesto?.municipio?.nombre} • {puesto?.direccion}
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Mesas"
          value={estadisticas?.totalMesas || 0}
          loading={loadingStats}
        />
        <StatCard
          title="Mesas Reportadas"
          value={estadisticas?.mesasReportadas || 0}
          loading={loadingStats}
        />
        <StatCard
          title="Progreso"
          value={`${estadisticas?.porcentajeReportado || 0}%`}
          loading={loadingStats}
        />
        <StatCard
          title="Total Votos"
          value={estadisticas?.totalVotos || 0}
          loading={loadingStats}
        />
      </div>

      {/* Barra de progreso */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progreso de Reporte
          </span>
          <span className="text-sm font-medium text-gray-700">
            {estadisticas?.porcentajeReportado || 0}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all"
            style={{ width: `${estadisticas?.porcentajeReportado || 0}%` }}
          />
        </div>
      </div>

      {/* Mesas */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Mesas</h2>
          <span className="text-sm text-gray-500">
            {mesas?.length || 0} mesas en total
          </span>
        </div>
        <div className="p-4">
          {loadingMesas ? (
            <div className="text-center py-8 text-gray-500">
              Cargando mesas...
            </div>
          ) : mesas?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                No tiene mesas asignadas actualmente
              </p>
              <p className="text-sm text-gray-400">
                Contacte a su coordinador para que le asigne mesas
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mesas?.map((mesa) => (
                <MesaCard
                  key={mesa.id}
                  mesa={mesa}
                  inSend={
                    mesa?.actas_e14?.[0]?.estado === "enviado" ||
                    mesa?.actas_e14?.[0]?.estado === "verificado"
                  }
                  testigoConfirmado={mesa.testigo_confirmado}
                  onClick={() => handleMesaClick(mesa)}
                  isCoordinadorPuesto={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- Modals --- */}
      {/* 1. Modal de Opciones (E-14 vs Afluencia vs Confirmar Testigo) */}
      <ModalOpcionesMesa
        isOpen={modalType === "opciones" && mesaSeleccionada !== null}
        onClose={closeModals}
        mesa={mesaSeleccionada}
        onOpenAfluencia={openAfluencia}
        onConfirmarTestigo={openConfirmarTestigo}
        mostrarConfirmarTestigo={!mesaSeleccionada?.testigo_confirmado}
        isCordinador={true}
      />

      {/* 2. Modal de Afluencia */}
      <ModalAfluencia
        isOpen={modalType === "afluencia"}
        onClose={closeModals}
        mesa={mesaSeleccionada}
        profileId={profile.id}
      />

      {/* 3. Modal de Confirmar Testigo */}
      <ModalConfirmarTestigo
        isOpen={modalType === "confirmar_testigo"}
        onClose={closeModals}
        mesa={mesaSeleccionada}
        onConfirmar={handleConfirmarTestigo}
        isLoading={confirmarTestigo.isPending}
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  loading: boolean;
}

function StatCard({ title, value, loading }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      {loading ? (
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
      ) : (
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      )}
    </div>
  );
}
