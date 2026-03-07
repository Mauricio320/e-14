## Resumen del sistema

Sistema de registro y seguimiento de actas E-14 para votaciones en el departamento de Casanare. Permite a testigos registrar resultados por mesa, sede y municipio, con verificación por revisores y dashboard en tiempo real.

---

## Tablas

### `municipios`

Catálogo de municipios de Casanare.

| Campo         | Tipo             | Descripción          |
| ------------- | ---------------- | -------------------- |
| `id`          | uuid (PK)        | Identificador único  |
| `nombre`      | varchar          | Nombre del municipio |
| `codigo_dane` | varchar (UNIQUE) | Código DANE oficial  |
| `created_at`  | timestamptz      | Fecha de creación    |

---

### `puestos_votacion`

Sedes o puestos de votación dentro de cada municipio.

| Campo          | Tipo                   | Descripción                            |
| -------------- | ---------------------- | -------------------------------------- |
| `id`           | uuid (PK)              | Identificador único                    |
| `municipio_id` | uuid (FK → municipios) | Municipio al que pertenece             |
| `nombre`       | varchar                | Nombre del puesto                      |
| `direccion`    | text                   | Dirección física                       |
| `zona`         | zona_enum              | `urbana` o `rural` (default: `urbana`) |
| `created_at`   | timestamptz            | Fecha de creación                      |

---

### `mesas`

Mesas de votación dentro de cada puesto.

| Campo                 | Tipo                         | Descripción                       |
| --------------------- | ---------------------------- | --------------------------------- |
| `id`                  | uuid (PK)                    | Identificador único               |
| `puesto_id`           | uuid (FK → puestos_votacion) | Puesto al que pertenece           |
| `numero_mesa`         | integer                      | Número de mesa                    |
| `potencial_electoral` | integer                      | Votantes habilitados (default: 0) |
| `created_at`          | timestamptz                  | Fecha de creación                 |

---

### `profiles`

Usuarios del sistema, extendidos desde `auth.users` de Supabase.

| Campo          | Tipo                         | Descripción                                             |
| -------------- | ---------------------------- | ------------------------------------------------------- |
| `id`           | uuid (PK, FK → auth.users)   | Mismo ID que auth de Supabase                           |
| `email`        | varchar                      | Correo electrónico                                      |
| `full_name`    | varchar                      | Nombre completo                                         |
| `role`         | role_enum                    | Rol: `testigo`, `revisor`, `admin` (default: `testigo`) |
| `municipio_id` | uuid (FK → municipios)       | Municipio asignado (opcional)                           |
| `puesto_id`    | uuid (FK → puestos_votacion) | Puesto asignado (opcional)                              |
| `activo`       | boolean                      | Estado del usuario (default: true)                      |
| `created_at`   | timestamptz                  | Fecha de creación                                       |
| `updated_at`   | timestamptz                  | Última actualización                                    |

---

### `partidos`

Partidos políticos o movimientos participantes.

| Campo        | Tipo             | Descripción                        |
| ------------ | ---------------- | ---------------------------------- |
| `id`         | uuid (PK)        | Identificador único                |
| `nombre`     | varchar          | Nombre del partido                 |
| `codigo`     | varchar (UNIQUE) | Código corto                       |
| `color_hex`  | varchar          | Color para UI (default: `#000000`) |
| `activo`     | boolean          | Activo/inactivo (default: true)    |
| `created_at` | timestamptz      | Fecha de creación                  |

---

### `candidatos`

Candidatos o listas asociadas a un partido.

| Campo          | Tipo                 | Descripción                             |
| -------------- | -------------------- | --------------------------------------- |
| `id`           | uuid (PK)            | Identificador único                     |
| `partido_id`   | uuid (FK → partidos) | Partido al que pertenece                |
| `nombre`       | varchar              | Nombre del candidato o lista            |
| `numero_lista` | integer              | Número en tarjetón (opcional)           |
| `es_partido`   | boolean              | Si el voto es al partido (no candidato) |
| `activo`       | boolean              | Activo/inactivo (default: true)         |
| `created_at`   | timestamptz          | Fecha de creación                       |

---

### `actas_e14`

