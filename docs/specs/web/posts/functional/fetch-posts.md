# 投稿一覧取得

## 概要

- サーバーコンポーネントから `getPosts` を呼び出し、全投稿を取得する。
- React `cache` と `connection()` によりリクエスト境界を明示する。

## 処理内容

- `prisma.post.findMany` を `createdAt` 降順で実行する。
- `author.name` を含めて返す。

## レスポンス

- 投稿の配列。0件の場合は UI 側で「データがありません」と表示する。
