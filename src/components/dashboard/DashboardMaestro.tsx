"use client";

import {
  useEstadisticasGlobales,
  useConsolidados,
} from "@/hooks/useConsolidados";
import type { Profile } from "@/types";
import Link from "next/link";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { useTotalMesas } from "@/hooks/useMesas";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

interface DashboardMaestroProps {
  profile: Profile;
}

export function DashboardMaestro({ profile }: DashboardMaestroProps) {
  const { data: estadisticas, isLoading: loadingStats } =
    useEstadisticasGlobales();
  const { data: consolidados, isLoading: loadingConsolidados } =
    useConsolidados();
  const { data: totalMesas } = useTotalMesas();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          font: { size: 11 },
        },
      },
    },
  };

  const municipalitiesChartData = {
    labels: consolidados?.map((c) => c.municipio?.nombre || "Unknown") || [],
    datasets: [
      {
        label: "Reportadas",
        data: consolidados?.map((c) => c.mesas_reportadas || 0) || [],
        backgroundColor: "rgba(37, 99, 235, 0.8)",
        borderRadius: 4,
      },
      {
        label: "Pendientes",
        data:
          consolidados?.map(
            (c) => (c.total_mesas || 0) - (c.mesas_reportadas || 0),
          ) || [],
        backgroundColor: "rgba(209, 213, 219, 0.8)",
        borderRadius: 4,
      },
    ],
  };

  const statusChartData = {
    labels: ["Reportadas", "Pendientes"],
    datasets: [
      {
        data: [
          estadisticas?.mesasReportadas || 0,
          (estadisticas?.totalMesas || 0) -
            (estadisticas?.mesasReportadas || 0),
        ],
        backgroundColor: ["rgba(22, 163, 74, 0.9)", "rgba(209, 213, 219, 0.9)"],
        borderWidth: 0,
      },
    ],
  };

  const votesChartData = {
    labels: ["Válidos", "Nulos", "Blanco"],
    datasets: [
      {
        data: [
          estadisticas?.totalVotosValidos || 0,
          estadisticas?.totalVotosNulos || 0,
          estadisticas?.totalVotosBlanco || 0,
        ],
        backgroundColor: [
          "rgba(37, 99, 235, 0.9)",
          "rgba(239, 68, 68, 0.9)",
          "rgba(251, 191, 36, 0.9)",
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Panel de Administración
        </h1>
        <p className="text-gray-600">Bienvenido, {profile.full_name}</p>
      </div>

      {/* Estadísticas Globales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total de Mesas"
          value={totalMesas || 0}
          loading={loadingStats}
          icon="mesas"
        />
        <StatCard
          title="Mesas Reportadas sdas"
          value={estadisticas?.mesasReportadas || 0}
          loading={loadingStats}
          icon="reportadas"
        />
        <StatCard
          title="Porcentaje Reportado"
          value={`${estadisticas?.porcentajeReportado || 0}%`}
          loading={loadingStats}
          icon="porcentaje"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Reporte por Municipio
          </h3>
          <div className="h-64">
            <Bar data={municipalitiesChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Estado de Mesas
          </h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut
              data={statusChartData}
              options={{
                ...chartOptions,
                cutout: "60%",
              }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Distribución de Votos
          </h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut
              data={votesChartData}
              options={{
                ...chartOptions,
                cutout: "60%",
              }}
            />
          </div>
        </div>
      </div>

      {/* Municipios con Consolidados */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Municipios</h2>
        </div>
        <div className="p-4">
          {loadingConsolidados ? (
            <div className="text-center py-8 text-gray-500">
              Cargando municipios...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {consolidados?.map((consolidado) => {
                const pct = consolidado.porcentaje_reportado;
                const isComplete = pct === 100;
                const isStarted = pct > 0;

                const statusColor = isComplete
                  ? "border-l-green-600 bg-green-50/50"
                  : pct > 50
                    ? "border-l-amber-500 bg-amber-50/50"
                    : isStarted
                      ? "border-l-blue-600 bg-blue-50/50"
                      : "border-l-gray-300";

                const statusBadge = isComplete
                  ? "bg-green-600 text-white"
                  : pct > 50
                    ? "bg-amber-500 text-white"
                    : isStarted
                      ? "bg-blue-600 text-white"
                      : "bg-gray-400 text-white";

                const progressColor = isComplete
                  ? "bg-green-600"
                  : "bg-blue-600";

                return (
                  <Link
                    key={consolidado.municipio_id}
                    href={`/municipio/${consolidado.municipio_id}`}
                    className={`p-4 bg-white border border-gray-200 rounded-lg border-l-4 ${statusColor} hover:shadow-lg hover:-translate-y-1 transition-all duration-200`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0 pr-3">
                        <p className="font-bold text-gray-900 text-lg tracking-tight truncate">
                          {consolidado.municipio?.nombre}
                        </p>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">
                          DANE {consolidado.municipio?.codigo_dane}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-flex items-center justify-center min-w-[60px] px-2 py-1 text-sm font-bold rounded-md ${statusBadge}`}
                        >
                          {isComplete ? "100%" : `${pct}%`}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="text-center p-2 bg-gray-100 rounded">
                        <p className="text-lg font-bold text-gray-800">
                          {consolidado.total_puestos}
                        </p>
                        <p className="text-[10px] uppercase tracking-wider text-gray-500">
                          Puestos
                        </p>
                      </div>
                      <div className="text-center p-2 bg-gray-100 rounded">
                        <p className="text-lg font-bold text-gray-800">
                          {consolidado.mesas_reportadas}
                          <span className="text-gray-400 font-normal text-sm">
                            /{consolidado.total_mesas}
                          </span>
                        </p>
                        <p className="text-[10px] uppercase tracking-wider text-gray-500">
                          Mesas
                        </p>
                      </div>
                      {consolidado.total_sufragantes > 0 && (
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <p className="text-lg font-bold text-blue-700">
                            {(consolidado.total_sufragantes / 1000).toFixed(1)}k
                          </p>
                          <p className="text-[10px] uppercase tracking-wider text-blue-600">
                            Votantes
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                          Reporte
                        </span>
                        <span className="text-xs font-semibold text-gray-800">
                          {consolidado.mesas_reportadas}/
                          {consolidado.total_mesas} mesas
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${progressColor} transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}
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
  icon: string;
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

interface ActionCardProps {
  href: string;
  title: string;
  description: string;
  icon: string;
}

function ActionCard({ href, title, description }: ActionCardProps) {
  return (
    <Link
      href={href}
      className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-sm transition-all"
    >
      <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </Link>
  );
}