Acta principal de resultados por mesa. Núcleo del sistema.

| Campo                     | Tipo                 | Descripción                                               |
| ------------------------- | -------------------- | --------------------------------------------------------- |
| `id`                      | uuid (PK)            | Identificador único                                       |
| `mesa_id`                 | uuid (FK → mesas)    | Mesa a la que corresponde el acta                         |
| `registrado_por`          | uuid (FK → profiles) | Testigo que registró el acta                              |
| `version`                 | integer              | Versión del acta (default: 1)                             |
| `estado`                  | estado_enum          | `borrador`, `enviado`, `verificado` (default: `borrador`) |
| `total_votos_urna`        | integer              | Total de votos en urna                                    |
| `total_votos_incinerados` | integer              | Votos incinerados                                         |
| `votos_en_blanco`         | integer              | Votos en blanco                                           |
| `votos_nulos`             | integer              | Votos nulos                                               |
| `tarjetas_no_marcadas`    | integer              | Tarjetas no marcadas                                      |
| `total_votos_validos`     | integer              | Total de votos válidos                                    |
| `total_sufragantes`       | integer              | Total de sufragantes                                      |
| `observaciones`           | text                 | Notas adicionales                                         |
| `creado_en`               | timestamptz          | Fecha de creación                                         |
| `actualizado_en`          | timestamptz          | Última modificación                                       |
| `enviado_en`              | timestamptz          | Fecha de envío (cuando estado = enviado)                  |
| `verificado_por`          | uuid (FK → profiles) | Revisor que verificó                                      |
| `verificado_en`           | timestamptz          | Fecha de verificación                                     |
| `total_votos_mesa`        | integer              | Total de votos por mesa                                   |
| `total_volantes_e11`      | integer              | Total de volantes E-11                                    |
| `tiene_tachaduras`        | boolean              | Si el acta tiene tachaduras                               |
| `hubo_reconteo`           | boolean              | Si hubo conteo adicional                                  |
| `hubo_reclamacion`        | boolean              | Si hubo reclamación                                       |
| `tipo_reclamacion`        | varchar              | Tipo de reclamación                                       |
| `total_votos_lista`       | integer              | Total de votos por lista                                  |

---

### `votos_candidato`

Detalle de votos por candidato dentro de un acta.

| Campo          | Tipo                   | Descripción                    |
| -------------- | ---------------------- | ------------------------------ |
| `id`           | uuid (PK)              | Identificador único            |
| `acta_id`      | uuid (FK → actas_e14)  | Acta a la que pertenece        |
| `candidato_id` | uuid (FK → candidatos) | Candidato votado               |
| `votos`        | integer                | Cantidad de votos (default: 0) |

---

### `fotos_acta`

Imágenes o PDFs del acta física subidos a Supabase Storage.

| Campo            | Tipo                  | Descripción                  |
| ---------------- | --------------------- | ---------------------------- |
| `id`             | uuid (PK)             | Identificador único          |
| `acta_id`        | uuid (FK → actas_e14) | Acta asociada                |
| `storage_path`   | text                  | Ruta en Supabase Storage     |
| `nombre_archivo` | varchar               | Nombre original del archivo  |
| `tamanio_bytes`  | integer               | Tamaño del archivo           |
| `subido_por`     | uuid (FK → profiles)  | Usuario que subió el archivo |
| `subido_en`      | timestamptz           | Fecha de subida              |

---

### `testigo_mesas`

Asignación de testigos a mesas específicas.

| Campo          | Tipo                 | Descripción                     |
| -------------- | -------------------- | ------------------------------- |
| `id`           | uuid (PK)            | Identificador único             |
| `testigo_id`   | uuid (FK → profiles) | Testigo asignado                |
| `mesa_id`      | uuid (FK → mesas)    | Mesa asignada                   |
| `asignado_por` | uuid (FK → profiles) | Admin que realizó la asignación |
| `asignado_en`  | timestamptz          | Fecha de asignación             |

---

### `revisor_asignaciones`

Asignación de revisores a municipios o puestos.

