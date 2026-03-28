"use server";

import { prisma } from "@packages/database";
import { hash } from "bcrypt";

import { authSchema } from "@/lib/auth-schema";

export type RegisterResult =
  | { ok: true; signInIdentifier: string }
  | { ok: false; message: string };

export async function registerEmployee(input: {
  identifier: string;
  password: string;
}): Promise<RegisterResult> {
  const parsed = authSchema.safeParse({
    identifier: input.identifier,
    password: input.password,
  });
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "入力が不正です";
    return { ok: false, message };
  }

  const { identifier: trimmed, password } = parsed.data;

  const isEmail = trimmed.includes("@");
  if (isEmail) {
    const email = trimmed.toLowerCase();
    const existing = await prisma.employee.findFirst({
      where: { email },
    });
    if (existing) {
      return {
        ok: false,
        message: "このメールアドレスは既に登録されています",
      };
    }

    const passwordHash = await hash(password, 10);
    await prisma.employee.create({
      data: {
        name: email,
        nickname: null,
        email,
        password: passwordHash,
        status: "ACTIVE",
      },
    });

    return { ok: true, signInIdentifier: email };
  }

  const nicknameSlug = trimmed.toLowerCase().replace(/[^a-z0-9._-]/g, "");
  if (!nicknameSlug) {
    return {
      ok: false,
      message: "ニックネームに使えるのは英数字・._- のみです",
    };
  }

  const existing = await prisma.employee.findFirst({
    where: { nickname: trimmed },
  });
  if (existing) {
    return {
      ok: false,
      message: "このニックネームは既に登録されています",
    };
  }

  const passwordHash = await hash(password, 10);
  await prisma.employee.create({
    data: {
      name: trimmed,
      nickname: trimmed,
      email: null,
      password: passwordHash,
      status: "ACTIVE",
    },
  });

  return { ok: true, signInIdentifier: trimmed };
}
