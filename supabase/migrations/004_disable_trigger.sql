-- Migración: Desactivar trigger automático de creación de perfiles
-- Fecha: 2026-03-04
--
-- Nota: Esta migración es opcional. El código de la API ahora crea explícitamente
-- el perfil después de crear el usuario auth, por lo que el trigger puede causar
-- conflictos si intenta crear un perfil duplicado.
--
-- Opción A: Desactivar completamente el trigger (recomendado)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Opción B: Alternativamente, se puede modificar el trigger para que no falle
-- si el perfil ya existe (como respaldo). Si prefieres esta opción, comenta
-- la línea de DROP TRIGGER y descomenta el bloque siguiente:

/*
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Intentar insertar solo si el perfil no existe
    INSERT INTO public.profiles (id, email, full_name, role, activo)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'role',
        true
    )
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
*/

-- Nota: Si más adelante necesitas recrear el trigger original, usa:
/*
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
*/
