-- Migración: Agregar campo observaciones_revisor al acta E-14
-- Fecha: 05 de Marzo 2026

-- ============================================
-- AGREGAR COLUMNA OBSERVACIONES_REVISOR
-- ============================================

ALTER TABLE actas_e14
ADD COLUMN IF NOT EXISTS observaciones_revisor TEXT;

-- ============================================
-- COMENTARIO
-- ============================================

COMMENT ON COLUMN actas_e14.observaciones_revisor IS 'Observaciones opcionales del revisor al momento de verificar el acta';
