-- Migración: Agregar campo total_votos_mesa a actas_e14
-- Este campo representa el total de votos que la persona ingresa manualmente
-- y debe coincidir con la suma de todos los votos (candidatos + blancos + nulos + no marcadas)

-- Agregar la columna a la tabla
ALTER TABLE actas_e14
ADD COLUMN IF NOT EXISTS total_votos_mesa INTEGER DEFAULT 0;

-- Comentario explicativo
COMMENT ON COLUMN actas_e14.total_votos_mesa IS 'Total de votos ingresado manualmente por el testigo, debe coincidir con la suma de todos los votos';
