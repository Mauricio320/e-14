"use client";

import { useState } from "react";
import type { PartidoResultado } from "@/servicios/resultados-electorales";

interface TablaResultadosProps {
  partidos: PartidoResultado[];
  totalVotos: number;
  isLoading: boolean;
}

export function TablaResultados({
  partidos,
  totalVotos,
  isLoading,
}: TablaResultadosProps) {
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set());
  const [busqueda, setBusqueda] = useState<Record<string, string>>({});

  const toggleExpand = (partidoId: string) => {
    setExpandidos((prev) => {
      const next = new Set(prev);
      if (next.has(partidoId)) {
        next.delete(partidoId);
      } else {
        next.add(partidoId);
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <div
        className="space-y-3"
        aria-busy="true"
        aria-label="Cargando resultados"
      >
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-[72px] bg-white rounded-xl animate-pulse border border-gray-100 shadow-sm"
          />
        ))}
      </div>
    );
  }

  if (!partidos.length) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
        <svg
          className="w-14 h-14 mx-auto mb-4 text-gray-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-gray-400 font-medium">
          No hay resultados disponibles
        </p>
      </div>
    );
  }

  return (
    <div
      className="space-y-2.5"
      role="list"
      aria-label="Resultados por partido"
    >
      {partidos.map((p, index) => {
        const isExpanded = expandidos.has(p.partido.id);
        const searchTerm = busqueda[p.partido.id] || "";

        const candidatosFiltrados = p.candidatos
          .filter(
            (c) =>
              !searchTerm ||
              c.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
          )
          .sort((a, b) => (b?.numero_lista ?? 0) - (a?.numero_lista ?? 0));

        return (
          <div
            key={p.partido.id}
            role="listitem"
            className={`rounded-xl overflow-hidden bg-white transition-all duration-300 ${
              isExpanded
                ? "shadow-md ring-1 ring-gray-200"
                : "shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200"
            }`}
            style={{
              borderLeft: `4px solid ${p.partido.color_hex}`,
            }}
          >
            {/* Fila del partido */}
            <button
              className="flex items-center w-full px-4 py-3.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-xl"
              onClick={() => toggleExpand(p.partido.id)}
              aria-expanded={isExpanded}
              aria-controls={`panel-${p.partido.id}`}
            >
              {/* Color badge del partido */}
              <div
                className="w-11 h-11 rounded-lg shrink-0 shadow-sm flex items-center justify-center overflow-hidden"
                style={{
                  backgroundColor: p.partido.img
                    ? "#f3f4f6"
                    : p.partido.color_hex,
                }}
                aria-hidden="true"
              >
                {p.partido.img ? (
                  <img
                    src={p.partido.img}
                    alt={p.partido.nombre}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-white font-bold text-xs opacity-80">
                    {p.partido.codigo?.substring(0, 2) || ""}
                  </span>
                )}
              </div>

              {/* Nombre del partido */}
              <div className="ml-3.5 flex-1 min-w-0">
                <p className="font-bold text-[13px] text-gray-800 uppercase truncate tracking-wide leading-tight">
                  {p.partido.nombre}
                </p>
              </div>

              {/* Métricas: Votos, Porcentaje, Curules */}
              <div className="flex items-center gap-5 mr-3 shrink-0">
                {/* Votos */}
                <div className="flex items-center gap-1.5" title="Total votos">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-[15px] font-extrabold text-gray-600 tabular-nums leading-none mt-0.5">
                    {p.totalVotos.toLocaleString("es-CO")}
                  </p>
                </div>

                {/* Porcentaje */}
                <div
                  className="flex items-center gap-1.5"
                  title="Porcentaje de votos"
                >
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                    />
                  </svg>
                  <p className="text-[15px] font-extrabold text-gray-600 tabular-nums leading-none mt-0.5">
                    {Number(p.porcentaje.toFixed(2))}%
                  </p>
                </div>

                {/* Curules */}
                {p.curules > 0 && (
                  <div
                    className="flex items-center gap-1.5"
                    title={`${p.curules} curul${p.curules > 1 ? "es" : ""}`}
                  >
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                    <p className="text-[15px] font-extrabold text-gray-600 tabular-nums leading-none mt-0.5">
                      {p.curules}
                    </p>
                  </div>
                )}
              </div>

              {/* Botón expandir */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                  isExpanded
                    ? "bg-red-500 text-white shadow-sm shadow-red-200"
                    : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                }`}
                aria-hidden="true"
              >
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-300 ${
                    isExpanded ? "rotate-45" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
            </button>

            {/* Panel expandido - candidatos */}
            {isExpanded && (
              <div
                id={`panel-${p.partido.id}`}
                className="border-t border-gray-100"
                role="region"
                aria-label={`Candidatos de ${p.partido.nombre}`}
              >
                {/* Barra de color sutil */}
                <div
                  className="h-0.5 opacity-30"
                  style={{ backgroundColor: p.partido.color_hex }}
                  aria-hidden="true"
                />

                {/* Buscador */}
                <div className="px-4 pt-3 pb-2">
                  <div className="relative">
                    <svg
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Lista de candidatos */}
                <div className="px-4 pb-3">
                  <table className="w-full" role="table">
                    <tbody>
                      {candidatosFiltrados.map((c) => (
                        <tr
                          key={c.id}
                          className="border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors"
                        >
                          <td className="py-2.5 pr-2">
                            <span className="flex items-baseline gap-1.5">
                              {c.numero_lista && (
                                <span className="text-gray-700 font-mono text-[11px]">
                                  ({c.numero_lista})
                                </span>
                              )}
                              <span className="font-semibold uppercase text-[11px] text-gray-600 tracking-wide">
                                {c.nombre}
                              </span>
                            </span>
                          </td>
                          <td className="py-2.5 text-right text-sm font-bold text-gray-700 w-20 tabular-nums">
                            {Number(c.porcentaje.toFixed(2))}%
                          </td>
                          <td className="py-2.5 text-right text-[13px] text-gray-400 w-24 tabular-nums font-medium">
                            {c.votos.toLocaleString("es-CO")}
                          </td>
                        </tr>
                      ))}
                      {candidatosFiltrados.length === 0 && (
                        <tr>
                          <td
                            colSpan={3}
                            className="py-6 text-center text-sm text-gray-300"
                          >
                            No se encontraron candidatos
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
