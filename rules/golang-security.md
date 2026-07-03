# 📏 Regra: golang — security

> **Adaptada do ECC:** \`rules/golang/security.md\`
> **Fonte original:** \`ECC/rules/golang/security.md\`

## Descrição

Regra ECC para golang: security

---

## Conteúdo Adaptado

---
paths:
  - "**/*.go"
  - "**/go.mod"
  - "**/go.sum"
---
# Go Security

> This file extends [common/security.md](../common/security.md) with Go specific content.

## Secret Management

```go
apiKey := os.Getenv("OPENAI_API_KEY")
if apiKey == "" {
    log.Fatal("OPENAI_API_KEY not configured")
}
```

## Security Scanning

- Use **gosec** for static security analysis:
  ```bash
  gosec ./...
  ```

## Context & Timeouts

Always use `context.Context` for timeout control:

```go
ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
defer cancel()
```

---

**ECC Original:** \`ECC/rules/golang/security.md\`
**Atualizado em:** 2026-07-02 23:01:51
