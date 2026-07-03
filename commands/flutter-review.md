# ⚡ Comando: flutter-review

> **Adaptado do ECC:** \`ECC/commands/flutter-review.md\`

## Descrição

Review Flutter/Dart code for idiomatic patterns, widget best practices, state management, performance, accessibility, and security. Invokes the flutter-reviewer agent.

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: Review Flutter/Dart code for idiomatic patterns, widget best practices, state management, performance, accessibility, and security. Invokes the flutter-reviewer agent.
---

# Flutter Code Review

This command invokes the **flutter-reviewer** agent to review Flutter/Dart code changes.

## What This Command Does

1. **Gather Context**: Review `git diff --staged` and `git diff`
2. **Inspect Project**: Check `pubspec.yaml`, `analysis_options.yaml`, state management solution
3. **Security Pre-scan**: Check for hardcoded secrets and critical security issues
4. **Full Review**: Apply the complete review checklist
5. **Report Findings**: Output issues grouped by severity with fix guidance

## Prerequisites

Before running `/flutter-review`, ensure:
1. **Build passes** — run `/flutter-build` first; a review on broken code is incomplete
2. **Tests pass** — run `/flutter-test` to confirm no regressions
3. **No merge conflicts** — resolve all conflicts so the diff reflects only intentional changes
4. **`flutter analyze` is clean** — fix analyzer warnings before review

## When to Use

Use `/flutter-review` when:
- Before submitting a PR with Flutter/Dart changes (after build and tests pass)
- After implementing a new feature to catch issues early
- When reviewing someone else's Flutter code
- To audit a widget, state management component, or service class
- Before a production release

## Review Areas

| Area | Severity |
|------|----------|
| Hardcoded secrets, cleartext HTTP | CRITICAL |
| Architecture violations, state management anti-patterns | CRITICAL |
| Widget rebuild issues, resource leaks | HIGH |
| Missing `dispose()`, `BuildContext` after await | HIGH |
| Dart null safety, missing error/loading states | HIGH |
| Const propagation, widget composition | HIGH |
| Performance: expensive work in `build()` | HIGH |
| Accessibility, semantic labels | MEDIUM |
| Missing tests for state transitions | HIGH |
| Hardcoded strings (l10n) | MEDIUM |
| Pub dependency hygiene | LOW |

## Example Session

````text
User: /flutter-review

Agent:
# Flutter Code Review

## Context

Changed files:
- lib/features/auth/presentation/login_page.dart
- lib/features/auth/data/auth_repository_impl.dart

State management: Riverpod (detected from pubspec.yaml)
Architecture: feature-first

## Security Pre-scan

✓ No hardcoded secrets detected
✓ No cleartext HTTP calls

## Review Findings

[HIGH] BuildContext used after async gap without mounted check
File: lib/features/auth/presentation/login_page.dart:67
Issue: `context.go('/home')` called after `await auth.login(...)` with no `mounted` check.
Fix: Add `if (!context.mounted) return;` before any navigation after awaits (Flutter 3.7+).

[HIGH] AsyncValue error state not handled
File: lib/features/auth/presentation/login_page.dart:42

---

**ECC Original:** \`ECC/commands/flutter-review.md\`
**Atualizado em:** 2026-07-02 23:01:57
