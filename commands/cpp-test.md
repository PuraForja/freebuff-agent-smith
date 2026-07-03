# ⚡ Comando: cpp-test

> **Adaptado do ECC:** \`ECC/commands/cpp-test.md\`

## Descrição

Enforce TDD workflow for C++. Write GoogleTest tests first, then implement. Verify coverage with gcov/lcov.

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: Enforce TDD workflow for C++. Write GoogleTest tests first, then implement. Verify coverage with gcov/lcov.
---

# C++ TDD Command

This command enforces test-driven development methodology for C++ code using GoogleTest/GoogleMock with CMake/CTest.

## What This Command Does

1. **Define Interfaces**: Scaffold class/function signatures first
2. **Write Tests**: Create comprehensive GoogleTest test cases (RED)
3. **Run Tests**: Verify tests fail for the right reason
4. **Implement Code**: Write minimal code to pass (GREEN)
5. **Refactor**: Improve while keeping tests green
6. **Check Coverage**: Ensure 80%+ coverage

## When to Use

Use `/cpp-test` when:
- Implementing new C++ functions or classes
- Adding test coverage to existing code
- Fixing bugs (write failing test first)
- Building critical business logic
- Learning TDD workflow in C++

## TDD Cycle

```
RED     → Write failing GoogleTest test
GREEN   → Implement minimal code to pass
REFACTOR → Improve code, tests stay green
REPEAT  → Next test case
```

## Example Session

````
User: /cpp-test I need a function to validate email addresses

Agent:
# TDD Session: Email Validator

## Step 1: Define Interface

```cpp
// validator/email.hpp
#pragma once
#include <string>
#include <expected>

enum class EmailError {
    Empty,
    InvalidFormat
};

std::expected<void, EmailError> validate_email(const std::string& email);
```

## Step 2: Write Tests (RED)

```cpp
// validator/email_test.cpp
#include <gtest/gtest.h>
#include "email.hpp"

TEST(ValidateEmail, AcceptsSimpleEmail) {
    auto result = validate_email("user@example.com");
    EXPECT_TRUE(result.has_value());
}

TEST(ValidateEmail, AcceptsSubdomain) {
    EXPECT_TRUE(validate_email("user@mail.example.com").has_value());
}

TEST(ValidateEmail, AcceptsPlus) {
    EXPECT_TRUE(validate_email("user+tag@example.com").has_value());
}

TEST(ValidateEmail, RejectsEmpty) {

---

**ECC Original:** \`ECC/commands/cpp-test.md\`
**Atualizado em:** 2026-07-02 23:01:56
