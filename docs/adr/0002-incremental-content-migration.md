# Migrate portfolio content incrementally by domain

The migration to Prisma/Postgres and the built-in admin will happen beside the current portfolio, switching content domains over one at a time rather than through a single cutover. We chose this because the project is changing content source, database model, and editing workflow together, and domain-by-domain parity is safer than replacing Mongo, Medium, and static content all at once.
