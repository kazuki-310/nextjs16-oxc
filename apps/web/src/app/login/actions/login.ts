"use server";

import { prisma } from "@packages/database";

export async function resolveEmail(identifier: string): Promise<string | null> {
  if (identifier.includes("@")) return identifier;

  const employee = await prisma.employee.findUnique({
    where: { nickname: identifier },
    select: { email: true },
  });

  return employee?.email ?? null;
}
