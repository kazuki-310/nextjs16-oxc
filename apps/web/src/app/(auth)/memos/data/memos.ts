import "server-only";
import { type Memo, prisma } from "@packages/database";
import { connection } from "next/server";
import { cache } from "react";

export const getMemosForEmployee = cache(async (authorId: number): Promise<Memo[]> => {
  await connection();
  return prisma.memo.findMany({
    where: { authorId },
    orderBy: { updatedAt: "desc" },
  });
});
