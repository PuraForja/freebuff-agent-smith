# ⚡ Comando: epic-publish

> **Adaptado do ECC:** \`ECC/commands/epic-publish.md\`

## Descrição

Publish a validated epic update back to the issue and local cache.

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: Publish a validated epic update back to the issue and local cache.
---

# /epic-publish

Publish a validated coordination update to GitHub.

```bash
node scripts/github-coordination.js publish <issue-number> --repo <owner/repo>
```

What this does:

1. Re-validates the epic before publishing.
2. Updates the coordination block in the issue body.
3. Appends a concise publish comment.
4. Records the final local snapshot.

Compatibility aliases:

- `/pr`
- `/prp-pr`

---

**ECC Original:** \`ECC/commands/epic-publish.md\`
**Atualizado em:** 2026-07-02 23:01:56
