-- Migración completa: Crear bucket actas-e14 y configurar políticas RLS
-- Ejecutar esto si recibes error "Bucket not found"

-- ============================================
-- 1. CREAR EL BUCKET (si no existe)
-- ============================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'actas-e14',
    'actas-e14',
    true,  -- Bucket público
    5242880, -- 5MB en bytes
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- ============================================
-- 2. HABILITAR RLS EN storage.objects
-- ============================================
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. ELIMINAR POLÍTICAS EXISTENTES (para evitar conflictos)
-- ============================================
DROP POLICY IF EXISTS "Public read access for actas-e14" ON storage.objects;
DROP POLICY IF EXISTS "Allow public selects" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated selects" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated uploads for actas-e14" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated deletes for actas-e14" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated updates for actas-e14" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- ============================================
-- 4. CREAR POLÍTICAS RLS
-- ============================================

-- Política: Cualquiera (anon + authenticated) puede VER fotos
-- ESTO ES CRÍTICO para que las URLs públicas funcionen
CREATE POLICY "Public read access for actas-e14"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'actas-e14');

-- Política: Usuarios autenticados pueden SUBIR fotos
CREATE POLICY "Authenticated uploads for actas-e14"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'actas-e14');

-- Política: Usuarios autenticados pueden ELIMINAR fotos
CREATE POLICY "Authenticated deletes for actas-e14"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'actas-e14');

-- Política: Usuarios autenticados pueden ACTUALIZAR fotos
CREATE POLICY "Authenticated updates for actas-e14"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'actas-e14');

-- ============================================
-- 5. VERIFICACIÓN (opcional - descomentar para probar)
-- ============================================
-- SELECT * FROM storage.buckets WHERE id = 'actas-e14';
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
