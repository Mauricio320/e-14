-- Migración 031: Corregir trigger de votos por municipio
-- Fecha: 2026-03-06
-- Problema: El trigger no estaba encontrando correctamente el municipio_id

-- ============================================
-- FUNCIÓN CORREGIDA: TRIGGER ACTUALIZAR VOTOS MUNICIPIO
-- ============================================

CREATE OR REPLACE FUNCTION trigger_actualizar_votos_municipio()
RETURNS TRIGGER AS $$
DECLARE
    v_municipio_id UUID;
    v_mesa_id UUID;
BEGIN
    -- Determinar qué mesa_id usar (NEW para INSERT/UPDATE, OLD para DELETE)
    IF TG_OP = 'DELETE' THEN
        v_mesa_id := OLD.mesa_id;
    ELSE
        v_mesa_id := NEW.mesa_id;
    END IF;

    -- Verificar que tenemos un mesa_id válido
    IF v_mesa_id IS NULL THEN
        RAISE NOTICE 'trigger_actualizar_votos_municipio: mesa_id es NULL';
        RETURN COALESCE(NEW, OLD);
    END IF;

    -- Obtener municipio_id desde la mesa
    SELECT pv.municipio_id INTO v_municipio_id
    FROM mesas m
    JOIN puestos_votacion pv ON pv.id = m.puesto_id
    WHERE m.id = v_mesa_id;

    -- Debug: mostrar qué se encontró
    RAISE NOTICE 'trigger_actualizar_votos_municipio: mesa_id=%, municipio_id=%', v_mesa_id, v_municipio_id;

    IF v_municipio_id IS NOT NULL THEN
        RAISE NOTICE 'Recalculando votos para municipio: %', v_municipio_id;
        PERFORM recalcular_votos_candidato_municipio(v_municipio_id);
        PERFORM recalcular_votos_lista_municipio(v_municipio_id);
    ELSE
        RAISE WARNING 'No se encontró municipio para mesa_id: %', v_mesa_id;
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- RECREAR TRIGGER
-- ============================================

-- Eliminar trigger existente si existe
DROP TRIGGER IF EXISTS trigger_actualizar_votos_municipio ON actas_e14;

-- Crear trigger nuevo
CREATE TRIGGER trigger_actualizar_votos_municipio
    AFTER INSERT OR UPDATE OR DELETE ON actas_e14
    FOR EACH ROW EXECUTE FUNCTION trigger_actualizar_votos_municipio();

-- ============================================
-- FUNCIÓN CORREGIDA: RECALCULAR VOTOS CANDIDATO
-- ============================================

CREATE OR REPLACE FUNCTION recalcular_votos_candidato_municipio(p_municipio_id UUID)
RETURNS VOID AS $$
DECLARE
    v_count INTEGER;
BEGIN
    RAISE NOTICE 'Iniciando recalcular_votos_candidato_municipio para municipio: %', p_municipio_id;

    -- Contar cuántos votos vamos a procesar
    SELECT COUNT(*) INTO v_count
    FROM votos_candidato vc
    JOIN actas_e14 a ON a.id = vc.acta_id
    JOIN mesas m ON m.id = a.mesa_id
    JOIN puestos_votacion pv ON pv.id = m.puesto_id
    WHERE pv.municipio_id = p_municipio_id
    AND a.estado IN ('enviado', 'verificado', 'corregido');

    RAISE NOTICE 'Encontrados % registros de votos_candidato', v_count;

    -- Insertar o actualizar votos consolidados
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

    RAISE NOTICE 'Finalizado recalcular_votos_candidato_municipio para municipio: %', p_municipio_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCIÓN CORREGIDA: RECALCULAR VOTOS LISTA
-- ============================================

CREATE OR REPLACE FUNCTION recalcular_votos_lista_municipio(p_municipio_id UUID)
RETURNS VOID AS $$
DECLARE
    v_count INTEGER;
BEGIN
    RAISE NOTICE 'Iniciando recalcular_votos_lista_municipio para municipio: %', p_municipio_id;

    -- Contar cuántos votos vamos a procesar
    SELECT COUNT(*) INTO v_count
    FROM votos_lista vl
    JOIN actas_e14 a ON a.id = vl.acta_id
    JOIN mesas m ON m.id = a.mesa_id
    JOIN puestos_votacion pv ON pv.id = m.puesto_id
    WHERE pv.municipio_id = p_municipio_id
    AND a.estado IN ('enviado', 'verificado', 'corregido');

    RAISE NOTICE 'Encontrados % registros de votos_lista', v_count;

    -- Insertar o actualizar votos consolidados
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

    RAISE NOTICE 'Finalizado recalcular_votos_lista_municipio para municipio: %', p_municipio_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VERIFICAR Y POBLAR DATOS FALTANTES
-- ============================================

DO $$
DECLARE
    r RECORD;
    v_total_candidatos INTEGER := 0;
    v_total_listas INTEGER := 0;
BEGIN
    RAISE NOTICE 'Iniciando población de datos para todos los municipios...';

    FOR r IN SELECT id, nombre FROM municipios LOOP
        RAISE NOTICE 'Procesando municipio: % (%)', r.nombre, r.id;

        PERFORM recalcular_votos_candidato_municipio(r.id);
        PERFORM recalcular_votos_lista_municipio(r.id);

        -- Contar registros creados
        SELECT COUNT(*) INTO v_total_candidatos
        FROM consolidado_votos_candidato_municipio
        WHERE municipio_id = r.id;

        SELECT COUNT(*) INTO v_total_listas
        FROM consolidado_votos_lista_municipio
        WHERE municipio_id = r.id;

        RAISE NOTICE 'Municipio %: % candidatos, % listas', r.nombre, v_total_candidatos, v_total_listas;
    END LOOP;

    RAISE NOTICE 'Finalizada población de datos';
END $$;
