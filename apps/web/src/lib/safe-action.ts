import { createSafeActionClient } from "next-safe-action";

import { auth } from "@/lib/auth";

// ユーザーに表示するメッセージを持つ意図的なエラー
// handleServerError はこのクラスのみ message をそのまま返す
export class ActionError extends Error {}

// 認証不要（ログイン・登録など）
export const actionClient = createSafeActionClient({
  defaultValidationErrorsShape: "flattened",
  handleServerError(e) {
    console.error("Action error:", e.message);
    if (e instanceof ActionError) return e.message;

    return "予期しないエラーが発生しました";
  },
});

// 認証必須（業務系 Action 用）
export const authClient = actionClient.use(async ({ next }) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const userId = parseInt(session.user.id, 10);
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error("Unauthorized");
  }

  return next({ ctx: { session } });
});
