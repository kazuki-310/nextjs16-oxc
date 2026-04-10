import { prisma } from "@packages/database";
import { compare } from "bcrypt";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authSchema } from "@/lib/auth-schema";
import {
  getEffectiveFailedAttempts,
  isAccountLocked,
  recordFailedLogin,
  resetLoginAttempts,
} from "@/lib/brute-force";

export class AccountLockedError extends CredentialsSignin {
  code = "account_locked";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        identifier: {
          label: "ニックネームまたはメールアドレス",
          type: "text",
          placeholder: "ニックネームまたはメールアドレスを入力",
        },
        password: {
          label: "パスワード",
          type: "password",
          placeholder: "パスワードを入力",
        },
      },
      async authorize(credentials) {
        const { identifier, password } = await authSchema.parseAsync(credentials);

        const employee = await prisma.employee.findFirst({
          where: { OR: [{ email: identifier }, { nickname: identifier }] },
        });
        if (!employee) {
          throw new Error("ユーザーが存在しません");
        }

        if (isAccountLocked(employee)) {
          throw new AccountLockedError();
        }

        const currentAttempts = getEffectiveFailedAttempts(employee);

        const valid = await compare(password, employee.password);
        if (!valid) {
          await recordFailedLogin(employee.id, currentAttempts);
          throw new Error("パスワードが正しくありません");
        }

        await resetLoginAttempts(employee.id);

        return { id: String(employee.id) };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1日
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
      }
      return session;
    },
  },
});
