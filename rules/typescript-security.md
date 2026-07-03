# 📏 Regra: typescript — security

> **Adaptada do ECC:** \`rules/typescript/security.md\`
> **Fonte original:** \`ECC/rules/typescript/security.md\`

## Descrição

Regra ECC para typescript: security

---

## Conteúdo Adaptado

---
paths:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.js"
  - "**/*.jsx"
---
# TypeScript/JavaScript Security

> This file extends [common/security.md](../common/security.md) with TypeScript/JavaScript specific content.

## Secret Management

```typescript
// NEVER: Hardcoded secrets
const apiKey = "sk-proj-xxxxx"

// ALWAYS: Environment variables
const apiKey = process.env.API_KEY

if (!apiKey) {
  throw new Error('API_KEY not configured')
}
```

## Agent Support

- Use **security-reviewer** skill for comprehensive security audits

---

**ECC Original:** \`ECC/rules/typescript/security.md\`
**Atualizado em:** 2026-07-02 23:01:55
