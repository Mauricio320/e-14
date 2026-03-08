-- Migración: Eliminar restricciones RLS para fotos_acta - permitir edición a cualquier usuario autenticado
-- Fecha: 08 de Marzo 2026

-- ============================================
-- ELIMINAR POLÍTICAS RESTRICTIVAS DE fotos_acta
-- ============================================

DROP POLICY IF EXISTS "fotos_select_related" ON fotos_acta;
DROP POLICY IF EXISTS "fotos_insert_any" ON fotos_acta;
DROP POLICY IF EXISTS "fotos_delete_own" ON fotos_acta;

-- Política permisiva: cualquier usuario autenticado puede hacer todo
CREATE POLICY "fotos_acta_all_access" ON fotos_acta
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
