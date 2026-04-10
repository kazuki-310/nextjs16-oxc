# 広告レポートデータ取得

## 概要

- `getAdData` がテーブル用の行データ（`tableData`）とテーブル設定（`tableConfigs`）を返す。
- いずれも `lib/constants` のモック定義に基づく（Prisma 等の DB ではない）。

## 処理内容

- 非同期で約 1 秒待機した後、`{ tableData, tableConfigs }` を返す。

## 備考

- 行数・テーブル数は定数側の設定に依存する（例: 90 行 × 複数テーブル）。
