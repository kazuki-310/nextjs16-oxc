# ディレクトリ構成

## モノレポ全体

```
nextjs16-oxc/
├── apps/
│   ├── web/                         # Next.js 16 フロントエンドアプリ
│   └── batch/                       # バッチ処理アプリ (Node.js)
├── packages/
│   └── typescript-config/           # 共有 TypeScript 設定
├── infrastructures/
├── docs/
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
├── .oxlintrc.json
├── .oxfmtrc.json
└── lefthook.yml
```

---

## apps/web (Next.js アプリ)

```
apps/web/
├── src/
│   ├── app/                         # App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── components/              # このルート専用コンポーネント
│   │   │   └── post-form.tsx
│   │   ├── lib/                     # constants.ts, utils.ts, types.ts, schema.ts
│   │   ├── functions/                 # Server Functions
│   │   │   ├── create-post.ts
│   │   │   └── create-post.test.ts
│   │   ├── data/                    # データ取得関数
│   │   └── (table)/
│   │       ├── components/
│   │       │   ├── column-visibility-control.tsx
│   │       │   ├── columns.tsx
│   │       │   ├── filter-form.tsx
│   │       │   ├── table-skeleton.tsx
│   │       │   └── tables-loading-fallback.tsx
│   │       ├── lib/
│   │       │   ├── constants.ts
│   │       │   └── schema.ts
│   │       ├── data/
│   │       │   └── get-ad-data.ts
│   │       ├── tables/
│   │       │   ├── components/
│   │       │   │   ├── ad-data-table.tsx
│   │       │   │   ├── tables-container.tsx
│   │       │   │   └── tables-content.tsx
│   │       │   └── page.tsx
│   │       └── tables-virtual/
│   │           ├── components/
│   │           │   ├── ad-data-table-virtual.tsx
│   │           │   ├── tables-container-virtual.tsx
│   │           │   └── tables-content-virtual.tsx
│   │           └── page.tsx
│   │
│   ├── components/                  # アプリ全体で共有するコンポーネント
│   │   ├── layout/
│   │   │   └── sidebar.tsx
│   │   └── shared/
│   ├── constants/
│   ├── hooks/
│   ├── lib/                         # 汎用ユーティリティ
│   ├── functions/                     # アプリ全体で共有する Server Functions
│   └── data/                        # アプリ全体で共有するデータ取得関数
│
├── e2e/
│   ├── create-post.spec.ts
│   └── tables.spec.ts
├── public/
├── next.config.ts
├── playwright.config.ts
├── vitest.config.ts
├── postcss.config.mjs
└── tsconfig.json
```

---

## 命名・配置ルール

### フィーチャー単位のディレクトリ

各ルート・グループ配下に以下のディレクトリを必要に応じて置く。
`_` プレフィックスは不要（`page.tsx` 等がなければ元々ルーティングされない）。

| ディレクトリ    | 用途                                             |
| --------------- | ------------------------------------------------ |
| `components/`   | そのルート・グループのみが使う UI コンポーネント |
| `lib/`          | constants.ts, utils.ts, types.ts, schema.ts      |
| `functions/`    | Server Functions（フォームアクション含む）        |
| `data/`         | データ取得関数                                   |
| `hooks/`        | カスタムフック                                   |

### グローバルスコープ (`src/` 直下)

複数ルートにまたがって使う場合は `src/` 直下に置く。

| ディレクトリ      | 用途                                   |
| ----------------- | -------------------------------------- |
| `src/components/` | アプリ全体で共有する UI コンポーネント |
| `src/constants/`  | アプリ全体で共有する定数               |
| `src/hooks/`      | カスタムフック                         |
| `src/lib/`        | 汎用ユーティリティ                     |
| `src/functions/`  | アプリ全体で共有する Server Functions  |
| `src/data/`       | アプリ全体で共有するデータ取得関数     |

---

## apps/batch (バッチアプリ)

```
apps/batch/
├── src/
│   └── index.ts
├── package.json
└── tsconfig.json
```

---

## packages/typescript-config

```
packages/typescript-config/
├── base.json
├── nextjs.json
├── node.json
└── package.json
```
