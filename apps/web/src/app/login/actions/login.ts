"use server";

import { AuthError } from "next-auth";

import { AccountLockedError, signIn } from "@/lib/auth";
import type { ActionResult } from "@/types/action";

export async function loginAction(
  identifier: string,
  password: string,
): Promise<ActionResult<undefined>> {
  try {
    await signIn("credentials", { identifier, password, redirectTo: "/" });
    return { success: true };
  } catch (error) {
    if (error instanceof AccountLockedError) {
      return {
        success: false,
        error: "アカウントがロックされています。30分後に再試行してください。",
      };
    }
    if (error instanceof AuthError) {
      return {
        success: false,
        error: "メールアドレス/ニックネームまたはパスワードが正しくありません",
      };
    }
    throw error;
  }
}
