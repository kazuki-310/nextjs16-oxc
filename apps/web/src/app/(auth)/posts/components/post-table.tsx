"use client";

import { Anchor, Table } from "@mantine/core";
import Link from "next/link";

type Post = {
  id: number;
  title: string;
  createdAt: Date;
  author: { name: string | null };
};

type Props = {
  posts: Post[];
};

export function PostTable({ posts }: Props): React.JSX.Element {
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>タイトル</Table.Th>
          <Table.Th>投稿者</Table.Th>
          <Table.Th>作成日</Table.Th>
          <Table.Th />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {posts.map((post) => (
          <Table.Tr key={post.id}>
            <Table.Td>{post.title}</Table.Td>
            <Table.Td>{post.author.name}</Table.Td>
            <Table.Td>{post.createdAt.toLocaleDateString("ja-JP")}</Table.Td>
            <Table.Td>
              <Anchor component={Link} href={`/posts/${post.id}/edit`} size="sm">
                編集
              </Anchor>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
