interface Alerta {
  codigo: string;
  descripcion: string;
}

interface PanelAlertasProps {
  alertas: Alerta[];
}

export function PanelAlertas({ alertas }: PanelAlertasProps) {
  if (alertas.length === 0) return null;

  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-amber-100 border-b border-amber-300">
        <svg
          className="w-5 h-5 text-amber-600 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          />
        </svg>
        <h4 className="font-semibold text-amber-800 text-sm">
          {alertas.length === 1
            ? "1 alerta detectada"
            : `${alertas.length} alertas detectadas`}
        </h4>
      </div>
      <ul className="divide-y divide-amber-200">
        {alertas.map((alerta) => (
          <li key={alerta.codigo} className="flex items-start gap-3 px-4 py-3">
            <span className="mt-0.5 text-amber-500 shrink-0">•</span>
            <p className="text-sm text-amber-900">{alerta.descripcion}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
