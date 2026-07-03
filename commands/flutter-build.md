# ⚡ Comando: flutter-build

> **Adaptado do ECC:** \`ECC/commands/flutter-build.md\`

## Descrição

Fix Dart analyzer errors and Flutter build failures incrementally. Invokes the dart-build-resolver agent for minimal, surgical fixes.

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: Fix Dart analyzer errors and Flutter build failures incrementally. Invokes the dart-build-resolver agent for minimal, surgical fixes.
---

# Flutter Build and Fix

This command invokes the **dart-build-resolver** agent to incrementally fix Dart/Flutter build errors with minimal changes.

## What This Command Does

1. **Run Diagnostics**: Execute `flutter analyze`, `flutter pub get`
2. **Parse Errors**: Group by file and sort by severity
3. **Fix Incrementally**: One error at a time
4. **Verify Each Fix**: Re-run analysis after each change
5. **Report Summary**: Show what was fixed and what remains

## When to Use

Use `/flutter-build` when:
- `flutter analyze` reports errors
- `flutter build` fails for any platform
- `dart pub get` / `flutter pub get` fails with version conflicts
- `build_runner` fails to generate code
- After pulling changes that break the build

## Diagnostic Commands Run

```bash
# Analysis
flutter analyze 2>&1

# Dependencies
flutter pub get 2>&1

# Code generation (if project uses build_runner)
dart run build_runner build --delete-conflicting-outputs 2>&1

# Platform builds
flutter build apk 2>&1
flutter build web 2>&1
```

## Example Session

````text
User: /flutter-build

Agent:
# Flutter Build Resolution

## Initial Diagnostics

```
$ flutter analyze
Analyzing project...

  error • lib/features/user/data/user_repository_impl.dart:34:16 •
    A value of type 'String?' can't be assigned to a variable of type 'String'. •
    invalid_assignment

  error • lib/features/cart/presentation/cart_page.dart:58:5 •
    The method 'add' isn't defined for the type 'List<Item>'.
    Try correcting the name to the name of an existing method, or defining a method named 'add'. •
    undefined_method

2 errors found.
```

## Fix 1: Null Safety

File: lib/features/user/data/user_repository_impl.dart:34
Error: A value of type 'String?' can't be assigned to type 'String'

Changed:
```dart
final id = response.id;
```
To:
```dart
final id = response.id ?? '';

---

**ECC Original:** \`ECC/commands/flutter-build.md\`
**Atualizado em:** 2026-07-02 23:01:57
