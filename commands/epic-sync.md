# ⚡ Comando: epic-sync

> **Adaptado do ECC:** \`ECC/commands/epic-sync.md\`

## Descrição

Sync epic issue bodies, labels, and local coordination snapshots from GitHub.

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: Sync epic issue bodies, labels, and local coordination snapshots from GitHub.
---

# /epic-sync

Run a deterministic sync for epic issues.

```bash
node scripts/github-coordination.js sync --repo <owner/repo>
```

What this does:

1. Reads issue bodies as the canonical epic state.
2. Reconciles the coordination block with labels.
3. Writes a fresh local snapshot for each epic issue.
4. Keeps the SQLite cache aligned with GitHub.

Compatibility aliases:

- `/projects`
- `/work-items sync-github`

---

**ECC Original:** \`ECC/commands/epic-sync.md\`
**Atualizado em:** 2026-07-02 23:01:56