| Campo          | Tipo                         | Descripción                   |
| -------------- | ---------------------------- | ----------------------------- |
| `id`           | uuid (PK)                    | Identificador único           |
| `revisor_id`   | uuid (FK → profiles)         | Revisor asignado              |
| `municipio_id` | uuid (FK → municipios)       | Municipio asignado (opcional) |
| `puesto_id`    | uuid (FK → puestos_votacion) | Puesto asignado (opcional)    |
| `asignado_por` | uuid (FK → profiles)         | Admin que asignó              |
| `asignado_en`  | timestamptz                  | Fecha de asignación           |
| `activo`       | boolean                      | Si la asignación está vigente |

---

### `auditoria_cambios`

Log de auditoría de todas las acciones sobre la base de datos.

| Campo              | Tipo                   | Descripción                            |
| ------------------ | ---------------------- | -------------------------------------- |
| `id`               | uuid (PK)              | Identificador único                    |
| `tabla_afectada`   | varchar                | Nombre de la tabla modificada          |
| `registro_id`      | uuid                   | ID del registro afectado               |
| `accion`           | varchar                | Tipo de acción: INSERT, UPDATE, DELETE |
| `datos_anteriores` | jsonb                  | Estado previo del registro             |
| `datos_nuevos`     | jsonb                  | Estado nuevo del registro              |
| `ejecutado_por`    | uuid (FK → auth.users) | Usuario que ejecutó la acción          |
| `ejecutado_en`     | timestamptz            | Fecha y hora de la acción              |
| `ip_address`       | inet                   | IP del cliente                         |

---

### `votos_lista`

Votos por lista (partido) dentro de un acta.

| Campo          | Tipo                  | Descripción                    |
| -------------- | --------------------- | ------------------------------ |
| `id`           | uuid (PK)             | Identificador único            |
| `acta_id`      | uuid (FK → actas_e14) | Acta a la que pertenece        |
| `partido_id`   | uuid (FK → partidos)  | Partido votado                 |
| `votos`        | integer               | Cantidad de votos (default: 0) |
| `created_at`   | timestamptz           | Fecha de creación              |
| `updated_at`   | timestamptz           | Última actualización           |

---

### `alertas_acta`

Alertas generadas automáticamente al detectar inconsistencias en el acta.

| Campo          | Tipo                  | Descripción                    |
| -------------- | --------------------- | ------------------------------ |
| `id`           | uuid (PK)             | Identificador único            |
| `acta_id`      | uuid (FK → actas_e14) | Acta asociada                  |
| `codigo`       | varchar               | Código de la alerta            |
| `descripcion`  | text                  | Descripción detallada          |
| `creado_en`    | timestamptz           | Fecha de creación              |

---

### `afluencia_votantes`

Registro de afluencia de votantes por hora.

| Campo            | Tipo                  | Descripción                    |
| ---------------- | --------------------- | ------------------------------ |
| `id`             | uuid (PK)             | Identificador único            |
| `mesa_id`        | uuid (FK → mesas)     | Mesa asociada                  |
| `hora_corte`     | varchar               | Hora de corte (ej: "10:00")    |
| `cantidad`       | integer               | Cantidad de votantes           |
| `registrado_por` | uuid (FK → profiles)  | Usuario que registró           |
| `creado_en`      | timestamptz           | Fecha de creación              |

---

### `consolidados_municipio`

Consolidado de estadísticas por municipio para consultas rápidas.

| Campo                   | Tipo                    | Descripción                              |
| ----------------------- | ----------------------- | ---------------------------------------- |
| `id`                    | uuid (PK)               | Identificador único                      |
| `municipio_id`          | uuid (FK → municipios)  | Municipio (UNIQUE)                       |
| `total_puestos`         | integer                 | Total de puestos de votación             |
| `total_mesas`           | integer                 | Total de mesas                           |
| `mesas_reportadas`      | integer                 | Mesas con acta reportada                 |
| `porcentaje_reportado`  | integer                 | Porcentaje de avance                     |
| `total_sufragantes`     | integer                 | Total de sufragantes                     |
| `total_votos_urna`      | integer                 | Total votos en urna                      |
| `total_votos_incinerados`| integer                | Votos incinerados                        |
| `votos_en_blanco`       | integer                 | Votos en blanco                          |
| `votos_nulos`           | integer                 | Votos nulos                              |
| `tarjetas_no_marcadas`  | integer                 | Tarjetas no marcadas                     |
| `total_votos_validos`   | integer                 | Total votos válidos                      |
| `total_votos_mesa`      | integer                 | Total votos por mesa                     |
| `total_votos_lista`     | integer                 | Total votos por lista                    |
| `actas_borrador`        | integer                 | Conteo de actas en borrador              |
| `actas_enviadas`        | integer                 | Conteo de actas enviadas                 |
| `actas_verificadas`     | integer                 | Conteo de actas verificadas              |
| `actas_corregidas`      | integer                 | Conteo de actas corregidas               |
| `ultima_actualizacion`  | timestamptz             | Última actualización                     |
| `created_at`            | timestamptz             | Fecha de creación                        |

