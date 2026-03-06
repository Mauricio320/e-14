-- Agregar política para que coordinadores de puesto puedan actualizar mesas de su puesto
-- Esto es necesario para la funcionalidad de "Confirmar Testigo"

CREATE POLICY "mesas_update_coordinador_puesto" ON mesas FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND role = 'coordinador_puesto'
        AND puesto_id = mesas.puesto_id
    )
);

COMMENT ON POLICY "mesas_update_coordinador_puesto" ON mesas IS 'Permite a los coordinadores de puesto actualizar las mesas de su puesto asignado';
