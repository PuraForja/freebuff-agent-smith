# 🧠 Skill: rust-patterns

> **Adaptada do ECC:** `rust-patterns` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/rust-patterns/SKILL.md`

## Descrição

Idiomatic Rust patterns, ownership, error handling, traits, concurrency, and best practices for building safe, performant applications.

---

## ⚠️ Adaptação para Codebuff



| Conceito ECC (Claude) | Equivalente Codebuff |
|-----------------------|---------------------|
| Hooks | Instruções no `.codebuff/instructions.md` |
| Comandos slash | Skills via `skill` tool |
| `settings.json` | `.codebuff/instructions.md` |
| Rules em `~/.claude/rules/` | Skills em `.agents/skills/` |

---

## Conteúdo Adaptado

# Rust Development Patterns

Idiomatic Rust patterns and best practices for building safe, performant, and maintainable applications.

## When to Use

- Writing new Rust code
- Reviewing Rust code
- Refactoring existing Rust code
- Designing crate structure and module layout

## How It Works

This skill enforces idiomatic Rust conventions across six key areas: ownership and borrowing to prevent data races at compile time, `Result`/`?` error propagation with `thiserror` for libraries and `anyhow` for applications, enums and exhaustive pattern matching to make illegal states unrepresentable, traits and generics for zero-cost abstraction, safe concurrency via `Arc<Mutex<T>>`, channels, and async/await, and minimal `pub` surfaces organized by domain.

## Core Principles

### 1. Ownership and Borrowing

Rust's ownership system prevents data races and memory bugs at compile time.

```rust
// Good: Pass references when you don't need ownership
fn process(data: &[u8]) -> usize {
    data.len()
}

// Good: Take ownership only when you need to store or consume
fn store(data: Vec<u8>) -> Record {
    Record { payload: data }
}

// Bad: Cloning unnecessarily to avoid borrow checker
fn process_bad(data: &Vec<u8>) -> usize {
    let cloned = data.clone(); // Wasteful — just borrow
    cloned.len()
}
```

### Use `Cow` for Flexible Ownership

```rust
use std::borrow::Cow;

fn normalize(input: &str) -> Cow<'_, str> {
    if input.contains(' ') {
        Cow::Owned(input.replace(' ', "_"))
    } else {
        Cow::Borrowed(input) // Zero-cost when no mutation needed
    }
}
```

## Error Handling

### Use `Result` and `?` — Never `unwrap()` in Production

```rust
// Good: Propagate errors with context
use anyhow::{Context, Result};

fn load_config(path: &str) -> Result<Config> {
    let content = std::fs::read_to_string(path)
        .with_context(|| format!("failed to read config from {path}"))?;
    let config: Config = toml::from_str(&content)
        .with_context(|| format!("failed to parse config from {path}"))?;
    Ok(config)
}

// Bad: Panics on error
fn load_config_bad(path: &str) -> Config {
    let content = std::fs::read_to_string(path).unwrap(); // Panics!
    toml::from_str(&content).unwrap()
}
```

### Library Errors with `thiserror`, Application Errors with `anyhow`

```rust
// Library code: structured, typed errors
use thiserror::Error;

#[derive(Debug, Error)]
pub enum StorageError {
    #[error("record not found: {id}")]
    NotFound { id: String },
    #[error("connection failed")]
    Connection(#[from] std::io::Error),
    #[error("invalid data: {0}")]
    InvalidData(String),
}

// Application code: flexible error handling
use anyhow::{bail, Result};

fn run() -> Result<()> {
    let config = load_config("app.toml")?;
    if config.workers == 0 {
        bail!("worker count must be > 0");
    }
    Ok(())
}
```

### `Option` Combinators Over Nested Matching

```rust
// Good: Combinator chain
fn find_user_email(users: &[User], id: u64) -> 

---

**ECC Original:** `ECC/skills/rust-patterns/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:32
