-- Migración 030: Tablas de consolidado de votos por municipio
-- Fecha: 2026-03-06
-- Propósito: Almacenar votos consolidados por candidato y por lista para consultas rápidas

-- ============================================
-- TABLA: CONSOLIDADO VOTOS CANDIDATO MUNICIPIO
-- ============================================

CREATE TABLE consolidado_votos_candidato_municipio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    municipio_id UUID NOT NULL REFERENCES municipios(id) ON DELETE CASCADE,
    candidato_id UUID NOT NULL REFERENCES candidatos(id) ON DELETE CASCADE,
    votos INTEGER NOT NULL DEFAULT 0,
    ultima_actualizacion TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(municipio_id, candidato_id)
);

COMMENT ON TABLE consolidado_votos_candidato_municipio IS 'Votos consolidados por candidato en cada municipio';

-- ============================================
-- TABLA: CONSOLIDADO VOTOS LISTA MUNICIPIO
-- ============================================

CREATE TABLE consolidado_votos_lista_municipio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    municipio_id UUID NOT NULL REFERENCES municipios(id) ON DELETE CASCADE,
    partido_id UUID NOT NULL REFERENCES partidos(id) ON DELETE CASCADE,
    votos_lista INTEGER NOT NULL DEFAULT 0,
    ultima_actualizacion TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(municipio_id, partido_id)
);

COMMENT ON TABLE consolidado_votos_lista_municipio IS 'Votos consolidados por lista (partido) en cada municipio';

-- ============================================
-- ÍNDICES
-- ============================================

CREATE INDEX idx_consolidado_votos_candidato_municipio ON consolidado_votos_candidato_municipio(municipio_id);
CREATE INDEX idx_consolidado_votos_candidato_candidato ON consolidado_votos_candidato_municipio(candidato_id);
CREATE INDEX idx_consolidado_votos_lista_municipio ON consolidado_votos_lista_municipio(municipio_id);
CREATE INDEX idx_consolidado_votos_lista_partido ON consolidado_votos_lista_municipio(partido_id);

-- ============================================
-- RLS (ROW LEVEL SECURITY)
-- ============================================

ALTER TABLE consolidado_votos_candidato_municipio ENABLE ROW LEVEL SECURITY;
ALTER TABLE consolidado_votos_lista_municipio ENABLE ROW LEVEL SECURITY;

-- Todos pueden leer los consolidados de votos
CREATE POLICY "consolidado_votos_candidato_select_all" ON consolidado_votos_candidato_municipio FOR SELECT USING (true);
CREATE POLICY "consolidado_votos_lista_select_all" ON consolidado_votos_lista_municipio FOR SELECT USING (true);

-- Solo maestro puede modificar manualmente
CREATE POLICY "consolidado_votos_candidato_insert_maestro" ON consolidado_votos_candidato_municipio FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'maestro')
);
CREATE POLICY "consolidado_votos_candidato_update_maestro" ON consolidado_votos_candidato_municipio FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'maestro')
);
CREATE POLICY "consolidado_votos_lista_insert_maestro" ON consolidado_votos_lista_municipio FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'maestro')
);
CREATE POLICY "consolidado_votos_lista_update_maestro" ON consolidado_votos_lista_municipio FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'maestro')
);

-- ============================================
-- FUNCIÓN: RECALCULAR VOTOS CANDIDATO MUNICIPIO
-- ============================================

CREATE OR REPLACE FUNCTION recalcular_votos_candidato_municipio(p_municipio_id UUID)
RETURNS VOID AS $$
BEGIN
    -- Sumar votos por candidato de todas las mesas del municipio
    INSERT INTO consolidado_votos_candidato_municipio (
        municipio_id, candidato_id, votos, ultima_actualizacion
    )
    SELECT
        pv.municipio_id,
        vc.candidato_id,
        SUM(vc.votos),
        NOW()
    FROM votos_candidato vc
    JOIN actas_e14 a ON a.id = vc.acta_id
    JOIN mesas m ON m.id = a.mesa_id
    JOIN puestos_votacion pv ON pv.id = m.puesto_id
    WHERE pv.municipio_id = p_municipio_id
    AND a.estado IN ('enviado', 'verificado', 'corregido')
    GROUP BY pv.municipio_id, vc.candidato_id
    ON CONFLICT (municipio_id, candidato_id) DO UPDATE SET
        votos = EXCLUDED.votos,
        ultima_actualizacion = NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCIÓN: RECALCULAR VOTOS LISTA MUNICIPIO
-- ============================================

CREATE OR REPLACE FUNCTION recalcular_votos_lista_municipio(p_municipio_id UUID)
RETURNS VOID AS $$
BEGIN
    -- Sumar votos por lista de todas las mesas del municipio
    INSERT INTO consolidado_votos_lista_municipio (
        municipio_id, partido_id, votos_lista, ultima_actualizacion
    )
    SELECT
        pv.municipio_id,
        vl.partido_id,
        SUM(vl.votos),
        NOW()
    FROM votos_lista vl
    JOIN actas_e14 a ON a.id = vl.acta_id
    JOIN mesas m ON m.id = a.mesa_id
    JOIN puestos_votacion pv ON pv.id = m.puesto_id
    WHERE pv.municipio_id = p_municipio_id
    AND a.estado IN ('enviado', 'verificado', 'corregido')
    GROUP BY pv.municipio_id, vl.partido_id
    ON CONFLICT (municipio_id, partido_id) DO UPDATE SET
        votos_lista = EXCLUDED.votos_lista,
        ultima_actualizacion = NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGER: ACTUALIZAR VOTOS MUNICIPIO AUTOMÁTICAMENTE
-- ============================================

CREATE OR REPLACE FUNCTION trigger_actualizar_votos_municipio()
RETURNS TRIGGER AS $$
DECLARE
    v_municipio_id UUID;
BEGIN
    -- Obtener municipio_id desde la mesa afectada
    SELECT pv.municipio_id INTO v_municipio_id
    FROM mesas m
    JOIN puestos_votacion pv ON pv.id = m.puesto_id
    WHERE m.id = COALESCE(NEW.mesa_id, OLD.mesa_id);

    IF v_municipio_id IS NOT NULL THEN
        PERFORM recalcular_votos_candidato_municipio(v_municipio_id);
        PERFORM recalcular_votos_lista_municipio(v_municipio_id);
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger en actas_e14 para actualizar consolidados de votos
CREATE TRIGGER trigger_actualizar_votos_municipio
    AFTER INSERT OR UPDATE OR DELETE ON actas_e14
    FOR EACH ROW EXECUTE FUNCTION trigger_actualizar_votos_municipio();

-- ============================================
-- POBLAR DATOS INICIALES
-- ============================================

-- Crear consolidados de votos para todos los municipios existentes
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT id FROM municipios LOOP
        PERFORM recalcular_votos_candidato_municipio(r.id);
        PERFORM recalcular_votos_lista_municipio(r.id);
    END LOOP;
END $$;