---

### `consolidado_votos_candidato_municipio`

Votos consolidados por candidato en cada municipio.

| Campo                   | Tipo                    | Descripción                              |
| ----------------------- | ----------------------- | ---------------------------------------- |
| `id`                    | uuid (PK)               | Identificador único                      |
| `municipio_id`          | uuid (FK → municipios)  | Municipio                                |
| `candidato_id`          | uuid (FK → candidatos)  | Candidato                                |
| `votos`                 | integer                 | Total de votos acumulados                |
| `ultima_actualizacion`  | timestamptz             | Última actualización                     |
| `created_at`            | timestamptz             | Fecha de creación                        |

**Índice único:** (`municipio_id`, `candidato_id`)

---

### `consolidado_votos_lista_municipio`

Votos consolidados por lista (partido) en cada municipio.

| Campo                   | Tipo                    | Descripción                              |
| ----------------------- | ----------------------- | ---------------------------------------- |
| `id`                    | uuid (PK)               | Identificador único                      |
| `municipio_id`          | uuid (FK → municipios)  | Municipio                                |
| `partido_id`            | uuid (FK → partidos)    | Partido                                  |
| `votos_lista`           | integer                 | Total de votos por lista                 |
| `ultima_actualizacion`  | timestamptz             | Última actualización                     |
| `created_at`            | timestamptz             | Fecha de creación                        |

**Índice único:** (`municipio_id`, `partido_id`)

---

## Tipos enumerados (ENUMs)

| Enum          | Valores                                           |
| ------------- | ------------------------------------------------- |
| `estado_enum` | `borrador`, `enviado`, `verificado`, `corregido`  |
| `role_enum`   | `maestro`, `revisor`, `coordinador_municipal`, `coordinador_puesto`, `testigo` |
| `zona_enum`   | `urbana`, `rural`                                 |

---

## Relaciones clave

### Jerarquía geográfica
```
municipios (1) → puestos_votacion (N) → mesas (N) → actas_e14 (1)
```

### Votos
```
actas_e14 (1) → votos_candidato (N) → candidatos (N) → partidos (1)
actas_e14 (1) → votos_lista (N) → partidos (1)
```

### Usuarios y asignaciones
```
profiles (testigo) → testigo_mesas → mesas
profiles (revisor) → revisor_asignaciones → municipios/puestos_votacion
```

### Consolidados (actualización automática vía triggers)
```
actas_e14 + votos_candidato + votos_lista → consolidados_municipio
actas_e14 + votos_candidato → consolidado_votos_candidato_municipio
actas_e14 + votos_lista → consolidado_votos_lista_municipio
```

---

## Triggers principales

| Trigger | Tabla | Descripción |
|---------|-------|-------------|
| `trigger_actualizar_consolidado` | `actas_e14` | Actualiza consolidados_municipio al cambiar un acta |
| `trigger_actualizar_votos_municipio` | `actas_e14` | Actualiza consolidados de votos al cambiar un acta |
| `trigger_actualizar_votos_candidato` | `votos_candidato` | Actualiza consolidados cuando cambian votos de candidatos |
| `trigger_actualizar_votos_lista` | `votos_lista` | Actualiza consolidados cuando cambian votos por lista |
| `audit_trigger` | Todas las tablas | Registra cambios en auditoria_cambios |
| `handle_new_user` | `auth.users` | Crea perfil automáticamente al registrar usuario |
