# Next.js 16 + React 19 + Prisma/PostgreSQL Migration Plan

## Objective
Modernize this portfolio to a fully server-first Next.js application with SSR-oriented data flow, Prisma as the ORM, and PostgreSQL as the primary database. This document is the working contract for future iterations, including sessions with smaller or older GPT models.

## Stable Version Baseline (confirmed on 2026-03-09)
- `next`: `16.1.6`
  - Confirmed from the official npm registry package metadata: `https://registry.npmjs.org/next/latest`
- `react`: stable branch `19.2`, security-fixed published stable `19.2.4`
  - React 19.2 was announced on the official React blog on 2025-10-01.
  - React 19.2.4 was published as a safe patched stable release in the official React security post on 2026-01-26.
- `react-dom`: align to the same React version, target `19.2.4`

## Current Architecture Snapshot
- Framework: Next.js App Router (`src/app`)
- Styling: Tailwind CSS
- Database access: MongoDB via Mongoose
- Current data flow:
  - Server Components call `fetch()` against internal API routes using `NEXT_PUBLIC_BASE_URL`
  - Route handlers in `src/app/api/projects/**` query Mongoose models
  - Cache policy is mostly `no-store`
- External content:
  - Medium RSS is fetched server-side

## Main Problems To Solve
1. Server Components are calling this same app over HTTP instead of importing server data functions directly.
2. `NEXT_PUBLIC_BASE_URL` is an unnecessary indirection for internal server reads.
3. Mongoose + MongoDB does not fit the new target stack.
4. Data types are loosely modeled (`Record<string, string>`, `Schema.Types.Mixed`), which will become painful in Prisma.
5. `no-store` is used broadly, which removes many of Next’s caching and revalidation advantages.
6. There is no automated test suite protecting the migration.

## Target Architecture
- Next.js 16 App Router
- React 19.2.4
- PostgreSQL
- Prisma ORM
- Server-first rendering
- Route handlers only where a public HTTP API is actually needed
- Direct server data access from pages/layouts/server utilities
- Explicit caching strategy:
  - `no-store` only for truly dynamic data
  - `revalidate` where stale-while-revalidate is acceptable
  - static rendering only where content is effectively immutable

## Core Next.js 16 / React 19 Best Practices To Apply

### 1. Prefer Server Components by default
- Keep components server-side unless they require browser APIs, client state, or event handlers.
- Minimize `"use client"` boundaries.
- Current obvious client components to review:
  - `src/components/Header.tsx`
  - `src/components/ProjectsComponents/ProjectsFilterBar.tsx`

### 2. Do not fetch your own route handlers from the server
- Replace:
  - `src/lib/fetchProjects.ts`
  - `src/lib/fetchOneProject.ts`
- With:
  - direct Prisma-backed server functions such as `src/server/projects/getProjects.ts`
  - direct imports into pages, layouts, metadata generators, and server actions if needed

### 3. Use route handlers only for external consumers
- Keep `src/app/api/**` only if:
  - the portfolio needs public API endpoints
  - a client component must call them from the browser
- Otherwise, delete or reduce them after the Prisma migration.

### 4. Make caching intentional
- Project list:
  - likely `revalidate` based, because portfolio projects do not change every second
- Project detail pages:
  - likely `revalidate` based
- Medium feed:
  - `revalidate` is a good fit
- Avoid blanket `cache: "no-store"` unless real-time freshness is required.

### 5. Keep Prisma server-only
- Prisma client must never leak into client bundles.
- Centralize it in `src/lib/prisma.ts` with a singleton pattern for dev.
- Any file importing Prisma should remain server-only.

### 6. Normalize the domain model
- Replace Mongoose’s flexible shapes with explicit relational structures.
- Current `about` and `details` shapes should be redesigned before generating the final Prisma schema.

## Recommended Data Model Direction

### Project
- `id`
- `title`
- `slug`
- `description`
- `imageUrl`
- `year`
- `featured`
- timestamps

