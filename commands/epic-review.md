# ⚡ Comando: epic-review

> **Adaptado do ECC:** \`ECC/commands/epic-review.md\`

## Descrição

Mark epic review requested, approved, or changes requested.

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: Mark epic review requested, approved, or changes requested.
---

# /epic-review

Coordinate review state for an epic issue.

```bash
node scripts/github-coordination.js review <issue-number> --repo <owner/repo> --review approved
```

What this does:

1. Updates the review state in the coordination block.
2. Syncs review labels to GitHub.
3. Records the review outcome in an audit comment.
4. Keeps the local cache aligned with the issue body.

Compatibility aliases:

- `/review-pr`
- `/code-review`

---

**ECC Original:** \`ECC/commands/epic-review.md\`
**Atualizado em:** 2026-07-02 23:01:56
