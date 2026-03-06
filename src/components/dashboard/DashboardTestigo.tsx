"use client";

import { useState } from "react";
import { useMesasPorTestigo } from "@/hooks/useMesas";
import type { Profile, MesaConRelaciones } from "@/types";
import { ModalAfluencia } from "./ModalAfluencia";
import { ModalOpcionesMesa } from "./ModalOpcionesMesa";
import { MesaCard } from "./MesaCard";

interface DashboardTestigoProps {
  profile: Profile;
}

export function DashboardTestigo({ profile }: DashboardTestigoProps) {
  const { data: mesas, isLoading } = useMesasPorTestigo(profile.id);

  // States for Modals
  const [mesaSeleccionada, setMesaSeleccionada] =
    useState<MesaConRelaciones | null>(null);
  const [modalType, setModalType] = useState<"opciones" | "afluencia" | null>(
    null,
  );

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Mis Mesas Asignadas
        </h1>
        <p className="text-gray-600">Bienvenido, {profile.full_name}</p>
      </div>

      {/* Instrucciones */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">Instrucciones</h3>
        <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
          <li>Seleccione una mesa para registrar el acta E-14</li>
          <li>Ingrese los votos por candidato cuidadosamente</li>
          <li>Suba fotos claras del acta física</li>
          <li>Verifique los totales antes de enviar</li>
        </ul>
      </div>

      {/* Mesas */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Mesas Asignadas
          </h2>
        </div>
        <div className="p-4">
          {isLoading ? (
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
                  onClick={() => handleMesaClick(mesa)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- Modals --- */}
      {/* 1. Modal de Opciones (E-14 vs Afluencia) */}
      <ModalOpcionesMesa
        isOpen={modalType === "opciones" && mesaSeleccionada !== null}
        onClose={closeModals}
        mesa={mesaSeleccionada}
        onOpenAfluencia={openAfluencia}
      />

      {/* 2. Modal de Afluencia */}
      <ModalAfluencia
        isOpen={modalType === "afluencia"}
        onClose={closeModals}
        mesa={mesaSeleccionada}
        profileId={profile.id}
      />
    </div>
  );
}
