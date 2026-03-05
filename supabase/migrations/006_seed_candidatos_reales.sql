-- Migración: Candidatos reales para Cámara de Representantes 2026
-- Departamento: Casanare
-- Fecha: 04 de Marzo 2026

-- ============================================
-- LIMPIAR CANDIDATOS EXISTENTES
-- ============================================

DELETE FROM candidatos;

-- ============================================
-- CANDIDATOS POR PARTIDO
-- ============================================

-- ALIANZA POR CASANARE (Código: ALCAS)
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
    ('Voto al Partido/Movimiento', NULL, true)
) AS c(nombre, numero_lista, es_partido)
WHERE p.codigo = 'ALCAS';

-- ALMA CASANARE (Código: ALMA)
INSERT INTO candidatos (partido_id, nombre, numero_lista, es_partido, activo)
SELECT
    p.id,
    c.nombre,
    c.numero_lista,
    c.es_partido,
    true
FROM partidos p
CROSS JOIN (VALUES
    ('Liliana Torres Torres', 101, false),
    ('Pedro Torres Ibarra', 102, false),
    ('Melquisedec Tejada Jiménez', 103, false),
    ('Voto al Partido/Movimiento', NULL, true)
) AS c(nombre, numero_lista, es_partido)
WHERE p.codigo = 'ALMA';

-- COALICIÓN FUERZA CIUDADANA (Código: FUERZA)
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
    ('Voto al Partido/Movimiento', NULL, true)
) AS c(nombre, numero_lista, es_partido)
WHERE p.codigo = 'FUERZA';

-- PACTO HISTÓRICO CASANARE (Código: PACTO)
INSERT INTO candidatos (partido_id, nombre, numero_lista, es_partido, activo)
SELECT
    p.id,
    c.nombre,
    c.numero_lista,
    c.es_partido,
    true
FROM partidos p
CROSS JOIN (VALUES
    ('Elfar Danilo Leal Galindo', 101, false),
    ('Luz Suescún Galvis', 102, false),
    ('Voto al Partido/Movimiento', NULL, true)
) AS c(nombre, numero_lista, es_partido)
WHERE p.codigo = 'PACTO';

-- CAMBIO RADICAL (Código: CR)
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
    ('Voto al Partido/Movimiento', NULL, true)
) AS c(nombre, numero_lista, es_partido)
WHERE p.codigo = 'CR';

-- CENTRO DEMOCRÁTICO (Código: CD)
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
    ('Voto al Partido/Movimiento', NULL, true)
) AS c(nombre, numero_lista, es_partido)
WHERE p.codigo = 'CD';

-- PARTIDO DEL TRABAJO DE COLOMBIA (Código: PTC)
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
    ('Voto al Partido/Movimiento', NULL, true)
) AS c(nombre, numero_lista, es_partido)
WHERE p.codigo = 'PTC';

-- PARTIDO MIRA (Código: MIRA)
INSERT INTO candidatos (partido_id, nombre, numero_lista, es_partido, activo)
SELECT
    p.id,
    c.nombre,
    c.numero_lista,
    c.es_partido,
    true
FROM partidos p
CROSS JOIN (VALUES
    ('Luz Estella Parra Franco', 101, false),
    ('Voto al Partido/Movimiento', NULL, true)
) AS c(nombre, numero_lista, es_partido)
WHERE p.codigo = 'MIRA';
