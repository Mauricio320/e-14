-- Fix RLS policy for revisor_asignaciones
-- Allow users to read their own assignments

DROP POLICY IF EXISTS "revisor_asignaciones_select_maestro" ON revisor_asignaciones;

CREATE POLICY "revisor_asignaciones_select_own" ON revisor_asignaciones FOR SELECT USING (
    revisor_id = auth.uid() OR
    public.get_my_role() = 'maestro'
);
