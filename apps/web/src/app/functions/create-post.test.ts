import { describe, expect, it, vi } from "vitest";

vi.mock("@packages/database", () => ({
  prisma: {
    post: {
      create: vi.fn().mockResolvedValue({ id: 1 }),
    },
  },
}));

import { createPost, type CreatePostState } from "./create-post";

const idle: CreatePostState = { status: "idle" };

function makeFormData(fields: Record<string, string>): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, value);
  }
  return formData;
}

describe("createPost", () => {
  it("title と body が揃っていれば成功を返す", async () => {
    const result = await createPost(idle, makeFormData({ title: "Hello", body: "World" }));

    expect(result).toEqual({ status: "success", id: "1" });
  });

  it("title が空文字のときエラーを返す", async () => {
    const result = await createPost(idle, makeFormData({ title: "", body: "World" }));

    expect(result).toEqual({ status: "error", error: "Title is required" });
  });

  it("title がスペースのみのときエラーを返す", async () => {
    const result = await createPost(idle, makeFormData({ title: "   ", body: "World" }));

    expect(result).toEqual({ status: "error", error: "Title is required" });
  });

  it("body が空文字のときエラーを返す", async () => {
    const result = await createPost(idle, makeFormData({ title: "Hello", body: "" }));

    expect(result).toEqual({ status: "error", error: "Body is required" });
  });

  it("body がスペースのみのときエラーを返す", async () => {
    const result = await createPost(idle, makeFormData({ title: "Hello", body: "   " }));

    expect(result).toEqual({ status: "error", error: "Body is required" });
  });
});
