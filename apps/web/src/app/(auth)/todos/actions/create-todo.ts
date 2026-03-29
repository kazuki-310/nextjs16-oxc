"use server";

import { prisma } from "@packages/database";
import { revalidatePath } from "next/cache";

import { authClient } from "@/lib/safe-action";

import { createTodoSchema } from "../schemas";

export const createTodo = authClient
  .inputSchema(createTodoSchema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    try {
      await prisma.todo.create({
        data: {
          title: parsedInput.title,
          authorId: Number(session.user.id),
        },
      });
    } catch {
      throw new Error("作成処理に失敗しました");
    }

    revalidatePath("/todos");
  });
