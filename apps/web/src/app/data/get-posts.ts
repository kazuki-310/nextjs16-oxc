import "server-only";
import { prisma } from "@packages/database";
import type { Post } from "@packages/database";
import { cache } from "react";

export const getPosts = cache(async (): Promise<Post[]> => {
  return prisma.post.findMany({ orderBy: { id: "desc" } });
});
