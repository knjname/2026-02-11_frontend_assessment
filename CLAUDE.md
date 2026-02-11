# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

pnpm workspaces monorepo with three packages:
- **`packages/main`** — React 19 frontend (Vite 7, TypeScript 5.9, Tailwind CSS 4)
- **`packages/api`** — OpenAPI code generation (`@hey-api/openapi-ts`). Generated typed SDK and types from OpenAPI spec.
- **`packages/mock-api`** — Hono-based mock API server (port 3000)

## Commands

All commands run from the repository root.

| Task | Command |
|---|---|
| Start dev server | `pnpm dev` (requires mock-api running) |
| Start mock API | `pnpm mock-api` |
| Build | `pnpm build` |
| Lint | `pnpm --filter @app/main lint` |
| Run all tests | `pnpm test` |
| Run tests (watch) | `pnpm --filter @app/main test:watch` |
| Run single test | `pnpm --filter @app/main vitest run src/__tests__/App.test.tsx` |
| Regenerate API client | `pnpm generate:api` |

## Architecture

### API Layer (OpenAPI-driven)

1. OpenAPI spec lives at `packages/mock-api/openapi/petstore.yaml`
2. `pnpm generate:api` produces typed SDK functions and types into `packages/api/src/generated/`
3. Main app imports from `@app/api` (e.g., `listPets()`, `createPet()`, `showPetById()`)
4. HTTP client: `@hey-api/client-fetch` with base URL `/api`
5. Vite dev server proxies `/api/*` → `http://localhost:3000` (strips `/api` prefix)

### Frontend Patterns

- **State management:** Valtio (`proxy()` + `useSnapshot()`) — see `src/stores/`
- **Forms:** React Hook Form + Zod schema validation (`@hookform/resolvers/zod`)
- **UI components:** shadcn/ui (Radix UI primitives + Tailwind). Config in `components.json` (style: new-york)
- **Path alias:** `@/*` maps to `./src/*`
- **Custom resolve condition:** `@app/source` used in Vite and tsconfig for workspace package source imports

### Testing

- Vitest 3 with jsdom environment (`vitest.config.ts`)
- `@testing-library/react` + `@testing-library/user-event`
- Setup file: `src/test-setup.ts` (imports `@testing-library/jest-dom/vitest`)
- Globals enabled (no need to import `describe`, `it`, `expect`)

### TypeScript

- Strict mode with `noUnusedLocals`, `noUnusedParameters`, `noUncheckedSideEffectImports`
- Root `tsconfig.json` uses project references for all packages
