# 従業員登録機能仕様

## 概要

- `registerEmployee` サーバーアクション（next-safe-action）で従業員を作成し、続けて `signIn("credentials")` を実行する。
- 入力はログインと同じ `authSchema` を用いる。

## リクエスト

| パラメータ名 | 型     | 必須 | 概要                             |
| ------------ | ------ | ---- | -------------------------------- |
| identifier   | string | 必須 | ニックネームまたはメールアドレス |
| password     | string | 必須 | パスワード（ハッシュ化して保存） |

## 処理内容

1. `identifier` に `@` が含まれるかでメール登録かニックネーム登録かを判定する。
2. `email` または `nickname` が `identifier` と一致する従業員が既にいれば、`returnValidationErrors` でフィールドエラーを返す。
   - メールの場合: 「このメールアドレスは既に登録されています」
   - ニックネームの場合: 「このニックネームは既に登録されています」
3. パスワードを bcrypt（salt rounds 10）でハッシュ化する。
4. `prisma.employee.create` でレコードを作成する。
   - `name`: `identifier`
   - メールの場合: `email` を設定、`nickname` は null
   - ニックネームの場合: `nickname` を設定、`email` は null
   - `status`: `ACTIVE`
5. `signIn("credentials", { identifier, password, redirectTo: "/" })` を実行する。

## レスポンス

- 成功時：NextAuth のフローに従い `/` へリダイレクトする。

## エラーハンドリング

| 条件                   | 扱い                                      |
| ---------------------- | ----------------------------------------- |
| スキーマバリデーション | フォームにフィールドエラーを表示する      |
| 重複する identifier    | `identifier` フィールドにエラーメッセージ |
| その他の失敗           | 通知で `serverError` を表示する           |
