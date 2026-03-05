-- Migración: Crear bucket de storage para fotos de actas
-- Fecha: 2026-03-04
--
-- Crea el bucket 'actas-e14' si no existe

-- Crear el bucket (esto es idempotente en Supabase)
INSERT INTO storage.buckets (id, name, public)
VALUES ('actas-e14', 'actas-e14', false)
ON CONFLICT (id) DO NOTHING;

-- Política RLS para permitir subir fotos a usuarios autenticados
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'actas-e14' AND
    auth.uid() IS NOT NULL
);

-- Política RLS para permitir ver fotos a usuarios autenticados
CREATE POLICY "Allow authenticated selects" ON storage.objects
FOR SELECT TO authenticated
USING (
    bucket_id = 'actas-e14'
);

-- Política RLS para permitir eliminar fotos (solo el dueño o admin)
CREATE POLICY "Allow authenticated deletes" ON storage.objects
FOR DELETE TO authenticated
USING (
    bucket_id = 'actas-e14' AND
    auth.uid() = owner
);
