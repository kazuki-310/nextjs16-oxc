import { Stack, Title } from "@mantine/core";
import { Suspense } from "react";

import { PostEditContainer } from "../../components/post-edit-container";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPostPage({ params }: Props): Promise<React.JSX.Element> {
  const { id } = await params;

  return (
    <Stack gap="md" p="md" maw={600}>
      <Title order={2}>投稿編集</Title>
      <Suspense fallback={null}>
        <PostEditContainer id={Number(id)} />
      </Suspense>
    </Stack>
  );
}