### ProjectDetail
- `id`
- `projectId`
- `key`
- `value`
- optional `sortOrder`

### ProjectSection
- `id`
- `projectId`
- `title`
- `type`
- optional `sortOrder`

### ProjectSectionContent
Use one of these approaches:

#### Option A: JSON column
- Fastest migration
- Best if section content is heterogeneous and editorial
- Good fit for portfolio content

#### Option B: More normalized tables
- Better queryability
- More work now
- More rigid content modeling

Recommendation for this repository: start with JSON for section content, normalize later only if content operations become complex.

## Migration Strategy

## Phase 0. Stabilize before moving
- Create a branch dedicated to modernization.
- Capture current behavior:
  - homepage
  - `/projects`
  - `/projects/[slug]`
  - `/thoughts`
  - `/about`
  - `/now`
  - `/experiments`
- Take screenshots of current UI states.
- Add a basic smoke-test layer before major refactors.

## Phase 1. Upgrade framework dependencies
- Upgrade:
  - `next` -> `16.1.6`
  - `react` -> `19.2.4`
  - `react-dom` -> `19.2.4`
  - compatible `eslint-config-next`
- Re-run:
  - `npm install`
  - `npm run lint`
  - `npm run build`
- Fix breaking changes before touching the database layer.

## Phase 2. Introduce Prisma + PostgreSQL without removing Mongo yet
- Install:
  - `prisma`
  - `@prisma/client`
- Add:
  - `prisma/schema.prisma`
  - `src/lib/prisma.ts`
- Choose database:
  - local Docker Postgres, Supabase, Neon, Railway, or managed Postgres
- Add environment variables:
  - `DATABASE_URL`
- Generate client:
  - `npx prisma generate`

## Phase 3. Design the Prisma schema
- Convert current `Project` and supporting content into relational or semi-structured Postgres models.
- Explicitly decide:
  - what stays queryable columns
  - what becomes JSON
- Create seed data requirements before migration.

## Phase 4. Migrate the data
- Export data from MongoDB.
- Transform documents to Prisma seed input.
- Seed PostgreSQL.
- Validate:
  - slugs
  - dates
  - image URLs
  - category/filter data
  - section rendering

Important:
- Do not delete the Mongoose layer until seeded Postgres data renders correctly in the UI.

## Phase 5. Replace internal HTTP with direct server reads
- Replace server-side `fetch(${NEXT_PUBLIC_BASE_URL}/api/...)` with direct data access functions.
- Create a server module boundary, for example:
  - `src/server/projects/queries.ts`
  - `src/server/thoughts/queries.ts`
- Pages should import queries directly.

Target pattern:

```ts
import { getProjects } from "@/server/projects/queries";

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectList projects={projects} />;
}
```

## Phase 6. Rework rendering and caching
- Decide per route:
  - fully dynamic
  - ISR/revalidated
  - static
- Likely direction for this portfolio:
  - `/`, `/about`, `/now`, `/experiments`: static or revalidated
  - `/projects`, `/projects/[slug]`: revalidated SSR-oriented content
  - `/thoughts`: revalidated RSS fetch

Possible patterns:
- `export const revalidate = 3600`
- tag-based revalidation later if admin editing is added

## Phase 7. Simplify or remove API routes
- Keep only routes with external value.
- If they are internal-only today, delete them after the pages consume server functions directly.

## Phase 8. Add quality gates
- Add at least:
  - type-safe lint/build checks
  - one smoke e2e layer (Playwright is the most natural fit)
- Minimum smoke tests:
  - homepage renders
  - projects list renders
  - project detail renders
  - thoughts page renders

