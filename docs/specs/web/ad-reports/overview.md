# 広告レポート一覧（テーブルデモ）

## 目的

モックの広告指標データを大量のテーブルで表示し、フィルタ・列表示切替・ソートなどの UI パターンを検証する。通常版と仮想スクロール版の2画面がある。

## 対応ページ

- `apps/web/src/app/(auth)/(table)/tables/page.tsx` … 通常一覧
- `apps/web/src/app/(auth)/(table)/tables-virtual/page.tsx` … 仮想スクロール一覧

## データソース

- クライアント向けデータは `getAdData` が返すモック（定数生成）。取得時に約1秒の遅延を入れる。
