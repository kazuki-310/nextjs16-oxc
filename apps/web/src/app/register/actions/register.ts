"use server";

import { prisma } from "@packages/database";
import { hash } from "bcrypt";
import { returnValidationErrors } from "next-safe-action";

import { signIn } from "@/lib/auth";
import { authSchema } from "@/lib/auth-schema";
import { actionClient } from "@/lib/safe-action";

const SALT_ROUNDS = 10;

export const registerEmployee = actionClient
  .inputSchema(authSchema)
  .action(async ({ parsedInput: { identifier, password } }) => {
    const isEmail = identifier.includes("@");

    const existing = await prisma.employee.findFirst({
      where: { OR: [{ email: identifier }, { nickname: identifier }] },
    });
    if (existing) {
      return returnValidationErrors(authSchema, {
        identifier: {
          _errors: [
            isEmail
              ? "このメールアドレスは既に登録されています"
              : "このニックネームは既に登録されています",
          ],
        },
      });
    }

    const passwordHash = await hash(password, SALT_ROUNDS);
    await prisma.employee.create({
      data: isEmail
        ? {
            name: identifier,
            nickname: null,
            email: identifier,
            password: passwordHash,
            status: "ACTIVE",
          }
        : {
            name: identifier,
            nickname: identifier,
            email: null,
            password: passwordHash,
            status: "ACTIVE",
          },
    });

    await signIn("credentials", {
      identifier,
      password,
      redirectTo: "/",
    });
  });
