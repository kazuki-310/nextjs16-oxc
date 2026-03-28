import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@packages/database", () => ({
  prisma: {
    employee: {
      update: vi.fn(),
    },
  },
}));

import { prisma } from "@packages/database";
import type { Employee } from "@packages/database";

import {
  getEffectiveFailedAttempts,
  isAccountLocked,
  recordFailedLogin,
  resetLoginAttempts,
} from "./brute-force";

const FUTURE = new Date(Date.now() + 60 * 60 * 1000); // 1時間後
const PAST = new Date(Date.now() - 60 * 60 * 1000); // 1時間前

function makeEmployee(overrides: Partial<Employee> = {}): Employee {
  return {
    id: 1,
    name: "taro",
    nickname: "taro",
    email: "taro@example.com",
    password: "hashed",
    status: "ACTIVE",
    failedLoginAttempts: 0,
    unlockAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("isAccountLocked", () => {
  it("unlockAt が null の場合は false", () => {
    expect(isAccountLocked(makeEmployee({ unlockAt: null }))).toBe(false);
  });

  it("unlockAt が未来の場合は true（ロック中）", () => {
    expect(isAccountLocked(makeEmployee({ unlockAt: FUTURE }))).toBe(true);
  });

  it("unlockAt が過去の場合は false（期限切れ）", () => {
    expect(isAccountLocked(makeEmployee({ unlockAt: PAST }))).toBe(false);
  });
});

describe("getEffectiveFailedAttempts", () => {
  it("unlockAt が null の場合は failedLoginAttempts をそのまま返す", () => {
    const employee = makeEmployee({ failedLoginAttempts: 3, unlockAt: null });
    expect(getEffectiveFailedAttempts(employee)).toBe(3);
  });

  it("ロック中（unlockAt が未来）の場合は failedLoginAttempts をそのまま返す", () => {
    const employee = makeEmployee({ failedLoginAttempts: 5, unlockAt: FUTURE });
    expect(getEffectiveFailedAttempts(employee)).toBe(5);
  });

  it("ロック期限切れ（unlockAt が過去）の場合は 0 を返す", () => {
    const employee = makeEmployee({ failedLoginAttempts: 5, unlockAt: PAST });
    expect(getEffectiveFailedAttempts(employee)).toBe(0);
  });
});

describe("recordFailedLogin", () => {
  it("失敗回数が閾値未満の場合は unlockAt を null でセットする", async () => {
    await recordFailedLogin(1, 3); // 3回目 → 4回目

    expect(prisma.employee.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { failedLoginAttempts: 4, unlockAt: null },
    });
  });

  it("失敗回数が閾値（5回）に達した場合は unlockAt をセットしてロックする", async () => {
    await recordFailedLogin(1, 4); // 4回目 → 5回目でロック

    expect(prisma.employee.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { failedLoginAttempts: 5, unlockAt: expect.any(Date) },
    });
  });
});

describe("resetLoginAttempts", () => {
  it("failedLoginAttempts と unlockAt をリセットする", async () => {
    await resetLoginAttempts(1);

    expect(prisma.employee.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { failedLoginAttempts: 0, unlockAt: null },
    });
  });
});
