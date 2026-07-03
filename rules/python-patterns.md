# 📏 Regra: python — patterns

> **Adaptada do ECC:** \`rules/python/patterns.md\`
> **Fonte original:** \`ECC/rules/python/patterns.md\`

## Descrição

Regra ECC para python: patterns

---

## Conteúdo Adaptado

---
paths:
  - "**/*.py"
  - "**/*.pyi"
---
# Python Patterns

> This file extends [common/patterns.md](../common/patterns.md) with Python specific content.

## Protocol (Duck Typing)

```python
from typing import Protocol

class Repository(Protocol):
    def find_by_id(self, id: str) -> dict | None: ...
    def save(self, entity: dict) -> dict: ...
```

## Dataclasses as DTOs

```python
from dataclasses import dataclass

@dataclass
class CreateUserRequest:
    name: str
    email: str
    age: int | None = None
```

## Context Managers & Generators

- Use context managers (`with` statement) for resource management
- Use generators for lazy evaluation and memory-efficient iteration

## Reference

See skill: `python-patterns` for comprehensive patterns including decorators, concurrency, and package organization.

---

**ECC Original:** \`ECC/rules/python/patterns.md\`
**Atualizado em:** 2026-07-02 23:01:53
