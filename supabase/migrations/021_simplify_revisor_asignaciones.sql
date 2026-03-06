-- Remover municipio_id de revisor_asignaciones ya que el puesto ya tiene esa relación
ALTER TABLE revisor_asignaciones DROP CONSTRAINT IF EXISTS unq_revisor_municipio_puesto;
ALTER TABLE revisor_asignaciones DROP COLUMN IF EXISTS municipio_id;

-- Asegurarnos de que no se pueda asignar el mismo revisor al mismo puesto multiples veces
ALTER TABLE revisor_asignaciones ADD CONSTRAINT unq_revisor_puesto UNIQUE (revisor_id, puesto_id);
