---
name: directory-structure
description: Directory structure and file placement rules for this project. Use when creating new files, adding features, or deciding where to place components, server functions, constants, or types.
user-invocable: false
---

# ディレクトリ構造

## プロジェクト全体構造

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # ルートレイアウト
│   ├── page.tsx                  # トップページ
│   ├── globals.css               # グローバルスタイル
│   ├── _components/              # app 直下ページ固有コンポーネント
│   ├── _lib/                     # app 直下ページ固有ユーティリティ
│   ├── _server-functions/        # app 直下ページ固有 Server Functions
│   │   ├── actions/              # 更新系処理（Server Actions）
│   │   └── fetchers/             # 参照系処理
│   └── (feature-group)/          # ルートグループ（URLに影響しない）
│       ├── _components/          # グループ内の複数ページで共有するコンポーネント
│       ├── _lib/                 # グループ内の複数ページで共有するユーティリティ
│       └── feature-name/
│           ├── page.tsx
│           └── _components/      # そのページ固有のコンポーネント
├── components/
│   ├── shared/                   # 共通コンポーネント
│   └── ui/                       # shadcn/ui コンポーネント（自動生成・編集不要）
├── constants/                    # 共通定数定義
├── hooks/                        # 共通カスタムフック
├── lib/                          # 共通ユーティリティ・ヘルパー関数
└── server-functions/             # 共通 Server Functions
    ├── actions/                  # 更新系処理
    └── fetchers/                 # 参照系処理
```

## 実際の構造例（(table) ルートグループ）

```
src/app/(table)/
├── _components/                  # tables/ と tables-virtual/ で共有
│   ├── filter-form.tsx
│   ├── column-visibility-control.tsx
│   ├── columns.tsx
│   └── data-table-column-header.tsx
├── _lib/                         # グループ内で共有
│   ├── schema.ts                 # schema 定義
│   └── constants.ts
├── tables/
│   ├── page.tsx
│   └── _components/              # ページ固有のコンポーネント
│       ├── tables-content.tsx
│       └── ad-data-table.tsx
└── tables-virtual/
    ├── page.tsx
    └── _components/              # tables-virtual ページ固有
        ├── tables-content-virtual.tsx
        └── ad-data-table-virtual.tsx
```

## ページごとの基本構造

```
src/app/(feature-group)/feature-name/
├── page.tsx
├── layout.tsx                    # レイアウト（任意）
├── loading.tsx                   # ローディング（任意）
├── _components/                  # ページ固有コンポーネント
│   ├── feature-form.tsx
│   └── feature-list.tsx
├── _lib/                         # ページ固有ライブラリ・ユーティリティ
│   ├── constants.ts              # 定数
│   └── utils.ts                  # ユーティリティ関数
└── _server-functions/            # ページ固有 Server Functions
    ├── actions/                  # 更新系処理（Server Actions）
    └── fetchers/                 # 参照系処理
```

## ファイル配置のルール

| ディレクトリ                     | 配置基準                                                     |
| -------------------------------- | ------------------------------------------------------------ |
| `src/components/ui/`             | shadcn/ui コンポーネント（`pnpm dlx shadcn add` で自動生成） |
| `src/components/shared/`         | 複数のページをまたいで使う共通コンポーネント                 |
| `src/lib/`                       | 複数のページをまたいで使う共通ユーティリティ                 |
| `src/server-functions/actions/`  | 複数のページをまたいで使う Server Actions                    |
| `src/server-functions/fetchers/` | 複数のページをまたいで使う fetcher                           |
| `src/constants/`                 | 複数のページをまたいで使う定数                               |
| `src/hooks/`                     | 複数のページをまたいで使うカスタムフック                     |
| `(group)/_components/`           | ルートグループ内の複数ページで共有するコンポーネント         |
| `(group)/_lib/`                  | ルートグループ内の複数ページで共有するユーティリティ・定数   |
| `[feature]/_components/`         | そのページ固有のコンポーネント                               |
| `[feature]/_lib/`                | そのページ固有の定数・ユーティリティ                         |
| `[feature]/_server-functions/`   | そのページ固有の Server Actions / fetcher                    |

**命名規則**: ディレクトリ名、ファイル名はすべて `kebab-case`

## アンダースコアプレフィックスの意味

- `_components/`, `_lib/`, `_server-functions/` のように `_` で始まるディレクトリは Next.js のルーティング対象外
- ページ固有・グループ固有のものを表す

## shadcn/ui コンポーネントの追加

```bash
pnpm dlx shadcn add <component-name>
# 例: pnpm dlx shadcn add button dialog table
```

追加されたコンポーネントは `src/components/ui/` に配置される。基本的に直接編集しない。
