import z, { object, string } from "zod";

export const authSchema = object({
  identifier: string({
    error: "ニックネームまたはメールアドレスを入力してください",
  })
    .trim()
    .min(1, "ニックネームまたはメールアドレスを入力してください")
    .refine(
      (val) => !val.includes("@") || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      "メールアドレスの形式が正しくありません",
    )
    .refine(
      (val) => val.includes("@") || /^[a-zA-Z0-9._-]+$/.test(val),
      "ニックネームに使えるのは英数字・._- のみです",
    ),
  password: string({ error: "パスワードを入力してください" })
    .min(1, "パスワードを入力してください")
    .min(8, "パスワードは8文字以上で入力してください")
    .max(32, "パスワードは32文字以内で入力してください"),
});

export type AuthSchema = z.infer<typeof authSchema>;
