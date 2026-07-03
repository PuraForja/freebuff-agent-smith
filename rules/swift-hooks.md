# 📏 Regra: swift — hooks

> **Adaptada do ECC:** \`rules/swift/hooks.md\`
> **Fonte original:** \`ECC/rules/swift/hooks.md\`

## Descrição

Regra ECC para swift: hooks

---

## Conteúdo Adaptado

---
paths:
  - "**/*.swift"
  - "**/Package.swift"
---
# Swift Hooks

> This file extends [common/hooks.md](../common/hooks.md) with Swift specific content.

## PostToolUse Hooks

Configure in `~/.claude/settings.json`:

- **SwiftFormat**: Auto-format `.swift` files after edit
- **SwiftLint**: Run lint checks after editing `.swift` files
- **swift build**: Type-check modified packages after edit

## Warning

Flag `print()` statements — use `os.Logger` or structured logging instead for production code.

---

**ECC Original:** \`ECC/rules/swift/hooks.md\`
**Atualizado em:** 2026-07-02 23:01:54
