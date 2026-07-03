# 🧠 Skill: cpp-coding-standards

> **Adaptada do ECC:** `cpp-coding-standards` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/cpp-coding-standards/SKILL.md`

## Descrição

C++ coding standards based on the C++ Core Guidelines (isocpp.github.io). Use when writing, reviewing, or refactoring C++ code to enforce modern, safe, and idiomatic practices.

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

# C++ Coding Standards (C++ Core Guidelines)

Comprehensive coding standards for modern C++ (C++17/20/23) derived from the [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines). Enforces type safety, resource safety, immutability, and clarity.

## When to Use

- Writing new C++ code (classes, functions, templates)
- Reviewing or refactoring existing C++ code
- Making architectural decisions in C++ projects
- Enforcing consistent style across a C++ codebase
- Choosing between language features (e.g., `enum` vs `enum class`, raw pointer vs smart pointer)

### When NOT to Use

- Non-C++ projects
- Legacy C codebases that cannot adopt modern C++ features
- Embedded/bare-metal contexts where specific guidelines conflict with hardware constraints (adapt selectively)

## Cross-Cutting Principles

These themes recur across the entire guidelines and form the foundation:

1. **RAII everywhere** (P.8, R.1, E.6, CP.20): Bind resource lifetime to object lifetime
2. **Immutability by default** (P.10, Con.1-5, ES.25): Start with `const`/`constexpr`; mutability is the exception
3. **Type safety** (P.4, I.4, ES.46-49, Enum.3): Use the type system to prevent errors at compile time
4. **Express intent** (P.3, F.1, NL.1-2, T.10): Names, types, and concepts should communicate purpose
5. **Minimize complexity** (F.2-3, ES.5, Per.4-5): Simple code is correct code
6. **Value semantics over pointer semantics** (C.10, R.3-5, F.20, CP.31): Prefer returning by value and scoped objects

## Philosophy & Interfaces (P.*, I.*)

### Key Rules

| Rule | Summary |
|------|---------|
| **P.1** | Express ideas directly in code |
| **P.3** | Express intent |
| **P.4** | Ideally, a program should be statically type safe |
| **P.5** | Prefer compile-time checking to run-time checking |
| **P.8** | Don't leak any resources |
| **P.10** | Prefer immutable data to mutable data |
| **I.1** | Make interfaces explicit |
| **I.2** | Avoid non-const global variables |
| **I.4** | Make interfaces precisely and strongly typed |
| **I.11** | Never transfer ownership by a raw pointer or reference |
| **I.23** | Keep the number of function arguments low |

### DO

```cpp
// P.10 + I.4: Immutable, strongly typed interface
struct Temperature {
    double kelvin;
};

Temperature boil(const Temperature& water);
```

### DON'T

```cpp
// Weak interface: unclear ownership, unclear units
double boil(double* temp);

// Non-const global variable
int g_counter = 0;  // I.2 violation
```

## Functions (F.*)

### Key Rules

| Rule | Summary |
|------|---------|
| **F.1** | Package meaningful operations as carefully named functions |
| **F.2** | A function should perform a single logical operation |
| **F.3** | Keep functions short and simple |
| **F.4** | If a function might be evaluated at compile time, declare it `constexpr` |
| **F.6** | If your function must not throw, declare it `noexcept` |
| **F.8** | Prefer pure functions |
| **F.16** | For "in" parameters, pass cheaply-co

---

**ECC Original:** `ECC/skills/cpp-coding-standards/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:21
