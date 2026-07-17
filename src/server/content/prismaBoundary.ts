import { prisma } from "@/lib/prisma";
import {
  createPrismaVersionedContentStore,
  createVersionedContentBoundary,
} from "./boundary";

export function createPrismaContentBoundary<TContent>(domain: string) {
  return createVersionedContentBoundary(
    createPrismaVersionedContentStore<TContent>(prisma, domain)
  );
}
