# 📏 Regra: cpp — hooks

> **Adaptada do ECC:** \`rules/cpp/hooks.md\`
> **Fonte original:** \`ECC/rules/cpp/hooks.md\`

## Descrição

Regra ECC para cpp: hooks

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
# C++ Hooks

> This file extends [common/hooks.md](../common/hooks.md) with C++ specific content.

## Build Hooks

Run these checks before committing C++ changes:

```bash
# Format check
clang-format --dry-run --Werror src/*.cpp src/*.hpp

# Static analysis
clang-tidy src/*.cpp -- -std=c++17

# Build
cmake --build build

# Tests
ctest --test-dir build --output-on-failure
```

## Recommended CI Pipeline

1. **clang-format** — formatting check
2. **clang-tidy** — static analysis
3. **cppcheck** — additional analysis
4. **cmake build** — compilation
5. **ctest** — test execution with sanitizers

---

**ECC Original:** \`ECC/rules/cpp/hooks.md\`
**Atualizado em:** 2026-07-02 23:01:50
