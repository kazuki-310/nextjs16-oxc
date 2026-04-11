"use server";

import { prisma } from "@packages/database";
import { revalidatePath } from "next/cache";

import { ActionError, authClient } from "@/lib/safe-action";

import { deleteMemoSchema } from "../schemas";

export const deleteMemo = authClient
  .inputSchema(deleteMemoSchema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    try {
      const deleted = await prisma.memo.deleteMany({
        where: { id: parsedInput.id, authorId: Number(session.user.id) },
      });
      if (deleted.count === 0) {
        throw new ActionError("メモが見つからないか削除権限がありません");
      }
    } catch (error) {
      if (error instanceof ActionError) {
        throw error;
      }
      throw new ActionError("メモの削除に失敗しました");
    }

    revalidatePath("/memos");
  });
