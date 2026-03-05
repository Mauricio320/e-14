-- Migración: Agregar columna url_publica a fotos_acta
-- Fecha: 2026-03-04
--
-- Guarda la URL pública completa para cargar más rápido

-- Agregar columna url_publica
ALTER TABLE fotos_acta ADD COLUMN IF NOT EXISTS url_publica TEXT;

-- Crear índice para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_fotos_url ON fotos_acta(url_publica);
