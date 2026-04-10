"use server";

import { prisma } from "@packages/database";
import { redirect } from "next/navigation";

import { ActionError, authClient } from "@/lib/safe-action";

import { createPostSchema } from "../schemas";

export const createPost = authClient
  .inputSchema(createPostSchema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    try {
      await prisma.post.create({
        data: {
          title: parsedInput.title,
          content: parsedInput.content,
          authorId: Number(session.user.id),
        },
      });
    } catch {
      throw new ActionError("作成処理に失敗しました");
    }

    redirect("/posts");
  });
