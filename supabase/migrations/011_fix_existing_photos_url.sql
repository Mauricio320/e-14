-- Fix existing photos with null url_publica
-- This updates all photos that don't have a public URL yet

UPDATE fotos_acta
SET url_publica = 'https://lzlfjbsdczjriywspzjf.supabase.co/storage/v1/object/public/actas-e14/' || storage_path
WHERE url_publica IS NULL;
