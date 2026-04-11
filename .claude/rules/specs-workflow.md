# 仕様参照ワークフロー

## 目的

関連する仕様を確認する。

## 手順

1. **仕様特定** → `docs/doc-standards.md` を必ず読み込み、実装に関連する仕様を特定する
   - `docs/specs/web`, `docs/specs/batch` など
2. **仕様確認** → 関連の仕様特定後ファイルを以下の順序で読む
   - `overview.md` → 目的・スコープ・対応ページ
   - `functional/*.md` → ビジネスロジック・処理フロー・エラーケース
   - `ui/*.md` → 画面設計・表示項目・バリデーション・権限
3. **domain・database 知識確認** → 必要に応じて `docs/domain/`、`docs/specs/database/` を参照する
4. **実装** → 仕様に基づいてコードを実装
