-- Migración: Eliminar restricciones RLS - permitir edición a cualquier usuario autenticado
-- Fecha: 05 de Marzo 2026

-- ============================================
-- ELIMINAR POLÍTICAS RESTRICTIVAS DE votos_candidato
-- ============================================

DROP POLICY IF EXISTS "votos_select_related" ON votos_candidato;
DROP POLICY IF EXISTS "votos_insert_any" ON votos_candidato;
DROP POLICY IF EXISTS "votos_update_any" ON votos_candidato;
DROP POLICY IF EXISTS "votos_delete_related" ON votos_candidato;

-- Política permisiva: cualquier usuario autenticado puede hacer todo
CREATE POLICY "votos_all_access" ON votos_candidato
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ============================================
-- ELIMINAR POLÍTICAS RESTRICTIVAS DE votos_lista
-- ============================================

DROP POLICY IF EXISTS "votos_lista_select_policy" ON votos_lista;
DROP POLICY IF EXISTS "votos_lista_insert_policy" ON votos_lista;
DROP POLICY IF EXISTS "votos_lista_update_policy" ON votos_lista;
DROP POLICY IF EXISTS "votos_lista_delete_policy" ON votos_lista;

-- Política permisiva: cualquier usuario autenticado puede hacer todo
CREATE POLICY "votos_lista_all_access" ON votos_lista
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ============================================
-- ELIMINAR POLÍTICAS RESTRICTIVAS DE actas_e14 (si existen)
-- ============================================

DROP POLICY IF EXISTS "actas_select_own" ON actas_e14;
DROP POLICY IF EXISTS "actas_insert_own" ON actas_e14;
DROP POLICY IF EXISTS "actas_update_own" ON actas_e14;
DROP POLICY IF EXISTS "actas_delete_own" ON actas_e14;

-- Política permisiva: cualquier usuario autenticado puede hacer todo
CREATE POLICY "actas_all_access" ON actas_e14
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
