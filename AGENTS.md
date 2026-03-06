# AGENTS.md - Guidelines for AI Agents

This file provides guidelines for AI coding agents working in this repository.

## Project Overview

**Name:** E-14 Sistema de Registro Electoral Digital  
**Tech Stack:** Next.js 16, React 19, TypeScript 5, Tailwind CSS v4, Supabase  
**Domain:** Sistema de registro electoral para elecciones de Cámara de Representantes en Casanare, Colombia

---

## Commands

### Development
```bash
pnpm dev          # Start development server (http://localhost:3000)
pnpm build        # Build for production
pnpm start        # Start production server
```

### Quality Checks
```bash
pnpm lint         # Run ESLint (ESLint 9 with flat config)
npx tsc --noEmit  # Run TypeScript type check
```

### Single File Linting
```bash
npx eslint src/path/to/file.tsx  # Lint specific file
```

### Environment Setup
Create `.env.local` with:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## Code Style Guidelines

### General Principles
- Use functional components with hooks
- Prefer const over let
- Avoid var; use let only when reassignment is necessary
- Keep functions small and focused (single responsibility)
- Write self-documenting code with clear variable/function names

### TypeScript

#### Type Annotations
- Use explicit types for function parameters and return values
- Use type inference for local variables when type is obvious
- Prefer interfaces over types for object shapes
- Use `type` for unions, intersections, and aliases

```typescript
// Good - explicit types for props and returns
interface DashboardMaestroProps {
  profile: Profile;
}

export function DashboardMaestro({ profile }: DashboardMaestroProps): JSX.Element {
  // ...
}

// Good - inferred for local variables
const nombre = "Yopal";
const filteredItems = items.filter(item => item.active);
```

#### Database Types
- Use types from `@/types/database` for Supabase row types
- Extend with relationships using intersection types:
```typescript
export type ConsolidadoMunicipio = Database['public']['Tables']['consolidados_municipio']['Row'] & {
  municipio?: {
    id: string;
    nombre: string;
  };
};
```

### Imports

#### Path Aliases
Use `@/` prefix for imports from `src/`:
```typescript
import { useConsolidados } from '@/hooks/useConsolidados';
import type { Profile } from '@/types';
import { createClient } from '@/lib/supabase/client';
```

#### Import Order (grouped)
1. React/Next imports (none needed for React 19+)
2. External libraries
3. Internal imports (@/...)
4. Type imports

```typescript
"use client";

import { useState } from "react";
import Link from "next/link";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
} from "chart.js";

import { useConsolidados } from "@/hooks/useConsolidados";
import type { Profile } from "@/types";
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Files | kebab-case | `useConsolidados.ts`, `DashboardMaestro.tsx` |
| Components | PascalCase | `DashboardMaestro`, `StatCard` |
| Hooks | camelCase with `use` prefix | `useConsolidados`, `useEstadisticasGlobales` |
| Functions | camelCase, verb+noun | `obtenerConsolidados`, `createClient` |
| Variables | camelCase | `consolidados`, `loadingStats` |
| Interfaces/Types | PascalCase | `ConsolidadoMunicipio`, `Profile` |
| Constants | UPPER_SNAKE_CASE | `CONSOLIDADOS_KEY` |
| CSS Classes | kebab-case (Tailwind) | `bg-white`, `text-gray-900` |

### Component Structure

#### Client Components
```typescript
"use client";

import { useState, useEffect } from "react";
import type { Profile } from "@/types";

interface ComponentNameProps {
  title: string;
  profile: Profile;
  onSubmit?: () => void;
}

export function ComponentName({ title, profile, onSubmit }: ComponentNameProps) {
  const [state, setState] = useState<string>("");

  useEffect(() => {
    // effect logic
  }, []);

  return (
    <div className="p-4">
      <h1>{title}</h1>
    </div>
  );
}
```

#### Service Functions
```typescript
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export async function obtenerConsolidados(): Promise<ConsolidadoMunicipio[]> {
  const { data, error } = await supabase
    .from('consolidados_municipio')
    .select('*');

  if (error) throw error;
  return data || [];
}
```

### Error Handling

#### Database Operations
```typescript
// Throw on error for query functions
if (error) throw error;

// Return null for single-item queries when not found
if (error) return null;
```

#### try/catch for Complex Operations
```typescript
try {
  const result = await asyncOperation();
  // handle success
} catch (error) {
  console.error('Operation failed:', error);
  // handle error - show toast, set error state, etc.
}
```

### React Query / TanStack Query

#### Hook Pattern
```typescript
const CONSOLIDADOS_KEY = 'consolidados';

export function useConsolidados() {
  return useQuery<ConsolidadoMunicipio[]>({
    queryKey: [CONSOLIDADOS_KEY],
    queryFn: obtenerConsolidados,
  });
}

export function useConsolidadoMunicipio(municipioId: string) {
  return useQuery<ConsolidadoMunicipio | null>({
    queryKey: [CONSOLIDADOS_KEY, municipioId],
    queryFn: () => obtenerConsolidadoPorMunicipio(municipioId),
    enabled: !!municipioId, // only run when municipioId exists
  });
}
```

### Tailwind CSS

- Use Tailwind v4 syntax (`@import "tailwindcss"`)
- Custom theme in `src/app/globals.css` using `@theme inline`
- Common utility patterns:
  - Spacing: `p-4`, `m-2`, `gap-4`
  - Colors: `text-gray-900`, `bg-blue-600`, `border-gray-200`
  - Responsive: `md:grid-cols-3`, `lg:grid-cols-4`
  - States: `hover:shadow-md`, `focus:ring-2`

### File Organization

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth group routes
│   ├── (dashboard)/      # Protected dashboard routes
│   ├── api/              # API routes
│   └── setup/            # Initial setup
├── components/
│   └── dashboard/        # Dashboard components
├── hooks/                 # React Query hooks (useXxx.ts)
├── servicios/             # Data fetching (xxx.ts)
├── lib/                   # Utilities
│   ├── supabase/         # Supabase clients
│   └── validations/      # Zod schemas
└── types/                 # TypeScript types
```

### Authentication & Authorization

- Supabase Auth with email/password
- Roles: `maestro`, `revisor`, `coordinador_municipal`, `coordinador_puesto`, `testigo`
- Check auth in middleware (`src/middleware.ts`)
- Use RLS policies in Supabase for data access

### Database Patterns

- Always use prepared queries via Supabase client
- Use `.select()` with explicit columns when possible
- Use `.single()` for single row responses
- Use `.order()` for sorting results

---

## Testing Guidelines

This project does not currently have a test framework set up. When adding tests:
- Use Vitest for unit tests
- Use Playwright for E2E tests
- Place tests next to source files: `ComponentName.test.tsx`

---

## Common Patterns

### Loading States
```typescript
const { data, isLoading } = useQuery(...);

if (isLoading) {
  return <div>Cargando...</div>;
}
```

### Null Safety
```typescript
// Always handle potential null/undefined
const value = data?.property ?? defaultValue;
const items = data || [];
```

### Conditional Rendering
```typescript
{data && <Component data={data} />}
{data?.length === 0 && <EmptyState />}

{loading ? (
  <Skeleton />
) : (
  <Content />
)}
```

---

## Pre-commit Checklist

Before committing:
- [ ] Run `pnpm lint` - no errors
- [ ] Run `npx tsc --noEmit` - no type errors
- [ ] Verify build with `pnpm build`
- [ ] Check for console.log statements
- [ ] Verify all imports are used
