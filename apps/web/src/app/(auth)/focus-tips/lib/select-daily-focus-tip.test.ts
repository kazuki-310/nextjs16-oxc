import { describe, expect, it } from "vitest";

import { selectDailyFocusTip } from "./select-daily-focus-tip";

describe("selectDailyFocusTip（docs/specs/web/focus-tips/functional/fetch-daily-focus-tip.md）", () => {
  it("候補が空のときフォールバック文言を返す", () => {
    const date = new Date(Date.UTC(2026, 3, 12));
    const result = selectDailyFocusTip([], date);
    expect(result.labelDate).toBe("2026-04-12");
    expect(result.body).toContain("focus_tips");
  });

  it("同一 UTC 日付では同じインデックスを選ぶ", () => {
    const date = new Date(Date.UTC(2026, 3, 12));
    const first = selectDailyFocusTip(["x", "y", "z"], date);
    const second = selectDailyFocusTip(["x", "y", "z"], date);
    expect(first.body).toBe(second.body);
    expect(first.body).toBe("z");
  });
});
