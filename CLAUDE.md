# CLAUDE.md

Next.js 16, oxlint, oxfmt を導入したプロジェクトになります。

## コマンド

```sh
pnpm dev          # 開発サーバー起動
pnpm build        # プロダクションビルド
pnpm lint         # oxlint でチェック
pnpm lint:fix     # oxlint で自動修正
pnpm fmt          # oxfmt でフォーマット
pnpm fmt:check    # oxfmt でフォーマットチェック
pnpm type-check   # tsc --noEmit で型チェック
```

## アーキテクチャ

- **Next.js 16 App Router** — `src/app/` 配下にルートを配置
- **React Compiler** (`reactCompiler: true`) — useMemo/useCallback の手動最適化は不要
- **cacheComponents: true** — データフェッチはデフォルトで動的。キャッシュしたい箇所に `use cache` を明示的に付ける
