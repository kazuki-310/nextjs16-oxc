import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/lib/auth", () => ({
  signIn: vi.fn(),
}));

vi.mock("bcrypt", () => ({
  hash: vi.fn(),
}));

vi.mock("@packages/database", () => ({
  prisma: {
    employee: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import { prisma } from "@packages/database";
import { hash } from "bcrypt";

import { signIn } from "@/lib/auth";

import { registerEmployee } from "./register";

const signInMock = vi.mocked(signIn);
const hashMock = vi.mocked(hash);
const findFirst = vi.mocked(prisma.employee.findFirst);
const create = vi.mocked(prisma.employee.create);

beforeEach(() => {
  vi.clearAllMocks();
  hashMock.mockResolvedValue("hashed_password" as never);
  signInMock.mockResolvedValue(undefined as never);
});

describe("registerEmployee（docs/specs/web/register/functional/register-employee.md）", () => {
  it("メールが既に登録済みなら identifier に「このメールアドレスは既に登録されています」", async () => {
    findFirst.mockResolvedValue({
      id: 1,
      name: "x",
      nickname: null,
      email: "a@example.com",
      password: "p",
      status: "ACTIVE",
      failedLoginAttempts: 0,
      unlockAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await registerEmployee({
      identifier: "a@example.com",
      password: "password12",
    });

    expect(result?.validationErrors?.fieldErrors?.identifier).toContain(
      "このメールアドレスは既に登録されています",
    );
    expect(create).not.toHaveBeenCalled();
    expect(signInMock).not.toHaveBeenCalled();
  });

  it("ニックネームが既に登録済みなら「このニックネームは既に登録されています」", async () => {
    findFirst.mockResolvedValue({
      id: 1,
      name: "taro",
      nickname: "taro",
      email: null,
      password: "p",
      status: "ACTIVE",
      failedLoginAttempts: 0,
      unlockAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await registerEmployee({
      identifier: "taro",
      password: "password12",
    });

    expect(result?.validationErrors?.fieldErrors?.identifier).toContain(
      "このニックネームは既に登録されています",
    );
    expect(create).not.toHaveBeenCalled();
  });

  it("メール新規登録: bcrypt(10) でハッシュし employee を作成して signIn する", async () => {
    findFirst.mockResolvedValue(null);
    create.mockResolvedValue({} as Awaited<ReturnType<typeof create>>);

    const result = await registerEmployee({
      identifier: "new@example.com",
      password: "password12",
    });

    expect(result?.serverError).toBeUndefined();
    expect(hashMock).toHaveBeenCalledWith("password12", 10);
    expect(create).toHaveBeenCalledWith({
      data: {
        name: "new@example.com",
        nickname: null,
        email: "new@example.com",
        password: "hashed_password",
        status: "ACTIVE",
      },
    });
    expect(signInMock).toHaveBeenCalledWith("credentials", {
      identifier: "new@example.com",
      password: "password12",
      redirectTo: "/",
    });
  });

  it("ニックネーム新規登録: nickname と name に identifier、email は null", async () => {
    findFirst.mockResolvedValue(null);
    create.mockResolvedValue({} as Awaited<ReturnType<typeof create>>);

    await registerEmployee({
      identifier: "nick_user",
      password: "password12",
    });

    expect(create).toHaveBeenCalledWith({
      data: {
        name: "nick_user",
        nickname: "nick_user",
        email: null,
        password: "hashed_password",
        status: "ACTIVE",
      },
    });
  });

  it("パスワード短すぎは authSchema のバリデーションエラー", async () => {
    const result = await registerEmployee({
      identifier: "taro",
      password: "short",
    });

    expect(result?.validationErrors?.fieldErrors?.password?.length).toBeGreaterThan(0);
    expect(findFirst).not.toHaveBeenCalled();
  });
});
