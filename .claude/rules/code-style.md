---
paths:
  - "apps/web/src/**/*.{ts,tsx}"
---

# コード規約

## 概要

このドキュメントは、Claude Code が一貫性のあるコードを出力するためのガイドラインです。

**基本方針:**

- 可読性と保守性を最優先
- 一貫性のあるコーディングスタイル
- チーム全体で同じルールに従う

---

## TypeScript

### 型定義

- すべての関数・変数に適切な型を付与
- `any` の使用は避け、適切な型を定義
- 型定義は `type` を使用
- 型名: `PascalCase`

### Props 型定義

- コンポーネントの Props は専用の型を定義
- 型名: コンポーネント名 + `Props`

```tsx
// ✅ Good: Props 型を定義
type UserCardProps = {
  userId: string;
  onUpdate?: (user: User) => void;
};

export function UserCard({ userId, onUpdate }: UserCardProps) {
  // ...
}
```

---

## Next.js App Router

### Server Actions

[next-safe-action](https://next-safe-action.dev/) を使用して管理します。Next.js の Server Actions にバリデーション、エラーハンドリング、型安全性を提供するライブラリ。

**Safe Actions 設定:**
各アクションに適した Client を Server Actions 側で呼び出します

```ts
// src/lib/safe-action.ts
export const actionClient = createSafeActionClient({});
export const authClient = actionClient.use(async ({ next }) => {});
```

**エラーハンドリングの使い分け:**

| エラータイプ                   | 方法                                                                                | 出力先                      | 用途                                                    |
| ------------------------------ | ----------------------------------------------------------------------------------- | --------------------------- | ------------------------------------------------------- |
| フィールドバリデーションエラー | `returnValidationErrors()`                                                          | フォーム上の該当フィールド  | 入力値が要件を満たさない（必須、文字数など）            |
| ビジネスロジックエラー（詳細） | try で `throw new ActionError()` → catch で instanceof ActionError で再 throw       | toast通知（onError）        | recordNotFound など詳細メッセージをユーザーに伝える     |
| 予期しないエラー（汎用）       | try で Error/Prisma エラー → catch で `throw new ActionError(ERROR_MESSAGE)` に変換 | toast通知（汎用メッセージ） | DB エラー・その他予期しないエラーを汎用メッセージで表示 |

#### スキーマ定義

バリデーションライブラリの zod を使う

```ts
import { z } from "zod";

export const updatePostSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
});
```

#### Server Actions（サーバー側）

```ts
"use server";
import { Prisma, prisma } from "@packages/database";
import { redirect } from "next/navigation";
import { returnValidationErrors } from "next-safe-action";
import { ActionError, actionClient } from "@/lib/safe-action";
import { ERROR_MESSAGE } from "@/constants/message";

export const updatePost = actionClient
  .inputSchema(updatePostSchema)
  .action(async ({ parsedInput }) => {
    const { id, title, content } = parsedInput;

    if (!title || title.trim().length === 0) {
      returnValidationErrors(updatePostSchema, {
        title: { _errors: ["タイトルは必須です"] },
      });
    }

    try {
      const post = await prisma.post.findUnique({
        where: { id },
      });
      if (!post) {
        throw new ActionError(ERROR_MESSAGE.recordNotFound);
      }

      await prisma.post.update({
        where: { id },
        data: {
          title,
          content,
        },
      });
    } catch (error) {
      if (error instanceof ActionError) {
        throw error;
      }

      // NOTE: 例外的な処理
      throw new ActionError(ERROR_MESSAGE.updateError);
    }

    // NOTE: try/catch の外で redirect 定義する必要がある
    redirect("/posts");
  });
```

**画面遷移について:**

- `redirect()`: サーバー側で画面遷移を指定。クライアント側の `useHookFormAction` では `onNavigation` コールバックで `navigationKind === "redirect"` を検知できる

#### useHookFormAction（フォーム処理）

フォーム処理は React Hook Form と next-safe-action のアダプタを組み合わせます。

- [React Hook Form](https://next-safe-action.dev/docs/integrations/react-hook-form)

```tsx
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { notifications } from "@mantine/notifications";
import { SUCCESS_MESSAGE } from "@/constants/message";

type UpdatePostFormProps = {
  defaultValues: {
    id: string;
    title: string;
    content: string;
  };
};

export function UpdatePostForm({ defaultValues }: UpdatePostFormProps) {
  const { form, handleSubmitWithAction, action, resetFormAndAction } = useHookFormAction(
    updatePost,
    zodResolver(updatePostSchema),
    {
      formProps: {
        defaultValues,
      },
      actionProps: {
        onNavigation: ({ navigationKind }) => {
          if (navigationKind === "redirect") {
            notifications.show({
              message: SUCCESS_MESSAGE.recordUpdated,
            });
          }
          resetFormAndAction();
        },
        onError: ({ error }) => {
          if (error.serverError) {
            notifications.show({
              message: error.serverError,
              color: "red",
            });
          }
        },
      },
    },
  );

  return (
    <form onSubmit={handleSubmitWithAction}>
      <TextInput
        label="タイトル"
        {...form.register("title")}
        error={
          action.result.validationErrors?.fieldErrors?.title?.[0] ||
          form.formState.errors.title?.message
        }
        disabled={action.isPending}
      />
      <Button type="submit" disabled={action.isPending} mt="md">
        更新
      </Button>
    </form>
  );
}
```

#### useOptimisticAction（楽観的更新）

削除、ステータス変更などで、サーバーからの応答を待たずに UI を即座に更新する場合に使用する。

```tsx
import { useOptimisticAction } from "next-safe-action/hooks";
import { deletePostAction } from "../actions/delete-post";

const {
  execute: executeDelete,
  isPending,
  optimisticState,
} = useOptimisticAction(deletePostAction, {
  currentState: posts,
  updateFn: (currentPosts, input) => currentPosts.filter((post) => post.id !== input.id),
});
```

### データ取得処理

サーバー側データ取得処理は、専用の `data` ディレクトリに配置します。**サーバー側でのみ使うデータ取得関数には `"server-only"` を付与します。**

#### ファイル配置

- グローバルなデータ取得関数：`src/data/`
- ページ特定のデータ取得関数：`src/app/[path]/data/`

#### `"server-only"` の役割

`"server-only"` をインポートすると、以下のことが保証されます：

- サーバー側でのみ実行されるコード
- クライアント側で誤ってインポートされることを防止

#### `await connection()` が必須な理由

動的にデータアクセスしたい場合、`await connection()` を最初に呼び出してください。

これにより、キャッシュされたコンポーネント内で動的コンテンツを生成することを明示的に伝えます。
(Next.js CacheComponent: true にする場合必要な設定)

```ts
import "server-only";
import { ERROR_MESSAGE } from "@/constants/message";
import { prisma } from "@packages/database";
import { connection } from "next/server";

export const getPost = cache(async (id: number) => {
  // NOTE: 動的データアクセス時は必須
  await connection();

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    throw new Error(ERROR_MESSAGE.recordNotFound);
  }

  return post;
});
```

### Suspense によるストリーミングデータ取得

非同期データ取得は `<Suspense>` でラップしてストリーミングします。

```tsx
import { Suspense } from "react";
import { PostContainer } from "./components/post-container";
import { PostsGridSkeleton } from "./components/posts-grid-skeleton";

export default function Page() {
  return (
    <Container>
      <Title>ポスト一覧</Title>
      <Suspense fallback={<PostsGridSkeleton />}>
        <PostContainer />
      </Suspense>
    </Container>
  );
}
```

```tsx
import { getPosts } from "../data/get-posts";
import { PostsGrid } from "./posts-grid";

export async function PostContainer() {
  const posts = await getPosts();
  return <PostsGrid posts={posts} />;
}
```

### URL 状態管理（nuqs）

フィルタ条件などの URL 状態管理には `nuqs` を使用します。

#### 基本方針

- パーサー定義とバリデーションスキーマは `lib/schema.ts` にまとめて定義する
- Server Component では `createSearchParamsCache` でパラメータを取得する

#### 例

```ts
import { parseAsString, parseAsStringEnum } from "nuqs/server";

export const exampleFilterParsers = {
  name: parseAsString,
  status: parseAsStringEnum(["active", "inactive"]),
};
```

```tsx
import { parseAsString, useQueryState, useQueryStates } from "nuqs";
import { exampleFilterParsers } from "../lib/schema";

// NOTE: パラメータが単一の場合 → `useQueryState`
const [tab, setTab] = useQueryState("tab", parseAsString);
// NOTE: パラメータが複数の場合 → `useQueryStates` でまとめて管理
const [filters, setFilters] = useQueryStates(exampleFilterParsers, {
  history: "push",
});
```

```tsx
import { SearchParams, createSearchParamsCache } from "nuqs/server";
import { exampleFilterParsers } from "./lib/schema";

const searchParamsCache = createSearchParamsCache(exampleFilterParsers);

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const query = searchParamsCache.parse(searchParams);
  // query.name, query.status で型安全にアクセス可能
}
```

---

## UI & スタイリング

### Mantine コンポーネント

UI コンポーネントライブラリとして [Mantine](https://mantine.dev/) を使用します。

```tsx
import { Button, TextInput, Group } from "@mantine/core";

export function LoginForm() {
  return (
    <form>
      <TextInput label="Email" placeholder="your@email.com" />
      <Group justify="flex-end" mt="md">
        <Button type="submit">Sign in</Button>
      </Group>
    </form>
  );
}
```

**原則:**

- Mantine コンポーネントを優先使用
- スタイルは `props` もしくは `styles` で指定する

### アイコン（@tabler/icons-react）

原則、アイコンは `@tabler/icons-react` のみを使用します。

```tsx
import { IconUser, IconLogout } from "@tabler/icons-react";

export function UserMenu() {
  return (
    <>
      <IconUser size={20} />
      <IconLogout size={20} />
    </>
  );
}
```

---

## イベントハンドラー名の規則

**`handle` vs `on` の使い分け:**

- **`handle`**: コンポーネント内部でイベント処理する関数
- **`on`**: 親から `props` で受け取るコールバック関数

```tsx
// ✅ Good: 内部処理は handle
function MyComponent() {
  const handleClick = () => {
    console.log("clicked");
  };
  return <button onClick={handleClick}>Click</button>;
}

// ✅ Good: props は on
type ButtonProps = {
  onClick: () => void;
};

function Button({ onClick }: ButtonProps) {
  return <button onClick={onClick}>Click</button>;
}
```

---

## コメント・ドキュメンテーション

### 基本原則

- コードの意図が明確な場合、コメントは基本的に不要
- 過多なコメントを避ける

### アノテーションコメント

コードの特定要素に追加情報を提供するために使用：

| タグ       | 説明                                 |
| ---------- | ------------------------------------ |
| `TODO`     | あとで作業するべきこと（実装、修正） |
| `NOTE`     | 重要な情報やコードの説明             |
| `FIXME`    | 不具合のあるコード、修正が必要       |
| `OPTIMIZE` | パフォーマンス向上のため改善が必要   |
| `WARNING`  | 注意が必要で慎重に修正すべきコード   |

```tsx
// TODO: この関数をリファクタリングする
// NOTE: ここで型チェックが厳密に行われている
// FIXME: この値が正しくない可能性がある
```
