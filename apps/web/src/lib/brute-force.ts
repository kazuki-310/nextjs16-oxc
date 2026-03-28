import "server-only";
import { type Employee, prisma } from "@packages/database";

// ログイン失敗の最大許容回数。これを超えるとアカウントをロックする
const MAX_FAILED_ATTEMPTS = 5;
// アカウントロックの継続時間（ミリ秒）
const LOCK_DURATION_MS = 30 * 60 * 1000; // 30分

// アカウントがロック中かどうかを判定する
// unlockAt が null（ロック設定なし）または過去の日時（ロック期限切れ）の場合は false を返す
export function isAccountLocked(employee: Employee): boolean {
  return employee.unlockAt !== null && employee.unlockAt > new Date();
}

// 現在の有効な失敗回数を返す
// ロック期限が切れている場合はカウントをリセット済みとみなして 0 を返す
// ロック中またはロックなしの場合は DB の値をそのまま返す
export function getEffectiveFailedAttempts(employee: Employee): number {
  const lockExpired = employee.unlockAt !== null && employee.unlockAt <= new Date();
  return lockExpired ? 0 : employee.failedLoginAttempts;
}

// ログイン失敗時に呼び出す
// 失敗回数を 1 増やし、MAX_FAILED_ATTEMPTS に達した場合は unlockAt をセットしてアカウントをロックする
export async function recordFailedLogin(
  employeeId: number,
  currentAttempts: number,
): Promise<void> {
  const newAttempts = currentAttempts + 1;
  await prisma.employee.update({
    where: { id: employeeId },
    data: {
      failedLoginAttempts: newAttempts,
      unlockAt: newAttempts >= MAX_FAILED_ATTEMPTS ? new Date(Date.now() + LOCK_DURATION_MS) : null,
    },
  });
}

// ログイン成功時に呼び出す
// 失敗回数と unlockAt をリセットする
export async function resetLoginAttempts(employeeId: number): Promise<void> {
  await prisma.employee.update({
    where: { id: employeeId },
    data: { failedLoginAttempts: 0, unlockAt: null },
  });
}
