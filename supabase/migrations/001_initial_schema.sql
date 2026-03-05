-- Migración inicial: Esquema completo del Sistema E-14 Digital
-- Fecha: 2026-03-04

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE role_enum AS ENUM (
    'maestro',
    'revisor',
    'coordinador_municipal',
    'coordinador_puesto',
    'testigo'
);

CREATE TYPE zona_enum AS ENUM (
    'urbana',
    'rural'
);

CREATE TYPE estado_enum AS ENUM (
    'borrador',
    'enviado',
    'verificado',
    'corregido'
);

-- ============================================
-- TABLAS
-- ============================================

-- Tabla: municipios
CREATE TABLE municipios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    codigo_dane VARCHAR(10) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE municipios IS 'Municipios del departamento de Casanare';

-- Tabla: puestos_votacion
CREATE TABLE puestos_votacion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    municipio_id UUID NOT NULL REFERENCES municipios(id) ON DELETE CASCADE,
    nombre VARCHAR(200) NOT NULL,
    direccion TEXT,
    zona zona_enum NOT NULL DEFAULT 'urbana',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE puestos_votacion IS 'Puestos de votación por municipio';

-- Tabla: mesas
CREATE TABLE mesas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    puesto_id UUID NOT NULL REFERENCES puestos_votacion(id) ON DELETE CASCADE,
    numero_mesa INTEGER NOT NULL,
    potencial_electoral INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(puesto_id, numero_mesa)
);

COMMENT ON TABLE mesas IS 'Mesas de votación por puesto';

-- Tabla: profiles (extiende auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    role role_enum NOT NULL DEFAULT 'testigo',
    municipio_id UUID REFERENCES municipios(id) ON DELETE SET NULL,
    puesto_id UUID REFERENCES puestos_votacion(id) ON DELETE SET NULL,
    activo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE profiles IS 'Perfiles de usuarios extendidos desde auth.users';

-- Tabla: testigo_mesas (relación muchos a muchos)
CREATE TABLE testigo_mesas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    testigo_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    mesa_id UUID NOT NULL REFERENCES mesas(id) ON DELETE CASCADE,
    asignado_por UUID REFERENCES profiles(id) ON DELETE SET NULL,
    asignado_en TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(testigo_id, mesa_id)
);

COMMENT ON TABLE testigo_mesas IS 'Relación de testigos con sus mesas asignadas';

-- Tabla: partidos
CREATE TABLE partidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(200) NOT NULL,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    color_hex VARCHAR(7) DEFAULT '#000000',
    activo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE partidos IS 'Partidos políticos y movimientos';

-- Tabla: candidatos
CREATE TABLE candidatos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partido_id UUID NOT NULL REFERENCES partidos(id) ON DELETE CASCADE,
    nombre VARCHAR(200) NOT NULL,
    numero_lista INTEGER,
    es_partido BOOLEAN NOT NULL DEFAULT false,
    activo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE candidatos IS 'Candidatos a la Cámara por partido';

-- Tabla: actas_e14
CREATE TABLE actas_e14 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mesa_id UUID NOT NULL REFERENCES mesas(id) ON DELETE CASCADE,
    registrado_por UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    version INTEGER NOT NULL DEFAULT 1,
    estado estado_enum NOT NULL DEFAULT 'borrador',
    total_votos_urna INTEGER DEFAULT 0,
    total_votos_incinerados INTEGER DEFAULT 0,
    votos_en_blanco INTEGER DEFAULT 0,
    votos_nulos INTEGER DEFAULT 0,
    tarjetas_no_marcadas INTEGER DEFAULT 0,
    total_votos_validos INTEGER DEFAULT 0,
    total_sufragantes INTEGER DEFAULT 0,
    observaciones TEXT,
    creado_en TIMESTAMPTZ DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ DEFAULT NOW(),
    enviado_en TIMESTAMPTZ,
    verificado_por UUID REFERENCES profiles(id) ON DELETE SET NULL,
    verificado_en TIMESTAMPTZ,
    UNIQUE(mesa_id, version)
);

