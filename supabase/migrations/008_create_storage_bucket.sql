-- Migración: Crear bucket de storage para fotos de actas
-- Fecha: 2026-03-04
--
-- Crea el bucket 'actas-e14' y configura políticas de acceso

-- Crear el bucket (esto es idempotente en Supabase)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'actas-e14',
    'actas-e14',
    true,
    5242880, -- 5MB en bytes
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- Política: Cualquier usuario autenticado puede subir fotos
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'actas-e14'
);

-- Política: Cualquiera puede ver fotos (incluyendo no autenticados)
DROP POLICY IF EXISTS "Allow public selects" ON storage.objects;
CREATE POLICY "Allow public selects" ON storage.objects
FOR SELECT TO anon, authenticated
USING (
    bucket_id = 'actas-e14'
);

-- Política: Usuarios autenticados pueden eliminar sus propias fotos
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;
CREATE POLICY "Allow authenticated deletes" ON storage.objects
FOR DELETE TO authenticated
USING (
    bucket_id = 'actas-e14'
);
