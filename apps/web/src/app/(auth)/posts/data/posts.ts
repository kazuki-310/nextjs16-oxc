import "server-only";
import { prisma } from "@packages/database";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";

export const getPosts = cache(async () => {
  await connection();
  return prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });
});

export const getPost = cache(async (id: number) => {
  await connection();

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();
  return post;
});
