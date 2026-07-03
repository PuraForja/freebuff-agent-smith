# ⚡ Comando: epic-decompose

> **Adaptado do ECC:** \`ECC/commands/epic-decompose.md\`

## Descrição

Break an epic into task children without creating task branches.

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: Break an epic into task children without creating task branches.
---

# /epic-decompose

Reconcile the task breakdown for one epic issue.

```bash
node scripts/github-coordination.js decompose <issue-number> --repo <owner/repo>
```

What this does:

1. Reads the epic issue body for task checklists and dependency references.
2. Stores the decomposition in the coordination block.
3. Leaves task branches out of the workflow.
4. Appends a concise audit comment.

Compatibility aliases:

- `/plan`
- `/prp-plan`

---

**ECC Original:** \`ECC/commands/epic-decompose.md\`
**Atualizado em:** 2026-07-02 23:01:56
