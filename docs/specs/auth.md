# 認証仕様

## 概要

Auth.js v5（NextAuth）の Credentials プロバイダーを使用したメールアドレス/ニックネーム + パスワード認証。

## 使用技術

| 項目               | 技術                  |
| ------------------ | --------------------- |
| 認証ライブラリ     | Auth.js v5 (NextAuth) |
| パスワードハッシュ | bcrypt                |
| セッション         | JWT                   |
| バリデーション     | Zod                   |

## 認証フロー

```
ユーザー入力（ログインフォーム）
  ↓
loginAction（Server Action）
  ↓
signIn("credentials", { identifier, password, redirectTo: "/" })
  ↓
authorize()（Auth.js コールバック）
  ├─ バリデーション（Zod parseAsync）
  ├─ ユーザー検索（email または nickname）
  ├─ アカウントロック確認 → ロック中なら AccountLockedError を throw
  ├─ パスワード検証（bcrypt.compare）
  ├─ 失敗時: 失敗カウント更新 → Error を throw
  └─ 成功時: 失敗カウントリセット → JWT 発行 → "/" にリダイレクト
```

## ログイン

### 入力

| フィールド | 説明                             | バリデーション                                     |
| ---------- | -------------------------------- | -------------------------------------------------- |
| identifier | ニックネームまたはメールアドレス | 必須、メールアドレス形式チェック（`@` を含む場合） |
| password   | パスワード                       | 必須、8〜32文字                                    |

### エラーハンドリング

| 状況                 | クライアントへのメッセージ                                    | サーバーログ                        |
| -------------------- | ------------------------------------------------------------- | ----------------------------------- |
| バリデーション失敗   | メールアドレス/ニックネームまたはパスワードが正しくありません | ZodError                            |
| ユーザーが存在しない | メールアドレス/ニックネームまたはパスワードが正しくありません | ユーザーが存在しません              |
| パスワード不一致     | メールアドレス/ニックネームまたはパスワードが正しくありません | パスワードが正しくありません        |
| アカウントロック中   | アカウントがロックされています。30分後に再試行してください。  | AccountLockedError (account_locked) |

> ユーザー列挙攻撃を防ぐため、「ユーザーが存在しない」と「パスワード不一致」はクライアントに同一メッセージを返す。
> 詳細はサーバーログにのみ出力される。

### エラー伝播の仕組み

- `AccountLockedError extends CredentialsSignin` → Auth.js がそのまま再スロー → `loginAction` で `instanceof AccountLockedError` で捕捉
- `throw new Error(...)` → Auth.js が `CallbackRouteError` にラップ → `loginAction` で `instanceof AuthError` で捕捉

### 成功時

`redirectTo: "/"` により Auth.js 内部で `NEXT_REDIRECT` を throw → `loginAction` の `throw error` で再スロー → `"/"` にリダイレクト。

## ブルートフォース対策

### ロジック

| 定数                 | 値   |
| -------------------- | ---- |
| ロックまでの失敗回数 | 5回  |
| ロック継続時間       | 30分 |

### DB スキーマ（Employee モデル）

| カラム                  | 型        | 説明                                            |
| ----------------------- | --------- | ----------------------------------------------- |
| `failed_login_attempts` | Int       | ログイン失敗回数（デフォルト: 0）               |
| `unlock_at`             | DateTime? | アカウントのロック解除日時（null = ロックなし） |

### 処理詳細

**ロックの判定（`isAccountLocked`）**

- `unlockAt` が null → ロックなし
- `unlockAt` が現在時刻より過去 → ロック期限切れ（ロックなし）
- `unlockAt` が現在時刻より未来 → ロック中

**有効な失敗回数の取得（`getEffectiveFailedAttempts`）**

- ロック期限切れの場合は 0 を返す（自動リセット扱い）
- それ以外は DB の `failedLoginAttempts` をそのまま返す

**失敗時（`recordFailedLogin`）**

1. 失敗回数を +1
2. 失敗回数が 5 回以上 → `unlockAt` に現在時刻 + 30分をセット（ロック）
3. 失敗回数が 5 回未満 → `unlockAt` を null のまま

**成功時（`resetLoginAttempts`）**

- `failedLoginAttempts` を 0 にリセット
- `unlockAt` を null にリセット

## セッション

| 項目                   | 値                   |
| ---------------------- | -------------------- |
| 戦略                   | JWT                  |
| 有効期限（maxAge）     | 86400秒（1日）       |
| JWT に含まれる情報     | `id`（従業員ID）のみ |
| セッションへのアクセス | `session.user.id`    |

> JWT には `id` のみを格納する。`name` や `status` はユーザー変更のたびに JWT を更新する必要が生じるため含めない。

## 関連ファイル

| ファイル                                  | 役割                                                                  |
| ----------------------------------------- | --------------------------------------------------------------------- |
| `src/lib/auth.ts`                         | Auth.js 設定、`authorize()` コールバック、`AccountLockedError` クラス |
| `src/lib/brute-force.ts`                  | ブルートフォース対策ロジック                                          |
| `src/lib/auth-schema.ts`                  | Zod バリデーションスキーマ                                            |
| `src/app/login/actions/login.ts`          | ログイン Server Action                                                |
| `src/app/login/components/login-form.tsx` | ログインフォームコンポーネント                                        |
