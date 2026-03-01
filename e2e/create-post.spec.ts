import { expect, test } from "@playwright/test";

test("フォームを送信するとpost作成成功メッセージが表示される", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Title").fill("Hello");
  await page.getByLabel("Body").fill("World");
  await page.getByRole("button", { name: "Create" }).click();

  await expect(page.getByText("Post created successfully.")).toBeVisible();
});
