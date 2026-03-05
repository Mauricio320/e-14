-- Migración: Agregar campo total_votos_lista al acta E-14
-- Fecha: 05 de Marzo 2026

-- ============================================
-- AGREGAR COLUMNA TOTAL_VOTOS_LISTA
-- ============================================

ALTER TABLE actas_e14
ADD COLUMN IF NOT EXISTS total_votos_lista INTEGER DEFAULT 0;

-- ============================================
-- COMENTARIO
-- ============================================

COMMENT ON COLUMN actas_e14.total_votos_lista IS 'Suma total de votos por lista de todos los partidos';
