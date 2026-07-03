# 📏 Regra: python — security

> **Adaptada do ECC:** \`rules/python/security.md\`
> **Fonte original:** \`ECC/rules/python/security.md\`

## Descrição

Regra ECC para python: security

---

## Conteúdo Adaptado

---
paths:
  - "**/*.py"
  - "**/*.pyi"
---
# Python Security

> This file extends [common/security.md](../common/security.md) with Python specific content.

## Secret Management

```python
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.environ["OPENAI_API_KEY"]  # Raises KeyError if missing
```

## Security Scanning

- Use **bandit** for static security analysis:
  ```bash
  bandit -r src/
  ```

## Reference

See skill: `django-security` for Django-specific security guidelines (if applicable).

---

**ECC Original:** \`ECC/rules/python/security.md\`
**Atualizado em:** 2026-07-02 23:01:53
