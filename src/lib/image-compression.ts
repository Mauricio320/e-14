import imageCompression from 'browser-image-compression'

export interface CompressionOptions {
  maxSizeMB?: number
  maxWidthOrHeight?: number
  initialQuality?: number
  useWebWorker?: boolean
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxSizeMB: 10,
  maxWidthOrHeight: 1920,
  initialQuality: 0.95,
  useWebWorker: true,
}

export interface CompressionResult {
  file: File
  originalSize: number
  compressedSize: number
  compressionRatio: number
  wasCompressed: boolean
}

export async function comprimirImagen(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  // Sin compresion - subir archivo original directamente
  return {
    file,
    originalSize: file.size,
    compressedSize: file.size,
    compressionRatio: 0,
    wasCompressed: false,
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}
