# 投稿1件取得

## 概要

- 編集画面で `getPost(id)` により1件取得する。

## 処理内容

- `prisma.post.findUnique({ where: { id } })` を実行する。
- 存在しない場合、`notFound()` を呼び出し Next.js の 404 を返す。

## 備考

- 取得時点では「投稿者本人か」のチェックは行わない。更新時に `authorId` とセッションを照合する。
