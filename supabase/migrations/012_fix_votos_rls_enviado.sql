-- Actualizar políticas RLS para permitir registrar votos en actas enviadas
-- Fecha: 2026-03-04

-- ============================================
-- POLÍTICAS ACTUALIZADAS PARA votos_candidato
-- ============================================

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "votos_select_related" ON votos_candidato;
DROP POLICY IF EXISTS "votos_insert_related" ON votos_candidato;
DROP POLICY IF EXISTS "votos_update_related" ON votos_candidato;

-- Política SELECT: Cualquiera puede ver votos de actas que puede consultar
CREATE POLICY "votos_select_related" ON votos_candidato FOR SELECT USING (
    EXISTS (SELECT 1 FROM actas_e14 WHERE id = acta_id AND (registrado_por = auth.uid() OR
        mesa_id IN (SELECT mesa_id FROM testigo_mesas WHERE testigo_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('maestro', 'revisor', 'coordinador_municipal', 'coordinador_puesto'))
    ))
);

-- Política INSERT: Permitir insertar votos en actas enviadas o borrador
-- Eliminada la restricción de estado 'borrador' - ahora funciona con cualquier estado
CREATE POLICY "votos_insert_any" ON votos_candidato FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM actas_e14 WHERE id = acta_id AND (registrado_por = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('maestro', 'coordinador_puesto'))
    ))
);

-- Política UPDATE: Permitir actualizar votos en actas enviadas o borrador
CREATE POLICY "votos_update_any" ON votos_candidato FOR UPDATE USING (
    EXISTS (SELECT 1 FROM actas_e14 WHERE id = acta_id AND (registrado_por = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('maestro', 'coordinador_puesto'))
    ))
);

-- Política DELETE: Permitir eliminar votos (solo maestro o coordinador)
CREATE POLICY "votos_delete_related" ON votos_candidato FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('maestro', 'coordinador_puesto'))
);

-- ============================================
-- POLÍTICAS ACTUALIZADAS PARA fotos_acta (mismo problema)
-- ============================================

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "fotos_select_related" ON fotos_acta;
DROP POLICY IF EXISTS "fotos_insert_related" ON fotos_acta;
DROP POLICY IF EXISTS "fotos_delete_related" ON fotos_acta;

-- Política SELECT
CREATE POLICY "fotos_select_related" ON fotos_acta FOR SELECT USING (
    EXISTS (SELECT 1 FROM actas_e14 WHERE id = acta_id AND (registrado_por = auth.uid() OR
        mesa_id IN (SELECT mesa_id FROM testigo_mesas WHERE testigo_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('maestro', 'revisor', 'coordinador_municipal', 'coordinador_puesto'))
    ))
);

-- Política INSERT: Permitir subir fotos sin restricción de estado
CREATE POLICY "fotos_insert_any" ON fotos_acta FOR INSERT WITH CHECK (
    subido_por = auth.uid() AND
    EXISTS (SELECT 1 FROM actas_e14 WHERE id = acta_id AND (registrado_por = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('maestro', 'coordinador_puesto'))
    ))
);

-- Política DELETE: Permitir eliminar fotos propias
CREATE POLICY "fotos_delete_own" ON fotos_acta FOR DELETE USING (
    subido_por = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('maestro', 'coordinador_puesto'))
);

-- ============================================
-- POLÍTICA ACTUALIZADA PARA actas_e14 UPDATE
-- ============================================

-- Eliminar y recrear política de UPDATE para permitir editar en cualquier estado (solo el dueño)
DROP POLICY IF EXISTS "actas_update_own" ON actas_e14;

-- Permitir actualizar actas propias sin importar el estado (solo el registrador)
CREATE POLICY "actas_update_own" ON actas_e14 FOR UPDATE USING (
    (registrado_por = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('maestro', 'revisor'))
);
