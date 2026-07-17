import { prisma } from "@/lib/prisma";
import { asThought } from "./domain";
import type { Thought } from "./types";

const domain = "thoughts";

type Document = {
  id: string;
  draft: unknown;
  published: unknown;
};

async function documents(): Promise<Document[]> {
  if (process.env.NEXT_PHASE === "phase-production-build") return [];

  return prisma.contentDocument.findMany({
    where: { domain },
    select: { id: true, draft: true, published: true },
  });
}

export async function getPublishedThoughts(): Promise<Thought[]> {
  return (await documents())
    .map((document) => asThought(document.published))
    .filter((thought): thought is Thought => thought !== null)
    .sort((a, b) => a.order - b.order);
}

export async function getFeaturedThoughts(): Promise<Thought[]> {
  return (await getPublishedThoughts())
    .filter((thought) => thought.featured)
    .sort((a, b) => a.featuredOrder - b.featuredOrder)
    .slice(0, 5);
}

export async function getPublishedThought(slug: string): Promise<Thought | null> {
  return (await getPublishedThoughts()).find((thought) => thought.slug === slug) ?? null;
}

export async function getThoughtDocuments() {
  if (process.env.NEXT_PHASE === "phase-production-build") return [];

  return prisma.contentDocument.findMany({
    where: { domain },
    orderBy: { updatedAt: "desc" },
    select: { id: true, draft: true, published: true, updatedAt: true },
  });
}
