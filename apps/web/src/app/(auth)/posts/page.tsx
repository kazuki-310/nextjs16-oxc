import { Group, Stack, Title } from "@mantine/core";
import Link from "next/link";
import { Suspense } from "react";

import { PostContainer } from "./components/post-container";

export default function Page(): React.JSX.Element {
  return (
    <Stack gap="md" p="md">
      <Group justify="space-between">
        <Title order={2}>投稿一覧</Title>
        <Link href="/posts/new">新規作成</Link>
      </Group>

      <Suspense fallback={null}>
        <PostContainer />
      </Suspense>
    </Stack>
  );
}
