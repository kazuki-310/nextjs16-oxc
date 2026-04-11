/** 仕様: docs/specs/web/focus-tips/functional/fetch-daily-focus-tip.md */

const EMPTY_FALLBACK =
  "ヒントがまだ登録されていません。データベースに focus_tips を投入してください。";

function toLabelDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function daySeed(date: Date): number {
  const y = date.getUTCFullYear();
  const mo = date.getUTCMonth() + 1;
  const da = date.getUTCDate();
  return y * 10_000 + mo * 100 + da;
}

export function selectDailyFocusTip(
  bodies: readonly string[],
  date: Date,
): { labelDate: string; body: string } {
  const labelDate = toLabelDate(date);
  if (bodies.length === 0) {
    return { labelDate, body: EMPTY_FALLBACK };
  }
  const index = daySeed(date) % bodies.length;
  return { labelDate, body: bodies[index] };
}
