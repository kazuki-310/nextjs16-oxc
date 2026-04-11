import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const authMock = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: () => authMock(),
}));

const revalidatePathMock = vi.fn();
vi.mock("next/cache", () => ({
  revalidatePath: (...args: unknown[]) => revalidatePathMock(...args),
}));

vi.mock("@packages/database", () => ({
  prisma: {
    memo: {
      create: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

import { prisma } from "@packages/database";

import { createMemo } from "./create-memo";
import { deleteMemo } from "./delete-memo";

const memoCreate = vi.mocked(prisma.memo.create);
const memoDeleteMany = vi.mocked(prisma.memo.deleteMany);

function sessionForUserId(id: string) {
  return { user: { id } };
}

beforeEach(() => {
  vi.clearAllMocks();
  authMock.mockResolvedValue(sessionForUserId("10"));
});

describe("createMemo（docs/specs/web/memos/functional/create-memo.md）", () => {
  it("未認証のとき serverError が返り DB は呼ばれない", async () => {
    authMock.mockResolvedValue(null);

    const result = await createMemo({ title: "t", body: "b" });

    expect(result?.serverError).toBeDefined();
    expect(memoCreate).not.toHaveBeenCalled();
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("user.id が非数値のとき serverError が返り DB は呼ばれない", async () => {
    authMock.mockResolvedValue({ user: { id: "abc" } });

    const result = await createMemo({ title: "t", body: "b" });

    expect(result?.serverError).toBeDefined();
    expect(memoCreate).not.toHaveBeenCalled();
  });

  it("user.id が 0 のとき serverError が返り DB は呼ばれない", async () => {
    authMock.mockResolvedValue({ user: { id: "0" } });

    const result = await createMemo({ title: "t", body: "b" });

    expect(result?.serverError).toBeDefined();
    expect(memoCreate).not.toHaveBeenCalled();
  });

  it("title・body が有効なとき authorId にセッション user.id を渡して作成し /memos を revalidate する", async () => {
    memoCreate.mockResolvedValue({} as Awaited<ReturnType<typeof memoCreate>>);

    const result = await createMemo({ title: "件名", body: "本文です" });

    expect(result?.serverError).toBeUndefined();
    expect(result?.validationErrors).toBeUndefined();
    expect(memoCreate).toHaveBeenCalledWith({
      data: {
        title: "件名",
        body: "本文です",
        authorId: 10,
      },
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/memos");
  });

  it("DB 失敗時は serverError が「メモの作成に失敗しました」", async () => {
    memoCreate.mockRejectedValue(new Error("db down"));

    const result = await createMemo({ title: "t", body: "b" });

    expect(result?.data).toBeUndefined();
    expect(result?.serverError).toBe("メモの作成に失敗しました");
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("タイトル空はバリデーションエラー（スキーマメッセージ）", async () => {
    const result = await createMemo({ title: "", body: "本文" });

    expect(result?.serverError).toBeUndefined();
    expect(result?.validationErrors?.fieldErrors?.title).toContain("タイトルを入力してください");
    expect(memoCreate).not.toHaveBeenCalled();
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("本文空はバリデーションエラー（スキーマメッセージ）", async () => {
    const result = await createMemo({ title: "件名", body: "" });

    expect(result?.validationErrors?.fieldErrors?.body).toContain("本文を入力してください");
    expect(memoCreate).not.toHaveBeenCalled();
  });

  it("タイトルが 100 文字超はバリデーションエラー", async () => {
    const result = await createMemo({ title: "a".repeat(101), body: "b" });

    expect(result?.validationErrors?.fieldErrors?.title?.length).toBeGreaterThan(0);
    expect(memoCreate).not.toHaveBeenCalled();
  });

  it("本文が 5000 文字超はバリデーションエラー", async () => {
    const result = await createMemo({ title: "t", body: "b".repeat(5001) });

    expect(result?.validationErrors?.fieldErrors?.body?.length).toBeGreaterThan(0);
    expect(memoCreate).not.toHaveBeenCalled();
  });
});

describe("deleteMemo（docs/specs/web/memos/functional/delete-memo.md）", () => {
  it("未認証のとき serverError が返り DB は呼ばれない", async () => {
    authMock.mockResolvedValue(null);

    const result = await deleteMemo({ id: 1 });

    expect(result?.serverError).toBeDefined();
    expect(memoDeleteMany).not.toHaveBeenCalled();
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("自分のメモなら id と authorId を条件に deleteMany し /memos を revalidate する", async () => {
    memoDeleteMany.mockResolvedValue({ count: 1 });

    const result = await deleteMemo({ id: 1 });

    expect(result?.serverError).toBeUndefined();
    expect(memoDeleteMany).toHaveBeenCalledWith({
      where: { id: 1, authorId: 10 },
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/memos");
  });

  it("メモが存在しないか authorId 不一致のとき「メモが見つからないか削除権限がありません」", async () => {
    memoDeleteMany.mockResolvedValue({ count: 0 });

    const result = await deleteMemo({ id: 999 });

    expect(result?.serverError).toBe("メモが見つからないか削除権限がありません");
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("DB 削除失敗時は serverError が「メモの削除に失敗しました」", async () => {
    memoDeleteMany.mockRejectedValue(new Error("db error"));

    const result = await deleteMemo({ id: 3 });

    expect(result?.serverError).toBe("メモの削除に失敗しました");
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });
});
