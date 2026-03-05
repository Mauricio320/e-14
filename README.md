# E-14 Digital - Sistema de Registro Electoral

Sistema de Registro Electoral Digital para las elecciones de Cámara de Representantes en Casanare (08 de Marzo 2026).

## Tecnologías

- **Frontend:** Next.js 16, React 19, TypeScript 5, Tailwind CSS v4
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Formularios:** React Hook Form + Zod
- **Estado:** TanStack Query (React Query)
- **Autenticación:** Magic Link vía Supabase Auth

## Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Grupo de rutas de autenticación
│   ├── (dashboard)/       # Grupo de rutas del dashboard
│   ├── api/               # API Routes
│   └── layout.tsx         # Layout raíz
├── components/
│   ├── auth/              # Componentes de autenticación
│   ├── dashboard/         # Componentes de dashboard por rol
│   ├── e14/               # Componentes del formulario E-14
│   ├── layout/            # Header, Sidebar
│   ├── providers/         # Proveedores (QueryProvider)
│   └── ui/                # Componentes UI
├── hooks/                 # Hooks de React Query
├── lib/
│   ├── supabase/          # Clientes de Supabase
│   └── validations/       # Schemas de Zod
├── servicios/             # Servicios para interactuar con Supabase
└── types/                 # Tipos TypeScript
```

## Roles del Sistema

1. **Maestro:** Administrador total del sistema
2. **Revisor:** Verifica y corrige actas enviadas
3. **Coordinador Municipal:** Supervisa puestos de su municipio
4. **Coordinador de Puesto:** Gestiona mesas de su puesto
5. **Testigo:** Registra actas E-14 en sus mesas asignadas

## Configuración Inicial

### 1. Variables de Entorno

Copie el archivo `.env.local.example` a `.env.local` y configure:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

### 2. Base de Datos

Ejecute las migraciones SQL en Supabase:

1. `supabase/migrations/001_initial_schema.sql` - Esquema completo
2. `supabase/migrations/002_seed_data.sql` - Datos iniciales

### 3. Bucket de Storage

Cree un bucket privado llamado `actas-e14` en Supabase Storage.

### 4. Usuario Maestro

1. Registre un usuario vía Magic Link
2. Actualice su rol a `maestro` en la tabla `profiles`:

```sql
UPDATE profiles SET role = 'maestro' WHERE email = 'admin@ejemplo.com';
```

## Comandos

```bash
# Instalar dependencias
pnpm install

# Desarrollo
pnpm dev

# Build producción
pnpm build

# Iniciar producción
pnpm start

# Lint
pnpm lint
```

## Características

### Sistema de Actas E-14
- Formulario completo con validaciones
- Cálculo automático de totales
- Subida de fotos (máx. 10, 5MB cada una)
- Estados: Borrador → Enviado → Verificado/Corregido

### Dashboards por Rol
- **Testigo:** Sus mesas asignadas
- **Coord. Puesto:** Mesas del puesto con progreso
- **Coord. Municipal:** Puestos del municipio
- **Revisor:** Actas pendientes de verificación
- **Maestro:** Estadísticas globales y gestión

### Seguridad
- RLS (Row Level Security) en todas las tablas
- Políticas de acceso por rol
- Auditoría de cambios inmutable
- Magic Link para autenticación sin contraseña

## Flujo de Trabajo

1. El **Maestro** configura municipios, puestos y mesas
2. El **Maestro** asigna testigos a mesas
3. Los **Testigos** registran las actas E-14
4. Los **Testigos** envían las actas completadas
5. Los **Revisores** verifican o solicitan correcciones
6. Los **Coordinadores** monitorean el progreso

## Licencia

Privado - Uso exclusivo para elecciones Casanare 2026
