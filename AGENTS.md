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

## Issue Implementation Workflow
- Before implementing a new issue, read the issue and write a short implementation plan.
- The plan must say whether the issue should land in one commit or in multiple coherent commits.
- Only split an issue into multiple commits when each commit closes a clear, reviewable part of the issue.
- Before starting each planned commit, state what part of the issue that commit is meant to close and what will remain open afterwards.
- After implementing a planned commit, re-read the issue and verify that the commit closes exactly the part it was supposed to close.
- Do not propose a commit until that verification is done.
- After each implementation pass, report explicitly whether the issue is fully closed.
- If the issue is not fully closed, report what is already done and what still remains before the issue can be considered complete.
- When the issue can be resolved in one commit, prefer one commit instead of atomizing the history unnecessarily.
- Once all planned commits are done, perform one final issue review and confirm that the full issue is closed end to end.
- Before every `push`, update the affected GitHub issue or issues so their state matches exactly what the pushed commit set has closed so far.
- If a pushed commit closes only part of an issue, leave the issue open and add a comment stating what was covered by the pushed work and what still remains.
- If a pushed commit closes an entire issue, close the issue and update any related issue state in the repo workflow so the visible issue map stays accurate.
- Do the GitHub issue update before the `push`, not after it, so the tracker always reflects the state of the branch being pushed.

## Security & Configuration Tips
Set `MONGODB_URI` locally before running database-backed pages or API routes. Do not commit secrets. External images are currently expected from Cloudinary and Medium, so update `next.config.ts` if new image hosts are introduced.

## Persistent Migration Context
If the task is related to the planned modernization of this repository, read [docs/next16-react19-prisma-migration-plan.md](/Users/lucas/Desktop/WebDev/Portfolio/portfolio/docs/next16-react19-prisma-migration-plan.md) before making changes. It contains the confirmed version baseline, target architecture, migration phases, and continuity prompt for future GPT sessions.

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues for this repository. See `docs/agents/issue-tracker.md`.

### Triage labels

This repo uses the default five-label triage vocabulary. See `docs/agents/triage-labels.md`.

### Domain docs

This repo uses a single-context domain-doc layout. See `docs/agents/domain.md`.
