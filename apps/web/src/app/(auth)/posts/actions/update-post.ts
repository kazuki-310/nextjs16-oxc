"use server";

import { prisma } from "@packages/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ActionError, authClient } from "@/lib/safe-action";

import { updatePostSchema } from "../schemas";

export const updatePost = authClient
  .inputSchema(updatePostSchema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    const post = await prisma.post.findUnique({
      where: { id: parsedInput.id },
    });

    if (!post) {
      throw new ActionError("投稿が見つかりません");
    }

    if (post.authorId !== Number(session.user.id)) {
      throw new ActionError("編集権限がありません");
    }

    try {
      await prisma.post.update({
        where: { id: parsedInput.id },
        data: {
          title: parsedInput.title,
          content: parsedInput.content,
        },
      });
    } catch {
      throw new ActionError("更新処理に失敗しました");
    }

    revalidatePath("/posts");
    redirect("/posts");
  });
