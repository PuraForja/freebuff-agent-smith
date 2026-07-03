# ⚡ Comando: hookify-configure

> **Adaptado do ECC:** \`ECC/commands/hookify-configure.md\`

## Descrição

Enable or disable hookify rules interactively

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: Enable or disable hookify rules interactively
---

Interactively enable or disable existing hookify rules.

## Steps

1. Find all `.claude/hookify.*.local.md` files
2. Read the current state of each rule
3. Present the list with current enabled / disabled status
4. Ask which rules to toggle
5. Update the `enabled:` field in the selected rule files
6. Confirm the changes

---

**ECC Original:** \`ECC/commands/hookify-configure.md\`
**Atualizado em:** 2026-07-02 23:01:57
