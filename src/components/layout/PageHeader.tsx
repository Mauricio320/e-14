'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface PageHeaderProps {
  title: string
  subtitle?: string
  backHref?: string
  children?: React.ReactNode
}

export function PageHeader({
  title,
  subtitle,
  backHref,
  children,
}: PageHeaderProps) {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  const BackIcon = () => (
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
        d="M15 19l-7-7 7-7"
      />
    </svg>
  )

  return (
    <div className="mb-6 lg:mb-8">
      {/* Contenedor del header con boton integrado */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 shadow-sm">
        <div className="flex items-center gap-3 lg:gap-4">
          {/* Boton volver - solo icono */}
          {backHref ? (
            <Link
              href={backHref}
              className="flex items-center justify-center w-10 h-10 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 hover:border-gray-300 hover:text-blue-600 transition-all shrink-0"
              aria-label="Volver"
            >
              <BackIcon />
            </Link>
          ) : (
            <button
              onClick={handleBack}
              className="flex items-center justify-center w-10 h-10 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 hover:border-gray-300 hover:text-blue-600 transition-all shrink-0 cursor-pointer"
              aria-label="Volver"
            >
              <BackIcon />
            </button>
          )}

          {/* Titulo y subtitulo */}
          <div className="min-w-0 flex-1">
            <h1 className="text-xl lg:text-2xl font-bold text-blue-900 truncate">
              {title}
            </h1>
            {subtitle && (
              <div className="mt-0.5 flex items-center gap-1.5 text-gray-600">
                <svg
                  className="w-3.5 h-3.5 text-gray-400 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm truncate">{subtitle}</span>
              </div>
            )}
          </div>

          {/* Acciones adicionales */}
          {children && (
            <div className="flex items-center gap-2 shrink-0">{children}</div>
          )}
        </div>
      </div>
    </div>
  )
}
