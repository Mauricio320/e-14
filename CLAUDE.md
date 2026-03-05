# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 project using the App Router, React 19, TypeScript 5, and Tailwind CSS v4.

**Domain:** Sistema de Registro Electoral Digital (E-14) para elecciones de Cámara de Representantes en Casanare.

## Common Commands

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint (ESLint 9 with flat config)
pnpm lint

# Type check
npx tsc --noEmit
```

## Architecture

### App Router Structure
- `src/app/` - Next.js App Router directory
  - `(auth)/` - Group routes for authentication (login)
  - `(dashboard)/` - Group routes for authenticated users
    - `admin/` - Admin panel for user/municipality/polling station management
    - `mesa/[id]/` - E-14 form for witness data entry
    - `puesto/[id]/` - Coordinator dashboard for polling station
    - `municipio/[id]/` - Municipal coordinator dashboard
    - `revisor/` - Reviewer dashboard for verifying submitted acts
  - `api/` - API routes including admin user creation
  - `setup/` - Initial setup page for first admin user

### Authentication & Authorization
- **Method:** Supabase Auth with email/password (signInWithPassword)
- **Middleware:** `src/middleware.ts` protects dashboard routes and redirects authenticated users from login
- **Roles:** `maestro` | `revisor` | `coordinador_municipal` | `coordinador_puesto` | `testigo`
- **RLS:** All database tables have Row Level Security enabled with role-based policies

### Data Flow Pattern
```
Database (Supabase PostgreSQL)
    ↓
Servicios (src/servicios/*.ts) - Direct Supabase client calls
    ↓
Hooks (src/hooks/*.ts) - TanStack Query wrappers
    ↓
Components (Server/Client Components)
```

Key services:
- `src/servicios/profiles.ts` - User management
- `src/servicios/actas-e14.ts` - E-14 form operations
- `src/servicios/mesas.ts` - Polling table management

### Database Architecture

**Critical Tables:**
- `profiles` - Extends auth.users with role, full_name, active status
- `actas_e14` - E-14 forms with states: borrador → enviado → verificado/corregido
- `mesas` - Polling tables linked to puestos_votacion
- `votos_candidato` - Vote counts per candidate per form
- `auditoria_cambios` - Immutable audit log of all changes

**Triggers:**
- `handle_new_user()` - Creates profile when auth.users row inserted
- `audit_trigger_func()` - Logs all changes to auditoria_cambios

**RLS Pattern:**
```sql
-- Most tables check auth.uid() against user id or role
EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'maestro')
```

### Tailwind CSS v4 Configuration
- Uses the new v4 `@import "tailwindcss"` syntax in `globals.css`
- Theme customization via `@theme inline` block in CSS
- PostCSS config uses `@tailwindcss/postcss` plugin
- No separate `tailwind.config.js` - configuration is CSS-based

### Path Aliases
- `@/*` maps to `./src/*` as configured in `tsconfig.json`

### Package Manager
- Uses pnpm (evidenced by `pnpm-lock.yaml`)

## Key Files

- `next.config.ts` - Next.js configuration (TypeScript)
- `eslint.config.mjs` - ESLint 9 flat config using `eslint-config-next`
- `postcss.config.mjs` - PostCSS configuration for Tailwind v4
- `tsconfig.json` - TypeScript configuration with strict mode enabled
- `src/middleware.ts` - Route protection and auth redirects
- `src/lib/supabase/client.ts` - Browser Supabase client
- `src/lib/supabase/server.ts` - Server Supabase client
- `src/lib/supabase/middleware.ts` - Middleware Supabase client
- `src/types/database.ts` - Generated Supabase database types

## Environment Variables

Required in `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Documentation & Libraries
Always use Context7 MCP when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.

## First-Time Setup

1. Run migrations in Supabase SQL Editor:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_seed_data.sql`

2. Create storage bucket `actas-e14` (private) in Supabase

3. Visit `/setup` to create the first admin user (only works when no users exist)

4. Or create admin via SQL (see README.md for template)
