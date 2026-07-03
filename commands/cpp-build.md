# ⚡ Comando: cpp-build

> **Adaptado do ECC:** \`ECC/commands/cpp-build.md\`

## Descrição

Fix C++ build errors, CMake issues, and linker problems incrementally. Invokes the cpp-build-resolver agent for minimal, surgical fixes.

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: Fix C++ build errors, CMake issues, and linker problems incrementally. Invokes the cpp-build-resolver agent for minimal, surgical fixes.
---

# C++ Build and Fix

This command invokes the **cpp-build-resolver** agent to incrementally fix C++ build errors with minimal changes.

## What This Command Does

1. **Run Diagnostics**: Execute `cmake --build`, `clang-tidy`, `cppcheck`
2. **Parse Errors**: Group by file and sort by severity
3. **Fix Incrementally**: One error at a time
4. **Verify Each Fix**: Re-run build after each change
5. **Report Summary**: Show what was fixed and what remains

## When to Use

Use `/cpp-build` when:
- `cmake --build build` fails with errors
- Linker errors (undefined references, multiple definitions)
- Template instantiation failures
- Include/dependency issues
- After pulling changes that break the build

## Diagnostic Commands Run

```bash
# CMake configure
cmake -B build -S .

# Build
cmake --build build 2>&1 | head -100

# Static analysis (if available)
clang-tidy src/*.cpp -- -std=c++17
cppcheck --enable=all src/
```

## Example Session

```text
User: /cpp-build

Agent:
# C++ Build Resolution

## Initial Diagnostics

```bash
$ cmake --build build
src/service/user.cpp:25:15: error: use of undeclared identifier 'UserRepository'
src/handler/api.cpp:42:9: error: no matching function for call to 'process'
src/handler/api.cpp:58:1: error: non-void function does not return a value
```

Errors found: 3

## Fix 1: Undeclared Identifier

File: src/service/user.cpp:25
Error: use of undeclared identifier 'UserRepository'
Cause: Missing include

```cpp
// Added include
#include "repository/user_repository.hpp"
```

```bash
$ cmake --build build
# 2 errors remaining
```

## Fix 2: No Matching Function

File: src/handler/api.cpp:42
Error: no matching function for call to 'process'

```cpp

---

**ECC Original:** \`ECC/commands/cpp-build.md\`
**Atualizado em:** 2026-07-02 23:01:56
