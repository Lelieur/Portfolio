export interface VersionedContentSnapshot<TDraft, TPublished = TDraft> {
  id: string;
  draft: TDraft | null;
  published: TPublished | null;
}

export interface VersionedContentStore<TDraft, TPublished = TDraft> {
  get(id: string): Promise<VersionedContentSnapshot<TDraft, TPublished> | null>;
  save(
    snapshot: VersionedContentSnapshot<TDraft, TPublished>
  ): Promise<VersionedContentSnapshot<TDraft, TPublished>>;
}

export function createVersionedContentBoundary<TDraft, TPublished = TDraft>(
  store: VersionedContentStore<TDraft, TPublished>
) {
  return {
    async getPublic(id: string): Promise<TPublished | null> {
      const snapshot = await store.get(id);
      return snapshot?.published ?? null;
    },

    async getPreview(
      id: string
    ): Promise<VersionedContentSnapshot<TDraft, TPublished> | null> {
      return store.get(id);
    },

    async saveDraft(id: string, draft: TDraft) {
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
        published: snapshot.draft as TPublished,
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
