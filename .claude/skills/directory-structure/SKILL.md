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
│   └── _server-functions/        # app 直下ページ固有 Server Functions
│       ├── actions/              # 更新系処理（Server Actions）
│       └── fetchers/             # 参照系処理
├── components/
│   └── shared/                   # 複数ページをまたぐ共通コンポーネント
├── constants/                    # 共通定数定義
├── hooks/                        # 共通カスタムフック
├── lib/                          # 共通ユーティリティ・ヘルパー関数
└── server-functions/             # 共通 Server Functions
    ├── actions/                  # 更新系処理
    └── fetchers/                 # 参照系処理
```

## ページごとの構造

ページごとに独立したディレクトリ構造を持ち、関連するファイルを近くに配置する。

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

| ディレクトリ                     | 配置基準                                        |
| -------------------------------- | ----------------------------------------------- |
| `src/components/shared/`         | 複数のページをまたいで使う共通コンポーネント    |
| `src/lib/`                       | 複数のページをまたいで使う共通ユーティリティ    |
| `src/server-functions/actions/`  | 複数のページをまたいで使う Server Actions       |
| `src/server-functions/fetchers/` | 複数のページをまたいで使う fetcher              |
| `src/constants/`                 | 複数のページをまたいで使う定数                  |
| `src/hooks/`                     | 複数のページをまたいで使うカスタムフック        |
| `[feature]/_components/`         | そのページ・機能固有のコンポーネント            |
| `[feature]/_lib/`                | そのページ・機能固有の定数・ユーティリティ      |
| `[feature]/_server-functions/`   | そのページ・機能固有の Server Actions / fetcher |

**命名規則**: ディレクトリ名、ファイル名はすべて `kebab-case`

## アンダースコアプレフィックスの意味

- `_components/`, `_lib/`, `_server-functions/` のように `_` で始まるディレクトリは **そのページ固有**のものを表す
- Next.js のルーティング対象外にするための命名規則
