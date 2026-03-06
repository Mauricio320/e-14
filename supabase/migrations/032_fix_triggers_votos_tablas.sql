-- Migración 032: Crear triggers en tablas de votos para actualizar consolidados
-- Fecha: 2026-03-06
-- Problema: Los votos se guardan en votos_candidato y votos_lista DESPUÉS de crear el acta,
-- por lo que el trigger en actas_e14 no detecta estos cambios.
-- Solución: Crear triggers adicionales en las tablas de votos.

-- ============================================
-- FUNCIÓN: ACTUALIZAR CONSOLIDADOS DESDE VOTOS
-- ============================================

CREATE OR REPLACE FUNCTION trigger_actualizar_votos_desde_votos()
RETURNS TRIGGER AS $$
DECLARE
    v_acta_id UUID;
    v_municipio_id UUID;
BEGIN
    -- Determinar el acta_id según la operación
    IF TG_OP = 'DELETE' THEN
        v_acta_id := OLD.acta_id;
    ELSE
        v_acta_id := NEW.acta_id;
    END IF;

    -- Verificar que tenemos un acta_id válido
    IF v_acta_id IS NULL THEN
        RAISE NOTICE 'trigger_actualizar_votos_desde_votos: acta_id es NULL';
        RETURN COALESCE(NEW, OLD);
    END IF;

    -- Obtener municipio desde el acta
    SELECT pv.municipio_id INTO v_municipio_id
    FROM actas_e14 a
    JOIN mesas m ON m.id = a.mesa_id
    JOIN puestos_votacion pv ON pv.id = m.puesto_id
    WHERE a.id = v_acta_id;

    RAISE NOTICE 'trigger_actualizar_votos_desde_votos: acta_id=%, municipio_id=%', v_acta_id, v_municipio_id;

    IF v_municipio_id IS NOT NULL THEN
        RAISE NOTICE 'Recalculando votos para municipio: %', v_municipio_id;
        PERFORM recalcular_votos_candidato_municipio(v_municipio_id);
        PERFORM recalcular_votos_lista_municipio(v_municipio_id);
    ELSE
        RAISE WARNING 'No se encontró municipio para acta_id: %', v_acta_id;
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGER: EN VOTOS_CANDIDATO
-- ============================================

-- Eliminar trigger existente si existe
DROP TRIGGER IF EXISTS trigger_actualizar_votos_candidato ON votos_candidato;

-- Crear trigger nuevo
CREATE TRIGGER trigger_actualizar_votos_candidato
    AFTER INSERT OR UPDATE OR DELETE ON votos_candidato
    FOR EACH ROW EXECUTE FUNCTION trigger_actualizar_votos_desde_votos();

-- ============================================
-- TRIGGER: EN VOTOS_LISTA
-- ============================================

-- Eliminar trigger existente si existe
DROP TRIGGER IF EXISTS trigger_actualizar_votos_lista ON votos_lista;

-- Crear trigger nuevo
CREATE TRIGGER trigger_actualizar_votos_lista
    AFTER INSERT OR UPDATE OR DELETE ON votos_lista
    FOR EACH ROW EXECUTE FUNCTION trigger_actualizar_votos_desde_votos();

-- ============================================
-- VERIFICAR TRIGGERS CREADOS
-- ============================================

DO $$
BEGIN
    RAISE NOTICE 'Triggers creados correctamente:';
    RAISE NOTICE '- trigger_actualizar_votos_candidato en votos_candidato';
    RAISE NOTICE '- trigger_actualizar_votos_lista en votos_lista';
END $$;
