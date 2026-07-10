# Use a built-in admin in the Next.js app instead of Strapi

This portfolio will use a protected admin area inside the existing Next.js application, with Prisma/Postgres as the source of truth for editable content. We rejected Strapi because the goal is a single-owner content workflow with the fewest moving parts, and a separate CMS would add an extra app, extra operational surface, and duplicate ownership concerns for the same content.

## Considered Options

- Built-in Next.js admin with Prisma/Postgres
- Strapi as the CMS for portfolio content
