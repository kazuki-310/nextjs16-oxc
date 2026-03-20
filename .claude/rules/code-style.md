---
paths:
  - "apps/**/*.{ts,tsx}"
---

# コード規約

## ファイル・ディレクトリ命名規則

- ファイル名: `kebab-case`
- ディレクトリ名: `kebab-case`
- コンポーネントファイル名: `kebab-case`

詳細なディレクトリ構造については `directory-structure.md` を参照。

## TypeScript

### 型定義

- すべての関数・変数に適切な型を付与
- `any` の使用は避け、適切な型を定義
- 型定義は `type` を使用（`interface` は使わない）
- 型名: `PascalCase`

```tsx
// NG
interface User {
  id: string;
  name: string;
}

// Good
type User = {
  id: string;
  name: string;
};
```

## React

### コンポーネント名の命名規則

- 目的に沿った具体的な名前を使用する
- 汎用的すぎる名前は避ける

```
// NG
client.tsx / component.tsx

// Good
post-form.tsx / user-profile-card.tsx
```

### React Compiler

このプロジェクトは `reactCompiler: true` が有効。

- **`useMemo` / `useCallback` の手動最適化は不要**
- React Compiler が自動でメモ化を最適化する

## Next.js App Router

### cacheComponents

`next.config.ts` で `cacheComponents: true` を設定済み。

- データフェッチは**デフォルトで動的**

## URL 状態管理（nuqs）

URL クエリパラメータの状態管理には **nuqs** を使用する。

```ts
// lib/schema.ts — パーサー定義
import { parseAsInteger, parseAsString } from "nuqs/server";

export const filterParsers = {
  name: parseAsString.withDefault(""),
  minImpressions: parseAsInteger.withDefault(0),
};
```

```tsx
// Client Component で使用
import { useQueryStates } from "nuqs";
import { filterParsers } from "../lib/schema";

const [params, setParams] = useQueryStates(filterParsers);
```

## Server Actions

バックエンド処理は基本的に **Server Actions** を使用する。

- `"use server"` ディレクティブを付ける
- ページ固有の Server Actions: `route-segment/actions/`
- 共通 Server Actions: `src/actions/`

### サーバー専用ユーティリティ（`server-only`）

- クライアントから呼ぶ Server Actions には `"use server"` ディレクティブを付ける
- それ以外のサーバー側コードはすべて `import "server-only"` を付ける

```ts
// actions（クライアントから呼ぶ）
"use server";
export async function createPost() { ... }

// data（RSC から呼ぶ）
import "server-only";
export async function getPosts() { ... }
```

### エラーハンドリング

#### 戻り値の型

Server Actions には `ActionResult<T>`（`src/types/action.ts`）を使う。

```ts
import type { ActionResult } from "@/types/action";

export async function createPost(input: Input): Promise<ActionResult<Post>> {
  const validated = PostSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: "入力内容が正しくありません" };
  }

  try {
    const post = await db.insert(validated.data);
    return { success: true, data: post };
  } catch {
    return { success: false, error: "作成処理に失敗しました" };
  }
}
```

#### try-catch の方針

- **バリデーションエラー**: try-catch 不要。`safeParse` などで処理
- **予期できる DB エラー**（ユニーク制約など）: catch してユーザー向けメッセージを返す
- **予期しないエラー**（DB 障害など）: catch せず throw → `error.tsx` に任せる
- catch しても再スローするだけなら try-catch ごと不要

```ts
try {
  const post = await db.insert(data);
  return { success: true, data: post };
} catch (e) {
  if (isUniqueConstraintError(e)) {
    return { success: false, error: "すでに存在しています" };
  }
  throw e; // 予期しないエラーは再スロー
}
```

#### redirect() の注意点

`redirect()` は内部で例外を throw するため **try ブロックの外** に置く。

```ts
// NG: catch に捕まる
try {
  await db.insert(data);
  redirect("/posts");
} catch (e) { ... }

// Good
try {
  await db.insert(data);
} catch (e) { ... }

redirect("/posts"); // try の外
```

## データ取得（data/）

RSC から呼ぶデータ取得関数のエラーハンドリング。**try-catch は不要**。

### React cache()

`data/` の関数は `React.cache()` で囲む。同一リクエスト内で複数のコンポーネントから呼ばれても DB アクセスが1回になる。

```ts
import "server-only";

import { cache } from "react";
import { prisma } from "@packages/database";

export const getPosts = cache(async (): Promise<Post[]> => {
  return prisma.post.findMany({ orderBy: { id: "desc" } });
});
```

```ts
import "server-only";
import { notFound } from "next/navigation";

export async function getPost(id: string): Promise<Post> {
  const post = await db.query(id); // DB エラーは throw → error.tsx
  if (!post) notFound(); // → not-found.tsx（404）
  return post;
}

// 業務ロジック上の異常は throw new Error → error.tsx
if (!post.isPublished) throw new Error("非公開データへのアクセス");
```

| 状況                        | 対処                                 |
| --------------------------- | ------------------------------------ |
| データが存在しない          | `notFound()` → not-found.tsx（404）  |
| 業務ロジック上の異常        | `throw new Error("...")` → error.tsx |
| DB 障害など予期しないエラー | そのまま throw → error.tsx           |

- `ActionResult<T>` は不要（エラーをクライアントに返す必要がないため）
- try-catch で全エラーを隠さない（障害が検知できなくなる）

## スタイリング

### Mantine

UI コンポーネントライブラリとして **Mantine v8** を使用する。

- `@mantine/core` — UI コンポーネント
- `@mantine/hooks` — フック（`useDisclosure`, `useForm` など）

## 命名規則

### イベントハンドラー名

- `handle` プレフィックス: コンポーネント内部のイベント処理
- `on` プレフィックス: 親から受け取る props のコールバック

```tsx
// 内部処理
const handleClick = (): void => { ... };

// props として受け取る
type Props = { onClick: () => void };
```

## コメント

- コードの意図が明確な場合、コメントは基本不要

### アノテーションコメント

| タグ       | 説明                                             |
| ---------- | ------------------------------------------------ |
| `TODO`     | あとで作業するべきこと                           |
| `NOTE`     | 重要な情報やコードの説明                         |
| `FIXME`    | 不具合のあるコード、修正が必要                   |
| `OPTIMIZE` | パフォーマンス向上のためのリファクタリング       |
| `WARNING`  | 注意が必要で、慎重に修正しなければならないコード |

## コードレビュー観点

### パフォーマンス

- 不要な再レンダリングが発生していないか（React Compiler に任せる）
- Server / Client Components の使い分けが適切か

### Server Actions / データ取得

- エラーハンドリングが適切か

### セキュリティ

- 秘匿情報が環境変数で管理されているか
- `server-only` が必要な箇所に付いているか

### メンテナビリティ

- マジックナンバーを使用していないか
- `any` 型の多用を避けているか
- コンポーネントが適切に分割されているか
