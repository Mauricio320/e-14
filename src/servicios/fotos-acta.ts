import { createClient } from '@/lib/supabase/client'
import { comprimirImagen, formatFileSize } from '@/lib/image-compression'
import type { FotoActa } from '@/types'

const supabase = createClient()

export async function subirFoto(
  file: File,
  actaId: string,
  onProgress?: (progress: number) => void,
  onStep?: (step: string) => void
): Promise<FotoActa> {
  const { data: userData } = await supabase.auth.getUser()

  // Notificar inicio de compresión
  onStep?.('Comprimiendo imagen...')

  // Comprimir imagen antes de subir
  const { file: fileComprimido, originalSize, compressedSize, wasCompressed } = await comprimirImagen(file)

  // Log de reduccion de tamano
  if (wasCompressed) {
    const reduccion = ((originalSize - compressedSize) / originalSize * 100).toFixed(1)
    console.log(`Imagen comprimida: ${formatFileSize(originalSize)} → ${formatFileSize(compressedSize)} (${reduccion}% menos)`)
  }

  // Notificar inicio de subida
  onStep?.('Subiendo a servidor...')

  // Generar nombre único para el archivo
  const timestamp = Date.now()
  const extension = fileComprimido.name.split('.').pop()
  const nombreArchivo = `acta-${actaId}-${timestamp}.${extension}`
  const storagePath = `${actaId}/${nombreArchivo}`

  // Subir archivo COMPRIMIDO al bucket
  const { error: uploadError } = await supabase
    .storage
    .from('actas-e14')
    .upload(storagePath, fileComprimido, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) throw uploadError

  // Obtener URL pública inmediatamente
  const { data: urlData } = supabase
    .storage
    .from('actas-e14')
    .getPublicUrl(storagePath)

  const urlPublica = urlData.publicUrl

  // Registrar en la base de datos con URL pública
  const { data, error } = await supabase
    .from('fotos_acta')
    .insert({
      acta_id: actaId,
      storage_path: storagePath,
      nombre_archivo: file.name,
      tamanio_bytes: compressedSize,
      subido_por: userData.user?.id,
      url_publica: urlPublica,
    } as never)
    .select()
    .single()

  if (error) {
    // Si falla el registro, eliminar el archivo
    await supabase.storage.from('actas-e14').remove([storagePath])
    throw error
  }

  return data as FotoActa
}

export async function obtenerFotosPorActa(actaId: string): Promise<FotoActa[]> {
  const { data, error } = await supabase
    .from('fotos_acta')
    .select('*')
    .eq('acta_id', actaId)
    .order('subido_en', { ascending: false })

  if (error) throw error
  return data as FotoActa[] || []
}

export async function obtenerUrlPublica(storagePath: string): Promise<string> {
  const { data } = supabase
    .storage
    .from('actas-e14')
    .getPublicUrl(storagePath)

  return data.publicUrl
}

export async function eliminarFoto(id: string): Promise<void> {
  // Obtener la información de la foto
  const { data: foto, error: errorFoto } = await supabase
    .from('fotos_acta')
    .select('storage_path')
    .eq('id', id)
    .single()

  if (errorFoto) throw errorFoto

  // Eliminar del storage
  const { error: errorStorage } = await supabase
    .storage
    .from('actas-e14')
    .remove([(foto as { storage_path: string }).storage_path])

  if (errorStorage) throw errorStorage

  // Eliminar de la base de datos
  const { error } = await supabase
    .from('fotos_acta')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function subirMultiplesFotos(
  files: File[],
  actaId: string,
  onProgress?: (progresoActual: number, total: number) => void,
  onStep?: (step: string) => void
): Promise<FotoActa[]> {
  const resultados: FotoActa[] = []

  for (let i = 0; i < files.length; i++) {
    const currentIndex = i + 1
    onStep?.(`Procesando foto ${currentIndex} de ${files.length}...`)

    const foto = await subirFoto(
      files[i],
      actaId,
      undefined,
      (step) => onStep?.(`Foto ${currentIndex}/${files.length}: ${step}`)
    )
    resultados.push(foto)

    if (onProgress) {
      onProgress(currentIndex, files.length)
    }
  }

  return resultados
}
