'use client'

interface SiNoToggleProps {
  label: string
  value: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
}

export function SiNoToggle({
  label,
  value,
  onChange,
  disabled = false,
}: SiNoToggleProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onChange(true)}
          disabled={disabled}
          className={`flex-1 min-h-[48px] px-4 py-3 text-base font-medium rounded-lg border-2 transition-all ${
            value
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Sí
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          disabled={disabled}
          className={`flex-1 min-h-[48px] px-4 py-3 text-base font-medium rounded-lg border-2 transition-all ${
            !value
              ? 'bg-gray-600 border-gray-600 text-white'
              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          No
        </button>
      </div>
    </div>
  )
}
