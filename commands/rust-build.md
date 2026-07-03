# ⚡ Comando: rust-build

> **Adaptado do ECC:** \`ECC/commands/rust-build.md\`

## Descrição

Fix Rust build errors, borrow checker issues, and dependency problems incrementally. Invokes the rust-build-resolver agent for minimal, surgical fixes.

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: Fix Rust build errors, borrow checker issues, and dependency problems incrementally. Invokes the rust-build-resolver agent for minimal, surgical fixes.
---

# Rust Build and Fix

This command invokes the **rust-build-resolver** agent to incrementally fix Rust build errors with minimal changes.

## What This Command Does

1. **Run Diagnostics**: Execute `cargo check`, `cargo clippy`, `cargo fmt --check`
2. **Parse Errors**: Identify error codes and affected files
3. **Fix Incrementally**: One error at a time
4. **Verify Each Fix**: Re-run `cargo check` after each change
5. **Report Summary**: Show what was fixed and what remains

## When to Use

Use `/rust-build` when:
- `cargo build` or `cargo check` fails with errors
- `cargo clippy` reports warnings
- Borrow checker or lifetime errors block compilation
- Cargo dependency resolution fails
- After pulling changes that break the build

## Diagnostic Commands Run

```bash
# Primary build check
cargo check 2>&1

# Lints and suggestions
cargo clippy -- -D warnings 2>&1

# Formatting check
cargo fmt --check 2>&1

# Dependency issues
cargo tree --duplicates

# Security audit (if available)
if command -v cargo-audit >/dev/null; then cargo audit; else echo "cargo-audit not installed"; fi
```

## Example Session

````text
User: /rust-build

Agent:
# Rust Build Resolution

## Initial Diagnostics

```bash
$ cargo check
error[E0502]: cannot borrow `map` as mutable because it is also borrowed as immutable
  --> src/service/cache.rs:25:5
error[E0308]: mismatched types
  --> src/handler/api.rs:42:12
error[E0425]: cannot find value `db` in this scope
  --> src/handler/api.rs:58:9
```

Errors found: 3

## Fix 1: Borrow Checker Error

File: src/service/cache.rs:25
Error: E0502 — cannot borrow `map` as mutable because also borrowed as immutable
Cause: Immutable borrow still active during mutable insert

```rust
// Changed: restructured to end immutable borrow before mutable access
if !map.contains_key("key") {
    map.insert("key".into(), default);
}
```

```bash

---

**ECC Original:** \`ECC/commands/rust-build.md\`
**Atualizado em:** 2026-07-02 23:02:00
