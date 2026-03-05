-- 019_create_alertas_acta.sql
-- Tabla de alertas detectadas en el acta E-14
-- Las alertas se detectan en el cliente y se persisten al guardar el acta.
-- La descripcion incluye todo el contexto necesario (partido, valores, etc.)

CREATE TABLE IF NOT EXISTS alertas_acta (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  acta_id     uuid        NOT NULL REFERENCES actas_e14(id) ON DELETE CASCADE,
  codigo      varchar(80) NOT NULL,   -- identificador de tipo, e.g. 'LISTA_DISCREPANCIA__<partido_id>'
  descripcion text        NOT NULL,   -- texto completo, e.g. '[PARTIDO VERDE] Total votos por lista (20) ≠ suma candidatos (15)'
  creado_en   timestamptz NOT NULL DEFAULT now(),

  -- Un tipo de alerta único por acta (el codigo incluye el partido si aplica)
  UNIQUE (acta_id, codigo)
);

-- Índice para consultas por acta
CREATE INDEX IF NOT EXISTS idx_alertas_acta_acta_id
  ON alertas_acta (acta_id);

-- -----------------------------------------------
-- Row Level Security
-- -----------------------------------------------
ALTER TABLE alertas_acta ENABLE ROW LEVEL SECURITY;

-- Testigos: insertar y leer alertas de sus propias actas
CREATE POLICY "testigos_insert_alertas" ON alertas_acta
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM actas_e14 a
      WHERE a.id = alertas_acta.acta_id
        AND a.registrado_por = auth.uid()
    )
  );

CREATE POLICY "testigos_select_alertas" ON alertas_acta
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM actas_e14 a
      WHERE a.id = alertas_acta.acta_id
        AND a.registrado_por = auth.uid()
    )
  );

-- Testigos: pueden eliminar alertas de sus propias actas (para resolver alertas)
CREATE POLICY "testigos_delete_alertas" ON alertas_acta
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM actas_e14 a
      WHERE a.id = alertas_acta.acta_id
        AND a.registrado_por = auth.uid()
    )
  );

-- Admins y revisores: lectura total
CREATE POLICY "admin_revisor_select_alertas" ON alertas_acta
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'revisor')
    )
  );
