import { Paper, Stack, Text } from "@mantine/core";

import { getPosts } from "../data/get-posts";

export async function PostList(): Promise<React.JSX.Element> {
  const posts = await getPosts();

  if (posts.length === 0) {
    return <></>;
  }

  return (
    <Stack gap="sm">
      {posts.map((post) => (
        <Paper key={post.id} withBorder p="md" radius="md">
          <Text fw={600}>{post.title}</Text>
          <Text fz="sm" c="dimmed" mt={4}>
            {post.content}
          </Text>
        </Paper>
      ))}
    </Stack>
  );
}
