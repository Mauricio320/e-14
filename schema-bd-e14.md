## Resumen del sistema

Sistema de registro y seguimiento de actas E-14 para votaciones en el departamento de Casanare. Permite a testigos registrar resultados por mesa, sede y municipio, con verificación por revisores y dashboard en tiempo real.

---

## Tablas

### `municipios`
Catálogo de municipios de Casanare.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid (PK) | Identificador único |
| `nombre` | varchar | Nombre del municipio |
| `codigo_dane` | varchar (UNIQUE) | Código DANE oficial |
| `created_at` | timestamptz | Fecha de creación |

---

### `puestos_votacion`
Sedes o puestos de votación dentro de cada municipio.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid (PK) | Identificador único |
| `municipio_id` | uuid (FK → municipios) | Municipio al que pertenece |
| `nombre` | varchar | Nombre del puesto |
| `direccion` | text | Dirección física |
| `zona` | zona_enum | `urbana` o `rural` (default: `urbana`) |
| `created_at` | timestamptz | Fecha de creación |

---

### `mesas`
Mesas de votación dentro de cada puesto.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid (PK) | Identificador único |
| `puesto_id` | uuid (FK → puestos_votacion) | Puesto al que pertenece |
| `numero_mesa` | integer | Número de mesa |
| `potencial_electoral` | integer | Votantes habilitados (default: 0) |
| `created_at` | timestamptz | Fecha de creación |

---

### `profiles`
Usuarios del sistema, extendidos desde `auth.users` de Supabase.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid (PK, FK → auth.users) | Mismo ID que auth de Supabase |
| `email` | varchar | Correo electrónico |
| `full_name` | varchar | Nombre completo |
| `role` | role_enum | Rol: `testigo`, `revisor`, `admin` (default: `testigo`) |
| `municipio_id` | uuid (FK → municipios) | Municipio asignado (opcional) |
| `puesto_id` | uuid (FK → puestos_votacion) | Puesto asignado (opcional) |
| `activo` | boolean | Estado del usuario (default: true) |
| `created_at` | timestamptz | Fecha de creación |
| `updated_at` | timestamptz | Última actualización |

---

### `partidos`
Partidos políticos o movimientos participantes.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid (PK) | Identificador único |
| `nombre` | varchar | Nombre del partido |
| `codigo` | varchar (UNIQUE) | Código corto |
| `color_hex` | varchar | Color para UI (default: `#000000`) |
| `activo` | boolean | Activo/inactivo (default: true) |
| `created_at` | timestamptz | Fecha de creación |

---

### `candidatos`
Candidatos o listas asociadas a un partido.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid (PK) | Identificador único |
| `partido_id` | uuid (FK → partidos) | Partido al que pertenece |
| `nombre` | varchar | Nombre del candidato o lista |
| `numero_lista` | integer | Número en tarjetón (opcional) |
| `es_partido` | boolean | Si el voto es al partido (no candidato) |
| `activo` | boolean | Activo/inactivo (default: true) |
| `created_at` | timestamptz | Fecha de creación |

---

### `actas_e14`
Acta principal de resultados por mesa. Núcleo del sistema.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid (PK) | Identificador único |
| `mesa_id` | uuid (FK → mesas) | Mesa a la que corresponde el acta |
| `registrado_por` | uuid (FK → profiles) | Testigo que registró el acta |
| `version` | integer | Versión del acta (default: 1) |
| `estado` | estado_enum | `borrador`, `enviado`, `verificado` (default: `borrador`) |
| `total_votos_urna` | integer | Total de votos en urna |
| `total_votos_incinerados` | integer | Votos incinerados |
| `votos_en_blanco` | integer | Votos en blanco |
| `votos_nulos` | integer | Votos nulos |
| `tarjetas_no_marcadas` | integer | Tarjetas no marcadas |
| `total_votos_validos` | integer | Total de votos válidos |
| `total_sufragantes` | integer | Total de sufragantes |
| `observaciones` | text | Notas adicionales |
| `creado_en` | timestamptz | Fecha de creación |
| `actualizado_en` | timestamptz | Última modificación |
| `enviado_en` | timestamptz | Fecha de envío (cuando estado = enviado) |
| `verificado_por` | uuid (FK → profiles) | Revisor que verificó |
| `verificado_en` | timestamptz | Fecha de verificación |

---

### `votos_candidato`
Detalle de votos por candidato dentro de un acta.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid (PK) | Identificador único |
| `acta_id` | uuid (FK → actas_e14) | Acta a la que pertenece |
| `candidato_id` | uuid (FK → candidatos) | Candidato votado |
| `votos` | integer | Cantidad de votos (default: 0) |

---

### `fotos_acta`
Imágenes o PDFs del acta física subidos a Supabase Storage.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid (PK) | Identificador único |
| `acta_id` | uuid (FK → actas_e14) | Acta asociada |
| `storage_path` | text | Ruta en Supabase Storage |
| `nombre_archivo` | varchar | Nombre original del archivo |
| `tamanio_bytes` | integer | Tamaño del archivo |
| `subido_por` | uuid (FK → profiles) | Usuario que subió el archivo |
| `subido_en` | timestamptz | Fecha de subida |

---

### `testigo_mesas`
Asignación de testigos a mesas específicas.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid (PK) | Identificador único |
| `testigo_id` | uuid (FK → profiles) | Testigo asignado |
| `mesa_id` | uuid (FK → mesas) | Mesa asignada |
| `asignado_por` | uuid (FK → profiles) | Admin que realizó la asignación |
| `asignado_en` | timestamptz | Fecha de asignación |

---

### `revisor_asignaciones`
Asignación de revisores a municipios o puestos.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid (PK) | Identificador único |
| `revisor_id` | uuid (FK → profiles) | Revisor asignado |
| `municipio_id` | uuid (FK → municipios) | Municipio asignado (opcional) |
| `puesto_id` | uuid (FK → puestos_votacion) | Puesto asignado (opcional) |
| `asignado_por` | uuid (FK → profiles) | Admin que asignó |
| `asignado_en` | timestamptz | Fecha de asignación |
| `activo` | boolean | Si la asignación está vigente |

---

### `auditoria_cambios`
Log de auditoría de todas las acciones sobre la base de datos.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid (PK) | Identificador único |
| `tabla_afectada` | varchar | Nombre de la tabla modificada |
| `registro_id` | uuid | ID del registro afectado |
| `accion` | varchar | Tipo de acción: INSERT, UPDATE, DELETE |
| `datos_anteriores` | jsonb | Estado previo del registro |
| `datos_nuevos` | jsonb | Estado nuevo del registro |
| `ejecutado_por` | uuid (FK → auth.users) | Usuario que ejecutó la acción |
| `ejecutado_en` | timestamptz | Fecha y hora de la acción |
| `ip_address` | inet | IP del cliente |

---

## Tipos enumerados (ENUMs)

| Enum | Valores |
|---|---|
| `estado_enum` | `borrador`, `enviado`, `verificado` |
| `role_enum` | `testigo`, `revisor`, `admin` |
| `zona_enum` | `urbana`, `rural` |

---

## Relaciones clave