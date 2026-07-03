# ⚡ Comando: rust-test

> **Adaptado do ECC:** \`ECC/commands/rust-test.md\`

## Descrição

Enforce TDD workflow for Rust. Write tests first, then implement. Verify 80%+ coverage with cargo-llvm-cov.

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: Enforce TDD workflow for Rust. Write tests first, then implement. Verify 80%+ coverage with cargo-llvm-cov.
---

# Rust TDD Command

This command enforces test-driven development methodology for Rust code using `#[test]`, rstest, proptest, and mockall.

## What This Command Does

1. **Define Types/Traits**: Scaffold function signatures with `todo!()`
2. **Write Tests**: Create comprehensive test module (RED)
3. **Run Tests**: Verify tests fail for the right reason
4. **Implement Code**: Write minimal code to pass (GREEN)
5. **Refactor**: Improve while keeping tests green
6. **Check Coverage**: Ensure 80%+ coverage with cargo-llvm-cov

## When to Use

Use `/rust-test` when:
- Implementing new Rust functions, methods, or traits
- Adding test coverage to existing Rust code
- Fixing bugs (write failing test first)
- Building critical business logic
- Learning TDD workflow in Rust

## TDD Cycle

```
RED     -> Write failing test first
GREEN   -> Implement minimal code to pass
REFACTOR -> Improve code, tests stay green
REPEAT  -> Next test case
```

## Example Session

````text
User: /rust-test I need a function to validate user registration

Agent:
# TDD Session: Registration Validator

## Step 1: Define Interface

```rust
// src/validator.rs
pub struct RegistrationRequest {
    pub name: String,
    pub email: String,
    pub password: String,
}

pub enum ValidationResult {
    Valid,
    Invalid(Vec<String>),
}

pub fn validate_registration(request: &RegistrationRequest) -> ValidationResult {
    todo!()
}
```

## Step 2: Write Tests (RED)

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn valid_registration_returns_valid() {
        let request = RegistrationRequest {
            name: "Alice".into(),
            email: "alice@example.com".into(),
            password: "SecureP@ss1".into(),
        };
        assert!(matches!(validate_registration(&request), ValidationResult::Valid));
    }

---

**ECC Original:** \`ECC/commands/rust-test.md\`
**Atualizado em:** 2026-07-02 23:02:00
