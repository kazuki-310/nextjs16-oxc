import { prisma } from "@packages/database";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { signInSchema } from "@/lib/credentials-schema";

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
        const parsed = signInSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }
        const { identifier: raw, password } = parsed.data;

        const employee = raw.includes("@")
          ? await prisma.employee.findFirst({ where: { email: raw.toLowerCase() } })
          : await prisma.employee.findFirst({ where: { nickname: raw } });
        if (!employee) {
          return null;
        }

        const valid = await compare(password, employee.password);
        if (!valid) {
          return null;
        }

        return {
          id: String(employee.id),
          name: employee.name,
          email: employee.email ?? "",
          status: employee.status,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.email = user.email;
        token.status = user.status;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.name = token.name ?? "";
        session.user.email = token.email ?? "";
        session.user.status = token.status ?? "ACTIVE";
      }
      return session;
    },
  },
});
