---
name: review
description: 4つの reviewer を並列起動し、指摘を統合して1本のレビューとして返す。
model: sonnet
disable-model-invocation: true
---

# 並列コードレビュー

判断は `.claude/agents/` の各 `*-reviewer` に任せ、ここでは起動と結果の統合だけ行う。

1. レビュー範囲を次の 4 エージェントすべてに渡す。
2. 下記テンプレの `{…}` を各出力で置き換える

| `name`                | 役割                   |
| --------------------- | ---------------------- |
| `spec-reviewer`       | 仕様と実装の整合性     |
| `code-style-reviewer` | コード規約             |
| `security-reviewer`   | セキュリティ           |
| `test-reviewer`       | カバレッジ・テスト観点 |

```markdown
### 1. 仕様と実装

{spec-reviewer}

### 2. コード規約

{code-style-reviewer}

### 3. セキュリティ

{security-reviewer}

### 4. カバレッジ・テスト観点

{test-reviewer}

### サマリー

- 指摘件数: 仕様 N件 / コード規約 N件 / セキュリティ N件 / テスト N件
- 指摘の要約: {各エージェントの表記に従い列挙、なければ「なし」}
- 総合: 問題なし / 軽微 / 要修正
```