## Phase 9. Establish the editorial UI foundation
- Use Tailwind CSS 4 and HeroUI 3 as the shared visual layer for application UI.
- Keep the existing portfolio palette and typography through semantic CSS tokens. Add a Header selector for System, Light, and Dark, persisted in local storage and shared by admin and public pages.
- Apply the shared content list pattern to every editable collection: Published and Draft filters, card overflow Settings, and drag ordering for published content.
- Keep editorial settings limited to slug, excerpt, publication date, and homepage featured state. Collection order and featured order are drag-only operations in their corresponding list.
- Introduce TipTap progressively per content domain. Store editable JSON as the source, generate safe HTML for public rendering, and require missing editorial settings after the first canvas save.
- Add owner-only image uploads for cover and inline images, then use HeroUI feedback primitives for save, publish, upload, and error states.
- Migrate Thoughts first; Projects, Experiments, About, and Now adopt the same shell only after their domain-specific editors are defined.

### Pending Editorial Experience
- The current Thoughts creation and editing routes are transitional. They must not be considered the final product until title, images, and previewed content are authored through TipTap; first-save required settings are enforced; and safe rich-text rendering and uploads are complete.

## Suggested Folder Direction After Refactor
```txt
src/
  app/
  components/
  lib/
    prisma.ts
  server/
    projects/
      queries.ts
      mappers.ts
    thoughts/
      queries.ts
  types/
prisma/
  schema.prisma
  seed.ts
```

## Concrete Refactors Expected In This Repo
- Remove `mongoose` dependency
- Remove `src/lib/mongodb.ts`
- Remove or replace:
  - `src/models/Project.model.ts`
  - `src/models/User.model.ts` if no longer needed or migrate it too
- Rewrite:
  - `src/lib/fetchProjects.ts`
  - `src/lib/fetchOneProject.ts`
- Review:
  - `src/app/api/projects/route.ts`
  - `src/app/api/projects/[slug]/route.ts`
- Replace `NEXT_PUBLIC_BASE_URL` internal fetch dependence
- Tighten project types to match Prisma payloads

## Learning Notes: What a Junior Should Internalize
1. In App Router, the best default is server-first, not client-first.
2. A Server Component should usually import data functions directly, not call its own backend over HTTP.
3. SSR does not mean “everything no-store”; it means server-rendered with a deliberate cache strategy.
4. Prisma forces you to think in explicit schemas. That pressure is healthy because it reveals fuzzy data contracts early.
5. Client Components are expensive in architecture terms: extra JS, hydration, and more moving parts. Use them only when necessary.

## Recommended Execution Order For Future GPT Sessions
1. Upgrade Next.js and React first.
2. Add Prisma and Postgres infrastructure.
3. Design the schema from current Mongo documents.
4. Seed Postgres with migrated data.
5. Replace internal API fetches with direct server queries.
6. Revisit caching route by route.
7. Add smoke tests.
8. Remove the old Mongo/Mongoose layer.

## Definition of Done
- App runs on Next.js 16.1.6 and React 19.2.4
- Prisma is the only ORM in active use
- PostgreSQL is the only primary database
- No Server Component calls internal API routes over HTTP
- `NEXT_PUBLIC_BASE_URL` is not required for internal data access
- Caching/revalidation strategy is documented and intentional
- Core pages render correctly under SSR/revalidation
- Lint and build pass
- A minimal smoke test suite exists

## Continuity Prompt For Smaller/Older Models
Use this prompt at the start of a future session:

> Read `AGENTS.md` and `docs/next16-react19-prisma-migration-plan.md` first. Use the migration plan as the source of truth. We are modernizing this portfolio to Next.js 16.1.6, React 19.2.4, Prisma, and PostgreSQL with server-first rendering. Do not re-propose the architecture from scratch. Continue from the current phase, preserve existing UI behavior unless explicitly changing it, and avoid internal server-to-server HTTP fetches.

## First Practical Iteration Recommended
The best next coding task is not the database migration itself. It is this:

1. Upgrade Next.js/React dependencies safely.
2. Remove internal server-side HTTP fetching for projects.
3. Replace those reads with temporary server functions still backed by Mongo.
4. Confirm behavior is unchanged.

Reason:
- This isolates framework modernization from data migration.
- It teaches the correct App Router pattern before Prisma enters the codebase.
- It reduces risk and token waste in future sessions.
