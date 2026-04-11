import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("next-auth", () => ({
  AuthError: class AuthError extends Error {},
}));

vi.mock("@/lib/auth", () => {
  class AccountLockedError extends Error {
    code = "account_locked";
  }
  return {
    AccountLockedError,
    signIn: vi.fn(),
  };
});

import { AuthError } from "next-auth";

import { AccountLockedError, signIn } from "@/lib/auth";

import { loginAction } from "./login";

const signInMock = vi.mocked(signIn);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("loginAction（docs/specs/web/auth/functional/login.md）", () => {
  it('成功時は signIn("credentials", { identifier, password, redirectTo: "/" }) を呼ぶ', async () => {
    signInMock.mockResolvedValue(undefined as never);

    const result = await loginAction({
      identifier: "taro",
      password: "password12",
    });

    expect(result?.serverError).toBeUndefined();
    expect(result?.validationErrors).toBeUndefined();
    expect(signInMock).toHaveBeenCalledWith("credentials", {
      identifier: "taro",
      password: "password12",
      redirectTo: "/",
    });
  });

  it("AccountLockedError のとき「アカウントがロックされています。30分後に再試行してください。」", async () => {
    signInMock.mockRejectedValue(new AccountLockedError());

    const result = await loginAction({
      identifier: "taro",
      password: "password12",
    });

    expect(result?.serverError).toBe(
      "アカウントがロックされています。30分後に再試行してください。",
    );
  });

  it("AuthError のとき「メールアドレス/ニックネームまたはパスワードが正しくありません」", async () => {
    signInMock.mockRejectedValue(new AuthError());

    const result = await loginAction({
      identifier: "taro",
      password: "password12",
    });

    expect(result?.serverError).toBe(
      "メールアドレス/ニックネームまたはパスワードが正しくありません",
    );
  });

  it("上記以外のエラーは handleServerError で「予期しないエラーが発生しました」", async () => {
    signInMock.mockRejectedValue(new Error("network"));

    const result = await loginAction({
      identifier: "taro",
      password: "password12",
    });

    expect(result?.serverError).toBe("予期しないエラーが発生しました");
  });

  it("identifier 空は authSchema のバリデーションエラー", async () => {
    const result = await loginAction({ identifier: "", password: "password12" });

    expect(result?.validationErrors?.fieldErrors?.identifier?.length).toBeGreaterThan(0);
    expect(signInMock).not.toHaveBeenCalled();
  });

  it("パスワードが短すぎると authSchema のバリデーションエラー", async () => {
    const result = await loginAction({ identifier: "taro", password: "short" });

    expect(result?.validationErrors?.fieldErrors?.password).toContain(
      "パスワードは8文字以上で入力してください",
    );
    expect(signInMock).not.toHaveBeenCalled();
  });
});
