# 集中ヒント（日替わり）

## 目的

ログイン済みユーザーに、短い集中のコツを 1 件だけ表示する。ヒント本文は MySQL の `focus_tips` テーブルから取得し、画面を開いたときのサーバー日付で表示する行を決める。外部 API は使わない。

## 対応ページ

- `apps/web/src/app/(auth)/focus-tips/page.tsx`
- データ取得: `apps/web/src/app/(auth)/focus-tips/data/get-daily-focus-tip.ts`

## スコープ

- 対象: 認証レイアウト配下（未認証は既存どおりログインへ誘導）
- データ: `focus_tips`（マスタ）。初期データはマイグレーションで投入する
- 非対応: アプリ内からのヒント編集 UI、ユーザー別の履歴、通知
