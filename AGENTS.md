# Repository Guidelines

## Project Structure & Module Organization
This repository is a Next.js 15 portfolio app using the App Router. Application routes live in `src/app` (for example `src/app/projects/[slug]/page.tsx` and API handlers under `src/app/api`). Reusable UI lives in `src/components`, shared data loaders and helpers in `src/lib`, Mongoose models in `src/models`, static seed content in `src/data`, utility functions in `src/utils`, and shared TypeScript types in `src/types`. Public assets belong in `public/`.

## Build, Test, and Development Commands
- `npm run dev`: start the local development server.
- `npm run build`: create a production build and catch compile-time issues.
- `npm run start`: serve the production build locally.
- `npm run lint`: run Next.js ESLint checks with the `next/core-web-vitals` and TypeScript rules.

Run commands from the repository root: `npm run dev`.

## Coding Style & Naming Conventions
Use TypeScript for app code and keep imports on the `@/*` alias when referencing `src/` modules. Follow the existing component style: PascalCase for React components and model files (`ProjectCard.tsx`, `Project.model.ts`), camelCase for helpers (`fetchProjects.ts`, `formatDate.ts`), and lowercase route folders in `src/app`. Prefer functional React components, Tailwind utility classes for styling, and keep page-specific CSS next to the route only when utilities are not enough.

Use 2-space indentation only if the file already does; otherwise preserve the repository’s current formatting pattern. Run `npm run lint` before opening a PR.

## Testing Guidelines
There is no automated test suite configured yet. Until one is added, use `npm run lint` and `npm run build` as the minimum verification gate, then manually test key pages such as `/`, `/projects`, `/thoughts`, and any changed API route. If you add tests, place them near the feature or under a dedicated `src/__tests__` directory and name them `*.test.ts` or `*.test.tsx`.

## Commit & Pull Request Guidelines
Recent history follows short Conventional Commit messages such as `feat: expand thoughts system` and `feat(projects): add dynamic category filtering`. Keep that format: `type(scope): summary` when scope helps. PRs should include a concise description, note any environment or schema changes, link the relevant issue when available, and attach screenshots for UI changes.

## Security & Configuration Tips
Set `MONGODB_URI` locally before running database-backed pages or API routes. Do not commit secrets. External images are currently expected from Cloudinary and Medium, so update `next.config.ts` if new image hosts are introduced.

## Persistent Migration Context
If the task is related to the planned modernization of this repository, read [docs/next16-react19-prisma-migration-plan.md](/Users/lucas/Desktop/WebDev/Portfolio/portfolio/docs/next16-react19-prisma-migration-plan.md) before making changes. It contains the confirmed version baseline, target architecture, migration phases, and continuity prompt for future GPT sessions.
