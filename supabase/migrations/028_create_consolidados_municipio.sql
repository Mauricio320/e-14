-- Migración 028: Tabla de consolidados por municipio
-- Propósito: Almacenar estadísticas consolidadas para consultas rápidas
-- Fecha: 2026-03-06

-- ============================================
-- TABLA: CONSOLIDADOS MUNICIPIO
-- ============================================

CREATE TABLE consolidados_municipio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    municipio_id UUID NOT NULL REFERENCES municipios(id) ON DELETE CASCADE,

    -- Conteos de infraestructura
    total_puestos INTEGER NOT NULL DEFAULT 0,
    total_mesas INTEGER NOT NULL DEFAULT 0,
    mesas_reportadas INTEGER NOT NULL DEFAULT 0,

    -- Progreso de reporte
    porcentaje_reportado INTEGER NOT NULL DEFAULT 0,

    -- Totales de votos acumulados (solo de actas enviadas/verificadas/corregidas)
    total_sufragantes INTEGER NOT NULL DEFAULT 0,
    total_votos_urna INTEGER NOT NULL DEFAULT 0,
    total_votos_incinerados INTEGER NOT NULL DEFAULT 0,
    votos_en_blanco INTEGER NOT NULL DEFAULT 0,
    votos_nulos INTEGER NOT NULL DEFAULT 0,
    tarjetas_no_marcadas INTEGER NOT NULL DEFAULT 0,
    total_votos_validos INTEGER NOT NULL DEFAULT 0,
    total_votos_mesa INTEGER NOT NULL DEFAULT 0,
    total_votos_lista INTEGER NOT NULL DEFAULT 0,

    -- Conteos por estado de actas
    actas_borrador INTEGER NOT NULL DEFAULT 0,
    actas_enviadas INTEGER NOT NULL DEFAULT 0,
    actas_verificadas INTEGER NOT NULL DEFAULT 0,
    actas_corregidas INTEGER NOT NULL DEFAULT 0,

    -- Metadatos
    ultima_actualizacion TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(municipio_id)
);

COMMENT ON TABLE consolidados_municipio IS 'Consolidado de estadísticas y votos por municipio para consultas rápidas';

-- ============================================
-- ÍNDICES
-- ============================================

CREATE INDEX idx_consolidados_municipio_id ON consolidados_municipio(municipio_id);
CREATE INDEX idx_consolidados_porcentaje ON consolidados_municipio(porcentaje_reportado);

-- ============================================
-- RLS (ROW LEVEL SECURITY)
-- ============================================

ALTER TABLE consolidados_municipio ENABLE ROW LEVEL SECURITY;

-- Todos pueden leer los consolidados
CREATE POLICY "consolidados_select_all" ON consolidados_municipio FOR SELECT USING (true);

-- Solo maestro puede modificar manualmente (los triggers hacen la actualización automática)
CREATE POLICY "consolidados_insert_maestro" ON consolidados_municipio FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'maestro')
);
CREATE POLICY "consolidados_update_maestro" ON consolidados_municipio FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'maestro')
);
CREATE POLICY "consolidados_delete_maestro" ON consolidados_municipio FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'maestro')
);

-- ============================================
-- FUNCIÓN: RECALCULAR CONSOLIDADO
-- ============================================

CREATE OR REPLACE FUNCTION recalcular_consolidado_municipio(p_municipio_id UUID)
RETURNS VOID AS $$
DECLARE
    v_total_puestos INTEGER;
    v_total_mesas INTEGER;
    v_mesas_reportadas INTEGER;
    v_porcentaje INTEGER;

    v_total_sufragantes INTEGER;
    v_total_votos_urna INTEGER;
    v_total_votos_incinerados INTEGER;
    v_votos_en_blanco INTEGER;
    v_votos_nulos INTEGER;
    v_tarjetas_no_marcadas INTEGER;
    v_total_votos_validos INTEGER;
    v_total_votos_mesa INTEGER;
    v_total_votos_lista INTEGER;

    v_actas_borrador INTEGER;
    v_actas_enviadas INTEGER;
    v_actas_verificadas INTEGER;
    v_actas_corregidas INTEGER;
