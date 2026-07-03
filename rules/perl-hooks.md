# 📏 Regra: perl — hooks

> **Adaptada do ECC:** \`rules/perl/hooks.md\`
> **Fonte original:** \`ECC/rules/perl/hooks.md\`

## Descrição

Regra ECC para perl: hooks

---

## Conteúdo Adaptado

---
paths:
  - "**/*.pl"
  - "**/*.pm"
  - "**/*.t"
  - "**/*.psgi"
  - "**/*.cgi"
---
# Perl Hooks

> This file extends [common/hooks.md](../common/hooks.md) with Perl-specific content.

## PostToolUse Hooks

Configure in `~/.claude/settings.json`:

- **perltidy**: Auto-format `.pl` and `.pm` files after edit
- **perlcritic**: Run lint check after editing `.pm` files

## Warnings

- Warn about `print` in non-script `.pm` files — use `say` or a logging module (e.g., `Log::Any`)

---

**ECC Original:** \`ECC/rules/perl/hooks.md\`
**Atualizado em:** 2026-07-02 23:01:52
