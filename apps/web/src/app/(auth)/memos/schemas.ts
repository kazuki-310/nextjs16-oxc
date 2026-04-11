import { z } from "zod";

export const createMemoSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルを入力してください")
    .max(100, "タイトルは100文字以内で入力してください"),
  body: z
    .string()
    .min(1, "本文を入力してください")
    .max(5000, "本文は5000文字以内で入力してください"),
});

export const deleteMemoSchema = z.object({
  id: z.number().int().positive(),
});
