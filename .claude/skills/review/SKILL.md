---
name: review
description: 4観点をサブエージェントで並列レビューし、結果を1本にまとめる。
model: sonnet
disable-model-invocation: true
---

# 並列コードレビュー

以下のサブエージェントで包括的にレビューしてください

| `name`                | 役割                   |
| --------------------- | ---------------------- |
| `security-reviewer`   | セキュリティ           |
| `code-style-reviewer` | コード規約             |
| `test-reviewer`       | カバレッジ・テスト観点 |
| `spec-reviewer`       | 仕様と実装の整合性     |

## コードレビュー結果

```markdown
### 1. コード規約

{code-style-reviewer}

### 2. セキュリティ

{security-reviewer}

### 3. カバレッジ・テスト観点

{test-reviewer}

### 4. docs 仕様と実装

{spec-reviewer}

### サマリー

- 指摘件数: コード規約 N件 / セキュリティ N件 / テスト N件 / 仕様 N件
- 指摘の要約: {各エージェントの表記に従い列挙、なければ「なし」}
- 総合: 問題なし / 軽微 / 要修正
```
