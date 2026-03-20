import { prisma } from "@packages/database";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
  user: {
    modelName: "employee",
    additionalFields: {
      nickname: {
        type: "string",
        required: true,
        unique: true,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.AUTH_SECRET,
});

export type Session = typeof auth.$Infer.Session;
