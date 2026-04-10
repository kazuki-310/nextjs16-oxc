import { Text } from "@mantine/core";

import { getPosts } from "../data/posts";
import { PostTable } from "./post-table";

export async function PostContainer(): Promise<React.JSX.Element> {
  const posts = await getPosts();

  if (posts.length === 0) {
    return <Text c="dimmed">データがありません</Text>;
  }

  return <PostTable posts={posts} />;
}
