# 📏 Regra: dart — coding-style

> **Adaptada do ECC:** \`rules/dart/coding-style.md\`
> **Fonte original:** \`ECC/rules/dart/coding-style.md\`

## Descrição

Regra ECC para dart: coding-style

---

## Conteúdo Adaptado

---
paths:
  - "**/*.dart"
  - "**/pubspec.yaml"
  - "**/analysis_options.yaml"
---
# Dart/Flutter Coding Style

> This file extends [common/coding-style.md](../common/coding-style.md) with Dart and Flutter-specific content.

## Formatting

- **dart format** for all `.dart` files — enforced in CI (`dart format --set-exit-if-changed .`)
- Line length: 80 characters (dart format default)
- Trailing commas on multi-line argument/parameter lists to improve diffs and formatting

## Immutability

- Prefer `final` for local variables and `const` for compile-time constants
- Use `const` constructors wherever all fields are `final`
- Return unmodifiable collections from public APIs (`List.unmodifiable`, `Map.unmodifiable`)
- Use `copyWith()` for state mutations in immutable state classes

```dart
// BAD
var count = 0;
List<String> items = ['a', 'b'];

// GOOD
final count = 0;
const items = ['a', 'b'];
```

## Naming

Follow Dart conventions:
- `camelCase` for variables, parameters, and named constructors
- `PascalCase` for classes, enums, typedefs, and extensions
- `snake_case` for file names and library names
- `SCREAMING_SNAKE_CASE` for constants declared with `const` at top level
- Prefix private members with `_`
- Extension names describe the type they extend: `StringExtensions`, not `MyHelpers`

## Null Safety

- Avoid `!` (bang operator) — prefer `?.`, `??`, `if (x != null)`, or Dart 3 pattern matching; reserve `!` only where a null value is a programming error and crashing is the right behaviour
- Avoid `late` unless initialization is guaranteed before first use (prefer nullable or constructor init)
- Use `required` for constructor parameters that must always be provided

```dart
// BAD — crashes at runtime if user is null
final name = user!.name;

// GOOD — null-aware operators
final name = user?.name ?? 'Unknown';

// GOOD — Dart 3 pattern matching (exhaustive, compiler-checked)
final name = switch (user) {
  User(:final name) => name,
  null => 'Unknown',
};

// GOOD — early-return null guard
String getUserName(User? user) {
  if (user == null) return 'Unknown';
  return user.name; // promoted to non-null after the guard
}
```

## Sealed Types and Pattern Matching (Dart 3+)

Use sealed classes to model closed state hierarchies:

```dart
sealed class AsyncState<T> {
  const AsyncState();
}

final class Loading<T> extends AsyncState<T> {
  const Loading();
}

final class Success<T> extends AsyncState<T> {
  const Success(this.data);
  final T data;
}

final class Failure<T> extends AsyncState<T> {
  const Failure(this.error);
  final Object error;
}
```

Always use exhaustive `switch` with sealed types — no default/wildcard:

```dart
// BAD
if (state is Loading) { ... }

// GOOD

---

**ECC Original:** \`ECC/rules/dart/coding-style.md\`
**Atualizado em:** 2026-07-02 23:01:51
