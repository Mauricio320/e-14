-- Fix for Supabase Storage public URL 404 error
-- The bucket actas-e14 exists and is public, but RLS policies on storage.objects are needed

-- Habilitar RLS en storage.objects (si no está habilitado)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes para evitar conflictos
DROP POLICY IF EXISTS "Public read access for actas-e14" ON storage.objects;
DROP POLICY IF EXISTS "Allow public selects" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated selects" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated uploads for actas-e14" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated deletes for actas-e14" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- Crear política para permitir lectura pública del bucket actas-e14
-- Esto permite que las URLs públicas funcionen para cualquiera (anon y authenticated)
CREATE POLICY "Public read access for actas-e14"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'actas-e14');

-- Política para subir archivos (solo usuarios autenticados)
CREATE POLICY "Authenticated uploads for actas-e14"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'actas-e14');

-- Política para eliminar archivos (solo usuarios autenticados)
CREATE POLICY "Authenticated deletes for actas-e14"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'actas-e14');

-- Política para actualizar archivos (solo usuarios autenticados)
DROP POLICY IF EXISTS "Authenticated updates for actas-e14" ON storage.objects;
CREATE POLICY "Authenticated updates for actas-e14"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'actas-e14');
