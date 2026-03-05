-- Migración correctiva: Eliminar recursión infinita en políticas RLS
-- Fecha: 2026-03-04
--
-- Problema: Las políticas RLS de "profiles" contienen sub-consultas a la misma
-- tabla profiles, causando error PostgreSQL 42P17 (infinite recursion detected).
-- Esto afecta en cascada a TODAS las tablas cuyas políticas también consultan profiles.
--
-- Solución: Crear función SECURITY DEFINER get_my_role() que bypasea RLS,
-- y reemplazar todas las sub-consultas recursivas con llamadas a esta función.

-- ============================================
-- PASO 1: Crear función auxiliar get_my_role()
-- ============================================

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
  SELECT role::TEXT FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ============================================
-- PASO 2: Reemplazar políticas de profiles
-- ============================================

-- profiles_select_own
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (
    id = auth.uid() OR
    public.get_my_role() IN ('maestro', 'revisor', 'coordinador_municipal', 'coordinador_puesto')
);

-- profiles_insert_maestro
DROP POLICY IF EXISTS "profiles_insert_maestro" ON profiles;
CREATE POLICY "profiles_insert_maestro" ON profiles FOR INSERT WITH CHECK (
    public.get_my_role() = 'maestro'
);

-- profiles_update_maestro
DROP POLICY IF EXISTS "profiles_update_maestro" ON profiles;
CREATE POLICY "profiles_update_maestro" ON profiles FOR UPDATE USING (
    public.get_my_role() = 'maestro'
);

-- profiles_update_own: sin cambios (no tiene sub-consulta recursiva)

-- ============================================
-- PASO 3: Reemplazar políticas de municipios
-- ============================================

DROP POLICY IF EXISTS "municipios_insert_maestro" ON municipios;
CREATE POLICY "municipios_insert_maestro" ON municipios FOR INSERT WITH CHECK (
    public.get_my_role() = 'maestro'
);

DROP POLICY IF EXISTS "municipios_update_maestro" ON municipios;
CREATE POLICY "municipios_update_maestro" ON municipios FOR UPDATE USING (
    public.get_my_role() = 'maestro'
);

DROP POLICY IF EXISTS "municipios_delete_maestro" ON municipios;
CREATE POLICY "municipios_delete_maestro" ON municipios FOR DELETE USING (
    public.get_my_role() = 'maestro'
);

-- ============================================
-- PASO 4: Reemplazar políticas de puestos_votacion
-- ============================================

DROP POLICY IF EXISTS "puestos_insert_maestro" ON puestos_votacion;
CREATE POLICY "puestos_insert_maestro" ON puestos_votacion FOR INSERT WITH CHECK (
    public.get_my_role() = 'maestro'
);

DROP POLICY IF EXISTS "puestos_update_maestro" ON puestos_votacion;
CREATE POLICY "puestos_update_maestro" ON puestos_votacion FOR UPDATE USING (
    public.get_my_role() = 'maestro'
);

DROP POLICY IF EXISTS "puestos_delete_maestro" ON puestos_votacion;
CREATE POLICY "puestos_delete_maestro" ON puestos_votacion FOR DELETE USING (
    public.get_my_role() = 'maestro'
);

-- ============================================
-- PASO 5: Reemplazar políticas de mesas
-- ============================================

DROP POLICY IF EXISTS "mesas_insert_maestro" ON mesas;
CREATE POLICY "mesas_insert_maestro" ON mesas FOR INSERT WITH CHECK (
    public.get_my_role() = 'maestro'
);

DROP POLICY IF EXISTS "mesas_update_maestro" ON mesas;
CREATE POLICY "mesas_update_maestro" ON mesas FOR UPDATE USING (
    public.get_my_role() = 'maestro'
);

DROP POLICY IF EXISTS "mesas_delete_maestro" ON mesas;
CREATE POLICY "mesas_delete_maestro" ON mesas FOR DELETE USING (
    public.get_my_role() = 'maestro'
);

-- ============================================
-- PASO 6: Reemplazar políticas de testigo_mesas
-- ============================================

DROP POLICY IF EXISTS "testigo_mesas_select_own" ON testigo_mesas;
CREATE POLICY "testigo_mesas_select_own" ON testigo_mesas FOR SELECT USING (
    testigo_id = auth.uid() OR
    public.get_my_role() IN ('maestro', 'coordinador_municipal', 'coordinador_puesto')
);

DROP POLICY IF EXISTS "testigo_mesas_insert_maestro" ON testigo_mesas;
CREATE POLICY "testigo_mesas_insert_maestro" ON testigo_mesas FOR INSERT WITH CHECK (
    public.get_my_role() = 'maestro'
);

DROP POLICY IF EXISTS "testigo_mesas_delete_maestro" ON testigo_mesas;
CREATE POLICY "testigo_mesas_delete_maestro" ON testigo_mesas FOR DELETE USING (
    public.get_my_role() = 'maestro'
);

-- ============================================
-- PASO 7: Reemplazar políticas de partidos
-- ============================================

DROP POLICY IF EXISTS "partidos_insert_maestro" ON partidos;
CREATE POLICY "partidos_insert_maestro" ON partidos FOR INSERT WITH CHECK (
    public.get_my_role() = 'maestro'
);

DROP POLICY IF EXISTS "partidos_update_maestro" ON partidos;
CREATE POLICY "partidos_update_maestro" ON partidos FOR UPDATE USING (
    public.get_my_role() = 'maestro'
);

-- ============================================
-- PASO 8: Reemplazar políticas de candidatos
-- ============================================

DROP POLICY IF EXISTS "candidatos_insert_maestro" ON candidatos;
CREATE POLICY "candidatos_insert_maestro" ON candidatos FOR INSERT WITH CHECK (
    public.get_my_role() = 'maestro'
);

