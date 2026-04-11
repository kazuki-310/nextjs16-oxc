import { Paper, Stack, Text, Title } from "@mantine/core";
import type { Metadata } from "next";

import { getDailyFocusTip } from "./data/get-daily-focus-tip";

export const metadata: Metadata = {
  title: "集中ヒント",
  description: "サーバー日付に応じて focus_tips から 1 件の集中ヒントを表示します。",
};

export default async function FocusTipsPage(): Promise<React.JSX.Element> {
  const { labelDate, body } = await getDailyFocusTip(new Date());

  return (
    <Stack gap="md" p="md" maw={640}>
      <Title order={2}>集中ヒント</Title>
      <Paper withBorder p="md" radius="md">
        <Text size="sm" c="dimmed" mb="xs">
          今日の基準日（サーバー）: {labelDate}
        </Text>
        <Text size="lg" fw={500}>
          {body}
        </Text>
      </Paper>
      <Text size="sm" c="dimmed">
        表示はサーバー日付ごとに切り替わります。ヒント本文はデータベースの focus_tips
        から読み込みます。
      </Text>
    </Stack>
  );
}
