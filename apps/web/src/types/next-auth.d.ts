import type { EmployeeStatus } from "@packages/database";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    status: EmployeeStatus;
  }

  interface Session {
    user: {
      id: string;
      status: EmployeeStatus;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    status?: EmployeeStatus;
  }
}
