# 📏 Regra: cpp — testing

> **Adaptada do ECC:** \`rules/cpp/testing.md\`
> **Fonte original:** \`ECC/rules/cpp/testing.md\`

## Descrição

Regra ECC para cpp: testing

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
# C++ Testing

> This file extends [common/testing.md](../common/testing.md) with C++ specific content.

## Framework

Use **GoogleTest** (gtest/gmock) with **CMake/CTest**.

## Running Tests

```bash
cmake --build build && ctest --test-dir build --output-on-failure
```

## Coverage

```bash
cmake -DCMAKE_CXX_FLAGS="--coverage" -DCMAKE_EXE_LINKER_FLAGS="--coverage" ..
cmake --build .
ctest --output-on-failure
lcov --capture --directory . --output-file coverage.info
```

## Sanitizers

Always run tests with sanitizers in CI:

```bash
cmake -DCMAKE_CXX_FLAGS="-fsanitize=address,undefined" ..
```

## Reference

See skill: `cpp-testing` for detailed C++ testing patterns, TDD workflow, and GoogleTest/GMock usage.

---

**ECC Original:** \`ECC/rules/cpp/testing.md\`
**Atualizado em:** 2026-07-02 23:01:50
