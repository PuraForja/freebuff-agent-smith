# 🧠 Skill: rust-testing

> **Adaptada do ECC:** `rust-testing` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/rust-testing/SKILL.md`

## Descrição

Rust testing patterns including unit tests, integration tests, async testing, property-based testing, mocking, and coverage. Follows TDD methodology.

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

# Rust Testing Patterns

Comprehensive Rust testing patterns for writing reliable, maintainable tests following TDD methodology.

## When to Use

- Writing new Rust functions, methods, or traits
- Adding test coverage to existing code
- Creating benchmarks for performance-critical code
- Implementing property-based tests for input validation
- Following TDD workflow in Rust projects

## How It Works

1. **Identify target code** — Find the function, trait, or module to test
2. **Write a test** — Use `#[test]` in a `#[cfg(test)]` module, rstest for parameterized tests, or proptest for property-based tests
3. **Mock dependencies** — Use mockall to isolate the unit under test
4. **Run tests (RED)** — Verify the test fails with the expected error
5. **Implement (GREEN)** — Write minimal code to pass
6. **Refactor** — Improve while keeping tests green
7. **Check coverage** — Use cargo-llvm-cov, target 80%+

## TDD Workflow for Rust

### The RED-GREEN-REFACTOR Cycle

```
RED     → Write a failing test first
GREEN   → Write minimal code to pass the test
REFACTOR → Improve code while keeping tests green
REPEAT  → Continue with next requirement
```

### Step-by-Step TDD in Rust

```rust
// RED: Write test first, use todo!() as placeholder
pub fn add(a: i32, b: i32) -> i32 { todo!() }

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn test_add() { assert_eq!(add(2, 3), 5); }
}
// cargo test → panics at 'not yet implemented'
```

```rust
// GREEN: Replace todo!() with minimal implementation
pub fn add(a: i32, b: i32) -> i32 { a + b }
// cargo test → PASS, then REFACTOR while keeping tests green
```

## Unit Tests

### Module-Level Test Organization

```rust
// src/user.rs
pub struct User {
    pub name: String,
    pub email: String,
}

impl User {
    pub fn new(name: impl Into<String>, email: impl Into<String>) -> Result<Self, String> {
        let email = email.into();
        if !email.contains('@') {
            return Err(format!("invalid email: {email}"));
        }
        Ok(Self { name: name.into(), email })
    }

    pub fn display_name(&self) -> &str {
        &self.name
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn creates_user_with_valid_email() {
        let user = User::new("Alice", "alice@example.com").unwrap();
        assert_eq!(user.display_name(), "Alice");
        assert_eq!(user.email, "alice@example.com");
    }

    #[test]
    fn rejects_invalid_email() {
        let result = User::new("Bob", "not-an-email");
        assert!(result.is_err());
        assert!(result.unwrap_err().contains("invalid email"));
    }
}
```

### Assertion Macros

```rust
assert_eq!(2 + 2, 4);                                    // Equality
assert_ne!(2 + 2, 5);                                    // Inequality
assert!(vec![1, 2, 3].contains(&2));                     // Boolean
assert_eq!(value, 42, "expected 42 but got {value}");    // Custom message
assert!((0.1_f64 + 0.2 - 0.3).abs() < f64::EPSILON);   // Float compar

---

**ECC Original:** `ECC/skills/rust-testing/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:32
