# 📏 Regra: java — hooks

> **Adaptada do ECC:** \`rules/java/hooks.md\`
> **Fonte original:** \`ECC/rules/java/hooks.md\`

## Descrição

Regra ECC para java: hooks

---

## Conteúdo Adaptado

---
paths:
  - "**/*.java"
  - "**/pom.xml"
  - "**/build.gradle"
  - "**/build.gradle.kts"
---
# Java Hooks

> This file extends [common/hooks.md](../common/hooks.md) with Java-specific content.

## PostToolUse Hooks

Configure in `~/.claude/settings.json`:

- **google-java-format**: Auto-format `.java` files after edit
- **checkstyle**: Run style checks after editing Java files
- **./mvnw compile** or **./gradlew compileJava**: Verify compilation after changes

---

**ECC Original:** \`ECC/rules/java/hooks.md\`
**Atualizado em:** 2026-07-02 23:01:52
