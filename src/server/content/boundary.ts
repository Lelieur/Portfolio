import { Prisma } from "@prisma/client";
import type { PrismaClient } from "@prisma/client";

function toPrismaJson<TContent>(
  value: TContent | null
): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput {
  return value === null ? Prisma.DbNull : (value as Prisma.InputJsonValue);
}

export interface VersionedContentSnapshot<TContent> {
  id: string;
  draft: TContent | null;
  published: TContent | null;
}

export interface VersionedContentStore<TContent> {
  get(id: string): Promise<VersionedContentSnapshot<TContent> | null>;
  save(
    snapshot: VersionedContentSnapshot<TContent>
  ): Promise<VersionedContentSnapshot<TContent>>;
}

export function createPrismaVersionedContentStore<TContent>(
  prisma: Pick<PrismaClient, "contentDocument">,
  domain: string
): VersionedContentStore<TContent> {
  return {
    async get(id) {
      const document = await prisma.contentDocument.findUnique({
        where: { domain_contentKey: { domain, contentKey: id } },
      });

      return document
        ? {
            id: document.contentKey,
            draft: document.draft as TContent | null,
            published: document.published as TContent | null,
          }
        : null;
    },

    async save(snapshot) {
      await prisma.contentDocument.upsert({
        where: {
          domain_contentKey: { domain, contentKey: snapshot.id },
        },
        update: {
          draft: toPrismaJson(snapshot.draft),
          published: toPrismaJson(snapshot.published),
        },
        create: {
          domain,
          contentKey: snapshot.id,
          draft: toPrismaJson(snapshot.draft),
          published: toPrismaJson(snapshot.published),
        },
      });

      return snapshot;
    },
  };
}

export function createVersionedContentBoundary<TContent>(
  store: VersionedContentStore<TContent>
) {
  return {
    async getPublic(id: string): Promise<TContent | null> {
      const snapshot = await store.get(id);
      return snapshot?.published ?? null;
    },

    async getPreview(id: string): Promise<VersionedContentSnapshot<TContent> | null> {
      return store.get(id);
    },

    async saveDraft(id: string, draft: TContent) {
      const snapshot = await store.get(id);

      return store.save({
        id,
        draft,
        published: snapshot?.published ?? null,
      });
    },

    async publish(id: string) {
      const snapshot = await store.get(id);

      if (!snapshot?.draft) {
        throw new Error(`Cannot publish missing draft for ${id}`);
      }

      return store.save({
        id,
        draft: snapshot.draft,
        published: snapshot.draft,
      });
    },

    async unpublish(id: string) {
      const snapshot = await store.get(id);

      if (!snapshot) {
        throw new Error(`Cannot unpublish missing content for ${id}`);
      }

      return store.save({
        ...snapshot,
        published: null,
      });
    },
  };
}