DROP POLICY IF EXISTS "candidatos_update_maestro" ON candidatos;
CREATE POLICY "candidatos_update_maestro" ON candidatos FOR UPDATE USING (
    public.get_my_role() = 'maestro'
);

-- ============================================
-- PASO 9: Reemplazar políticas de actas_e14
-- ============================================

DROP POLICY IF EXISTS "actas_select_own" ON actas_e14;
CREATE POLICY "actas_select_own" ON actas_e14 FOR SELECT USING (
    registrado_por = auth.uid() OR
    mesa_id IN (SELECT mesa_id FROM testigo_mesas WHERE testigo_id = auth.uid()) OR
    public.get_my_role() IN ('maestro', 'revisor', 'coordinador_municipal', 'coordinador_puesto')
);

DROP POLICY IF EXISTS "actas_insert_own" ON actas_e14;
CREATE POLICY "actas_insert_own" ON actas_e14 FOR INSERT WITH CHECK (
    registrado_por = auth.uid() AND
    (mesa_id IN (SELECT mesa_id FROM testigo_mesas WHERE testigo_id = auth.uid()) OR
     public.get_my_role() IN ('maestro', 'coordinador_puesto'))
);

DROP POLICY IF EXISTS "actas_update_own" ON actas_e14;
CREATE POLICY "actas_update_own" ON actas_e14 FOR UPDATE USING (
    (registrado_por = auth.uid() AND estado = 'borrador') OR
    public.get_my_role() IN ('maestro', 'revisor')
);

-- ============================================
-- PASO 10: Reemplazar políticas de votos_candidato
-- ============================================

DROP POLICY IF EXISTS "votos_select_related" ON votos_candidato;
CREATE POLICY "votos_select_related" ON votos_candidato FOR SELECT USING (
    EXISTS (SELECT 1 FROM actas_e14 WHERE id = acta_id AND (
        registrado_por = auth.uid() OR
        mesa_id IN (SELECT mesa_id FROM testigo_mesas WHERE testigo_id = auth.uid()) OR
        public.get_my_role() IN ('maestro', 'revisor', 'coordinador_municipal', 'coordinador_puesto')
    ))
);

DROP POLICY IF EXISTS "votos_insert_related" ON votos_candidato;
CREATE POLICY "votos_insert_related" ON votos_candidato FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM actas_e14 WHERE id = acta_id AND estado = 'borrador' AND (
        registrado_por = auth.uid() OR
        public.get_my_role() IN ('maestro', 'coordinador_puesto')
    ))
);

DROP POLICY IF EXISTS "votos_update_related" ON votos_candidato;
CREATE POLICY "votos_update_related" ON votos_candidato FOR UPDATE USING (
    EXISTS (SELECT 1 FROM actas_e14 WHERE id = acta_id AND estado = 'borrador' AND (
        registrado_por = auth.uid() OR
        public.get_my_role() IN ('maestro', 'coordinador_puesto')
    ))
);

-- ============================================
-- PASO 11: Reemplazar políticas de fotos_acta
-- ============================================

DROP POLICY IF EXISTS "fotos_select_related" ON fotos_acta;
CREATE POLICY "fotos_select_related" ON fotos_acta FOR SELECT USING (
    EXISTS (SELECT 1 FROM actas_e14 WHERE id = acta_id AND (
        registrado_por = auth.uid() OR
        mesa_id IN (SELECT mesa_id FROM testigo_mesas WHERE testigo_id = auth.uid()) OR
        public.get_my_role() IN ('maestro', 'revisor', 'coordinador_municipal', 'coordinador_puesto')
    ))
);

DROP POLICY IF EXISTS "fotos_insert_related" ON fotos_acta;
CREATE POLICY "fotos_insert_related" ON fotos_acta FOR INSERT WITH CHECK (
    subido_por = auth.uid() AND
    EXISTS (SELECT 1 FROM actas_e14 WHERE id = acta_id AND estado = 'borrador' AND (
        registrado_por = auth.uid() OR
        public.get_my_role() IN ('maestro', 'coordinador_puesto')
    ))
);

-- fotos_delete_related: sin cambios (no tiene sub-consulta a profiles)

-- ============================================
-- PASO 12: Reemplazar política de auditoria_cambios
-- ============================================

DROP POLICY IF EXISTS "auditoria_select_maestro" ON auditoria_cambios;
CREATE POLICY "auditoria_select_maestro" ON auditoria_cambios FOR SELECT USING (
    public.get_my_role() = 'maestro'
);

-- ============================================
-- PASO 13: Reemplazar políticas de revisor_asignaciones
-- ============================================

DROP POLICY IF EXISTS "revisor_asignaciones_select_maestro" ON revisor_asignaciones;
CREATE POLICY "revisor_asignaciones_select_maestro" ON revisor_asignaciones FOR SELECT USING (
    public.get_my_role() = 'maestro'
);

DROP POLICY IF EXISTS "revisor_asignaciones_insert_maestro" ON revisor_asignaciones;
CREATE POLICY "revisor_asignaciones_insert_maestro" ON revisor_asignaciones FOR INSERT WITH CHECK (
    public.get_my_role() = 'maestro'
);

DROP POLICY IF EXISTS "revisor_asignaciones_update_maestro" ON revisor_asignaciones;
CREATE POLICY "revisor_asignaciones_update_maestro" ON revisor_asignaciones FOR UPDATE USING (
    public.get_my_role() = 'maestro'
);

DROP POLICY IF EXISTS "revisor_asignaciones_delete_maestro" ON revisor_asignaciones;
CREATE POLICY "revisor_asignaciones_delete_maestro" ON revisor_asignaciones FOR DELETE USING (
    public.get_my_role() = 'maestro'
);
