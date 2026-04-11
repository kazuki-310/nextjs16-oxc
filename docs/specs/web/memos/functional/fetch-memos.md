# メモ一覧取得

## 概要

- サーバーで `getMemosForEmployee(authorId)` を呼び出し、指定従業員のメモのみ取得する。
- `updatedAt` の降順で並べる。

## 処理内容

- `prisma.memo.findMany({ where: { authorId }, orderBy: { updatedAt: "desc" } })` を実行する。
- `connection()` と React `cache` を利用する（他データ取得と同様のパターン）。

## レスポンス

- `Memo` エンティティの配列。0件の場合は UI で空メッセージを表示する。
