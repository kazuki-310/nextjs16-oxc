"use server";

import { AuthError } from "next-auth";

import { AccountLockedError, signIn } from "@/lib/auth";
import { authSchema } from "@/lib/auth-schema";
import { actionClient, ActionError } from "@/lib/safe-action";

export const loginAction = actionClient
  .inputSchema(authSchema)
  .action(async ({ parsedInput: { identifier, password } }) => {
    try {
      await signIn("credentials", { identifier, password, redirectTo: "/" });
    } catch (error) {
      if (error instanceof AccountLockedError) {
        throw new ActionError("アカウントがロックされています。30分後に再試行してください。");
      }
      if (error instanceof AuthError) {
        throw new ActionError("メールアドレス/ニックネームまたはパスワードが正しくありません");
      }

      throw error;
    }
  });
