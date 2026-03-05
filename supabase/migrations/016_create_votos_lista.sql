-- Migración: Crear tabla votos_lista para almacenar votos por partido/lista
-- Fecha: 05 de Marzo 2026

-- ============================================
-- CREAR TABLA VOTOS_LISTA
-- ============================================

CREATE TABLE IF NOT EXISTS votos_lista (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    acta_id UUID NOT NULL REFERENCES actas_e14(id) ON DELETE CASCADE,
    partido_id UUID NOT NULL REFERENCES partidos(id) ON DELETE CASCADE,
    votos INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Un partido solo puede tener un registro de votos por acta
    UNIQUE(acta_id, partido_id)
);

-- ============================================
-- ÍNDICES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_votos_lista_acta_id ON votos_lista(acta_id);
CREATE INDEX IF NOT EXISTS idx_votos_lista_partido_id ON votos_lista(partido_id);

-- ============================================
-- TRIGGER PARA ACTUALIZAR updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_votos_lista_updated_at
    BEFORE UPDATE ON votos_lista
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RLS (ROW LEVEL SECURITY)
-- ============================================

ALTER TABLE votos_lista ENABLE ROW LEVEL SECURITY;

-- Política para lectura: cualquier usuario autenticado puede leer
CREATE POLICY "votos_lista_select_policy" ON votos_lista
    FOR SELECT
    TO authenticated
    USING (true);

-- Política para inserción: solo testigos y coordinadores pueden insertar
CREATE POLICY "votos_lista_insert_policy" ON votos_lista
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role IN ('testigo', 'coordinador_puesto', 'coordinador_municipal', 'maestro')
        )
    );

-- Política para actualización: solo testigos y coordinadores pueden actualizar
CREATE POLICY "votos_lista_update_policy" ON votos_lista
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role IN ('testigo', 'coordinador_puesto', 'coordinador_municipal', 'maestro')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role IN ('testigo', 'coordinador_puesto', 'coordinador_municipal', 'maestro')
        )
    );

-- Política para eliminación: solo maestros pueden eliminar
CREATE POLICY "votos_lista_delete_policy" ON votos_lista
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'maestro'
        )
    );

-- ============================================
-- COMENTARIOS
-- ============================================

COMMENT ON TABLE votos_lista IS 'Almacena los votos totales por lista/partido para cada acta E-14';
COMMENT ON COLUMN votos_lista.acta_id IS 'Referencia al acta E-14';
COMMENT ON COLUMN votos_lista.partido_id IS 'Referencia al partido político';
COMMENT ON COLUMN votos_lista.votos IS 'Cantidad de votos que recibió la lista';
