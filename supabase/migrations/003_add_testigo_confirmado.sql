-- Agregar columna testigo_confirmado a la tabla mesas
ALTER TABLE mesas
ADD COLUMN testigo_confirmado BOOLEAN DEFAULT FALSE;

-- Agregar columna para registrar quién confirmó y cuándo
ALTER TABLE mesas
ADD COLUMN testigo_confirmado_por UUID REFERENCES profiles(id);

ALTER TABLE mesas
ADD COLUMN testigo_confirmado_en TIMESTAMP WITH TIME ZONE;

-- Comentarios para documentación
COMMENT ON COLUMN mesas.testigo_confirmado IS 'Indica si el coordinador de puesto ha confirmado la presencia del testigo en la mesa';
COMMENT ON COLUMN mesas.testigo_confirmado_por IS 'ID del usuario que confirmó la presencia del testigo';
COMMENT ON COLUMN mesas.testigo_confirmado_en IS 'Fecha y hora de la confirmación';