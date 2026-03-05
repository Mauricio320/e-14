-- Migración: Hacer el bucket actas-e14 público
-- Fecha: 2026-03-04

-- Hacer el bucket público
UPDATE storage.buckets
SET public = true
WHERE id = 'actas-e14';

-- Política: Cualquiera puede ver fotos (público)
DROP POLICY IF EXISTS "Allow public selects" ON storage.objects;
CREATE POLICY "Allow public selects" ON storage.objects
FOR SELECT TO anon, authenticated
USING (
    bucket_id = 'actas-e14'
);
