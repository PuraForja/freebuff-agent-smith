# ⚡ Comando: kotlin-review

> **Adaptado do ECC:** \`ECC/commands/kotlin-review.md\`

## Descrição

Comprehensive Kotlin code review for idiomatic patterns, null safety, coroutine safety, and security. Invokes the kotlin-reviewer agent.

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: Comprehensive Kotlin code review for idiomatic patterns, null safety, coroutine safety, and security. Invokes the kotlin-reviewer agent.
---

# Kotlin Code Review

This command invokes the **kotlin-reviewer** agent for comprehensive Kotlin-specific code review.

## What This Command Does

1. **Identify Kotlin Changes**: Find modified `.kt` and `.kts` files via `git diff`
2. **Run Build & Static Analysis**: Execute `./gradlew build`, `detekt`, `ktlintCheck`
3. **Security Scan**: Check for SQL injection, command injection, hardcoded secrets
4. **Null Safety Review**: Analyze `!!` usage, platform type handling, unsafe casts
5. **Coroutine Review**: Check structured concurrency, dispatcher usage, cancellation
6. **Generate Report**: Categorize issues by severity

## When to Use

Use `/kotlin-review` when:
- After writing or modifying Kotlin code
- Before committing Kotlin changes
- Reviewing pull requests with Kotlin code
- Onboarding to a new Kotlin codebase
- Learning idiomatic Kotlin patterns

## Review Categories

### CRITICAL (Must Fix)
- SQL/Command injection vulnerabilities
- Force-unwrap `!!` without justification
- Platform type null safety violations
- GlobalScope usage (structured concurrency violation)
- Hardcoded credentials
- Unsafe deserialization

### HIGH (Should Fix)
- Mutable state where immutable suffices
- Blocking calls inside coroutine context
- Missing cancellation checks in long loops
- Non-exhaustive `when` on sealed types
- Large functions (>50 lines)
- Deep nesting (>4 levels)

### MEDIUM (Consider)
- Non-idiomatic Kotlin (Java-style patterns)
- Missing trailing commas
- Scope function misuse or nesting
- Missing sequence for large collection chains
- Redundant explicit types

## Automated Checks Run

```bash
# Build check
./gradlew build

# Static analysis
./gradlew detekt

# Formatting check
./gradlew ktlintCheck

# Tests
./gradlew test
```

## Example Usage

````text
User: /kotlin-review

Agent:
# Kotlin Code Review Report

## Files Reviewed
- src/main/kotlin/com/example/service/UserService.kt (modified)
- src/main/kotlin/com/example/routes/UserRoutes.kt (modified)

## Static Analysis Results

---

**ECC Original:** \`ECC/commands/kotlin-review.md\`
**Atualizado em:** 2026-07-02 23:01:58
