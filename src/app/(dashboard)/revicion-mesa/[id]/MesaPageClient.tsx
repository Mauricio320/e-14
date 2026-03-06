"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormularioE14 } from "@/components/e14/FormularioE14";
import { PanelAlertas } from "@/components/e14/PanelAlertas";
import { PageHeader } from "@/components/layout/PageHeader";
import { useMesaData } from "@/hooks/useMesaData";
import { useUserRole } from "@/hooks/useUserRole";

interface MesaPageClientProps {
  mesaId: string;
}

export function MesaPageClient({ mesaId }: MesaPageClientProps) {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useMesaData(mesaId);
  const { role } = useUserRole();
  const [alertasCalculadas, setAlertasCalculadas] = useState<
    { codigo: string; descripcion: string }[]
  >([]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">Error al cargar los datos de la mesa</p>
          <button
            onClick={() => refetch()}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const { mesa, acta, candidatos } = data;

  const puedeEditar =
    role === "maestro" || role === "coordinador_puesto" || role === "testigo";

  const esRevisor = role === "revisor" || role === "maestro";

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader
        title={`Acta E-14 - Mesa ${mesa.numero_mesa}`}
        subtitle={`${mesa.puesto?.nombre} • ${mesa.puesto?.municipio?.nombre}`}
      />
      {/* Alertas calculadas en tiempo real */}
      {alertasCalculadas.length > 0 && (
        <PanelAlertas alertas={alertasCalculadas} />
      )}
      <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Columna Izquierda: Formulario */}
        <div className="order-2 lg:order-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">
              Datos del Acta
            </h2>
            <FormularioE14
              mesa={mesa}
              actaExistente={acta}
              candidatos={candidatos}
              modoRevisor={esRevisor && !puedeEditar}
              onSuccess={() => router.push("/")}
              onAlertasChange={setAlertasCalculadas}
            />
          </div>
        </div>

        {/* Columna Derecha: Alertas y Visor de Fotos */}
        <div className="order-1 lg:order-2 lg:sticky lg:top-0 space-y-6">
          <VisorFotosRevision fotos={acta?.fotos || []} />
        </div>
      </div>
    </div>
  );
}

function VisorFotosRevision({ fotos }: { fotos: any[] }) {
  const [fotoSeleccionada, setFotoSeleccionada] = useState<number>(0);
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!fotos || fotos.length === 0) {
    return (
      <div className="bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="mt-2 text-sm text-gray-500 font-medium">
          No hay fotos disponibles para esta mesa
        </p>
      </div>
    );
  }

  const getUrl = (foto: any) => {
    if (foto.url_publica) return foto.url_publica;
    return `${SUPABASE_URL}/storage/v1/object/public/actas-e14/${foto.storage_path}`;
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden relative group">
        <div className="h-[calc(100vh-200px)] min-h-[400px] bg-gray-300 flex items-center justify-center">
          <img
            src={getUrl(fotos[fotoSeleccionada])}
            alt={`Foto ${fotoSeleccionada + 1}`}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {/* Navegación superpuesta */}
        <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <button
            onClick={() =>
              setFotoSeleccionada((prev: number) => Math.max(0, prev - 1))
            }
            disabled={fotoSeleccionada === 0}
            className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-0 transition-all pointer-events-auto"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={() =>
              setFotoSeleccionada((prev: number) =>
                Math.min(fotos.length - 1, prev + 1),
              )
            }
            disabled={fotoSeleccionada === fotos.length - 1}
            className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-0 transition-all pointer-events-auto"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
          {fotoSeleccionada + 1} / {fotos.length}
        </div>
      </div>

      {/* Miniaturas */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {fotos.map((foto, idx) => (
          <button
            key={idx}
            onClick={() => setFotoSeleccionada(idx)}
            className={`shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${
              fotoSeleccionada === idx
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <img
              src={getUrl(foto)}
              alt={`Miniatura ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
