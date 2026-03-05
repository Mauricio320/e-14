-- Migración: Agregar campos de observaciones al acta E-14
-- Fecha: 05 de Marzo 2026

-- ============================================
-- AGREGAR COLUMNAS A LA TABLA ACTAS_E14
-- ============================================

ALTER TABLE actas_e14
ADD COLUMN IF NOT EXISTS tiene_tachaduras BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS hubo_reconteo BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS hubo_reclamacion BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS tipo_reclamacion VARCHAR(100);

-- ============================================
-- COMENTARIOS
-- ============================================

COMMENT ON COLUMN actas_e14.tiene_tachaduras IS 'Indica si el acta tiene tachaduras o enmendaduras';
COMMENT ON COLUMN actas_e14.hubo_reconteo IS 'Indica si hubo reconteo de votos en la mesa';
COMMENT ON COLUMN actas_e14.hubo_reclamacion IS 'Indica si se presentó reclamación en la mesa';
COMMENT ON COLUMN actas_e14.tipo_reclamacion IS 'Tipo de reclamación presentada (solo si hubo_reclamacion es true)';
