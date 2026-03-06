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
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 shadow-sm">
      <div className="flex items-start gap-3">
        <svg
          className="w-5 h-5 text-amber-500 shrink-0 mt-0.5"
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
        <div className="space-y-1">
          <p className="text-sm font-bold text-amber-800">
            {alertas.length === 1
              ? "1 alerta detectada:"
              : `${alertas.length} alertas detectadas:`}
          </p>
          <ul className="space-y-1">
            {alertas.map((alerta) => (
              <li
                key={alerta.codigo}
                className="text-sm text-amber-700 leading-tight"
              >
                • {alerta.descripcion}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