COMMENT ON TABLE actas_e14 IS 'Actas de escrutinio E-14 por mesa y versión';

-- Tabla: votos_candidato
CREATE TABLE votos_candidato (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    acta_id UUID NOT NULL REFERENCES actas_e14(id) ON DELETE CASCADE,
    candidato_id UUID NOT NULL REFERENCES candidatos(id) ON DELETE CASCADE,
    votos INTEGER NOT NULL DEFAULT 0,
    UNIQUE(acta_id, candidato_id)
);

COMMENT ON TABLE votos_candidato IS 'Votos por candidato en cada acta';

-- Tabla: fotos_acta
CREATE TABLE fotos_acta (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    acta_id UUID NOT NULL REFERENCES actas_e14(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    tamanio_bytes INTEGER,
    subido_por UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subido_en TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE fotos_acta IS 'Fotos de evidencia del acta E-14';

-- Tabla: auditoria_cambios (log inmutable)
CREATE TABLE auditoria_cambios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tabla_afectada VARCHAR(100) NOT NULL,
    registro_id UUID NOT NULL,
    accion VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    ejecutado_por UUID NOT NULL REFERENCES auth.users(id),
    ejecutado_en TIMESTAMPTZ DEFAULT NOW(),
    ip_address INET
);

COMMENT ON TABLE auditoria_cambios IS 'Log inmutable de todos los cambios en el sistema';

-- Tabla: revisor_asignaciones
CREATE TABLE revisor_asignaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    revisor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    municipio_id UUID REFERENCES municipios(id) ON DELETE CASCADE,
    puesto_id UUID REFERENCES puestos_votacion(id) ON DELETE CASCADE,
    asignado_por UUID REFERENCES profiles(id) ON DELETE SET NULL,
    asignado_en TIMESTAMPTZ DEFAULT NOW(),
    activo BOOLEAN NOT NULL DEFAULT true,
    CHECK (
        (municipio_id IS NOT NULL AND puesto_id IS NULL) OR
        (municipio_id IS NULL AND puesto_id IS NOT NULL)
    )
);

COMMENT ON TABLE revisor_asignaciones IS 'Asignaciones de revisores a municipios o puestos específicos';

-- ============================================
-- ÍNDICES
-- ============================================

CREATE INDEX idx_puestos_municipio ON puestos_votacion(municipio_id);
CREATE INDEX idx_mesas_puesto ON mesas(puesto_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_municipio ON profiles(municipio_id);
CREATE INDEX idx_profiles_puesto ON profiles(puesto_id);
CREATE INDEX idx_testigo_mesas_testigo ON testigo_mesas(testigo_id);
CREATE INDEX idx_testigo_mesas_mesa ON testigo_mesas(mesa_id);
CREATE INDEX idx_actas_mesa ON actas_e14(mesa_id);
CREATE INDEX idx_actas_registrado_por ON actas_e14(registrado_por);
CREATE INDEX idx_actas_estado ON actas_e14(estado);
CREATE INDEX idx_votos_acta ON votos_candidato(acta_id);
CREATE INDEX idx_votos_candidato ON votos_candidato(candidato_id);
CREATE INDEX idx_fotos_acta ON fotos_acta(acta_id);
CREATE INDEX idx_auditoria_tabla ON auditoria_cambios(tabla_afectada);
CREATE INDEX idx_auditoria_registro ON auditoria_cambios(registro_id);
CREATE INDEX idx_auditoria_fecha ON auditoria_cambios(ejecutado_en);
CREATE INDEX idx_revisor_asignaciones_revisor ON revisor_asignaciones(revisor_id);

-- ============================================
-- HABILITAR RLS
-- ============================================

ALTER TABLE municipios ENABLE ROW LEVEL SECURITY;
ALTER TABLE puestos_votacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE mesas ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE testigo_mesas ENABLE ROW LEVEL SECURITY;
ALTER TABLE partidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE actas_e14 ENABLE ROW LEVEL SECURITY;
ALTER TABLE votos_candidato ENABLE ROW LEVEL SECURITY;
ALTER TABLE fotos_acta ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditoria_cambios ENABLE ROW LEVEL SECURITY;
ALTER TABLE revisor_asignaciones ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS RLS
-- ============================================

-- Políticas para municipios (todos pueden leer, solo maestro puede modificar)
CREATE POLICY "municipios_select_all" ON municipios FOR SELECT USING (true);
CREATE POLICY "municipios_insert_maestro" ON municipios FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'maestro')
);
CREATE POLICY "municipios_update_maestro" ON municipios FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'maestro')
);
CREATE POLICY "municipios_delete_maestro" ON municipios FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'maestro')
);

