import test from "node:test";
import assert from "node:assert/strict";
import {
  createVersionedContentBoundary,
  type VersionedContentSnapshot,
  type VersionedContentStore,
} from "./boundary.ts";

function createMemoryStore<T>(): VersionedContentStore<T> & {
  snapshots: Map<string, VersionedContentSnapshot<T>>;
} {
  const snapshots = new Map<string, VersionedContentSnapshot<T>>();

  return {
    snapshots,
    async get(id) {
      return snapshots.get(id) ?? null;
    },
    async save(snapshot) {
      snapshots.set(snapshot.id, snapshot);
      return snapshot;
    },
  };
}

test("saveDraft updates preview without changing public content", async () => {
  const store = createMemoryStore<{ title: string }>();
  store.snapshots.set("thought-1", {
    id: "thought-1",
    draft: { title: "Draft v1" },
    published: { title: "Published v1" },
  });

  const boundary = createVersionedContentBoundary(store);

  await boundary.saveDraft("thought-1", { title: "Draft v2" });

  assert.deepEqual(await boundary.getPublic("thought-1"), {
    title: "Published v1",
  });
  assert.deepEqual(await boundary.getPreview("thought-1"), {
    id: "thought-1",
    draft: { title: "Draft v2" },
    published: { title: "Published v1" },
  });
});

test("publish promotes the current draft to the public snapshot", async () => {
  const store = createMemoryStore<{ title: string }>();
  store.snapshots.set("thought-1", {
    id: "thought-1",
    draft: { title: "Draft v2" },
    published: { title: "Published v1" },
  });

  const boundary = createVersionedContentBoundary(store);

  await boundary.publish("thought-1");

  assert.deepEqual(await boundary.getPublic("thought-1"), {
    title: "Draft v2",
  });
});

test("unpublish removes public visibility while keeping the draft", async () => {
  const store = createMemoryStore<{ title: string }>();
  store.snapshots.set("thought-1", {
    id: "thought-1",
    draft: { title: "Draft v2" },
    published: { title: "Published v2" },
  });

  const boundary = createVersionedContentBoundary(store);

  await boundary.unpublish("thought-1");

  assert.equal(await boundary.getPublic("thought-1"), null);
  assert.deepEqual(await boundary.getPreview("thought-1"), {
    id: "thought-1",
    draft: { title: "Draft v2" },
    published: null,
  });
});
