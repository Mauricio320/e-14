"use client";

import { useMesasPorTestigo } from "@/hooks/useMesas";
import type { Profile, MesaConRelaciones } from "@/types";
import Link from "next/link";

interface DashboardTestigoProps {
  profile: Profile;
}

export function DashboardTestigo({ profile }: DashboardTestigoProps) {
  const { data: mesas, isLoading } = useMesasPorTestigo(profile.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Mis Mesas Asignadas
        </h1>
        <p className="text-gray-600">Bienvenido, {profile.full_name}</p>
      </div>

      {/* Instrucciones */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">Instrucciones</h3>
        <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
          <li>Seleccione una mesa para registrar el acta E-14</li>
          <li>Ingrese los votos por candidato cuidadosamente</li>
          <li>Suba fotos claras del acta física</li>
          <li>Verifique los totales antes de enviar</li>
        </ul>
      </div>

      {/* Mesas */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Mesas Asignadas
          </h2>
        </div>
        <div className="p-4">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              Cargando mesas...
            </div>
          ) : mesas?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                No tiene mesas asignadas actualmente
              </p>
              <p className="text-sm text-gray-400">
                Contacte a su coordinador para que le asigne mesas
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mesas?.map((mesa) => (
                <MesaCard key={mesa.id} mesa={mesa} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MesaCard({ mesa }: { mesa: MesaConRelaciones }) {
  return (
    <Link
      href={`/mesa/${mesa.id}`}
      className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-3xl font-bold text-gray-900">
            Mesa {mesa.numero_mesa}
          </p>
          <p className="text-sm text-gray-600 mt-1">{mesa.puesto?.nombre}</p>
          <p className="text-sm text-gray-500">
            {mesa.puesto?.municipio?.nombre}
          </p>
        </div>
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <svg
            className="w-5 h-5 text-blue-600"
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
    </Link>
  );
}
