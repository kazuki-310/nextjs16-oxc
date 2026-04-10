import { Stack, Title } from "@mantine/core";

import { PostForm } from "../components/post-form";

export default function NewPostPage(): React.JSX.Element {
  return (
    <Stack gap="md" p="md" maw={600}>
      <Title order={2}>投稿作成</Title>
      <PostForm />
    </Stack>
  );
}
