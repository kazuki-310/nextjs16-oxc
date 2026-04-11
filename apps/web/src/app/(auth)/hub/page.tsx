import { Card, List, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "オペレーションハブ",
  description: "ログイン後の起点。仕様サマリーと主要画面へのショートカットを表示します。",
};

const shortcuts = [
  {
    href: "/focus-tips",
    title: "集中ヒント",
    body: "DB の focus_tips から日替わりで 1 件表示（仕様: docs/specs/web/focus-tips）",
  },
  { href: "/memos", title: "メモ帳", body: "個人用メモの作成と整理" },
  { href: "/tables", title: "広告レポート", body: "テーブル表示の広告データ閲覧" },
  {
    href: "/tables-virtual",
    title: "広告レポート（仮想化）",
    body: "大量行向けの仮想スクロール版",
  },
  { href: "/posts", title: "投稿", body: "投稿の一覧と編集" },
  { href: "/todos", title: "ToDo", body: "タスクの追加と完了管理" },
] as const;

export default function HubPage(): React.JSX.Element {
  const generatedAt = new Date().toISOString();

  return (
    <Stack gap="lg" p="md" maw={960}>
      <div>
        <Title order={2}>オペレーションハブ</Title>
        <Text c="dimmed" size="sm" mt={4}>
          サーバーで生成した時刻: {generatedAt}
        </Text>
      </div>

      <Card withBorder padding="md" radius="md">
        <Title order={3} size="h4" mb="sm">
          この画面の仕様
        </Title>
        <List size="sm" spacing="xs">
          <List.Item>対象ユーザー: 認証済み（未ログインはログインへリダイレクト）</List.Item>
          <List.Item>
            目的: 作業の起点として、主要機能への導線と仕様の要約を一画面に集約する
          </List.Item>
          <List.Item>
            表示: サーバー基準のタイムスタンプ、ショートカットカード、上記の仕様リスト
          </List.Item>
          <List.Item>非スコープ: 永続データの読み書き、外部サービス連携、権限の細分化</List.Item>
        </List>
      </Card>

      <div>
        <Title order={3} size="h4" mb="sm">
          ショートカット
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          {shortcuts.map(({ href, title, body }) => (
            <Card key={href} withBorder padding="md" radius="md" component={Link} href={href}>
              <Text fw={600}>{title}</Text>
              <Text size="sm" c="dimmed" mt={6}>
                {body}
              </Text>
              <Text size="sm" c="blue" mt="sm" fw={500}>
                開く →
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      </div>
    </Stack>
  );
}
