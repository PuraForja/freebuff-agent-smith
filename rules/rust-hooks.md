# 📏 Regra: rust — hooks

> **Adaptada do ECC:** \`rules/rust/hooks.md\`
> **Fonte original:** \`ECC/rules/rust/hooks.md\`

## Descrição

Regra ECC para rust: hooks

---

## Conteúdo Adaptado

---
paths:
  - "**/*.rs"
  - "**/Cargo.toml"
---
# Rust Hooks

> This file extends [common/hooks.md](../common/hooks.md) with Rust-specific content.

## PostToolUse Hooks

Configure in `~/.claude/settings.json`:

- **cargo fmt**: Auto-format `.rs` files after edit
- **cargo clippy**: Run lint checks after editing Rust files
- **cargo check**: Verify compilation after changes (faster than `cargo build`)

---

**ECC Original:** \`ECC/rules/rust/hooks.md\`
**Atualizado em:** 2026-07-02 23:01:54
