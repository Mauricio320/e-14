"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { MesaCard } from "@/components/dashboard/MesaCard";
import { usePuesto } from "@/hooks/usePuestosVotacion";
import { useMesasConActasPorPuesto } from "@/hooks/useMesas";

interface PuestoPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PuestoPage({ params }: PuestoPageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const { data: puesto, isLoading: isLoadingPuesto } = usePuesto(id);
  const {
    data: mesas,
    isLoading: isLoadingMesas,
    refetch,
  } = useMesasConActasPorPuesto(id);

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);

  if (isLoadingPuesto || isLoadingMesas) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center text-gray-500">
          Cargando datos del puesto...
        </div>
      </div>
    );
  }

  if (!puesto) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">Puesto no encontrado</p>
        <Link href="/" className="text-blue-600 hover:underline">
          Volver al dashboard
        </Link>
      </div>
    );
  }

  // Calcular estadísticas
  const mesasConEstado = mesas?.map((mesa) => {
    const acta = mesa.actas_e14?.[0];
    return {
      ...mesa,
      estado: acta?.estado || "pendiente",
    };
  });

  const totalMesas = mesas?.length || 0;
  const mesasReportadas =
    mesasConEstado?.filter((m) =>
      ["enviado", "verificado", "corregido"].includes(m.estado),
    ).length || 0;
  const porcentaje =
    totalMesas > 0 ? Math.round((mesasReportadas / totalMesas) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← Volver al dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">
          {puesto.nombre}
        </h1>
        <p className="text-gray-600">
          {puesto.municipio?.nombre} • {puesto.direccion}
        </p>
        <p className="text-sm text-gray-500 capitalize">Zona {puesto.zona}</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total Mesas</p>
          <p className="text-3xl font-bold text-gray-900">{totalMesas}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Mesas Reportadas</p>
          <p className="text-3xl font-bold text-gray-900">{mesasReportadas}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Progreso</p>
          <p className="text-3xl font-bold text-gray-900">{porcentaje}%</p>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${porcentaje}%` }}
          />
        </div>
      </div>

      {/* Mesas */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Mesas</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {mesasConEstado?.map((mesa) => {
              return (
                <MesaCard
                  key={mesa.id}
                  mesa={mesa as any}
                  inSend={mesa?.actas_e14?.[0]?.estado === "enviado"}
                  href={`/mesa/${mesa.id}`}
                  isRevisor={true}
                  status={mesa?.actas_e14?.[0]?.estado}
                  isCoordinadorPuesto={true}
                  testigoConfirmado={mesa.testigo_confirmado}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
