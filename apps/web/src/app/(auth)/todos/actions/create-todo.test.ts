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
    todo: {
      create: vi.fn(),
    },
  },
}));

import { prisma } from "@packages/database";

import { createTodo } from "./create-todo";

const todoCreate = vi.mocked(prisma.todo.create);

function sessionForUserId(id: string) {
  return { user: { id } };
}

beforeEach(() => {
  vi.clearAllMocks();
  authMock.mockResolvedValue(sessionForUserId("7"));
});

describe("createTodo（docs/specs/web/todos/functional/create-todo.md）", () => {
  it("未認証のとき serverError が返り DB は呼ばれない", async () => {
    authMock.mockResolvedValue(null);

    const result = await createTodo({ title: "x" });

    expect(result?.serverError).toBeDefined();
    expect(todoCreate).not.toHaveBeenCalled();
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("title が有効なとき authorId にセッション user.id を渡して作成し /todos を revalidate する", async () => {
    todoCreate.mockResolvedValue({} as Awaited<ReturnType<typeof todoCreate>>);

    const result = await createTodo({ title: "買い物" });

    expect(result?.serverError).toBeUndefined();
    expect(result?.validationErrors).toBeUndefined();
    expect(todoCreate).toHaveBeenCalledWith({
      data: {
        title: "買い物",
        authorId: 7,
      },
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/todos");
  });

  it("DB 失敗時は next-safe-action の handleServerError により「予期しないエラーが発生しました」", async () => {
    todoCreate.mockRejectedValue(new Error("db"));

    const result = await createTodo({ title: "x" });

    expect(result?.serverError).toBe("予期しないエラーが発生しました");
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("タイトル空は「タイトルを入力してください」", async () => {
    const result = await createTodo({ title: "" });

    expect(result?.validationErrors?.fieldErrors?.title).toContain("タイトルを入力してください");
    expect(todoCreate).not.toHaveBeenCalled();
  });
});
