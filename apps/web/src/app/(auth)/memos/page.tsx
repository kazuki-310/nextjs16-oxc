import { Stack, Title } from "@mantine/core";
import type { Metadata } from "next";
import { Suspense } from "react";

import { MemoContainer } from "./components/memo-container";

export const metadata: Metadata = {
  title: "メモ帳",
  description: "個人用のメモを作成・削除できます。",
};

export default function MemosPage(): React.JSX.Element {
  return (
    <Stack gap="md" p="md" maw={720}>
      <Title order={2}>メモ帳</Title>
      <Suspense fallback={null}>
        <MemoContainer />
      </Suspense>
    </Stack>
  );
}
