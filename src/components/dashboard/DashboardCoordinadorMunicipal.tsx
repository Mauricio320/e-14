"use client";

import { useEstadisticasMunicipio, useMunicipio } from "@/hooks/useMunicipios";
import { usePuestosPorMunicipio } from "@/hooks/usePuestosVotacion";
import type { Profile } from "@/types";
import Link from "next/link";

interface DashboardCoordinadorMunicipalProps {
  profile: Profile;
}

export function DashboardCoordinadorMunicipal({
  profile,
}: DashboardCoordinadorMunicipalProps) {
  const municipioId = profile.municipio_id;

  const { data: municipio } = useMunicipio(municipioId || "");
  const { data: estadisticas, isLoading: loadingStats } =
    useEstadisticasMunicipio(municipioId || "");
  const { data: puestos, isLoading: loadingPuestos } = usePuestosPorMunicipio(
    municipioId || "",
  );

  if (!municipioId) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">
          No tiene un municipio asignado. Contacte al administrador.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {municipio?.nombre}
        </h1>
        <p className="text-gray-600">
          Coordinador Municipal: {profile.full_name}
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Puestos de Votación"
          value={estadisticas?.totalPuestos || 0}
          loading={loadingStats}
        />
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

      {/* Puestos */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Puestos de Votación
          </h2>
        </div>
        <div className="p-4">
          {loadingPuestos ? (
            <div className="text-center py-8 text-gray-500">
              Cargando puestos...
            </div>
          ) : puestos?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay puestos configurados en este municipio
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {puestos?.map((puesto) => (
                <Link
                  key={puesto.id}
                  href={`/puesto/${puesto.id}`}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <p className="font-medium text-gray-900">{puesto.nombre}</p>
                  <p className="text-sm text-gray-500 capitalize">
                    Zona {puesto.zona}
                  </p>
                  {puesto.direccion && (
                    <p className="text-sm text-gray-400 mt-1">
                      {puesto.direccion}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
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
