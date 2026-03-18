import { Box, Center, Paper, Text, Title } from "@mantine/core";
import type { Metadata } from "next";
import { Suspense } from "react";

import { PostForm } from "./components/post-form";
import { PostList } from "./components/post-list";

export const metadata: Metadata = {
  title: "Create Post",
  description: "Fill in the details below to create a new post.",
};

export default function Page(): React.JSX.Element {
  return (
    <Center mih="100vh" p="md">
      <Box w="100%" maw={512}>
        <Box mb="xl">
          <Title order={1} fz="2xl" fw={600}>
            Create Post
          </Title>
          <Text fz="sm" c="dimmed" mt={4}>
            Fill in the details below to create a new post.
          </Text>
        </Box>
        <Paper withBorder p="lg" radius="md">
          <PostForm />
        </Paper>
        <Box mt="xl">
          <Title order={2} fz="lg" fw={600} mb="md">
            Posts
          </Title>

          <Suspense fallback={<Text c="dimmed">Loading...</Text>}>
            <PostList />
          </Suspense>
        </Box>
      </Box>
    </Center>
  );
}
