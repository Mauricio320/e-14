-- Migración: Desactivar restricciones RLS para insert en actas_e14
-- Fecha: 2026-03-04
--
-- Esto permite que cualquier usuario autenticado pueda crear actas
-- Útil para desarrollo y pruebas

-- Eliminar política restrictiva de inserción
DROP POLICY IF EXISTS "actas_insert_own" ON actas_e14;

-- Crear política permisiva para inserción
-- Cualquier usuario autenticado puede crear actas
CREATE POLICY "actas_insert_any" ON actas_e14 FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
);

-- Nota: Las políticas de SELECT y UPDATE permanecen restrictivas
-- Solo se ha relajado la política de INSERT
