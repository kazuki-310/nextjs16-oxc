import "server-only";
import { prisma } from "@packages/database";
import { connection } from "next/server";
import { cache } from "react";

import { selectDailyFocusTip } from "../lib/select-daily-focus-tip";

export const getDailyFocusTip = cache(async (date: Date) => {
  await connection();
  const tips = await prisma.focusTip.findMany({
    orderBy: { sortOrder: "asc" },
    select: { body: true },
  });
  const bodies = tips.map((row) => row.body);
  return selectDailyFocusTip(bodies, date);
});
