---
paths:
  - "apps/**/*.{ts,tsx}"
---

# コード規約

## 基本方針

- 可読性と保守性を重視
- 一貫性のあるコーディングスタイル
- TypeScript の型安全性を最大限活用

## ツールチェーン

- **Linter**: oxlint（`pnpm lint` / `pnpm lint:fix`）
- **Formatter**: oxfmt（`pnpm fmt` / `pnpm fmt:check`）
- **型チェック**: `pnpm type-check`
- **まとめて実行**: `pnpm check`（ファイル変更後は必ず実行）

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

### コンポーネント

- 関数コンポーネントを使用
- Props 型を明確に定義
- `page.tsx`, `layout.tsx` は Next.js の規約に従い `export default` を使用
- それ以外のファイルは named export を使用

```tsx
// NG: default export
export default function UserCard() { ... }

// Good: named export
export function UserCard() { ... }
```

#### コンポーネント名の命名規則

- 目的に沿った具体的な名前を使用する
- 汎用的すぎる名前は避ける

```
// NG
client.tsx / component.tsx

// Good
post-form.tsx / user-profile-card.tsx
```

### key prop

リストレンダリングでは **安定した一意な ID** を `key` に使う。配列の index は使わない。

```tsx
// NG: index をキーに使うとリスト並び替え・フィルタ時にバグが起きる
{
  items.map((item, index) => <li key={index}>{item.name}</li>);
}

// Good: 安定した一意 ID を使う
{
  items.map((item) => <li key={item.id}>{item.name}</li>);
}

// エラーメッセージなど一意な文字列が使える場合
{
  errors.map((error) => <li key={error.message}>{error.message}</li>);
}
```

### React Compiler

このプロジェクトは `reactCompiler: true` が有効。

- **`useMemo` / `useCallback` の手動最適化は不要**
- React Compiler が自動でメモ化を最適化する

### hooks

- カスタムフックは `use` プレフィックス
- 適切な依存配列を指定

## Next.js App Router

### metadata（SEO）

すべての `page.tsx` には `metadata` または `generateMetadata` を必ず export する。

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ページタイトル",
  description: "ページの説明文。",
};
```

動的なメタデータが必要な場合：

```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.id);
  return { title: post.title };
}
```

### cacheComponents

`next.config.ts` で `cacheComponents: true` を設定済み。

- データフェッチは**デフォルトで動的**
- キャッシュしたい箇所にのみ `use cache` を明示的に付ける

```tsx
// キャッシュしたい場合のみ
async function getData() {
  "use cache";
  return fetch(...);
}
```

### Server Components と Client Components の使い分け

**基本原則**: デフォルトで Server Components を使用し、必要な場合のみ Client Components を使用する

#### Server Components を使用する場合

- データフェッチ
- バックエンドリソースへのアクセス

#### Client Components を使用する場合

- インタラクティブな機能（クリック、フォーム送信）
- 状態管理（`useState`, `useReducer`）
- ブラウザ API（`localStorage`, `window` など）
- React hooks を使う場合（`useQueryStates` など）

## URL 状態管理（nuqs）

URL クエリパラメータの状態管理には **nuqs** を使用する。

```ts
// _lib/schema.ts — パーサー定義
import { parseAsInteger, parseAsString } from "nuqs/server";

export const filterParsers = {
  name: parseAsString.withDefault(""),
  minImpressions: parseAsInteger.withDefault(0),
};
```

```tsx
// Client Component で使用
import { useQueryStates } from "nuqs";
import { filterParsers } from "../_lib/schema";

const [params, setParams] = useQueryStates(filterParsers);
```

## Server Actions

バックエンド処理は基本的に **Server Actions** を使用する。

- `"use server"` ディレクティブを付ける
- ページ固有の Server Actions: `[feature]/actions/`
- 共通 Server Actions: `src/actions/`

### サーバー専用ユーティリティ（`server-only`）

- クライアントから呼ぶ Server Actions には `"use server"` ディレクティブを付ける
- それ以外のサーバー側コード（data/ など）はすべて `import "server-only"` を付ける

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

直接呼び出す Server Actions には `ActionResult<T>`（`src/types/action.ts`）を使う。

```ts
import type { ActionResult } from "@/types/action";

export async function createPost(input: Input): Promise<ActionResult<Post>> {
  const validated = PostSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: "入力内容が正しくありません" };
  }
  const post = await db.insert(validated.data); // DB エラーは throw → error.tsx
  return { success: true, data: post };
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

```tsx
import { Button, Stack, TextInput } from "@mantine/core";

<Stack gap="md">
  <TextInput label="タイトル" placeholder="入力してください" />
  <Button type="submit">保存</Button>
</Stack>;
```

- `@mantine/core` — UI コンポーネント
- `@mantine/hooks` — フック（`useDisclosure`, `useForm` など）

## テスト

### Vitest（ユニットテスト）

- `pnpm test` — ウォッチモード
- `pnpm test:run` — 1回実行
- テストファイルは対象ファイルと同じディレクトリに配置（`*.test.ts`）

### Playwright（E2Eテスト）

- `pnpm test:e2e` — E2Eテスト実行
- `pnpm test:e2e:ui` — UIモードで実行

## 命名規則

### 変数・関数名

- キャメルケース（camelCase）を使う
- snake_case・PascalCase は NG

### 定数名

- UPPER_SNAKE_CASE を使う

```tsx
const ITEMS_PER_PAGE = 100;
const DEFAULT_TIMEOUT_MS = 3000;
const SUPPORTED_LANGUAGES = ["en", "ja"];
```

### イベントハンドラー名

- `handle` プレフィックス: コンポーネント内部のイベント処理
- `on` プレフィックス: 親から受け取る props のコールバック

```tsx
// 内部処理
const handleClick = (): void => { ... };

// props として受け取る
type Props = { onClick: () => void };
```

## コーディングスタイル

### `const` と `let` の使い分け

- 原則 `const`、値を変更せざるを得ない場合のみ `let`、`var` は NG

### 分割代入

```tsx
// Good: 段階的に分割代入
const { user } = data;
const { id, name, address } = user;
const { city } = address;

// NG: 深いネストの分割代入
const {
  user: {
    address: { city },
  },
} = data;
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
- `use cache` の使用が適切か（不必要に付けていないか）

### セキュリティ

- 秘匿情報が環境変数で管理されているか
- `server-only` が必要な箇所に付いているか

### メンテナビリティ

- マジックナンバーを使用していないか
- `any` 型の多用を避けているか
- コンポーネントが適切に分割されているか
