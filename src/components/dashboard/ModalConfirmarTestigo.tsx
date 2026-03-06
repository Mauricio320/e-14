"use client";

import { Modal } from "@/components/ui/Modal";
import type { MesaConRelaciones } from "@/types";

interface ModalConfirmarTestigoProps {
  isOpen: boolean;
  onClose: () => void;
  mesa: MesaConRelaciones | null;
  onConfirmar: () => void;
  isLoading?: boolean;
}

export function ModalConfirmarTestigo({
  isOpen,
  onClose,
  mesa,
  onConfirmar,
  isLoading = false,
}: ModalConfirmarTestigoProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Confirmar Testigo - Mesa ${mesa?.numero_mesa}`}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-orange-600"
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
        </div>

        <div className="text-center space-y-2">
          <p className="text-lg text-gray-900 font-medium">
            ¿Confirma que el testigo está presente en esta mesa?
          </p>
          <p className="text-sm text-gray-500">
            Mesa {mesa?.numero_mesa} - {mesa?.puesto?.nombre}
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <span className="font-medium">Nota:</span> Esta acción confirma que el
            testigo asignado se encuentra físicamente en el puesto de votación.
            Una vez confirmado, el estado se guardará y será visible para el
            coordinador municipal.
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Confirmando...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Confirmar Testigo
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
