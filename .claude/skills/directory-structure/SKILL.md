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
│   │   ├── components/              # app/ 直下のルート専用コンポーネント
│   │   ├── lib/                     # constants.ts, utils.ts, types.ts, schema.ts
│   │   ├── actions/                 # Server Actions（更新系処理）
│   │   ├── data/                    # データ取得関数（参照系処理）
│   │   ├── hooks/                   # カスタムフック（任意）
│   │   └── (table)/                 # 複数ページをまとめる場合は Route Group で囲む
│   │       ├── components/
│   │       ├── lib/
│   │       ├── data/
│   │       ├── tables/
│   │       │   ├── components/
│   │       │   └── page.tsx
│   │       └── tables-virtual/
│   │           ├── components/
│   │           └── page.tsx
│   ├── components/                  # アプリ全体で共有するコンポーネント
│   │   └── shared/
│   ├── constants/                   # アプリ全体で共有する定数
│   ├── hooks/                       # カスタムフック
│   ├── lib/                         # 汎用ユーティリティ
│   ├── actions/                     # アプリ全体で共有する Server Actions
│   └── data/                        # アプリ全体で共有するデータ取得関数
├── e2e/                             # Playwright E2E テスト
├── public/                          # 静的ファイル
├── next.config.ts
├── playwright.config.ts
└── vitest.config.ts
```

## ファイル配置のルール

### フィーチャー単位

各ルート配下に以下を必要に応じて置く。複数ルートで共有したいものは Route Group `(groupName)` でまとめてその配下に置く。

| ディレクトリ  | 用途                                             |
| ------------- | ------------------------------------------------ |
| `components/` | そのルート・グループのみが使う UI コンポーネント |
| `lib/`        | constants.ts, utils.ts, types.ts, schema.ts      |
| `actions/`    | Server Actions                                   |
| `data/`       | データ取得関数                                   |
| `hooks/`      | カスタムフック                                   |

`_` プレフィックスは不要（`page.tsx` 等がなければ元々ルーティングされない）。

### グローバルスコープ (`src/` 直下)

複数ルートにまたがって使う場合は `src/` 直下に置く。

| ディレクトリ      | 用途                                   |
| ----------------- | -------------------------------------- |
| `src/components/` | アプリ全体で共有する UI コンポーネント |
| `src/constants/`  | アプリ全体で共有する定数               |
| `src/hooks/`      | カスタムフック                         |
| `src/lib/`        | 汎用ユーティリティ                     |
| `src/actions/`    | アプリ全体で共有する Server Actions    |
| `src/data/`       | アプリ全体で共有するデータ取得関数     |

**命名規則**: ディレクトリ名、ファイル名はすべて `kebab-case`

## apps/batch（バッチアプリ）構造

```
apps/batch/
├── src/
│   └── index.ts
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
