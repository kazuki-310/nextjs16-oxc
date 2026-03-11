import type { Metadata } from "next";
import { Box, Center, Paper, Text, Title } from "@mantine/core";
import { PostForm } from "./_components/post-form";

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
      </Box>
    </Center>
  );
}
