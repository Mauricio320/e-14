-- Migración: Permitir a revisor insertar/actualizar votos al verificar acta
-- Fecha: 05 de Marzo 2026

-- ============================================
-- POLÍTICAS ACTUALIZADAS PARA votos_candidato
-- ============================================

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "votos_select_related" ON votos_candidato;
DROP POLICY IF EXISTS "votos_insert_any" ON votos_candidato;
DROP POLICY IF EXISTS "votos_update_any" ON votos_candidato;
DROP POLICY IF EXISTS "votos_delete_related" ON votos_candidato;

-- Política SELECT: Cualquiera puede ver votos de actas que puede consultar
CREATE POLICY "votos_select_related" ON votos_candidato FOR SELECT USING (
    EXISTS (SELECT 1 FROM actas_e14 WHERE id = acta_id AND (registrado_por = auth.uid() OR
        mesa_id IN (SELECT mesa_id FROM testigo_mesas WHERE testigo_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('maestro', 'revisor', 'coordinador_municipal', 'coordinador_puesto'))
    ))
);

-- Política INSERT: Permitir insertar votos (testigo, coordinador, maestro o revisor)
CREATE POLICY "votos_insert_any" ON votos_candidato FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM actas_e14 WHERE id = acta_id AND (
        registrado_por = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('maestro', 'revisor', 'coordinador_puesto'))
    ))
);

-- Política UPDATE: Permitir actualizar votos (testigo, coordinador, maestro o revisor)
CREATE POLICY "votos_update_any" ON votos_candidato FOR UPDATE USING (
    EXISTS (SELECT 1 FROM actas_e14 WHERE id = acta_id AND (
        registrado_por = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('maestro', 'revisor', 'coordinador_puesto'))
    ))
);

-- Política DELETE: Permitir eliminar votos (solo maestro o coordinador)
CREATE POLICY "votos_delete_related" ON votos_candidato FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('maestro', 'coordinador_puesto'))
);

-- ============================================
-- POLÍTICAS ACTUALIZADAS PARA votos_lista
-- ============================================

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "votos_lista_select_policy" ON votos_lista;
DROP POLICY IF EXISTS "votos_lista_insert_policy" ON votos_lista;
DROP POLICY IF EXISTS "votos_lista_update_policy" ON votos_lista;
DROP POLICY IF EXISTS "votos_lista_delete_policy" ON votos_lista;

-- Política para lectura: cualquier usuario autenticado puede leer
CREATE POLICY "votos_lista_select_policy" ON votos_lista
    FOR SELECT
    TO authenticated
    USING (true);

-- Política para inserción: testigos, coordinadores, maestros y revisores pueden insertar
CREATE POLICY "votos_lista_insert_policy" ON votos_lista
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role IN ('testigo', 'coordinador_puesto', 'coordinador_municipal', 'maestro', 'revisor')
        )
    );

-- Política para actualización: testigos, coordinadores, maestros y revisores pueden actualizar
CREATE POLICY "votos_lista_update_policy" ON votos_lista
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role IN ('testigo', 'coordinador_puesto', 'coordinador_municipal', 'maestro', 'revisor')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role IN ('testigo', 'coordinador_puesto', 'coordinador_municipal', 'maestro', 'revisor')
        )
    );

-- Política para eliminación: solo maestros pueden eliminar
CREATE POLICY "votos_lista_delete_policy" ON votos_lista
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'maestro'
        )
    );
