# ⚡ Comando: flutter-test

> **Adaptado do ECC:** \`ECC/commands/flutter-test.md\`

## Descrição

Run Flutter/Dart tests, report failures, and incrementally fix test issues. Covers unit, widget, golden, and integration tests.

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: Run Flutter/Dart tests, report failures, and incrementally fix test issues. Covers unit, widget, golden, and integration tests.
---

# Flutter Test

This command runs the Flutter test suite and reports results. When failures occur, it diagnoses and fixes issues incrementally.

## What This Command Does

1. **Run Tests**: Execute `flutter test` (or scope to changed files)
2. **Parse Failures**: Identify failing tests by type and cause
3. **Fix Incrementally**: One failure at a time where possible
4. **Verify**: Re-run after each fix
5. **Report**: Show coverage summary and remaining failures

## When to Use

Use `/flutter-test` when:
- After implementing a feature to verify nothing broke
- After running `/flutter-build` to ensure tests pass
- To check test coverage on new code
- When a specific test file is failing
- Before submitting a PR

## Commands Run

```bash
# Run all tests
flutter test 2>&1

# Run with coverage
flutter test --coverage 2>&1

# Run specific test file
flutter test test/unit/domain/usecases/get_user_test.dart 2>&1

# Run tests matching a name pattern
flutter test --name "CartBloc" 2>&1

# Run integration tests (requires device/emulator)
flutter test integration_test/ 2>&1

# Update golden files when intentional visual changes are made
flutter test --update-goldens 2>&1
```

## Example Session

````text
User: /flutter-test

Agent:
# Flutter Test Run

## Test Execution

```
$ flutter test
00:05 +42 -2: Some tests failed.

FAILED: test/unit/data/user_repository_test.dart
  UserRepository getById
    returns null when user not found
    Expected: null
    Actual: User(id: 'test-id', name: 'Test User')

FAILED: test/widget/cart_page_test.dart
  CartPage
    shows empty state when cart is empty
    Expected: exactly one widget with text 'Your cart is empty'
    Found: no widget with text 'Your cart is empty'
```

## Fix 1: Repository Test

File: test/unit/data/user_repository_test.dart
Failure: `getById` returns a user when it should return null for missing ID

Root cause: Test setup adds a user with ID 'test-id' but queries with 'missing-id'.

---

**ECC Original:** \`ECC/commands/flutter-test.md\`
**Atualizado em:** 2026-07-02 23:01:57