BEGIN
    -- Contar puestos de votación del municipio
    SELECT COUNT(*) INTO v_total_puestos
    FROM puestos_votacion
    WHERE municipio_id = p_municipio_id;

    -- Contar total de mesas del municipio
    SELECT COUNT(m.id) INTO v_total_mesas
    FROM mesas m
    JOIN puestos_votacion pv ON pv.id = m.puesto_id
    WHERE pv.municipio_id = p_municipio_id;

    -- Contar mesas reportadas (tienen acta en estado enviado, verificado o corregido)
    SELECT COUNT(DISTINCT a.mesa_id) INTO v_mesas_reportadas
    FROM actas_e14 a
    JOIN mesas m ON m.id = a.mesa_id
    JOIN puestos_votacion pv ON pv.id = m.puesto_id
    WHERE pv.municipio_id = p_municipio_id
    AND a.estado IN ('enviado', 'verificado', 'corregido');

    -- Calcular porcentaje
    IF v_total_mesas > 0 THEN
        v_porcentaje := ROUND((v_mesas_reportadas::NUMERIC / v_total_mesas::NUMERIC) * 100);
    ELSE
        v_porcentaje := 0;
    END IF;

    -- Sumar totales de votos (solo de actas enviadas/verificadas/corregidas)
    SELECT
        COALESCE(SUM(a.total_sufragantes), 0),
        COALESCE(SUM(a.total_votos_urna), 0),
        COALESCE(SUM(a.total_votos_incinerados), 0),
        COALESCE(SUM(a.votos_en_blanco), 0),
        COALESCE(SUM(a.votos_nulos), 0),
        COALESCE(SUM(a.tarjetas_no_marcadas), 0),
        COALESCE(SUM(a.total_votos_validos), 0),
        COALESCE(SUM(a.total_votos_mesa), 0),
        COALESCE(SUM(a.total_votos_lista), 0)
    INTO
        v_total_sufragantes,
        v_total_votos_urna,
        v_total_votos_incinerados,
        v_votos_en_blanco,
        v_votos_nulos,
        v_tarjetas_no_marcadas,
        v_total_votos_validos,
        v_total_votos_mesa,
        v_total_votos_lista
    FROM actas_e14 a
    JOIN mesas m ON m.id = a.mesa_id
    JOIN puestos_votacion pv ON pv.id = m.puesto_id
    WHERE pv.municipio_id = p_municipio_id
    AND a.estado IN ('enviado', 'verificado', 'corregido');

    -- Contar actas por estado
    SELECT COUNT(*) INTO v_actas_borrador
    FROM actas_e14 a
    JOIN mesas m ON m.id = a.mesa_id
    JOIN puestos_votacion pv ON pv.id = m.puesto_id
    WHERE pv.municipio_id = p_municipio_id AND a.estado = 'borrador';

    SELECT COUNT(*) INTO v_actas_enviadas
    FROM actas_e14 a
    JOIN mesas m ON m.id = a.mesa_id
    JOIN puestos_votacion pv ON pv.id = m.puesto_id
    WHERE pv.municipio_id = p_municipio_id AND a.estado = 'enviado';

    SELECT COUNT(*) INTO v_actas_verificadas
    FROM actas_e14 a
    JOIN mesas m ON m.id = a.mesa_id
    JOIN puestos_votacion pv ON pv.id = m.puesto_id
    WHERE pv.municipio_id = p_municipio_id AND a.estado = 'verificado';

    SELECT COUNT(*) INTO v_actas_corregidas
    FROM actas_e14 a
    JOIN mesas m ON m.id = a.mesa_id
    JOIN puestos_votacion pv ON pv.id = m.puesto_id
    WHERE pv.municipio_id = p_municipio_id AND a.estado = 'corregido';

    -- Insertar o actualizar el consolidado
    INSERT INTO consolidados_municipio (
        municipio_id,
        total_puestos,
        total_mesas,
        mesas_reportadas,
        porcentaje_reportado,
        total_sufragantes,
        total_votos_urna,
        total_votos_incinerados,
        votos_en_blanco,
        votos_nulos,
        tarjetas_no_marcadas,
        total_votos_validos,
        total_votos_mesa,
        total_votos_lista,
        actas_borrador,
        actas_enviadas,
        actas_verificadas,
        actas_corregidas,
        ultima_actualizacion
    ) VALUES (
        p_municipio_id,
        v_total_puestos,
        v_total_mesas,
        v_mesas_reportadas,
        v_porcentaje,
        v_total_sufragantes,
        v_total_votos_urna,
        v_total_votos_incinerados,
        v_votos_en_blanco,
        v_votos_nulos,
        v_tarjetas_no_marcadas,
        v_total_votos_validos,
        v_total_votos_mesa,
        v_total_votos_lista,
        v_actas_borrador,
        v_actas_enviadas,
        v_actas_verificadas,
        v_actas_corregidas,
        NOW()
    )
    ON CONFLICT (municipio_id) DO UPDATE SET
        total_puestos = EXCLUDED.total_puestos,
        total_mesas = EXCLUDED.total_mesas,
        mesas_reportadas = EXCLUDED.mesas_reportadas,
        porcentaje_reportado = EXCLUDED.porcentaje_reportado,
        total_sufragantes = EXCLUDED.total_sufragantes,
        total_votos_urna = EXCLUDED.total_votos_urna,
        total_votos_incinerados = EXCLUDED.total_votos_incinerados,
        votos_en_blanco = EXCLUDED.votos_en_blanco,
        votos_nulos = EXCLUDED.votos_nulos,
        tarjetas_no_marcadas = EXCLUDED.tarjetas_no_marcadas,
        total_votos_validos = EXCLUDED.total_votos_validos,
        total_votos_mesa = EXCLUDED.total_votos_mesa,
        total_votos_lista = EXCLUDED.total_votos_lista,
        actas_borrador = EXCLUDED.actas_borrador,
        actas_enviadas = EXCLUDED.actas_enviadas,
        actas_verificadas = EXCLUDED.actas_verificadas,
        actas_corregidas = EXCLUDED.actas_corregidas,
        ultima_actualizacion = NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGER: ACTUALIZAR CONSOLIDADO AUTOMÁTICAMENTE
-- ============================================

CREATE OR REPLACE FUNCTION trigger_actualizar_consolidado_municipio()
RETURNS TRIGGER AS $$
DECLARE
    v_municipio_id UUID;
BEGIN
    -- Obtener el municipio_id desde la mesa afectada
    SELECT pv.municipio_id INTO v_municipio_id
    FROM mesas m
    JOIN puestos_votacion pv ON pv.id = m.puesto_id
    WHERE m.id = COALESCE(NEW.mesa_id, OLD.mesa_id);

    -- Si encontramos el municipio, recalcular su consolidado
    IF v_municipio_id IS NOT NULL THEN
        PERFORM recalcular_consolidado_municipio(v_municipio_id);
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger en actas_e14 para actualizar consolidado cuando cambia un acta
CREATE TRIGGER trigger_actualizar_consolidado
    AFTER INSERT OR UPDATE OR DELETE ON actas_e14
    FOR EACH ROW EXECUTE FUNCTION trigger_actualizar_consolidado_municipio();

-- ============================================
-- POBLAR DATOS INICIALES
-- ============================================

-- Crear consolidados para todos los municipios existentes
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT id FROM municipios LOOP
        PERFORM recalcular_consolidado_municipio(r.id);
    END LOOP;
END $$;
