-- Migración: Partidos y Candidatos para Cámara de Representantes 2026
-- Departamento: Casanare
-- Fecha: 05 de Marzo 2026

-- ============================================
-- LIMPIAR DATOS EXISTENTES
-- ============================================

DELETE FROM votos_candidato;
DELETE FROM candidatos;
DELETE FROM partidos;

-- ============================================
-- INSERTAR PARTIDOS CON COLORES
-- ============================================

INSERT INTO partidos (nombre, codigo, color_hex, activo) VALUES
    ('PARTIDO VERDE-ALIANZA POR CASANARE', 'PV-ALCAS', '#86efac', true),
    ('ALMA CASANARE', 'ALMA', '#93c5fd', true),
    ('COALICIÓN FUERZA CIUDADANA', 'FUERZA', '#fdba74', true),
    ('PACTO HISTÓRICO CASANARE', 'PACTO', '#fca5a5', true),
    ('CAMBIO RADICAL', 'CR', '#67e8f9', true),
    ('CENTRO DEMOCRÁTICO', 'CD', '#c4b5fd', true),
    ('PARTIDO DEL TRABAJO DE COLOMBIA', 'PTC', '#fde047', true),
    ('PARTIDO MIRA', 'MIRA', '#fdb4c1', true);

-- ============================================
-- INSERTAR CANDIDATOS
-- ============================================

-- PARTIDO VERDE-ALIANZA POR CASANARE
INSERT INTO candidatos (partido_id, nombre, numero_lista, es_partido, activo)
SELECT
    p.id,
    c.nombre,
    c.numero_lista,
    c.es_partido,
    true
FROM partidos p
CROSS JOIN (VALUES
    ('Diego García Alfonso', 101, false),
    ('Diana Rincón Leguizamón', 102, false),
    ('Daimer Cordero Escobar', 103, false),
    ('Total votos por la lista', NULL, true)
) AS c(nombre, numero_lista, es_partido)
WHERE p.codigo = 'PV-ALCAS';

-- ALMA CASANARE (Sin candidatos individuales - solo voto al partido)
INSERT INTO candidatos (partido_id, nombre, numero_lista, es_partido, activo)
SELECT
    p.id,
    'Voto al Partido/Movimiento',
    NULL,
    true,
    true
FROM partidos p
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
    ('Virginia Calderón Landínez', 101, false),
    ('Cristhian Silva Solano', 102, false),
    ('Juan Rosas Salamanaca', 103, false),
    ('Total votos por la lista', NULL, true)
) AS c(nombre, numero_lista, es_partido)
WHERE p.codigo = 'FUERZA';

-- PACTO HISTÓRICO CASANARE (Sin candidatos individuales - solo voto al partido)
INSERT INTO candidatos (partido_id, nombre, numero_lista, es_partido, activo)
SELECT
    p.id,
    'Voto al Partido/Movimiento',
    NULL,
    true,
    true
FROM partidos p
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
    ('Amanda Rocío González Rodríguez', 101, false),
    ('Héctor Vacca Bohórquez', 102, false),
    ('Ingrid Sánchez Saravia', 103, false),
    ('Total votos por la lista', NULL, true)
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
    ('Arledy Alvarado Patiño', 101, false),
    ('Wilmer Garcés Juez', 102, false),
    ('Álvaro Mariño Álvarez', 103, false),
    ('Total votos por la lista', NULL, true)
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
    ('Alciber Pinillos Atuesta', 101, false),
    ('Lina Patricia Vega Orduz', 102, false),
    ('Gilberto Vargas Laverde', 103, false),
    ('Total votos por la lista', NULL, true)
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
    ('Luz Estella Parra Franco', 102, false),
    ('Total votos por la lista', NULL, true)
) AS c(nombre, numero_lista, es_partido)
WHERE p.codigo = 'MIRA';
