-- Migración 033: Corregir suma de votos para 'Total votos por la lista'
-- Fecha: 2026-03-06
-- Problema: El candidato ficticio "Total votos por la lista" estaba sumando votos desde
-- la tabla votos_candidato, cuando debería heredar su valor de la tabla votos_lista.
-- Solución: Modificar la función `recalcular_votos_candidato_municipio` para que 
-- excluya los candidatos 'Total votos por la lista' de la consolidación normal y
-- luego los inserte explícitamente tomando los valores desde `votos_lista`.

-- ============================================
-- FUNCIÓN ACTUALIZADA: RECALCULAR VOTOS CANDIDATO
-- ============================================

CREATE OR REPLACE FUNCTION recalcular_votos_candidato_municipio(p_municipio_id UUID)
RETURNS VOID AS $$
DECLARE
    v_count INTEGER;
BEGIN
    RAISE NOTICE 'Iniciando recalcular_votos_candidato_municipio para municipio: %', p_municipio_id;

    -- 1. Insertar o actualizar votos consolidados para CANDIDATOS REALES
    -- Excluimos a los que se llaman 'Total votos por la lista'
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
    JOIN candidatos c ON c.id = vc.candidato_id
    WHERE pv.municipio_id = p_municipio_id
    AND a.estado IN ('enviado', 'verificado', 'corregido')
    AND c.nombre != 'Total votos por la lista' -- EXCLUSIÓN CLAVE AQUÍ
    GROUP BY pv.municipio_id, vc.candidato_id
    ON CONFLICT (municipio_id, candidato_id) DO UPDATE SET
        votos = EXCLUDED.votos,
        ultima_actualizacion = NOW();

    -- 2. Insertar o actualizar votos consolidados para 'Total votos por la lista'
    -- Tomamos el valor desde `votos_lista` y buscamos el candidato ficticio correspondiente
    INSERT INTO consolidado_votos_candidato_municipio (
        municipio_id, candidato_id, votos, ultima_actualizacion
    )
    SELECT 
        pv.municipio_id,
        c.id AS candidato_id,
        SUM(vl.votos),
        NOW()
    FROM votos_lista vl
    JOIN actas_e14 a ON a.id = vl.acta_id
    JOIN mesas m ON m.id = a.mesa_id
    JOIN puestos_votacion pv ON pv.id = m.puesto_id
    JOIN candidatos c ON c.partido_id = vl.partido_id AND c.nombre = 'Total votos por la lista'
    WHERE pv.municipio_id = p_municipio_id
    AND a.estado IN ('enviado', 'verificado', 'corregido')
    GROUP BY pv.municipio_id, c.id
    ON CONFLICT (municipio_id, candidato_id) DO UPDATE SET
        votos = EXCLUDED.votos,
        ultima_actualizacion = NOW();

    RAISE NOTICE 'Finalizado recalcular_votos_candidato_municipio para municipio: %', p_municipio_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- RECALCULAR DATOS HISTÓRICOS
-- ============================================
-- Como la lógica cambió, repoblamos todos los municipios

DO $$
DECLARE
    r RECORD;
BEGIN
    RAISE NOTICE 'Recalculando datos históricos de candidatos para todos los municipios partiendo de cero (limpiando)...';
    
    -- Opcional, pero recomendado: Limpiamos los consolidados de los candidatos 'Total votos por la lista' 
    -- que pudieron haber quedado sucios con la lógica anterior (con la data de votos_candidato)
    DELETE FROM consolidado_votos_candidato_municipio cvcm
    USING candidatos c
    WHERE cvcm.candidato_id = c.id
    AND c.nombre = 'Total votos por la lista';

    -- Recorremos todos los municipios para actualizar
    FOR r IN SELECT id FROM municipios LOOP
        PERFORM recalcular_votos_candidato_municipio(r.id);
    END LOOP;

    RAISE NOTICE 'Finalizada corrección de datos históricos';
END $$;
