# 📏 Regra: kotlin — hooks

> **Adaptada do ECC:** \`rules/kotlin/hooks.md\`
> **Fonte original:** \`ECC/rules/kotlin/hooks.md\`

## Descrição

Regra ECC para kotlin: hooks

---

## Conteúdo Adaptado

---
paths:
  - "**/*.kt"
  - "**/*.kts"
  - "**/build.gradle.kts"
---
# Kotlin Hooks

> This file extends [common/hooks.md](../common/hooks.md) with Kotlin-specific content.

## PostToolUse Hooks

Configure in `~/.claude/settings.json`:

- **ktfmt/ktlint**: Auto-format `.kt` and `.kts` files after edit
- **detekt**: Run static analysis after editing Kotlin files
- **./gradlew build**: Verify compilation after changes

---

**ECC Original:** \`ECC/rules/kotlin/hooks.md\`
**Atualizado em:** 2026-07-02 23:01:52
