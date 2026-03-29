import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1, "タイトルを入力してください").max(100),
  content: z.string().min(1, "本文を入力してください"),
});

export const updatePostSchema = z.object({
  id: z.number(),
  title: z.string().min(1, "タイトルを入力してください").max(100),
  content: z.string().min(1, "本文を入力してください"),
});
