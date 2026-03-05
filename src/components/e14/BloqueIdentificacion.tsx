import type { MesaConRelaciones } from "@/types";

interface BloqueIdentificacionProps {
  mesa: MesaConRelaciones;
}

export function BloqueIdentificacion({ mesa }: BloqueIdentificacionProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h3 className="font-medium text-gray-900">Identificación del Acta</h3>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Municipio
          </label>
          <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
            {mesa.puesto?.municipio?.nombre || "No disponible"}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Puesto de Votación
          </label>
          <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
            {mesa.puesto?.nombre || "No disponible"}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Zona
          </label>
          <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 capitalize">
            {mesa.puesto?.zona || "No disponible"}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mesa
          </label>
          <div className="px-3 py-2 bg-blue-100 border border-blue-300 rounded-lg text-blue-800 font-semibold">
            Mesa {mesa.numero_mesa}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dirección
          </label>
          <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 text-sm">
            {mesa.puesto?.direccion || "No disponible"}
          </div>
        </div>
      </div>
    </div>
  );
}
