# ⚡ Comando: hookify-list

> **Adaptado do ECC:** \`ECC/commands/hookify-list.md\`

## Descrição

List all configured hookify rules

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: List all configured hookify rules
---

Find and display all hookify rules in a formatted table.

## Steps

1. Find all `.claude/hookify.*.local.md` files
2. Read each file's frontmatter:
   - `name`
   - `enabled`
   - `event`
   - `action`
   - `pattern`
3. Display them as a table:

| Rule | Enabled | Event | Pattern | File |
|------|---------|-------|---------|------|

4. Show the rule count and remind the user that `/hookify-configure` can change state later.

---

**ECC Original:** \`ECC/commands/hookify-list.md\`
**Atualizado em:** 2026-07-02 23:01:57
