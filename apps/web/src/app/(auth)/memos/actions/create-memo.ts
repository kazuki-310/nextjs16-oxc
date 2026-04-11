"use server";

import { prisma } from "@packages/database";
import { revalidatePath } from "next/cache";

import { ActionError, authClient } from "@/lib/safe-action";

import { createMemoSchema } from "../schemas";

export const createMemo = authClient
  .inputSchema(createMemoSchema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    try {
      await prisma.memo.create({
        data: {
          title: parsedInput.title,
          body: parsedInput.body,
          authorId: Number(session.user.id),
        },
      });
    } catch (error) {
      if (error instanceof ActionError) {
        throw error;
      }
      throw new ActionError("メモの作成に失敗しました");
    }

    revalidatePath("/memos");
  });
