---
name: directory-structure
description: Directory structure and file placement rules for this project. Use when creating new files, adding features, or deciding where to place components, server functions, constants, or types.
user-invocable: false
---

# ディレクトリ構造

## モノレポ全体構造

```
nextjs16-oxc/                        # ルート
├── apps/
│   ├── web/                         # Next.js 16 フロントエンドアプリ
│   └── batch/                       # バッチ処理アプリ (Node.js)
├── packages/
│   └── typescript-config/           # 共有 TypeScript 設定
├── infrastructures/                 # インフラ関連
├── docs/                            # ドキュメント
├── turbo.json                       # Turborepo 設定
├── pnpm-workspace.yaml              # pnpm ワークスペース設定
├── package.json                     # ルート package.json
├── .oxlintrc.json                   # oxlint 設定
├── .oxfmtrc.json                    # oxfmt 設定
└── lefthook.yml                     # Git フック設定
```

## apps/web（Next.js アプリ）構造

```
apps/web/
├── src/
│   ├── app/                         # App Router のルートディレクトリ
│   │   ├── layout.tsx               # ルートレイアウト
│   │   ├── page.tsx                 # トップページ (/)
│   │   ├── globals.css              # グローバルスタイル
│   │   ├── _components/             # app/ 直下のルート専用コンポーネント
│   │   ├── _lib/                    # app/ 直下のルート専用ユーティリティ
│   │   ├── _server-functions/       # app/ 直下のルート専用サーバー関数
│   │   │   ├── actions/             # Server Actions（更新系処理）
│   │   │   └── fetchers/            # データ取得関数（参照系処理）
│   │   └── (feature-group)/         # Route Group（URL に影響しない）
│   │       ├── _components/         # グループ共有コンポーネント
│   │       ├── _lib/                # グループ共有ユーティリティ・定数
│   │       ├── _server-functions/   # グループ共有サーバー関数
│   │       │   └── fetchers/
│   │       └── feature-name/        # 各ページ
│   │           ├── page.tsx
│   │           ├── layout.tsx       # （任意）
│   │           ├── loading.tsx      # （任意）
│   │           └── _components/     # ページ固有コンポーネント
│   ├── components/                  # アプリ全体で共有するコンポーネント
│   │   └── shared/
│   ├── constants/                   # アプリ全体で共有する定数
│   ├── hooks/                       # カスタムフック
│   ├── lib/                         # 汎用ユーティリティ
│   └── server-functions/            # アプリ全体で共有するサーバー関数
│       ├── actions/                 # Server Actions
│       └── fetchers/                # データ取得関数
├── e2e/                             # Playwright E2E テスト
├── public/                          # 静的ファイル
├── next.config.ts
├── playwright.config.ts
└── vitest.config.ts
```

## 実際の構造例（(table) ルートグループ）

```
apps/web/src/app/(table)/
├── _components/                  # tables/ と tables-virtual/ で共有
│   ├── column-visibility-control.tsx
│   ├── columns.tsx
│   ├── filter-form.tsx
│   ├── table-skeleton.tsx
│   └── tables-loading-fallback.tsx
├── _lib/                         # グループ内で共有
│   ├── constants.ts
│   └── schema.ts
├── _server-functions/
│   └── fetchers/
│       └── get-ad-data.ts
├── tables/
│   ├── page.tsx
│   └── _components/
│       ├── ad-data-table.tsx
│       ├── tables-container.tsx
│       └── tables-content.tsx
└── tables-virtual/
    ├── page.tsx
    └── _components/
        ├── ad-data-table-virtual.tsx
        ├── tables-container-virtual.tsx
        └── tables-content-virtual.tsx
```

## ファイル配置のルール

| ディレクトリ                     | 配置基準                                             |
| -------------------------------- | ---------------------------------------------------- |
| `src/components/shared/`         | 複数ページをまたいで使う共通コンポーネント           |
| `src/lib/`                       | 複数ページをまたいで使う共通ユーティリティ           |
| `src/server-functions/actions/`  | 複数ページをまたいで使う Server Actions              |
| `src/server-functions/fetchers/` | 複数ページをまたいで使う fetcher                     |
| `src/constants/`                 | 複数ページをまたいで使う定数                         |
| `src/hooks/`                     | 複数ページをまたいで使うカスタムフック               |
| `(group)/_components/`           | ルートグループ内の複数ページで共有するコンポーネント |
| `(group)/_lib/`                  | ルートグループ内の複数ページで共有するユーティリティ |
| `(group)/_server-functions/`     | ルートグループ内で共有するサーバー関数               |
| `[feature]/_components/`         | そのページ固有のコンポーネント                       |
| `[feature]/_lib/`                | そのページ固有の定数・ユーティリティ                 |
| `[feature]/_server-functions/`   | そのページ固有の Server Actions / fetcher            |

**命名規則**: ディレクトリ名、ファイル名はすべて `kebab-case`

## アンダースコアプレフィックスの意味

- `_components/`, `_lib/`, `_server-functions/` は Next.js の Private Folder 規則に従い、ルーティング対象外
- そのルート・グループ専用のファイルを置く

## apps/batch（バッチアプリ）構造

```
apps/batch/
├── src/
│   └── index.ts                  # エントリーポイント
├── package.json
└── tsconfig.json
```

## packages/typescript-config

```
packages/typescript-config/
├── base.json                     # 基本 TypeScript 設定
├── nextjs.json                   # Next.js 向け拡張設定
├── node.json                     # Node.js 向け拡張設定
└── package.json
```
