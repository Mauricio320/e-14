-- Migración: Agregar campo total_volantes_e11 a actas_e14
-- Este campo representa el total de volantes del formulario E-11
-- según el formato oficial del formulario E-14

-- Agregar la columna a la tabla
ALTER TABLE actas_e14
ADD COLUMN IF NOT EXISTS total_volantes_e11 INTEGER DEFAULT 0;

-- Comentario explicativo
COMMENT ON COLUMN actas_e14.total_volantes_e11 IS 'Total de volantes del formulario E-11 según formato oficial E-14';
