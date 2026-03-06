"use client";

import { useState } from "react";
import { useMesasPorTestigo } from "@/hooks/useMesas";
import type { Profile, MesaConRelaciones } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { ModalAfluencia } from "./ModalAfluencia";

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
      <Modal
        isOpen={modalType === "opciones" && mesaSeleccionada !== null}
        onClose={closeModals}
        title={`Opciones - Mesa ${mesaSeleccionada?.numero_mesa}`}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            ¿Qué acción deseas realizar en esta mesa?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href={`/mesa/${mesaSeleccionada?.id}`}
              className="flex flex-col items-center justify-center p-6 border-2 border-blue-100 rounded-xl hover:bg-blue-50 transition-colors group"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <span className="font-bold text-gray-900 text-center">
                Diligenciar E-14
              </span>
              <span className="text-sm text-gray-500 text-center mt-2">
                Ingreso de votos y evidencia fotográfica
              </span>
            </Link>

            <button
              onClick={openAfluencia}
              className="flex flex-col items-center justify-center p-6 border-2 border-purple-100 rounded-xl hover:bg-purple-50 transition-colors group text-left"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <span className="font-bold text-gray-900 text-center">
                Afluencia (Votantes)
              </span>
              <span className="text-sm text-gray-500 text-center mt-2">
                Reporte de cantidad de votantes por hora
              </span>
            </button>
          </div>
        </div>
      </Modal>

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

function MesaCard({
  mesa,
  inSend,
  onClick,
}: {
  mesa: MesaConRelaciones;
  inSend?: boolean;
  onClick: () => void;
}) {
  const totalAfluencia =
    mesa.afluencia_votantes?.reduce((acc, a) => acc + (a.cantidad || 0), 0) ||
    0;
  const cortesReportados = mesa.afluencia_votantes?.length || 0;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-6 border rounded-lg hover:shadow-sm transition-all flex flex-col justify-between h-full ${
        inSend
          ? "bg-green-50 border-green-200 hover:border-green-500"
          : "bg-white border-gray-200 hover:border-blue-500"
      }`}
    >
      <div className="flex items-start justify-between w-full">
        <div>
          <p
            className={`text-3xl font-bold ${inSend ? "text-green-900" : "text-gray-900"}`}
          >
            Mesa {mesa.numero_mesa}
          </p>
          <p className="text-sm text-gray-600 mt-1">{mesa.puesto?.nombre}</p>
          <p className="text-sm text-gray-500">
            {mesa.puesto?.municipio?.nombre}
          </p>
          {inSend && (
            <span className="inline-flex capitalize items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
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
