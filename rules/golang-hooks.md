# 📏 Regra: golang — hooks

> **Adaptada do ECC:** \`rules/golang/hooks.md\`
> **Fonte original:** \`ECC/rules/golang/hooks.md\`

## Descrição

Regra ECC para golang: hooks

---

## Conteúdo Adaptado

---
paths:
  - "**/*.go"
  - "**/go.mod"
  - "**/go.sum"
---
# Go Hooks

> This file extends [common/hooks.md](../common/hooks.md) with Go specific content.

## PostToolUse Hooks

Configure in `~/.claude/settings.json`:

- **gofmt/goimports**: Auto-format `.go` files after edit
- **go vet**: Run static analysis after editing `.go` files
- **staticcheck**: Run extended static checks on modified packages

---

**ECC Original:** \`ECC/rules/golang/hooks.md\`
**Atualizado em:** 2026-07-02 23:01:51
