# ディレクトリ構成

## モノレポ全体

```
nextjs16-oxc/                        # ルート
├── apps/
│   ├── web/                         # Next.js 16 フロントエンドアプリ
│   └── batch/                       # バッチ処理アプリ (Node.js)
├── packages/
│   └── typescript-config/           # 共有 TypeScript 設定
├── infrastructures/                 # インフラ関連 (未使用)
├── docs/                            # ドキュメント
├── .github/workflows/               # CI/CD (Playwright)
├── turbo.json                       # Turborepo 設定
├── pnpm-workspace.yaml              # pnpm ワークスペース設定
├── package.json                     # ルート package.json
├── .oxlintrc.json                   # oxlint 設定
├── .oxfmtrc.json                    # oxfmt 設定
├── lefthook.yml                     # Git フック設定
└── CLAUDE.md                        # Claude Code 向け指示
```

---

## apps/web (Next.js アプリ)

```
apps/web/
├── src/
│   ├── app/                         # App Router のルートディレクトリ
│   │   ├── layout.tsx               # ルートレイアウト
│   │   ├── page.tsx                 # トップページ (/)
│   │   ├── globals.css              # グローバルスタイル
│   │   ├── favicon.ico
│   │   │
│   │   ├── _components/             # app/ 直下のルート専用コンポーネント
│   │   │   └── post-form.tsx
│   │   ├── _lib/                    # app/ 直下のルート専用ユーティリティ
│   │   ├── _server-functions/       # app/ 直下のルート専用サーバー関数
│   │   │   ├── actions/             # Server Actions
│   │   │   │   ├── create-post.ts
│   │   │   │   └── create-post.test.ts
│   │   │   └── fetchers/            # データ取得関数
│   │   │
│   │   └── (table)/                 # Route Group: テーブル系ページ
│   │       ├── _components/         # グループ共有コンポーネント
│   │       │   ├── column-visibility-control.tsx
│   │       │   ├── columns.tsx
│   │       │   ├── filter-form.tsx
│   │       │   ├── table-skeleton.tsx
│   │       │   └── tables-loading-fallback.tsx
│   │       ├── _lib/                # グループ共有ユーティリティ
│   │       │   ├── constants.ts
│   │       │   └── schema.ts
│   │       ├── _server-functions/   # グループ共有サーバー関数
│   │       │   └── fetchers/
│   │       │       └── get-ad-data.ts
│   │       ├── tables/              # /tables ページ
│   │       │   ├── _components/
│   │       │   │   ├── ad-data-table.tsx
│   │       │   │   ├── tables-container.tsx
│   │       │   │   └── tables-content.tsx
│   │       │   └── page.tsx
│   │       └── tables-virtual/      # /tables-virtual ページ
│   │           ├── _components/
│   │           │   ├── ad-data-table-virtual.tsx
│   │           │   ├── tables-container-virtual.tsx
│   │           │   └── tables-content-virtual.tsx
│   │           └── page.tsx
│   │
│   ├── components/                  # アプリ全体で共有するコンポーネント
│   │   └── shared/
│   │       └── sidebar.tsx
│   ├── constants/                   # アプリ全体で共有する定数
│   ├── hooks/                       # カスタムフック
│   ├── lib/                         # 汎用ユーティリティ
│   └── server-functions/            # アプリ全体で共有するサーバー関数
│       ├── actions/                 # Server Actions
│       └── fetchers/                # データ取得関数
│
├── e2e/                             # Playwright E2E テスト
│   ├── create-post.spec.ts
│   └── tables.spec.ts
├── public/                          # 静的ファイル
├── next.config.ts                   # Next.js 設定
├── playwright.config.ts             # Playwright 設定
├── vitest.config.ts                 # Vitest 設定
├── postcss.config.mjs               # PostCSS 設定
└── tsconfig.json                    # TypeScript 設定
```

---

## 命名・配置ルール

### `_` プレフィックスディレクトリ (Private フォルダ)

`_components/`, `_lib/`, `_server-functions/` は Next.js の Private Folder 規則に従い、
**そのルート/グループ専用**のファイルを置く。

| ディレクトリ                  | 用途                                                 |
| ----------------------------- | ---------------------------------------------------- |
| `_components/`                | そのルート・グループのみが使う UI コンポーネント     |
| `_lib/`                       | そのルート・グループのみが使う定数・スキーマ・型定義 |
| `_server-functions/actions/`  | そのルート・グループのみが使う Server Actions        |
| `_server-functions/fetchers/` | そのルート・グループのみが使うデータ取得関数         |

### Route Groups `(groupName)`

`(table)` のように括弧で囲ったディレクトリは URL に影響せず、関連ページをグループ化する。
グループ内の `_components/`, `_lib/`, `_server-functions/` はグループ内のページで共有できる。

### グローバルスコープ (`src/` 直下)

複数ルートにまたがって使う場合は `src/` 直下のディレクトリに置く。

| ディレクトリ            | 用途                                     |
| ----------------------- | ---------------------------------------- |
| `src/components/`       | アプリ全体で共有する UI コンポーネント() |
| `src/constants/`        | アプリ全体で共有する定数                 |
| `src/hooks/`            | カスタムフック                           |
| `src/lib/`              | 汎用ユーティリティ                       |
| `src/server-functions/` | アプリ全体で共有するサーバー関数         |

---

## apps/batch (バッチアプリ)

```
apps/batch/
├── src/
│   └── index.ts                     # エントリーポイント
├── package.json
└── tsconfig.json
```

---

## packages/typescript-config

```
packages/typescript-config/
├── base.json                        # 基本 TypeScript 設定
├── nextjs.json                      # Next.js 向け拡張設定
├── node.json                        # Node.js 向け拡張設定
└── package.json
```
