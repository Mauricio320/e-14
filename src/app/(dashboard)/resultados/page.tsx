"use client";

import { useState } from "react";
import { useResultadosElectorales } from "@/hooks/useResultadosElectorales";
import { useMunicipios } from "@/hooks/useMunicipios";
import { PageHeader } from "@/components/layout/PageHeader";
import { TablaResultados } from "@/components/resultados/TablaResultados";
import { GraficoCurules } from "@/components/resultados/GraficoCurules";
import { GraficoRepartoVotos } from "@/components/resultados/GraficoRepartoVotos";

export default function ResultadosPage() {
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
            label="Partidos"
            value={String(resultados.partidos.length)}
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            }
            color="gray"
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
              resultados.partidos[0]?.partido.nombre
                ?.split(" ")
                .slice(0, 2)
                .join(" ") || "—"
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
            {/* Reparto de Curules */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-5 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                  />
                </svg>
                Reparto de Curules
              </h2>
              <GraficoCurules
                partidos={resultados?.partidos || []}
                totalCurules={resultados?.totalCurules || 0}
                isLoading={isLoading}
              />
            </div>

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
  color: "blue" | "gray" | "emerald" | "amber";
}) {
  const ObjectColors = {
    blue: {
      bg: "bg-gradient-to-br from-blue-50 to-blue-100/50",
      border: "border-blue-100",
      text: "text-blue-900",
      label: "text-blue-600/80",
      icon: "text-blue-600 bg-blue-100/80 shadow-sm ring-1 ring-blue-200/50",
      glow: "hover:shadow-blue-500/5",
      pattern: "text-blue-200/40",
    },
    gray: {
      bg: "bg-gradient-to-br from-slate-50 to-slate-100/50",
      border: "border-slate-100",
      text: "text-slate-800",
      label: "text-slate-500",
      icon: "text-slate-600 bg-slate-100/80 shadow-sm ring-1 ring-slate-200/50",
      glow: "hover:shadow-slate-500/5",
      pattern: "text-slate-200/40",
    },
    emerald: {
      bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50",
      border: "border-emerald-100",
      text: "text-emerald-900",
      label: "text-emerald-600/80",
      icon: "text-emerald-600 bg-emerald-100/80 shadow-sm ring-1 ring-emerald-200/50",
      glow: "hover:shadow-emerald-500/5",
      pattern: "text-emerald-200/40",
    },
    amber: {
      bg: "bg-gradient-to-br from-amber-50 to-amber-100/50",
      border: "border-amber-100",
      text: "text-amber-900",
      label: "text-amber-600/90",
      icon: "text-amber-600 bg-amber-100/80 shadow-sm ring-1 ring-amber-200/50",
      glow: "hover:shadow-amber-500/5",
      pattern: "text-amber-200/50",
    },
  };

  const c = ObjectColors[color];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${c.border} ${c.bg} p-5 lg:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${c.glow} group shadow-md flex flex-col justify-center min-h-[110px]`}
    >
      {/* Background Pattern - Official look */}
      <div
        className={`absolute -right-4 -top-4 w-32 h-32 ${c.pattern} opacity-30 transform rotate-12 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 [&>svg]:w-full [&>svg]:h-full`}
      >
        {icon}
      </div>

      <div className="relative flex items-center justify-between gap-4 z-10">
        <div className="flex flex-col min-w-0">
          <p
            className={`text-xs font-bold uppercase tracking-widest ${c.label} mb-1.5 truncate`}
          >
            {label}
          </p>
          <p
            className={`text-3xl lg:text-4xl font-black tracking-tight ${c.text} truncate drop-shadow-sm`}
          >
            {value}
          </p>
        </div>
        <div
          className={`p-3 rounded-xl flex items-center justify-center shrink-0 ${c.icon} backdrop-blur-sm transition-all duration-300 group-hover:scale-105`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
