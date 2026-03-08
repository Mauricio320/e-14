"use client";

import type { MesaConRelaciones } from "@/types";
import Link from "next/link";

interface MesaCardProps {
  mesa: MesaConRelaciones;
  inSend?: boolean;
  onClick?: () => void;
  href?: string;
  isRevisor?: boolean;
  status?: string;
  testigoConfirmado?: boolean;
  isCoordinadorPuesto?: boolean;
}

//lpamsdkl
export function MesaCard({
  mesa,
  inSend,
  onClick,
  href,
  isRevisor,
  status,
  testigoConfirmado,
  isCoordinadorPuesto = false,
}: MesaCardProps) {
  const totalAfluencia =
    mesa.afluencia_votantes?.reduce((acc, a) => acc + (a.cantidad || 0), 0) ||
    0;
  const cortesReportados = mesa.afluencia_votantes?.length || 0;

  const cardClassName = `w-full cursor-pointer text-left p-6 border rounded-lg hover:shadow-sm transition-all flex flex-col justify-between h-full ${
    isRevisor
      ? status === "verificado"
        ? "bg-green-50 border-green-200 hover:border-green-500"
        : status === "enviado"
          ? "bg-orange-50 border-orange-200 hover:border-orange-500"
          : ""
      : inSend
        ? "bg-green-50 border-green-200 hover:border-green-500"
        : "bg-white border-gray-200 hover:border-blue-500"
  }`;

  const innerContent = (
    <>
      <div className="flex items-start justify-between w-full">
        <div>
          <p
            className={`text-3xl font-bold ${inSend ? "text-gray-900" : "text-gray-900"}`}
          >
            Mesa {mesa.numero_mesa}
          </p>
          <p className="text-sm text-gray-600 mt-1">{mesa.puesto?.nombre}</p>
          <p className="text-sm text-gray-500">
            {mesa.puesto?.municipio?.nombre}
          </p>
          {(inSend || isRevisor) && (
            <span className="inline-flex capitalize items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-2">
              {mesa?.actas_e14?.[0]?.estado}
            </span>
          )}
          {testigoConfirmado && isCoordinadorPuesto && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mt-2 ml-2">
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Testigo OK
            </span>
          )}
        </div>
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            inSend ? "bg-green-100" : "bg-blue-100"
          }`}
        >
          <svg
            className={`w-5 h-5 ${inSend ? "text-green-600" : "text-blue-600"}`}
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
        </div>
      </div>

      {/* Afluencia Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between w-full">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Afluencia Total
          </p>
          <p className="text-lg font-bold text-gray-900">
            {totalAfluencia}{" "}
            <span className="text-sm font-normal text-gray-500">votantes</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Reportes
          </p>
          <div className="flex items-center gap-1.5 focus:outline-none justify-end">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i <= cortesReportados ? "bg-purple-500" : "bg-gray-200"
                }`}
              />
            ))}
            <span className="text-xs font-medium text-gray-600 ml-1">
              {cortesReportados}/3
            </span>
          </div>
        </div>
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cardClassName}>
        {innerContent}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={cardClassName}>
      {innerContent}
    </button>
  );
}
