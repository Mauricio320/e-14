-- Migración 029: Corregir cálculos en consolidados_municipio
-- Fecha: 2026-03-06
-- Problema: El total_votos_validos debe calcularse como total_votos_lista + votos_en_blanco

-- ============================================
-- FUNCIÓN ACTUALIZADA: RECALCULAR CONSOLIDADO
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
    -- CORRECCIÓN: Calcular total_votos_validos como total_votos_lista + votos_en_blanco
    SELECT
        COALESCE(SUM(a.total_sufragantes), 0),
        COALESCE(SUM(a.total_votos_urna), 0),
        COALESCE(SUM(a.total_votos_incinerados), 0),
        COALESCE(SUM(a.votos_en_blanco), 0),
        COALESCE(SUM(a.votos_nulos), 0),
        COALESCE(SUM(a.tarjetas_no_marcadas), 0),
        -- CORRECCIÓN: total_votos_validos = total_votos_lista + votos_en_blanco
        COALESCE(SUM(a.total_votos_lista + a.votos_en_blanco), 0),
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
-- RECALCULAR TODOS LOS CONSOLIDADOS EXISTENTES
-- ============================================

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT id FROM municipios LOOP
        PERFORM recalcular_consolidado_municipio(r.id);
    END LOOP;
END $$;
