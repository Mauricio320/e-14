"use client";

import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import type { MesaConRelaciones } from "@/types";

interface ModalOpcionesMesaProps {
  isOpen: boolean;
  onClose: () => void;
  mesa: MesaConRelaciones | null;
  onOpenAfluencia: () => void;
  onConfirmarTestigo?: () => void;
  mostrarConfirmarTestigo?: boolean;
  isCordinador?: boolean;
}

export function ModalOpcionesMesa({
  isOpen,
  onClose,
  mesa,
  onOpenAfluencia,
  onConfirmarTestigo,
  isCordinador = false,
  mostrarConfirmarTestigo = false,
}: ModalOpcionesMesaProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Opciones - Mesa ${mesa?.numero_mesa}`}
    >
      <div className="space-y-4">
        <p className="text-gray-600">
          ¿Qué acción deseas realizar en esta mesa?
        </p>

        <div
          className={`grid grid-cols-1 align-center ${mostrarConfirmarTestigo ? "md:grid-cols-2" : "md:grid-cols-2"} gap-4`}
        >
          <Link
            href={`/mesa/${mesa?.id}`}
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
            onClick={onOpenAfluencia}
            className="flex flex-col cursor-pointer items-center justify-center p-6 border-2 border-purple-100 rounded-xl hover:bg-purple-50 transition-colors group text-left"
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

          {mostrarConfirmarTestigo && isCordinador && onConfirmarTestigo && (
            <button
              onClick={onConfirmarTestigo}
              className="flex flex-col cursor-pointer items-center justify-center p-6 border-2 border-orange-100 rounded-xl hover:bg-orange-50 transition-colors group text-left"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-orange-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <span className="font-bold text-gray-900 text-center">
                Confirmar Testigo
              </span>
              <span className="text-sm text-gray-500 text-center mt-2">
                Confirmar presencia del testigo en mesa
              </span>
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
