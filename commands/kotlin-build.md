# ⚡ Comando: kotlin-build

> **Adaptado do ECC:** \`ECC/commands/kotlin-build.md\`

## Descrição

Fix Kotlin/Gradle build errors, compiler warnings, and dependency issues incrementally. Invokes the kotlin-build-resolver agent for minimal, surgical fixes.

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: Fix Kotlin/Gradle build errors, compiler warnings, and dependency issues incrementally. Invokes the kotlin-build-resolver agent for minimal, surgical fixes.
---

# Kotlin Build and Fix

This command invokes the **kotlin-build-resolver** agent to incrementally fix Kotlin build errors with minimal changes.

## What This Command Does

1. **Run Diagnostics**: Execute `./gradlew build`, `detekt`, `ktlintCheck`
2. **Parse Errors**: Group by file and sort by severity
3. **Fix Incrementally**: One error at a time
4. **Verify Each Fix**: Re-run build after each change
5. **Report Summary**: Show what was fixed and what remains

## When to Use

Use `/kotlin-build` when:
- `./gradlew build` fails with errors
- Kotlin compiler reports errors
- `./gradlew detekt` reports violations
- Gradle dependency resolution fails
- After pulling changes that break the build

## Diagnostic Commands Run

```bash
# Primary build check
./gradlew build 2>&1

# Static analysis
./gradlew detekt 2>&1 || echo "detekt not configured"
./gradlew ktlintCheck 2>&1 || echo "ktlint not configured"

# Dependency issues
./gradlew dependencies --configuration runtimeClasspath 2>&1 | head -100

# Optional deep refresh when caches or dependency metadata are suspect
./gradlew build --refresh-dependencies
```

## Example Session

````text
User: /kotlin-build

Agent:
# Kotlin Build Resolution

## Initial Diagnostics

```bash
$ ./gradlew build
e: src/main/kotlin/com/example/service/UserService.kt:25:15 Unresolved reference: UserRepository
e: src/main/kotlin/com/example/routes/UserRoutes.kt:42:9 Type mismatch: inferred type is String but Int was expected
e: src/main/kotlin/com/example/routes/UserRoutes.kt:58:5 'when' expression must be exhaustive
```

Errors found: 3

## Fix 1: Unresolved Reference

File: src/main/kotlin/com/example/service/UserService.kt:25
Error: Unresolved reference: UserRepository
Cause: Missing import

```kotlin
// Added import
import com.example.repository.UserRepository
```

```bash
$ ./gradlew build
# 2 errors remaining
```

## Fix 2: Type Mismatch

File: src/main/kotlin/com/example/routes/UserRoutes.kt:42

---

**ECC Original:** \`ECC/commands/kotlin-build.md\`
**Atualizado em:** 2026-07-02 23:01:58
