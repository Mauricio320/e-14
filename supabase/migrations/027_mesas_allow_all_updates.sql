-- Permitir que cualquier usuario autenticado pueda actualizar mesas
-- Esto es necesario para la funcionalidad de "Confirmar Testigo" y otras operaciones

-- Eliminar la política específica de coordinador de puesto si existe
DROP POLICY IF EXISTS "mesas_update_coordinador_puesto" ON mesas;

-- Crear política permisiva para actualizaciones
CREATE POLICY "mesas_update_all" ON mesas FOR UPDATE USING (
    auth.role() = 'authenticated'
);

-- También permitir inserciones para usuarios autenticados
DROP POLICY IF EXISTS "mesas_insert_maestro" ON mesas;
CREATE POLICY "mesas_insert_all" ON mesas FOR INSERT WITH CHECK (
    auth.role() = 'authenticated'
);

COMMENT ON POLICY "mesas_update_all" ON mesas IS 'Permite a cualquier usuario autenticado actualizar mesas';
COMMENT ON POLICY "mesas_insert_all" ON mesas IS 'Permite a cualquier usuario autenticado insertar mesas';
