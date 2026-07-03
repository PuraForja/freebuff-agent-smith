# 🧠 Skill: kotlin-testing

> **Adaptada do ECC:** `kotlin-testing` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/kotlin-testing/SKILL.md`

## Descrição

Kotlin testing patterns with Kotest, MockK, coroutine testing, property-based testing, and Kover coverage. Follows TDD methodology with idiomatic Kotlin practices.

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

# Kotlin Testing Patterns

Comprehensive Kotlin testing patterns for writing reliable, maintainable tests following TDD methodology with Kotest and MockK.

## When to Use

- Writing new Kotlin functions or classes
- Adding test coverage to existing Kotlin code
- Implementing property-based tests
- Following TDD workflow in Kotlin projects
- Configuring Kover for code coverage

## How It Works

1. **Identify target code** — Find the function, class, or module to test
2. **Write a Kotest spec** — Choose a spec style (StringSpec, FunSpec, BehaviorSpec) matching the test scope
3. **Mock dependencies** — Use MockK to isolate the unit under test
4. **Run tests (RED)** — Verify the test fails with the expected error
5. **Implement code (GREEN)** — Write minimal code to pass the test
6. **Refactor** — Improve the implementation while keeping tests green
7. **Check coverage** — Run `./gradlew koverHtmlReport` and verify 80%+ coverage

## Examples

The following sections contain detailed, runnable examples for each testing pattern:

### Quick Reference

- **Kotest specs** — StringSpec, FunSpec, BehaviorSpec, DescribeSpec examples in [Kotest Spec Styles](#kotest-spec-styles)
- **Mocking** — MockK setup, coroutine mocking, argument capture in [MockK](#mockk)
- **TDD walkthrough** — Full RED/GREEN/REFACTOR cycle with EmailValidator in [TDD Workflow for Kotlin](#tdd-workflow-for-kotlin)
- **Coverage** — Kover configuration and commands in [Kover Coverage](#kover-coverage)
- **Ktor testing** — testApplication setup in [Ktor testApplication Testing](#ktor-testapplication-testing)

### TDD Workflow for Kotlin

#### The RED-GREEN-REFACTOR Cycle

```
RED     -> Write a failing test first
GREEN   -> Write minimal code to pass the test
REFACTOR -> Improve code while keeping tests green
REPEAT  -> Continue with next requirement
```

#### Step-by-Step TDD in Kotlin

```kotlin
// Step 1: Define the interface/signature
// EmailValidator.kt
package com.example.validator

fun validateEmail(email: String): Result<String> {
    TODO("not implemented")
}

// Step 2: Write failing test (RED)
// EmailValidatorTest.kt
package com.example.validator

import io.kotest.core.spec.style.StringSpec
import io.kotest.matchers.result.shouldBeFailure
import io.kotest.matchers.result.shouldBeSuccess

class EmailValidatorTest : StringSpec({
    "valid email returns success" {
        validateEmail("user@example.com").shouldBeSuccess("user@example.com")
    }

    "empty email returns failure" {
        validateEmail("").shouldBeFailure()
    }

    "email without @ returns failure" {
        validateEmail("userexample.com").shouldBeFailure()
    }
})

// Step 3: Run tests - verify FAIL
// $ ./gradlew test
// EmailValidatorTest > valid email returns success FAILED
//   kotlin.NotImplementedError: An operation is not implemented

// Step 4: Implement minimal code (GREEN)
fun validateEmail(email: String): Result<String> {
    if (email.isBlank()) return Result.failure(IllegalArgumentException("

---

**ECC Original:** `ECC/skills/kotlin-testing/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:26
