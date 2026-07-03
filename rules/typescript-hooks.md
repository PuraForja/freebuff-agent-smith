# 📏 Regra: typescript — hooks

> **Adaptada do ECC:** \`rules/typescript/hooks.md\`
> **Fonte original:** \`ECC/rules/typescript/hooks.md\`

## Descrição

Regra ECC para typescript: hooks

---

## Conteúdo Adaptado

---
paths:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.js"
  - "**/*.jsx"
---
# TypeScript/JavaScript Hooks

> This file extends [common/hooks.md](../common/hooks.md) with TypeScript/JavaScript specific content.

## PostToolUse Hooks

Configure in `~/.claude/settings.json`:

- **Prettier**: Auto-format JS/TS files after edit
- **TypeScript check**: Run `tsc` after editing `.ts`/`.tsx` files
- **console.log warning**: Warn about `console.log` in edited files

## Stop Hooks

- **console.log audit**: Check all modified files for `console.log` before session ends

---

**ECC Original:** \`ECC/rules/typescript/hooks.md\`
**Atualizado em:** 2026-07-02 23:01:55