-- Políticas para puestos_votacion
CREATE POLICY "puestos_select_all" ON puestos_votacion FOR SELECT USING (true);
CREATE POLICY "puestos_insert_maestro" ON puestos_votacion FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'maestro')
);
CREATE POLICY "puestos_update_maestro" ON puestos_votacion FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'maestro')
);
CREATE POLICY "puestos_delete_maestro" ON puestos_votacion FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'maestro')
);

-- Políticas para mesas
CREATE POLICY "mesas_select_all" ON mesas FOR SELECT USING (true);
CREATE POLICY "mesas_insert_maestro" ON mesas FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'maestro')
);
CREATE POLICY "mesas_update_maestro" ON mesas FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'maestro')
);
CREATE POLICY "mesas_delete_maestro" ON mesas FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'maestro')
);

-- Políticas para profiles
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (
    id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('maestro', 'revisor', 'coordinador_municipal', 'coordinador_puesto'))
);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (
    id = auth.uid()
);
CREATE POLICY "profiles_insert_maestro" ON profiles FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'maestro')
);
CREATE POLICY "profiles_update_maestro" ON profiles FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'maestro')
);

-- Políticas para testigo_mesas
CREATE POLICY "testigo_mesas_select_own" ON testigo_mesas FOR SELECT USING (
    testigo_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('maestro', 'coordinador_municipal', 'coordinador_puesto'))
);
CREATE POLICY "testigo_mesas_insert_maestro" ON testigo_mesas FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'maestro')
);
CREATE POLICY "testigo_mesas_delete_maestro" ON testigo_mesas FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'maestro')
);

-- Políticas para partidos
CREATE POLICY "partidos_select_all" ON partidos FOR SELECT USING (true);
CREATE POLICY "partidos_insert_maestro" ON partidos FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'maestro')
);
CREATE POLICY "partidos_update_maestro" ON partidos FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'maestro')
);

-- Políticas para candidatos
CREATE POLICY "candidatos_select_all" ON candidatos FOR SELECT USING (true);
CREATE POLICY "candidatos_insert_maestro" ON candidatos FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'maestro')
);
CREATE POLICY "candidatos_update_maestro" ON candidatos FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'maestro')
);

-- Políticas para actas_e14
CREATE POLICY "actas_select_own" ON actas_e14 FOR SELECT USING (
    registrado_por = auth.uid() OR
    mesa_id IN (SELECT mesa_id FROM testigo_mesas WHERE testigo_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('maestro', 'revisor', 'coordinador_municipal', 'coordinador_puesto'))
);
CREATE POLICY "actas_insert_own" ON actas_e14 FOR INSERT WITH CHECK (
    registrado_por = auth.uid() AND
    (mesa_id IN (SELECT mesa_id FROM testigo_mesas WHERE testigo_id = auth.uid()) OR
     EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('maestro', 'coordinador_puesto')))
);
CREATE POLICY "actas_update_own" ON actas_e14 FOR UPDATE USING (
    (registrado_por = auth.uid() AND estado = 'borrador') OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('maestro', 'revisor'))
);

