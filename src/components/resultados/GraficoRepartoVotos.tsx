"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { PartidoResultado } from "@/servicios/resultados-electorales";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface GraficoRepartoVotosProps {
  partidos: PartidoResultado[];
  totalVotos: number;
  isLoading: boolean;
}

export function GraficoRepartoVotos({
  partidos,
  totalVotos,
  isLoading,
}: GraficoRepartoVotosProps) {
  if (isLoading) {
    return <div className="h-64 bg-gray-100 rounded animate-pulse" />;
  }

  if (!partidos.length || totalVotos === 0) {
    return (
      <div className="text-center py-6 text-gray-400 text-sm">
        Sin datos de votación
      </div>
    );
  }

  const partidosConVotos = partidos.filter((p) => p.totalVotos > 0);

  const data = {
    labels: partidosConVotos.map((p) => p.partido.nombre),
    datasets: [
      {
        label: "Votos",
        data: partidosConVotos.map((p) => p.totalVotos),
        backgroundColor: partidosConVotos.map((p) => p.partido.color_hex),
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y" as const,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.95)",
        titleFont: { size: 11 },
        bodyFont: { size: 11 },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => {
            const votos = context.parsed.x;
            const pct =
              totalVotos > 0 ? ((votos / totalVotos) * 100).toFixed(2) : "0";
            return ` ${votos.toLocaleString("es-CO")} votos (${pct}%)`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 10 },
          callback: (value: any) => {
            if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
            return value;
          },
        },
      },
      y: {
        grid: { display: false },
        ticks: {
          font: { size: 9, weight: "bold" as const },
          callback: function (_: any, index: number) {
            const label = partidosConVotos[index]?.partido.nombre || "";
            return label.length > 20 ? label.substring(0, 20) + "…" : label;
          },
        },
      },
    },
  };

  return (
    <div style={{ height: Math.max(200, partidosConVotos.length * 40) }}>
      <Bar data={data} options={options} />
    </div>
  );
}
