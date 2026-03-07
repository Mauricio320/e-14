"use client";

import { useState, useCallback, useEffect } from "react";
import type { FotoActa } from "@/types";
import {
  comprimirImagen,
  formatFileSize,
  type CompressionResult,
} from "@/lib/image-compression";

// Hook para detectar si es dispositivo móvil
function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(
          userAgent,
        );
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 768;

      // Consideramos móvil si es un dispositivo móvil detectado por user agent
      // O si es touch y pantalla pequeña
      setIsMobile(isMobileDevice || (isTouchDevice && isSmallScreen));
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

// Obtener la URL base de Supabase desde las variables de entorno
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Construir URL pública de la foto
function construirUrlPublica(foto: FotoActa): string {
  // Si ya tiene URL pública guardada, usarla
  if (foto.url_publica) {
    return foto.url_publica;
  }

  // Si no hay URL de Supabase configurada, mostrar error
  if (!SUPABASE_URL) {
    console.error("NEXT_PUBLIC_SUPABASE_URL no está configurada");
    return "";
  }

  // Construir URL completa
  return `${SUPABASE_URL}/storage/v1/object/public/actas-e14/${foto.storage_path}`;
}

// Componente para mostrar foto usando URL guardada en BD
function FotoItem({ foto }: { foto: FotoActa }) {
  const [error, setError] = useState(false);
  const url = construirUrlPublica(foto);

  // Si no hay URL válida, mostrar placeholder
  if (!url) {
    return (
      <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center">
        <div className="text-center p-2">
          <svg
            className="mx-auto h-8 w-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-xs text-gray-500 mt-1">Error de configuración</p>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
      {error ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center p-2">
            <svg
              className="mx-auto h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-xs text-gray-500 mt-1">No se pudo cargar</p>
          </div>
        </div>
      ) : (
        <img
          src={url}
          alt={foto.nombre_archivo}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}

interface FotoConCompression {
  file: File;
  compression: CompressionResult | null;
  isCompressing: boolean;
}

interface BloqueEvidenciaProps {
  actaId?: string;
  fotos: File[];
  setFotos: (fotos: File[]) => void;
  disabled?: boolean;
  fotosExistentes?: FotoActa[];
  isRevisor?: boolean;
}

export function BloqueEvidencia({
  fotos,
  setFotos,
  disabled = false,
  fotosExistentes = [],
  isRevisor,
}: BloqueEvidenciaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [fotosInfo, setFotosInfo] = useState<Map<number, FotoConCompression>>(
    new Map(),
  );
  const [globalCompressing, setGlobalCompressing] = useState(false);
  const isMobile = useIsMobile();

  const validarArchivo = (file: File): boolean => {
    // Validar tipo
    const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];
    if (!tiposPermitidos.includes(file.type)) {
      setError(
        `El archivo "${file.name}" no es una imagen válida. Use JPG, PNG o WebP.`,
      );
      return false;
    }

    // Validar tamaño (10MB antes de compresion - permitimos mas porque se va a comprimir)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`El archivo "${file.name}" excede el límite de 10MB.`);
      return false;
    }

    return true;
  };

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      setError("");

      if (!files) return;

      const nuevosArchivos: File[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (validarArchivo(file)) {
          nuevosArchivos.push(file);
        }
      }

      // Validar límite total
      const totalFotos =
        fotos.length + fotosExistentes.length + nuevosArchivos.length;
      if (totalFotos > 14) {
        setError(
          "Máximo 14 fotos por acta. Elimine algunas fotos para continuar.",
        );
        return;
      }

      // Comprimir fotos antes de agregarlas
      setGlobalCompressing(true);
      const comprimidos: File[] = [];
      const nuevosInfo = new Map(fotosInfo);

      // Inicializar estado de compresion para cada foto
      const startIndex = fotos.length;
      nuevosArchivos.forEach((file, idx) => {
        nuevosInfo.set(startIndex + idx, {
          file,
          compression: null,
          isCompressing: true,
        });
      });
      setFotosInfo(nuevosInfo);

      // Comprimir en paralelo
      const resultados = await Promise.all(
        nuevosArchivos.map(async (file, idx) => {
          const compression = await comprimirImagen(file);
          return { idx: startIndex + idx, compression };
        }),
      );

      // Actualizar estado con resultados
      const finalInfo = new Map(nuevosInfo);
      resultados.forEach(({ idx, compression }) => {
        finalInfo.set(idx, {
          file: compression.file,
          compression,
          isCompressing: false,
        });
        comprimidos.push(compression.file);
      });
      setFotosInfo(finalInfo);
      setGlobalCompressing(false);

      // Usar el estado anterior a través de una referencia temporal
      const nuevasFotos = [...fotos, ...comprimidos];
      setFotos(nuevasFotos);
    },
    [fotos, fotosExistentes.length, setFotos, fotosInfo],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const eliminarFoto = useCallback(
    (index: number) => {
      // 1. Usar filter en lugar de splice para evitar mutación de estado
      setFotos(fotos.filter((_, i) => i !== index));

      // 2. Actualizar map de info de manera inmutable
      setFotosInfo((prev) => {
        const nuevoInfo = new Map<number, FotoConCompression>();

        let newIndex = 0;
        // Recorremos el original ordenadamente
        for (let oldIndex = 0; oldIndex <= prev.size; oldIndex++) {
          if (oldIndex === index) {
            continue; // Saltamos el eliminado
          }

          const value = prev.get(oldIndex);
          if (value) {
            nuevoInfo.set(newIndex, value);
            newIndex++;
          }
        }

        return nuevoInfo;
      });
    },
    [fotos, setFotos],
  );

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 overflow-hidden"
      hidden={isRevisor}
    >
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Fotos E-14</h3>
        <span className="text-sm text-gray-500">
          {fotosExistentes.length + fotos.length} / 14 fotos
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Fotos existentes */}
        {fotosExistentes.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Fotos ya subidas:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {fotosExistentes.map((foto) => (
                <div key={foto.id} className="relative group">
                  <FotoItem foto={foto} />
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {foto.nombre_archivo}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatFileSize(foto.tamanio_bytes || 0)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dropzone - Más grande para mobile */}
        {!disabled && (
          <>
            {isMobile ? (
              // Versión móvil: Todo el área es clickeable para abrir cámara
              <label className="block border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-lg p-6 md:p-8 text-center transition-colors min-h-[150px] flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-blue-50">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                  capture="environment"
                />
                <svg
                  className="mx-auto h-12 w-12 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="mt-3 text-base font-medium text-gray-700">
                  Toca aquí para tomar foto
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {fotos.length + fotosExistentes.length} de 14 fotos
                </p>
                {globalCompressing && (
                  <p className="mt-2 text-xs text-blue-600 font-medium">
                    Comprimiendo imágenes...
                  </p>
                )}
              </label>
            ) : (
              // Versión desktop: Drag & drop + selección de archivos
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-lg p-6 md:p-8 text-center transition-colors min-h-[120px] flex flex-col items-center justify-center ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <svg
                  className="mx-auto h-10 w-10 md:h-12 md:w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-600">
                  Arrastre y suelte fotos aquí, o{" "}
                  <label className="text-blue-600 hover:text-blue-500 cursor-pointer font-medium">
                    seleccione archivos
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => handleFileSelect(e.target.files)}
                      className="hidden"
                    />
                  </label>
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  JPG, PNG o WebP. Máximo 10MB por archivo (se comprimirán
                  automáticamente). Máximo 14 fotos.
                </p>
                {globalCompressing && (
                  <p className="mt-2 text-xs text-blue-600 font-medium">
                    Comprimiendo imágenes...
                  </p>
                )}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Previews de fotos nuevas - Grid 2 columnas en mobile */}
            {fotos.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Fotos a subir:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {fotos.map((foto, index) => {
                    const info = fotosInfo.get(index);
                    const isCompressing = info?.isCompressing ?? false;
                    const compression = info?.compression;
                    const wasCompressed = compression?.wasCompressed ?? false;

                    return (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden relative">
                          <img
                            src={URL.createObjectURL(foto)}
                            alt={foto.name}
                            className="w-full h-full object-cover"
                          />
                          {isCompressing && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <div className="text-center text-white">
                                <svg
                                  className="animate-spin h-5 w-5 mx-auto mb-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  />
                                </svg>
                                <p className="text-xs">Comprimiendo...</p>
                              </div>
                            </div>
                          )}
                          {wasCompressed && !isCompressing && (
                            <div className="absolute top-1 right-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                              -{compression?.compressionRatio.toFixed(0)}%
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => eliminarFoto(index)}
                          className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
                          aria-label="Eliminar foto"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {foto.name}
                        </p>
                        <div className="flex items-center gap-1">
                          {wasCompressed ? (
                            <>
                              <span className="text-xs text-gray-400 line-through">
                                {formatFileSize(compression?.originalSize ?? 0)}
                              </span>
                              <span className="text-xs text-green-600 font-medium">
                                {formatFileSize(
                                  compression?.compressedSize ?? 0,
                                )}
                              </span>
                            </>
                          ) : (
                            <span className="text-xs text-gray-400">
                              {formatFileSize(foto.size)}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
