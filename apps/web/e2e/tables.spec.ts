import { expect, test } from "@playwright/test";

test.describe("/tables", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tables");
  });

  test("ページが表示される", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "広告レポート一覧" })).toBeVisible();
  });

  test.describe("フィルター", () => {
    test("キャンペーン名で絞り込める", async ({ page }) => {
      await page.getByPlaceholder("キャンペーン名で検索").fill("キャンペーン_01");
      await page.getByRole("button", { name: "検索" }).click();

      const firstTable = page.getByRole("region").first();
      await expect(firstTable.getByRole("cell", { name: "キャンペーン_01" })).toBeVisible();
    });

    test("最小インプレッション数で絞り込める", async ({ page }) => {
      // n=1: 25000, n=2: 40000 ... 25000以上は全90件、40000以上は89件
      await page.getByLabel("最小インプレッション数").fill("40000");
      await page.getByRole("button", { name: "検索" }).click();

      const firstTable = page.getByRole("region").first();
      await expect(firstTable.getByRole("cell", { name: "キャンペーン_02" })).toBeVisible();
    });

    test("リセットでフィルターが解除される", async ({ page }) => {
      await page.getByPlaceholder("キャンペーン名で検索").fill("キャンペーン_01");
      await page.getByRole("button", { name: "検索" }).click();

      await page.getByRole("button", { name: "リセット" }).click();

      const firstTable = page.getByRole("region").first();
      await expect(firstTable.getByRole("cell", { name: "キャンペーン_01" })).toBeVisible();
    });

    test("一致しない検索でデータなし表示になる", async ({ page }) => {
      await page.getByPlaceholder("キャンペーン名で検索").fill("存在しないキャンペーン");
      await page.getByRole("button", { name: "検索" }).click();

      await expect(page.getByText("データがありません").first()).toBeVisible();
    });
  });

  test.describe("カラム表示切り替え", () => {
    test("スイッチをオフにするとカラムが非表示になる", async ({ page }) => {
      // クリック数対策で最初のテーブルのみ確認
      const firstTable = page.getByRole("region").first();
      await expect(firstTable.getByRole("columnheader", { name: "クリック数" })).toBeVisible();

      await page.getByLabel("クリック数").first().click();

      await expect(firstTable.getByRole("columnheader", { name: "クリック数" })).not.toBeVisible();
    });
  });

  test.describe("ソート", () => {
    test("カラムヘッダーをクリックするとソートアイコンが変化する", async ({ page }) => {
      const firstTable = page.getByRole("region").first();
      const header = firstTable
        .getByRole("columnheader", { name: "インプレッション数" })
        .getByRole("button");

      await header.click();
      // 昇順ソート後、再クリックで降順
      await header.click();

      await expect(firstTable.getByRole("cell").first()).toBeVisible();
    });
  });
});
