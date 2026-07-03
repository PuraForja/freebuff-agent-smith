# ⚡ Comando: kotlin-test

> **Adaptado do ECC:** \`ECC/commands/kotlin-test.md\`

## Descrição

Enforce TDD workflow for Kotlin. Write Kotest tests first, then implement. Verify 80%+ coverage with Kover.

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: Enforce TDD workflow for Kotlin. Write Kotest tests first, then implement. Verify 80%+ coverage with Kover.
---

# Kotlin TDD Command

This command enforces test-driven development methodology for Kotlin code using Kotest, MockK, and Kover.

## What This Command Does

1. **Define Types/Interfaces**: Scaffold function signatures first
2. **Write Kotest Tests**: Create comprehensive test specs (RED)
3. **Run Tests**: Verify tests fail for the right reason
4. **Implement Code**: Write minimal code to pass (GREEN)
5. **Refactor**: Improve while keeping tests green
6. **Check Coverage**: Ensure 80%+ coverage with Kover

## When to Use

Use `/kotlin-test` when:
- Implementing new Kotlin functions or classes
- Adding test coverage to existing Kotlin code
- Fixing bugs (write failing test first)
- Building critical business logic
- Learning TDD workflow in Kotlin

## TDD Cycle

```
RED     -> Write failing Kotest test
GREEN   -> Implement minimal code to pass
REFACTOR -> Improve code, tests stay green
REPEAT  -> Next test case
```

## Example Session

````text
User: /kotlin-test I need a function to validate user registration requests

Agent:
# TDD Session: Registration Validator

## Step 1: Define Interface

```kotlin
// validator/RegistrationValidator.kt
package com.example.validator

data class RegistrationRequest(
    val name: String,
    val email: String,
    val password: String,
)

sealed class ValidationResult {
    data object Valid : ValidationResult()
    data class Invalid(val errors: List<String>) : ValidationResult()
}

fun validateRegistration(request: RegistrationRequest): ValidationResult {
    TODO("not implemented")
}
```

## Step 2: Write Kotest Tests (RED)

```kotlin
// validator/RegistrationValidatorTest.kt
package com.example.validator

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.types.shouldBeInstanceOf

class RegistrationValidatorTest : FunSpec({
    test("valid registration returns Valid") {
        val request = RegistrationRequest(
            name = "Alice",
            email = "alice@example.com",

---

**ECC Original:** \`ECC/commands/kotlin-test.md\`
**Atualizado em:** 2026-07-02 23:01:58
