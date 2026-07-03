# 📏 Regra: cpp — security

> **Adaptada do ECC:** \`rules/cpp/security.md\`
> **Fonte original:** \`ECC/rules/cpp/security.md\`

## Descrição

Regra ECC para cpp: security

---

## Conteúdo Adaptado

---
paths:
  - "**/*.cpp"
  - "**/*.hpp"
  - "**/*.cc"
  - "**/*.hh"
  - "**/*.cxx"
  - "**/*.h"
  - "**/CMakeLists.txt"
---
# C++ Security

> This file extends [common/security.md](../common/security.md) with C++ specific content.

## Memory Safety

- Never use raw `new`/`delete` — use smart pointers
- Never use C-style arrays — use `std::array` or `std::vector`
- Never use `malloc`/`free` — use C++ allocation
- Avoid `reinterpret_cast` unless absolutely necessary

## Buffer Overflows

- Use `std::string` over `char*`
- Use `.at()` for bounds-checked access when safety matters
- Never use `strcpy`, `strcat`, `sprintf` — use `std::string` or `fmt::format`

## Undefined Behavior

- Always initialize variables
- Avoid signed integer overflow
- Never dereference null or dangling pointers
- Use sanitizers in CI:
  ```bash
  cmake -DCMAKE_CXX_FLAGS="-fsanitize=address,undefined" ..
  ```

## Static Analysis

- Use **clang-tidy** for automated checks:
  ```bash
  clang-tidy --checks='*' src/*.cpp
  ```
- Use **cppcheck** for additional analysis:
  ```bash
  cppcheck --enable=all src/
  ```

## Reference

See skill: `cpp-coding-standards` for detailed security guidelines.

---

**ECC Original:** \`ECC/rules/cpp/security.md\`
**Atualizado em:** 2026-07-02 23:01:50
