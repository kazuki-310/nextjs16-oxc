---
name: coding-standards
description: Coding conventions for this project. Use when writing, reviewing, or refactoring code — TypeScript types, React components, naming rules, Server Actions, Tailwind CSS, testing.
user-invocable: false
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

## ファイル・ディレクトリ命名規則

- ファイル名: `kebab-case`
- ディレクトリ名: `kebab-case`
- コンポーネントファイル名: `kebab-case`

詳細なディレクトリ構造については `directory-structure` スキルを参照。

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

### React Compiler

このプロジェクトは `reactCompiler: true` が有効。

- **`useMemo` / `useCallback` の手動最適化は不要**
- React Compiler が自動でメモ化を最適化する

### hooks

- カスタムフックは `use` プレフィックス
- 適切な依存配列を指定

## Next.js App Router

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
- ブラウザ API や React hooks を使う場合

## Server Actions

バックエンド処理は基本的に **Server Actions** を使用する。

- `"use server"` ディレクティブを付ける
- ページ固有の Server Actions: `_server-functions/actions/`
- 共通 Server Actions: `src/server-functions/actions/`

### サーバー専用ユーティリティ（`server-only`）

クライアントから誤って import されることを防ぐため `import 'server-only'` を付与する。

```ts
// src/server-functions/_lib/utils.ts
import "server-only";
```

## スタイリング

### Tailwind CSS v4

- Tailwind CSS v4 を使用（PostCSS 経由）
- クラスの結合には `cn()` ヘルパーを使う（`@/lib/utils`）
- ダークモードは `dark:` バリアントで対応

```tsx
import { cn } from "@/lib/utils";

<div className={cn("rounded-lg px-4 py-2", isActive && "bg-primary text-primary-foreground")} />;
```

### shadcn/ui

UI コンポーネントライブラリとして **shadcn/ui**（new-york スタイル）を使用する。

#### コンポーネントの追加

```bash
pnpm dlx shadcn add <component-name>
# 例: pnpm dlx shadcn add button dialog table
```

追加されたコンポーネントは `src/components/ui/` に配置される。

#### 使い方

```tsx
import { Button } from "@/components/ui/button";

<Button variant="outline" size="sm">
  保存
</Button>;
```

#### アイコン

アイコンは **lucide-react** を使う。

```tsx
import { Pencil, Trash2 } from "lucide-react";

<Button size="icon">
  <Pencil />
</Button>;
```

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
