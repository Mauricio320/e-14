# Product Requirements Document (PRD): E-14 Digital

## 1. Introducción

**E-14 Digital** es una plataforma web de gestión y control electoral diseñada para administrar la estructura de votación (municipios, puestos y mesas), asignar personal logístico y operativo (coordinadores, revisores, testigos), y registrar los resultados electorales (escrutinio de mesas) en tiempo real mediante actas E-14 y reporte de afluencia, garantizando la transparencia, trazabilidad y consolidación de la información de las elecciones.

## 2. Objetivos del Producto

- **Digitalización y agilidad:** Permitir a los testigos electorales registrar los datos del acta E-14 desde cualquier dispositivo directamente desde la mesa de votación.
- **Control y auditoría:** Mantener un seguimiento estricto de las modificaciones en los reportes y contar con evidencia fotográfica de las actas físicas.
- **Monitorización en tiempo real:** Ofrecer a los administradores y coordinadores un panorama actualizado sobre el avance del preconteo, la afluencia de votantes y el estado de la transmisión.
- **Consolidación rápida:** Obtener informes consolidados de los resultados por candidato, lista, puesto y municipio sin esperar el escrutinio oficial.

## 3. Arquitectura y Roles de Usuario

El sistema cuenta con un modelo de Control de Acceso Basado en Roles (RBAC):

1. **Maestro (Administrador del Sistema):**
   - Control total sobre la plataforma.
   - Gestión (CRUD) de la división político-administrativa: Municipios, Puestos de Votación y Mesas.
   - Creación y gestión de usuarios en todos los roles y configuración de partidos y candidatos.
   - Visualización del panel de control global (Dashboard Maestro).
2. **Coordinador Municipal:**
   - Visualización y monitoreo de todos los puestos y mesas dentro de un municipio específico.
   - Supervisión del avance logístico a nivel municipal.
3. **Coordinador de Puesto:**
   - Coordinación operativa de un puesto de votación designado.
   - Monitoreo de todas las mesas del puesto y soporte a los testigos.
4. **Revisor:**
   - Tareas de auditoría y revisión de la información reportada en las mesas asociadas a sus puestos asignados.
   - Verificación de la exactitud entre las fotos de las actas y los datos digitados.
5. **Testigo (Electoral / de Mesa):**
   - Usuario base asignado a una o más mesas específicas.
   - Encargado principal de transmitir (digitar) la información del acta E-14, subir fotografías como evidencia y reportar la afluencia de votantes en los cortes horarios delimitados.

## 4. Funcionalidades Principales

### 4.1. Configuración de Entidades Base

- **Gestión Geográfica y Logística:** Administración de Municipios y Puestos de Votación (zona urbana y rural).
- **Gestión de Mesas:** Creación de mesas con su respectivo número y cálculo de potencial electoral máximo.
- **Actores Electorales:** Gestión de Partidos Políticos y Candidatos inscritos.

### 4.2. Asignación y Gestión de Personal

- **Gestión de Usuarios:** Registro seguro de los participantes y administración de su estado (Activo/Inactivo).
- **Asignación Operativa:** Mapeo de perfiles a zonas específicas (ej. Testigo -> Mesa, Coordinador/Revisor -> Puesto).
- **Confirmación de Asistencia:** Funcionalidad para marcar un testigo como "confirmado" en una mesa en el puesto.

### 4.3. Registro de Escrutinio (Formulario Acta E-14)

- **Captura de Totales E-11 y E-14:** Volantes E-11, total de votos en la urna, votos incinerados, votos en blanco, nulos, tarjetas no marcadas, total válidos.
- **Votación por Candidato y Lista:** Ingreso detallado de los votos obtenidos por cada candidato o partido / lista (voto preferente y no preferente).
- **Observaciones y Reclamaciones:** Registro de incidencias (error aritmético, firmas insuficientes, sufragantes excede habilitados), reconteo y tachaduras.
- **Manejo de Estados de Acta:** Las actas pueden poseer estados de ciclo de vida (Ej: Reportada, Verificada/Auditada, Con Inconsistencias).

### 4.4. Carga de Evidencia Fotográfica

- **Anexos del Acta:** Posibilidad de cargar imágenes legibles del acta E-14 física. El sistema valida tamaño (hasta 5MB) y formato oportuno (JPG, PNG, WebP) (máximo 10 fotos por acta).

### 4.5. Reporte de Afluencia de Votantes

- Formulario para recolectar cortes temporales del volumen de ciudadanos que ya sufragaron en cada mesa del puesto electoral durante la jornada (ej. para medir índices de participación).

### 4.6. Visualización, Tableros de Control y Alertas

- **Dashboards:** Vistas personalizadas para el Maestro, Coordinador y Revisor mostrando el porcentaje de escrutinio, reportes faltantes, afluencia y distribución de la votación.
- **Alertas e Inconsistencias:** Motor que levanta `alertas_acta` automáticamente si los números capturados en el E-14 no tienen congruencia aritmética o lógica (por ejemplo, votos urna < suma candidaturas + nulos/blancos).
- **Auditoría y Trazabilidad:** Registro completo en tabla `auditoria_cambios` para visualizar el historial sobre quién reportó y los cambios ejecutados en el acta de cada mesa.

## 5. Requisitos No Funcionales (A nivel técnico)

- **Stack:** Aplicación con framework Next.js (App Router), React, TypeScript.
- **Servicios e Integración BD:** Supabase (Base de datos PostgreSQL, autenticación de usuarios y administración de almacenamiento / buckets para evidencias fotográficas).
- **Estilización:** Tailwind CSS y diseño 'Mobile First' enfocado en que los Testigos utilicen sus smartphones en el sitio.
- **Validación de seguridad y consistencia:** Zod parsers para sanitizar, tipar e impedir cargas maliciosas del cliente.
- **Experiencia en Tiempo Real:** Configuración para refresco progresivo/SWR (React Query o similar como se vislumbra en `useMesas.ts`) para lograr que los tableros destaquen el estatus actualizado sin necesidad de F5 constante.

## 6. Siguientes Pasos (Roadmap de Tareas Abiertas)

- Realizar ajustes sobre los ciclos de redirección (Login / Sign Out) para asegurar limpieza de sesión eficaz.
- Depurar permisos estables de inserción en Base de datos (Políticas `RLS` de Postgres para los diferentes roles).
- Finalizar las pruebas de consistencia de la calculadora en el acta (comprobar validación aritmética a nivel frontend y base de datos).
