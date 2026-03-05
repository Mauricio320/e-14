-- Migración: Corregir trigger de updated_at para actas_e14
-- Fecha: 2026-03-04
--
-- Problema: El trigger usa 'updated_at' pero el campo se llama 'actualizado_en'

-- Eliminar el trigger existente
DROP TRIGGER IF EXISTS update_actas_e14_updated_at ON actas_e14;

-- Crear función corregida
CREATE OR REPLACE FUNCTION update_actualizado_en_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger corregido
CREATE TRIGGER update_actas_e14_actualizado_en
    BEFORE UPDATE ON actas_e14
    FOR EACH ROW EXECUTE FUNCTION update_actualizado_en_column();