-- Políticas para votos_candidato
CREATE POLICY "votos_select_related" ON votos_candidato FOR SELECT USING (
    EXISTS (SELECT 1 FROM actas_e14 WHERE id = acta_id AND (registrado_por = auth.uid() OR
        mesa_id IN (SELECT mesa_id FROM testigo_mesas WHERE testigo_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('maestro', 'revisor', 'coordinador_municipal', 'coordinador_puesto'))
    ))
);
CREATE POLICY "votos_insert_related" ON votos_candidato FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM actas_e14 WHERE id = acta_id AND estado = 'borrador' AND (registrado_por = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('maestro', 'coordinador_puesto'))
    ))
);
CREATE POLICY "votos_update_related" ON votos_candidato FOR UPDATE USING (
    EXISTS (SELECT 1 FROM actas_e14 WHERE id = acta_id AND estado = 'borrador' AND (registrado_por = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('maestro', 'coordinador_puesto'))
    ))
);

-- Políticas para fotos_acta
CREATE POLICY "fotos_select_related" ON fotos_acta FOR SELECT USING (
    EXISTS (SELECT 1 FROM actas_e14 WHERE id = acta_id AND (registrado_por = auth.uid() OR
        mesa_id IN (SELECT mesa_id FROM testigo_mesas WHERE testigo_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('maestro', 'revisor', 'coordinador_municipal', 'coordinador_puesto'))
    ))
);
CREATE POLICY "fotos_insert_related" ON fotos_acta FOR INSERT WITH CHECK (
    subido_por = auth.uid() AND
    EXISTS (SELECT 1 FROM actas_e14 WHERE id = acta_id AND estado = 'borrador' AND (registrado_por = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('maestro', 'coordinador_puesto'))
    ))
);
CREATE POLICY "fotos_delete_related" ON fotos_acta FOR DELETE USING (
    subido_por = auth.uid() AND
    EXISTS (SELECT 1 FROM actas_e14 WHERE id = acta_id AND estado = 'borrador')
);

-- Políticas para auditoria_cambios (solo maestro puede consultar)
CREATE POLICY "auditoria_select_maestro" ON auditoria_cambios FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'maestro')
);

-- Políticas para revisor_asignaciones
CREATE POLICY "revisor_asignaciones_select_maestro" ON revisor_asignaciones FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'maestro')
);
CREATE POLICY "revisor_asignaciones_insert_maestro" ON revisor_asignaciones FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'maestro')
);
CREATE POLICY "revisor_asignaciones_update_maestro" ON revisor_asignaciones FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'maestro')
);
CREATE POLICY "revisor_asignaciones_delete_maestro" ON revisor_asignaciones FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'maestro')
);

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_actas_e14_updated_at BEFORE UPDATE ON actas_e14
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para auditoría
CREATE OR REPLACE FUNCTION audit_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO auditoria_cambios (tabla_afectada, registro_id, accion, datos_anteriores, ejecutado_por)
        VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', row_to_json(OLD), auth.uid());
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO auditoria_cambios (tabla_afectada, registro_id, accion, datos_anteriores, datos_nuevos, ejecutado_por)
        VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', row_to_json(OLD), row_to_json(NEW), auth.uid());
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO auditoria_cambios (tabla_afectada, registro_id, accion, datos_nuevos, ejecutado_por)
        VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', row_to_json(NEW), auth.uid());
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers de auditoría para tablas críticas
CREATE TRIGGER audit_actas_e14_trigger
    AFTER INSERT OR UPDATE OR DELETE ON actas_e14
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_votos_candidato_trigger
    AFTER INSERT OR UPDATE OR DELETE ON votos_candidato
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

-- Función para crear perfil automáticamente al crear usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_role role_enum;
    v_role_text TEXT;
BEGIN
    -- Obtener el rol del metadata, default 'testigo' si no existe
    v_role_text := NEW.raw_user_meta_data->>'role';

    -- Validar que el rol sea válido, si no, usar 'testigo'
    IF v_role_text IS NULL OR v_role_text NOT IN ('maestro', 'revisor', 'coordinador_municipal', 'coordinador_puesto', 'testigo') THEN
        v_role := 'testigo';
    ELSE
        v_role := v_role_text::role_enum;
    END IF;

    INSERT INTO public.profiles (id, email, full_name, role, activo)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        v_role,
        true
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
