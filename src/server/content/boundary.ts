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
