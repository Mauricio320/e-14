"use client";

import { useState, useEffect } from "react";
import { useAfluenciasPorMesa, useUpsertAfluencia } from "@/hooks/useAfluencia";
import { Modal } from "@/components/ui/Modal";
import type { MesaConRelaciones } from "@/types";

interface ModalAfluenciaProps {
  isOpen: boolean;
  onClose: () => void;
  mesa: MesaConRelaciones | null;
  profileId: string;
}

const TURNOS = [
  { label: "Corte 10:00 AM", value: "10:00", horaSist: 10 },
  { label: "Corte 1:00 PM", value: "13:00", horaSist: 13 },
  { label: "Corte 3:00 PM", value: "15:00", horaSist: 15 },
];

export function ModalAfluencia({
  isOpen,
  onClose,
  mesa,
  profileId,
}: ModalAfluenciaProps) {
  const { data: afluencias, isLoading } = useAfluenciasPorMesa(mesa?.id || "");
  const upsertMut = useUpsertAfluencia();

  // Guardar cantidades editadas temporalmente
  const [cantidades, setCantidades] = useState<Record<string, string>>({});
  // Hora actual del sistema
  const [horaActual, setHoraActual] = useState(new Date().getHours());

  // Refrescar hora cada minuto
  useEffect(() => {
    if (!isOpen) return;
    const updateTime = () => setHoraActual(new Date().getHours());
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!mesa || !isOpen) return null;

  const getAfluenciaGuardada = (horaCorte: string) => {
    return afluencias?.find((a) => a.hora_corte === horaCorte);
  };

  const handleGuardar = async (horaCorte: string) => {
    const qtyStr = cantidades[horaCorte];
    if (!qtyStr || isNaN(Number(qtyStr))) return;

    try {
      await upsertMut.mutateAsync({
        mesa_id: mesa.id,
        hora_corte: horaCorte,
        cantidad: Number(qtyStr),
        registrado_por: profileId,
      });
      // Limpiar el input tras guardado exitoso
      setCantidades((prev) => {
        const next = { ...prev };
        delete next[horaCorte];
        return next;
      });
    } catch (error) {
      console.error("Error guardando afluencia", error);
      alert("Hubo un error al guardar. Intenta nuevamente.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Afluencia - Mesa ${mesa.numero_mesa}`}
    >
      <div className="space-y-6">
        <p className="text-gray-600 text-sm">
          Registra la cantidad total de votantes
        </p>

        {isLoading ? (
          <div className="text-center py-4 text-gray-500">Cargando...</div>
        ) : (
          <div className="space-y-4">
            {TURNOS.map((turno) => {
              const guardado = getAfluenciaGuardada(turno.value);
              // Habilitado solo si la hora actual del sistema = hora del turno
              // Por ejemplo, turno 10:00 -> habilitado de 10:00 a 10:59
              const estaHabilitado = horaActual === turno.horaSist;
              const yaPaso = horaActual > turno.horaSist;

              const inputValue = cantidades[turno.value] ?? "";

              return (
                <div
                  key={turno.value}
                  className={`p-4 border rounded-xl ${
                    estaHabilitado
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">
                      {turno.label}
                    </h4>
                  </div>

                  {guardado ? (
                    <div className="flex justify-between items-center bg-white p-3 border rounded-lg">
                      <span className="text-gray-600">Total votantes:</span>
                      <span className="text-xl font-bold text-gray-900">
                        {guardado.cantidad}
                      </span>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0"
                        inputMode="numeric"
                        placeholder="Cantidad..."
                        value={inputValue}
                        onChange={(e) =>
                          setCantidades((prev) => ({
                            ...prev,
                            [turno.value]: e.target.value,
                          }))
                        }
                        className="flex-1 min-h-[44px] px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleGuardar(turno.value)}
                        disabled={upsertMut.isPending || !inputValue}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        {upsertMut.isPending ? "..." : "Guardar"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}
