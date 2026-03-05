-- Migración: Corrección del trigger handle_new_user
-- Fecha: 2026-03-04
-- Problema: El cast directo (NEW.raw_user_meta_data->>'role')::role_enum fallaba
--          cuando el rol no era válido o el metadata no existía

-- Función corregida para crear perfil automáticamente al crear usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_role role_enum;
    v_role_text TEXT;
BEGIN
    -- Obtener el rol del metadata, default 'testigo' si no existe
    v_role_text := NEW.raw_user_meta_data->>'role';

    -- Validar que el rol sea válido, si no, usar 'testigo'
    IF v_role_text IS NULL OR v_role_text NOT IN ('maestro', 'revisor', 'coordinador_municipal', 'coordinador_puesto', 'testigo') THEN
        v_role := 'testigo';
    ELSE
        v_role := v_role_text::role_enum;
    END IF;

    INSERT INTO public.profiles (id, email, full_name, role, activo)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        v_role,
        true
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- El trigger ya existe, no necesita recrearse
-- CREATE TRIGGER on_auth_user_created
--     AFTER INSERT ON auth.users
--     FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
