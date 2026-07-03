# 🧠 Skill: dart-flutter-patterns

> **Adaptada do ECC:** `dart-flutter-patterns` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/dart-flutter-patterns/SKILL.md`

## Descrição

Production-ready Dart and Flutter patterns covering null safety, immutable state, async composition, widget architecture, popular state management frameworks (BLoC, Riverpod, Provider), GoRouter navigation, Dio networking, Freezed code generation, and clean architecture.

---

## ⚠️ Adaptação para Codebuff

> ⚠️ Esta skill original usava hooks do Claude Code. Adaptada para Codebuff.

| Conceito ECC (Claude) | Equivalente Codebuff |
|-----------------------|---------------------|
| Hooks | Instruções no `.codebuff/instructions.md` |
| Comandos slash | Skills via `skill` tool |
| `settings.json` | `.codebuff/instructions.md` |
| Rules em `~/.claude/rules/` | Skills em `.agents/skills/` |

---

## Conteúdo Adaptado

# Dart/Flutter Patterns

## When to Use

Use this skill when:
- Starting a new Flutter feature and need idiomatic patterns for state management, navigation, or data access
- Reviewing or writing Dart code and need guidance on null safety, sealed types, or async composition
- Setting up a new Flutter project and choosing between BLoC, Riverpod, or Provider
- Implementing secure HTTP clients, WebView integration, or local storage
- Writing tests for Flutter widgets, Cubits, or Riverpod providers
- Wiring up GoRouter with authentication guards

## How It Works

This skill provides copy-paste-ready Dart/Flutter code patterns organized by concern:
1. **Null safety** — avoid `!`, prefer `?.`/`??`/pattern matching
2. **Immutable state** — sealed classes, `freezed`, `copyWith`
3. **Async composition** — concurrent `Future.wait`, safe `BuildContext` after `await`
4. **Widget architecture** — extract to classes (not methods), `const` propagation, scoped rebuilds
5. **State management** — BLoC/Cubit events, Riverpod notifiers and derived providers
6. **Navigation** — GoRouter with reactive auth guards via `refreshListenable`
7. **Networking** — Dio with interceptors, token refresh with one-time retry guard
8. **Error handling** — global capture, `ErrorWidget.builder`, crashlytics wiring
9. **Testing** — unit (BLoC test), widget (ProviderScope overrides), fakes over mocks

## Examples

```dart
// Sealed state — prevents impossible states
sealed class AsyncState<T> {}
final class Loading<T> extends AsyncState<T> {}
final class Success<T> extends AsyncState<T> { final T data; const Success(this.data); }
final class Failure<T> extends AsyncState<T> { final Object error; const Failure(this.error); }

// GoRouter with reactive auth redirect
final router = GoRouter(
  refreshListenable: GoRouterRefreshStream(authCubit.stream),
  redirect: (context, state) {
    final authed = context.read<AuthCubit>().state is AuthAuthenticated;
    if (!authed && !state.matchedLocation.startsWith('/login')) return '/login';
    return null;
  },
  routes: [...],
);

// Riverpod derived provider with safe firstWhereOrNull
@riverpod
double cartTotal(Ref ref) {
  final cart = ref.watch(cartNotifierProvider);
  final products = ref.watch(productsProvider).valueOrNull ?? [];
  return cart.fold(0.0, (total, item) {
    final product = products.firstWhereOrNull((p) => p.id == item.productId);
    return total + (product?.price ?? 0) * item.quantity;
  });
}
```

---

Practical, production-ready patterns for Dart and Flutter applications. Library-agnostic where possible, with explicit coverage of the most common ecosystem packages.

---

## 1. Null Safety Fundamentals

### Prefer Patterns Over Bang Operator

```dart
// BAD — crashes at runtime if null
final name = user!.name;

// GOOD — provide fallback
final name = user?.name ?? 'Unknown';

// GOOD — Dart 3 pattern matching (preferred for complex cases)
final display = switch (user) {
  User(:final name, :final email) => '$name <$email>

---

**ECC Original:** `ECC/skills/dart-flutter-patterns/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:21
