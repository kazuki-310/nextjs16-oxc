import "server-only";
import { prisma } from "@packages/database";
import { connection } from "next/server";
import { cache } from "react";

export const getTodos = cache(async () => {
  await connection();
  return prisma.todo.findMany({ orderBy: { createdAt: "desc" } });
});
