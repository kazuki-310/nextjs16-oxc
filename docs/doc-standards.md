# ドキュメント標準

## ディレクトリ構成

- `docs/domain/` … ドメイン知識・用語定義
- `docs/specs/database/` … データベースの仕様
- `docs/specs/web/{feature}/` … アプリ機能ごとの仕様
  - `overview.md` … 目的・スコープ・対応ページ
  - `functional/` … 機能仕様
  - `ui/` … 画面仕様
- `docs/specs/batch/{feature}/` … バッチ処理ごとの仕様
  - `overview.md` … 目的・実行タイミング・入出力
  - `functional/` … 処理仕様

## 各ファイルの書き方

- `domain/ubiquitous-lang.md` … ユビキタス言語を記載
- `domain/knowledge.md` … 業務知識全般を記載
- `database/er.dbml` … データベースのER図を記載
- `{feature}/overview.md` … 目的・対応ページを記載
- `{feature}/functional/*.md` … 処理フロー・ビジネスロジック・エラーケースを記載
- `{feature}/ui/*.md` … 表示項目・バリデーション・権限を記載

## 命名規則

- すべてケバブケース
  - 例: `functional/app-list.md`
  - 例: `ui/app-list.md`
