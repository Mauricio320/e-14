"use client";

import { useState } from "react";
import { useResultadosElectorales } from "@/hooks/useResultadosElectorales";
import { useMunicipios } from "@/hooks/useMunicipios";
import { PageHeader } from "@/components/layout/PageHeader";
import { TablaResultados } from "@/components/resultados/TablaResultados";
import { GraficoCurules } from "@/components/resultados/GraficoCurules";
import { GraficoRepartoVotos } from "@/components/resultados/GraficoRepartoVotos";
import { useEstadisticasGlobales } from "@/hooks/useConsolidados";

export default function ResultadosPage() {
  const { data: estadisticas, isLoading: loadingStats } =
    useEstadisticasGlobales();
  const [municipioId, setMunicipioId] = useState<string>("");
  const { data: municipios } = useMunicipios();
  const { data: resultados, isLoading } = useResultadosElectorales(
    municipioId || undefined,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resultados Electorales"
        subtitle="Distribución de votos y curules por partido político"
      >
        <select
          id="municipio-select"
          value={municipioId}
          onChange={(e) => setMunicipioId(e.target.value)}
          className="block w-full sm:w-64 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all cursor-pointer"
        >
          <option value="">Todos los municipios</option>
          {municipios?.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nombre}
            </option>
          ))}
        </select>
      </PageHeader>

      {/* Resumen rápido */}
      {resultados && resultados.totalVotos > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <SummaryCard
            label="Total Votos"
            value={resultados.totalVotos.toLocaleString("es-CO")}
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            color="blue"
          />

          <SummaryCard
            label="Curules"
            value={String(resultados.totalCurules)}
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            }
            color="emerald"
          />
          <SummaryCard
            label="Partido Líder"
            value={
              resultados.partidos[0]?.partido.nombre?.split(" ").join(" ") ||
              "—"
            }
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            }
            color="amber"
          />
        </div>
      )}

      {/* Estadísticas de mesas */}
      {!loadingStats && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <SummaryCard
            label="Total de Mesas"
            value={String(estadisticas?.totalMesas || 0)}
            icon={
              <svg
                className="w-5 h-5"
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
            }
            color="indigo"
          />
          <SummaryCard
            label="Mesas Reportadas"
            value={String(estadisticas?.mesasReportadas || 0)}
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            color="green"
          />
          <SummaryCard
            label="% Reportado"
            value={`${estadisticas?.porcentajeReportado || 0}%`}
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            }
            color="cyan"
          />
        </div>
      )}

      {/* Layout principal */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Panel izquierdo - Tabla de partidos */}
          <section
            aria-label="Tabla de partidos"
            className="p-6 border-b lg:border-b-0 lg:border-r border-gray-100"
          >
            <TablaResultados
              partidos={resultados?.partidos || []}
              totalVotos={resultados?.totalVotos || 0}
              isLoading={isLoading}
            />
          </section>

          {/* Panel derecho - Gráficos */}
          <aside className="p-6 space-y-6" aria-label="Gráficos de resultados">
            {/* Reparto de Votos */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-5 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Reparto de Votos
              </h2>
              <GraficoRepartoVotos
                partidos={resultados?.partidos || []}
                totalVotos={resultados?.totalVotos || 0}
                isLoading={isLoading}
              />
            </div>
          </aside>
        </div>
      </div>

      {/* Footer nota */}
      <footer className="flex justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-xs text-gray-400 font-medium">
            * Los resultados se actualizan automáticamente conforme se registran
            actas
          </p>
        </div>
      </footer>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: "blue" | "gray" | "emerald" | "amber" | "indigo" | "green" | "cyan";
}) {
  const ObjectColors = {
    blue: {
      border: "border border-gray-100 border-l-4 border-l-blue-500",
      text: "text-gray-900",
      label: "text-gray-500",
      icon: "text-blue-500 bg-blue-50",
      glow: "hover:shadow-md hover:border-blue-200",
      pattern: "text-blue-50",
    },
    gray: {
      border: "border border-gray-100 border-l-4 border-l-slate-500",
      text: "text-gray-900",
      label: "text-gray-500",
      icon: "text-slate-500 bg-slate-50",
      glow: "hover:shadow-md hover:border-slate-200",
      pattern: "text-slate-50",
    },
    emerald: {
      border: "border border-gray-100 border-l-4 border-l-emerald-500",
      text: "text-gray-900",
      label: "text-gray-500",
      icon: "text-emerald-500 bg-emerald-50",
      glow: "hover:shadow-md hover:border-emerald-200",
      pattern: "text-emerald-50",
    },
    amber: {
      border: "border border-gray-100 border-l-4 border-l-amber-500",
      text: "text-gray-900",
      label: "text-gray-500",
      icon: "text-amber-500 bg-amber-50",
      glow: "hover:shadow-md hover:border-amber-200",
      pattern: "text-amber-50",
    },
    indigo: {
      border: "border border-gray-100 border-l-4 border-l-indigo-500",
      text: "text-gray-900",
      label: "text-gray-500",
      icon: "text-indigo-500 bg-indigo-50",
      glow: "hover:shadow-md hover:border-indigo-200",
      pattern: "text-indigo-50",
    },
    green: {
      border: "border border-gray-100 border-l-4 border-l-green-500",
      text: "text-gray-900",
      label: "text-gray-500",
      icon: "text-green-500 bg-green-50",
      glow: "hover:shadow-md hover:border-green-200",
      pattern: "text-green-50",
    },
    cyan: {
      border: "border border-gray-100 border-l-4 border-l-cyan-500",
      text: "text-gray-900",
      label: "text-gray-500",
      icon: "text-cyan-500 bg-cyan-50",
      glow: "hover:shadow-md hover:border-cyan-200",
      pattern: "text-cyan-50",
    },
  };

  const c = ObjectColors[color];

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-white ${c.border} p-4 transition-all duration-300 hover:-translate-y-0.5 ${c.glow} group flex flex-col justify-center min-h-[85px] shadow-sm`}
    >
      {/* Background Pattern */}
      <div
        className={`absolute -right-2 -top-2 w-24 h-24 ${c.pattern} opacity-40 transform rotate-12 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 [&>svg]:w-full [&>svg]:h-full pointer-events-none`}
      >
        {icon}
      </div>

      <div className="relative flex items-center gap-3 z-10 w-full">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${c.icon} transition-all duration-300 group-hover:scale-105`}
        >
          {icon}
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <p
            className={`text-[11px] font-bold uppercase tracking-wider ${c.label} mb-0.5 truncate`}
          >
            {label}
          </p>
          <p
            className={`text-xl lg:text-2xl font-black tracking-tight ${c.text} truncate`}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
