-- Seed data: Partidos y Candidatos para Elecciones Cámara de Representantes 2026
-- Departamento: Casanare
-- Fecha: 08 de Marzo 2026

-- ============================================
-- PARTIDOS POLÍTICOS
-- ============================================

INSERT INTO partidos (nombre, codigo, color_hex, activo) VALUES
    ('ALIANZA POR CASANARE', 'ALCAS', '#1E40AF', true),
    ('ALMA CASANARE', 'ALMA', '#DC2626', true),
    ('COALICIÓN FUERZA CIUDADANA', 'FUERZA', '#059669', true),
    ('PACTO HISTÓRICO CASANARE', 'PACTO', '#7C3AED', true),
    ('CAMBIO RADICAL', 'CR', '#2563EB', true),
    ('CENTRO DEMOCRÁTICO', 'CD', '#1D4ED8', true),
    ('PARTIDO DEL TRABAJO DE COLOMBIA', 'PTC', '#DC2626', true),
    ('PARTIDO MIRA', 'MIRA', '#F59E0B', true);

-- ============================================
-- CANDIDATOS POR PARTIDO
-- ============================================

-- Nota: Los candidatos son representativos según la especificación
-- En una implementación real, se actualizarían con la lista definitiva de la Registraduría

-- ALIANZA POR CASANARE
INSERT INTO candidatos (partido_id, nombre, numero_lista, es_partido, activo)
SELECT
    p.id,
    c.nombre,
    c.numero_lista,
    c.es_partido,
    true
FROM partidos p
CROSS JOIN (VALUES
    ('Candidato Lista 1 - Alianza Casanare', 1, false),
    ('Candidato Lista 2 - Alianza Casanare', 2, false),
    ('Voto al Partido', NULL, true)
) AS c(nombre, numero_lista, es_partido)
WHERE p.codigo = 'ALCAS';

-- ALMA CASANARE
INSERT INTO candidatos (partido_id, nombre, numero_lista, es_partido, activo)
SELECT
    p.id,
    c.nombre,
    c.numero_lista,
    c.es_partido,
    true
FROM partidos p
CROSS JOIN (VALUES
    ('Candidato Lista 1 - Alma Casanare', 1, false),
    ('Candidato Lista 2 - Alma Casanare', 2, false),
    ('Voto al Partido', NULL, true)
) AS c(nombre, numero_lista, es_partido)
WHERE p.codigo = 'ALMA';

-- COALICIÓN FUERZA CIUDADANA
INSERT INTO candidatos (partido_id, nombre, numero_lista, es_partido, activo)
SELECT
    p.id,
    c.nombre,
    c.numero_lista,
    c.es_partido,
    true
FROM partidos p
CROSS JOIN (VALUES
    ('Candidato Lista 1 - Fuerza Ciudadana', 1, false),
    ('Candidato Lista 2 - Fuerza Ciudadana', 2, false),
    ('Voto al Partido', NULL, true)
) AS c(nombre, numero_lista, es_partido)
WHERE p.codigo = 'FUERZA';

-- PACTO HISTÓRICO CASANARE
INSERT INTO candidatos (partido_id, nombre, numero_lista, es_partido, activo)
SELECT
    p.id,
    c.nombre,
    c.numero_lista,
    c.es_partido,
    true
FROM partidos p
CROSS JOIN (VALUES
    ('Candidato Lista 1 - Pacto Histórico', 1, false),
    ('Candidato Lista 2 - Pacto Histórico', 2, false),
    ('Voto al Partido', NULL, true)
) AS c(nombre, numero_lista, es_partido)
WHERE p.codigo = 'PACTO';

-- CAMBIO RADICAL
INSERT INTO candidatos (partido_id, nombre, numero_lista, es_partido, activo)
SELECT
    p.id,
    c.nombre,
    c.numero_lista,
    c.es_partido,
    true
FROM partidos p
CROSS JOIN (VALUES
    ('Candidato Lista 1 - Cambio Radical', 1, false),
    ('Candidato Lista 2 - Cambio Radical', 2, false),
    ('Voto al Partido', NULL, true)
) AS c(nombre, numero_lista, es_partido)
WHERE p.codigo = 'CR';

-- CENTRO DEMOCRÁTICO
INSERT INTO candidatos (partido_id, nombre, numero_lista, es_partido, activo)
SELECT
    p.id,
    c.nombre,
    c.numero_lista,
    c.es_partido,
    true
FROM partidos p
CROSS JOIN (VALUES
    ('Candidato Lista 1 - Centro Democrático', 1, false),
    ('Candidato Lista 2 - Centro Democrático', 2, false),
    ('Voto al Partido', NULL, true)
) AS c(nombre, numero_lista, es_partido)
WHERE p.codigo = 'CD';

-- PARTIDO DEL TRABAJO DE COLOMBIA
INSERT INTO candidatos (partido_id, nombre, numero_lista, es_partido, activo)
SELECT
    p.id,
    c.nombre,
    c.numero_lista,
    c.es_partido,
    true
FROM partidos p
CROSS JOIN (VALUES
    ('Candidato Lista 1 - PTC', 1, false),
    ('Voto al Partido', NULL, true)
) AS c(nombre, numero_lista, es_partido)
WHERE p.codigo = 'PTC';

-- PARTIDO MIRA
INSERT INTO candidatos (partido_id, nombre, numero_lista, es_partido, activo)
SELECT
    p.id,
    c.nombre,
    c.numero_lista,
    c.es_partido,
    true
FROM partidos p
CROSS JOIN (VALUES
    ('Candidato Lista 1 - MIRA', 1, false),
    ('Voto al Partido', NULL, true)
) AS c(nombre, numero_lista, es_partido)
WHERE p.codigo = 'MIRA';

-- ============================================
-- MUNICIPIOS DE CASANARE (Códigos DANE)
-- ============================================

INSERT INTO municipios (nombre, codigo_dane) VALUES
    ('Yopal', '85001'),
    ('Aguazul', '85010'),
    ('Chámeza', '85015'),
    ('Hato Corozal', '85125'),
    ('La Salina', '85136'),
    ('Maní', '85139'),
    ('Monterrey', '85162'),
    ('Nunchía', '85225'),
    ('Orocué', '85230'),
    ('Paz de Ariporo', '85250'),
    ('Pore', '85263'),
    ('Recetor', '85279'),
    ('Sabanalarga', '85300'),
    ('Sácama', '85315'),
    ('San Luis de Palenque', '85325'),
    ('Támara', '85400'),
    ('Tauramena', '85410'),
    ('Trinidad', '85430'),
    ('Villanueva', '85440');

-- ============================================
-- USUARIO MAESTRO INICIAL (opcional)
-- Descomentar y modificar email si se desea crear automáticamente
-- ============================================

-- Nota: El usuario maestro debe crearse manualmente en el dashboard de Supabase
-- o mediante el signup inicial, luego actualizar su rol a 'maestro' con:
--
-- UPDATE profiles SET role = 'maestro' WHERE email = 'admin@ejemplo.com';

-- ============================================
-- NOTAS
-- ============================================

-- 1. Los candidatos incluyen tanto los candidatos individuales como la opción
--    de "Voto al Partido" que se registra en el E-14.
-- 2. Los municipios incluyen todos los del departamento de Casanare.
-- 3. Los puestos de votación y mesas deben crearse según la configuración
--    específica de cada elección.
-- 4. Los usuarios de prueba se recomienda crearlos manualmente vía dashboard.
