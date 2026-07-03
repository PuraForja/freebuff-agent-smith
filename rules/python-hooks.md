# 📏 Regra: python — hooks

> **Adaptada do ECC:** \`rules/python/hooks.md\`
> **Fonte original:** \`ECC/rules/python/hooks.md\`

## Descrição

Regra ECC para python: hooks

---

## Conteúdo Adaptado

---
paths:
  - "**/*.py"
  - "**/*.pyi"
---
# Python Hooks

> This file extends [common/hooks.md](../common/hooks.md) with Python specific content.

## PostToolUse Hooks

Configure in `~/.claude/settings.json`:

- **black/ruff**: Auto-format `.py` files after edit
- **mypy/pyright**: Run type checking after editing `.py` files

## Warnings

- Warn about `print()` statements in edited files (use `logging` module instead)

---

**ECC Original:** \`ECC/rules/python/hooks.md\`
**Atualizado em:** 2026-07-02 23:01:53
