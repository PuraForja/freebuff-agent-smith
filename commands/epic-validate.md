# ⚡ Comando: epic-validate

> **Adaptado do ECC:** \`ECC/commands/epic-validate.md\`

## Descrição

Validate epic readiness, dependencies, and coordination policy.

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: Validate epic readiness, dependencies, and coordination policy.
---

# /epic-validate

Validate a single epic issue before publishing or review handoff.

```bash
node scripts/github-coordination.js validate <issue-number> --repo <owner/repo>
```

What this checks:

1. Coordination state exists and is parseable.
2. Validation state is satisfied by policy.
3. Declared dependencies are closed.
4. The epic is ready for the next workflow stage.

Compatibility aliases:

- `/quality-gate`

---

**ECC Original:** \`ECC/commands/epic-validate.md\`
**Atualizado em:** 2026-07-02 23:01:56
