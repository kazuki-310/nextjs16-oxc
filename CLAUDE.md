# CLAUDE.md

Next.js 16, oxlint, oxfmt を導入したプロジェクトになります。

## コマンド

```sh
pnpm dev          # 開発サーバー起動
pnpm build        # プロダクションビルド
pnpm check        #　
pnpm lint         # oxlint でチェック
pnpm lint:fix     # oxlint で自動修正
pnpm fmt    # oxfmt でフォーマットチェック
pnpm fmt:fix          # oxfmt でフォーマット
pnpm type-check   # tsc --noEmit で型チェック
```

## 作業ルール

ファイルを変更した場合は必ず `pnpm check` を実行し、エラーが出たら修正してから作業完了とすること。

## アーキテクチャ

- **Next.js 16 App Router** — `src/app/` 配下にルートを配置
- **React Compiler** (`reactCompiler: true`) — useMemo/useCallback の手動最適化は不要
- **cacheComponents: true**
