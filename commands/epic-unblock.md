# ⚡ Comando: epic-unblock

> **Adaptado do ECC:** \`ECC/commands/epic-unblock.md\`

## Descrição

Sweep blocked epic issues and reopen anything whose dependencies are closed.

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: Sweep blocked epic issues and reopen anything whose dependencies are closed.
---

# /epic-unblock

Sweep blocked epics whose declared dependencies are complete.

```bash
node scripts/github-coordination.js unblock --repo <owner/repo>
```

What this does:

1. Scans epic issues in the repository.
2. Checks each blocked epic's dependency list.
3. Moves fully unblocked epics to ready.
4. Updates labels, comments, and local snapshots.

Compatibility aliases:

- `/loop-status`

---

**ECC Original:** \`ECC/commands/epic-unblock.md\`
**Atualizado em:** 2026-07-02 23:01:56
