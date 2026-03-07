"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import type { PartidoResultado } from "@/servicios/resultados-electorales";

ChartJS.register(ArcElement, Tooltip, Legend);

interface GraficoCurulesProps {
  partidos: PartidoResultado[];
  totalCurules: number;
  isLoading: boolean;
}

export function GraficoCurules({
  partidos,
  totalCurules,
  isLoading,
}: GraficoCurulesProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64" aria-busy="true">
        <div className="w-44 h-44 rounded-full border-[10px] border-gray-100 animate-pulse" />
      </div>
    );
  }

  const partidosConCurules = partidos.filter((p) => p.curules > 0);

  if (partidosConCurules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-300">
        <svg
          className="w-12 h-12 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
          />
        </svg>
        <span className="text-xs font-medium">Sin curules asignadas</span>
      </div>
    );
  }

  const data = {
    labels: partidosConCurules.map((p) => p.partido.nombre),
    datasets: [
      {
        data: partidosConCurules.map((p) => p.curules),
        backgroundColor: partidosConCurules.map((p) => p.partido.color_hex),
        borderWidth: 0,
        hoverBorderWidth: 0,
        hoverOffset: 12,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.95)",
        titleFont: { size: 13, weight: "bold" as const },
        bodyFont: { size: 12 },
        padding: 14,
        cornerRadius: 12,
        displayColors: true,
        boxWidth: 12,
        boxHeight: 12,
        boxPadding: 6,
        callbacks: {
          label: (context: { parsed: number }) => {
            const pct =
              totalCurules > 0
                ? ((context.parsed / totalCurules) * 100).toFixed(1)
                : "0";
            return ` ${context.parsed} curules (${pct}%)`;
          },
        },
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative h-64 w-full max-w-[280px] flex items-center justify-center"
        role="img"
        aria-label={`Distribución de ${totalCurules} curules`}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="text-center">
            <span className="text-5xl font-black text-white leading-none drop-shadow-sm">
              {totalCurules}
            </span>
            <p className="text-xs uppercase tracking-[0.2em] text-white font-semibold mt-1">
              Curules
            </p>
          </div>
        </div>
        <div className="w-56 h-56 drop-shadow-xl">
          <Pie data={data} options={options} />
        </div>
      </div>

      {/* Leyenda mejorada */}
      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 w-full max-w-xs">
        {partidosConCurules.map((p) => {
          const pct =
            totalCurules > 0
              ? ((p.curules / totalCurules) * 100).toFixed(1)
              : "0";
          return (
            <div key={p.partido.id} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full shadow-sm shrink-0"
                style={{ backgroundColor: p.partido.color_hex }}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-700 truncate">
                  {p.partido.nombre}
                </p>
                <p className="text-[10px] text-gray-400">
                  {p.curules} curules • {pct}%
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
