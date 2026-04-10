# 投稿更新

## 概要

- `updatePost` サーバーアクション（`authClient`）で投稿を更新する。

## リクエスト

| パラメータ名 | 型     | 必須 | 制約                 |
| ------------ | ------ | ---- | -------------------- |
| id           | number | 必須 | 対象投稿 ID          |
| title        | string | 必須 | 1文字以上100文字以下 |
| content      | string | 必須 | 1文字以上            |

## 処理内容

1. `id` で投稿を取得する。存在しなければ `ActionError`「投稿が見つかりません」。
2. `post.authorId` とセッションの `user.id` が一致しない場合、`ActionError`「編集権限がありません」。
3. `prisma.post.update` で `title` と `content` を更新する。
4. `revalidatePath("/posts")` のあと `/posts` へ `redirect` する。

## エラーハンドリング

| 条件               | 扱い                                    |
| ------------------ | --------------------------------------- |
| 上記ビジネスエラー | 通知で `serverError` を表示する         |
| DB 等の失敗        | `ActionError`「更新処理に失敗しました」 |
