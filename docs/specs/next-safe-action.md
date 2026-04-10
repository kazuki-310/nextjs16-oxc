# next-safe-action 仕様

## 概要

Next.js Server Actions に型安全性・バリデーション・ミドルウェアを提供するライブラリ。

## クライアント設定

```ts
// src/lib/safe-action.ts
const baseClient = createSafeActionClient({
  defaultValidationErrorsShape: "flattened", // エラー形式（後述）
  handleServerError(error) {
    console.error(error); // サーバーログに詳細を出す
    return "予期しないエラーが発生しました"; // クライアントには汎用メッセージ
  },
});

// 認証不要
export const actionClient = baseClient;

// 認証必須（middleware で session を注入）
export const authActionClient = baseClient.use(async ({ next }) => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return next({ ctx: { session } }); // ctx として後続に渡す
});
```

## Action の定義

```ts
"use server";

export const createPost = authActionClient
  .inputSchema(schema)          // Zod スキーマでバリデーション
  .action(async ({ parsedInput, ctx: { session } }) => {
    // parsedInput: バリデーション済み入力（型安全）
    // ctx.session: middleware で注入された session
    await db.post.create({ ... });
    revalidatePath("/posts");
    return { id: post.id };     // data として返る
  });
```

## Action Result の構造

```ts
{
  data?: Data;              // 成功時の戻り値
  validationErrors?: VE;    // バリデーション失敗（フィールドレベル）
  serverError?: string;     // サーバーエラー
}
```

3つは**排他的**。同時に複数が入ることはない。

| 状態                           | data | validationErrors | serverError |
| ------------------------------ | ---- | ---------------- | ----------- |
| 成功                           | ✅   | —                | —           |
| バリデーション失敗             | —    | ✅               | —           |
| サーバーエラー                 | —    | —                | ✅          |
| framework error（redirect 等） | —    | —                | —           |

## エラーハンドリング

### serverError

`throw new Error(...)` → `handleServerError` でフィルタリング → `error.serverError`

```ts
// Action 内
throw new Error("作成処理に失敗しました"); // → serverError に入る
```

### validationErrors

Zod のスキーマ失敗か `returnValidationErrors()` で返した場合。

```ts
import { returnValidationErrors } from "next-safe-action";

// フィールドに紐づくエラー（重複チェックなど）
return returnValidationErrors(inputSchema, {
  identifier: { _errors: ["このメールアドレスは既に登録されています"] },
});

// フォーム全体のエラー
return returnValidationErrors(inputSchema, {
  _errors: ["認証に失敗しました"],
});
```

> `returnValidationErrors` は内部で throw するため実際には return しない。

### validationErrors の形式

`defaultValidationErrorsShape: "flattened"` を設定した場合：

```ts
// flattened（推奨）
error.validationErrors?.fieldErrors?.identifier?.at(0);
error.validationErrors?.fieldErrors?.password?.at(0);
error.validationErrors?.formErrors?.at(0);

// formatted（デフォルト）
error.validationErrors?.identifier?._errors?.at(0);
```

## framework errors（redirect / notFound）

`redirect()` や `notFound()` は framework error として扱われ、result オブジェクトを**バイパス**する。Next.js が直接ナビゲーションを処理する。

```ts
// Action 内で呼ぶとレスポンスに RSC Payload が含まれる（1往復で完結）
revalidatePath("/posts");
redirect("/posts"); // onSuccess は呼ばれない → onNavigation が呼ばれる
```

> `redirect()` を Server Action 内で使うと、HTTPリダイレクトを挟まずに遷移先の RSC Payload を含むレスポンスが返るため、2往復→1往復になる。

## useAction フック

```tsx
const { execute, isPending, result } = useAction(myAction, {
  onSuccess: ({ data, input }) => {
    // 成功時（redirect() が呼ばれた場合は発火しない）
  },
  onNavigation: ({ navigationKind }) => {
    // redirect() / notFound() 等の framework error 時
    // navigationKind: "redirect" | "notFound" | "forbidden" | "unauthorized"
  },
  onError: ({ error }) => {
    // serverError または validationErrors がある場合
    notifications.show({ color: "red", message: error.serverError ?? "エラー" });
  },
  onSettled: ({ result }) => {
    // 成功・失敗問わず常に呼ばれる
  },
});

// 実行
execute({ title: "Hello" });

// フィールドエラーの取得（flattened 形式）
const identifierError = result.validationErrors?.fieldErrors?.identifier?.at(0);
```

## useOptimisticAction フック

楽観的 UI 更新。サーバーレスポンスを待たず即座に UI を更新し、失敗時は自動ロールバック。

```tsx
const { execute, optimisticState, isPending } = useOptimisticAction(createTodo, {
  currentState: todos, // サーバーから渡された現在の状態
  updateFn: (current, input) => [
    ...current,
    { id: Date.now(), title: input.title, done: false }, // 即時反映
  ],
  onError: ({ error }) => {
    // 失敗時は optimisticState が currentState に自動ロールバック
    notifications.show({ color: "red", message: error.serverError ?? "エラー" });
  },
});

// optimisticState を表示に使う（楽観的状態 or 実データ）
optimisticState.map((todo) => <div key={todo.id}>{todo.title}</div>);
```

> `updateFn` は純粋関数（副作用なし）。React の render サイクルで実行される。

## 使い分けまとめ

| 用途                     | 方法                                                                        |
| ------------------------ | --------------------------------------------------------------------------- |
| 予期しない DB エラー     | `throw new Error("...")` → `serverError` → toast                            |
| フィールドに紐づくエラー | `returnValidationErrors(schema, {...})` → `validationErrors` → フィールド下 |
| 成功後に別ページへ遷移   | Action 内で `redirect("/path")` → 1往復で遷移                               |
| 楽観的 UI 更新           | `useOptimisticAction` + `updateFn`                                          |
| 認証が必要な Action      | `authActionClient`（middleware で session を注入）                          |

## 関連ファイル

| ファイル                                        | 役割                                             |
| ----------------------------------------------- | ------------------------------------------------ |
| `src/lib/safe-action.ts`                        | `actionClient` / `authActionClient` の定義       |
| `src/app/login/actions/login.ts`                | `actionClient` 使用例（ログイン）                |
| `src/app/register/actions/register.ts`          | `actionClient` + `returnValidationErrors` 使用例 |
| `src/app/(auth)/posts/actions/create-post.ts`   | `authActionClient` + `redirect()` 使用例         |
| `src/app/(auth)/todos/actions/create-todo.ts`   | `authActionClient` 使用例                        |
| `src/app/(auth)/todos/components/todo-list.tsx` | `useOptimisticAction` 使用例                     |
