import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const authMock = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: () => authMock(),
}));

const redirectMock = vi.fn();
vi.mock("next/navigation", () => ({
  redirect: (url: string) => redirectMock(url),
}));

const revalidatePathMock = vi.fn();
vi.mock("next/cache", () => ({
  revalidatePath: (...args: unknown[]) => revalidatePathMock(...args),
}));

vi.mock("@packages/database", () => ({
  prisma: {
    post: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import { prisma } from "@packages/database";

import { createPost } from "./create-post";
import { updatePost } from "./update-post";

const postCreate = vi.mocked(prisma.post.create);
const postFindUnique = vi.mocked(prisma.post.findUnique);
const postUpdate = vi.mocked(prisma.post.update);

function sessionForUserId(id: string) {
  return { user: { id } };
}

beforeEach(() => {
  vi.clearAllMocks();
  authMock.mockResolvedValue(sessionForUserId("10"));
});

describe("createPost（docs/specs/web/posts/functional/create-post.md）", () => {
  it("未認証のとき serverError が返り DB は呼ばれない", async () => {
    authMock.mockResolvedValue(null);

    const result = await createPost({ title: "t", content: "c" });

    expect(result?.serverError).toBeDefined();
    expect(postCreate).not.toHaveBeenCalled();
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("有効な入力で authorId 付きで post を作成し /posts へ redirect する", async () => {
    postCreate.mockResolvedValue({} as Awaited<ReturnType<typeof postCreate>>);

    const result = await createPost({
      title: "件名",
      content: "本文",
    });

    expect(result?.serverError).toBeUndefined();
    expect(result?.validationErrors).toBeUndefined();
    expect(postCreate).toHaveBeenCalledWith({
      data: {
        title: "件名",
        content: "本文",
        authorId: 10,
      },
    });
    expect(redirectMock).toHaveBeenCalledWith("/posts");
  });

  it("DB 失敗時は「作成処理に失敗しました」", async () => {
    postCreate.mockRejectedValue(new Error("db"));

    const result = await createPost({ title: "t", content: "c" });

    expect(result?.serverError).toBe("作成処理に失敗しました");
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("タイトル空はバリデーションエラー", async () => {
    const result = await createPost({ title: "", content: "c" });

    expect(result?.validationErrors?.fieldErrors?.title?.length).toBeGreaterThan(0);
    expect(postCreate).not.toHaveBeenCalled();
  });

  it("本文空はバリデーションエラー", async () => {
    const result = await createPost({ title: "t", content: "" });

    expect(result?.validationErrors?.fieldErrors?.content?.length).toBeGreaterThan(0);
    expect(postCreate).not.toHaveBeenCalled();
  });

  it("タイトルが 100 文字超はバリデーションエラー", async () => {
    const result = await createPost({ title: "a".repeat(101), content: "b" });

    expect(result?.validationErrors?.fieldErrors?.title?.length).toBeGreaterThan(0);
    expect(postCreate).not.toHaveBeenCalled();
  });
});

describe("updatePost（docs/specs/web/posts/functional/update-post.md）", () => {
  it("未認証のとき serverError が返り DB は呼ばれない", async () => {
    authMock.mockResolvedValue(null);

    const result = await updatePost({ id: 1, title: "t", content: "c" });

    expect(result?.serverError).toBeDefined();
    expect(postFindUnique).not.toHaveBeenCalled();
    expect(postUpdate).not.toHaveBeenCalled();
  });

  it("自分の投稿なら更新し revalidate して /posts へ redirect する", async () => {
    postFindUnique.mockResolvedValue({
      id: 1,
      title: "old",
      content: "oldc",
      authorId: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    postUpdate.mockResolvedValue({} as Awaited<ReturnType<typeof postUpdate>>);

    const result = await updatePost({
      id: 1,
      title: "新タイトル",
      content: "新本文",
    });

    expect(result?.serverError).toBeUndefined();
    expect(postUpdate).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        title: "新タイトル",
        content: "新本文",
      },
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/posts");
    expect(redirectMock).toHaveBeenCalledWith("/posts");
  });

  it("投稿がないとき「投稿が見つかりません」", async () => {
    postFindUnique.mockResolvedValue(null);

    const result = await updatePost({
      id: 99,
      title: "t",
      content: "c",
    });

    expect(result?.serverError).toBe("投稿が見つかりません");
    expect(postUpdate).not.toHaveBeenCalled();
    expect(revalidatePathMock).not.toHaveBeenCalled();
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("authorId が一致しないとき「編集権限がありません」", async () => {
    postFindUnique.mockResolvedValue({
      id: 2,
      title: "x",
      content: "y",
      authorId: 88,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await updatePost({
      id: 2,
      title: "t",
      content: "c",
    });

    expect(result?.serverError).toBe("編集権限がありません");
    expect(postUpdate).not.toHaveBeenCalled();
  });

  it("DB 更新失敗時は「更新処理に失敗しました」", async () => {
    postFindUnique.mockResolvedValue({
      id: 3,
      title: "x",
      content: "y",
      authorId: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    postUpdate.mockRejectedValue(new Error("db"));

    const result = await updatePost({
      id: 3,
      title: "t",
      content: "c",
    });

    expect(result?.serverError).toBe("更新処理に失敗しました");
    expect(revalidatePathMock).not.toHaveBeenCalled();
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("タイトル 100 文字超はバリデーションエラー", async () => {
    const result = await updatePost({
      id: 1,
      title: "a".repeat(101),
      content: "b",
    });

    expect(result?.validationErrors?.fieldErrors?.title?.length).toBeGreaterThan(0);
    expect(postFindUnique).not.toHaveBeenCalled();
  });
});
