-- 020_create_afluencia_votantes.sql
-- Tabla para registrar la cantidad de votantes en horas de corte específicas (10am, 1pm, 3pm)

CREATE TABLE IF NOT EXISTS afluencia_votantes (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  mesa_id        uuid        NOT NULL REFERENCES mesas(id) ON DELETE CASCADE,
  hora_corte     varchar(10) NOT NULL, -- Ej: '10:00', '13:00', '15:00'
  cantidad       integer     NOT NULL CHECK (cantidad >= 0),
  registrado_por uuid        NOT NULL REFERENCES profiles(id),
  creado_en      timestamptz NOT NULL DEFAULT now(),

  -- Solo puede haber un registro por mesa y por hora de corte
  UNIQUE (mesa_id, hora_corte)
);

-- Índices para búsquedas rápidas por mesa
CREATE INDEX IF NOT EXISTS idx_afluencia_votantes_mesa_id
  ON afluencia_votantes (mesa_id);

-- -----------------------------------------------
-- Row Level Security
-- -----------------------------------------------
ALTER TABLE afluencia_votantes ENABLE ROW LEVEL SECURITY;

-- Asumimos la misma lógica que otras tablas operativas:
-- Testigos: insertar para las mesas que tienen asignadas
CREATE POLICY "testigos_insert_afluencia" ON afluencia_votantes
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM testigo_mesas tm
      WHERE tm.mesa_id = afluencia_votantes.mesa_id
        AND tm.testigo_id = auth.uid()
    )
  );

-- Testigos: Ver afluencia de las mesas a las que están asignados
CREATE POLICY "testigos_select_afluencia" ON afluencia_votantes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM testigo_mesas tm
      WHERE tm.mesa_id = afluencia_votantes.mesa_id
        AND tm.testigo_id = auth.uid()
    )
  );

-- Testigos: Actualizar la afluencia que ellos mismos registraron (en caso de error durante la hora abierta)
CREATE POLICY "testigos_update_afluencia" ON afluencia_votantes
  FOR UPDATE
  USING (
    registrado_por = auth.uid() AND
    EXISTS (
      SELECT 1 FROM testigo_mesas tm
      WHERE tm.mesa_id = afluencia_votantes.mesa_id
        AND tm.testigo_id = auth.uid()
    )
  );

-- Admins y revisores: Ver toda la afluencia
CREATE POLICY "admin_revisor_select_afluencia" ON afluencia_votantes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'revisor')
    )
  );
