# 📏 Regra: golang — testing

> **Adaptada do ECC:** \`rules/golang/testing.md\`
> **Fonte original:** \`ECC/rules/golang/testing.md\`

## Descrição

Regra ECC para golang: testing

---

## Conteúdo Adaptado

---
paths:
  - "**/*.go"
  - "**/go.mod"
  - "**/go.sum"
---
# Go Testing

> This file extends [common/testing.md](../common/testing.md) with Go specific content.

## Framework

Use the standard `go test` with **table-driven tests**.

## Race Detection

Always run with the `-race` flag:

```bash
go test -race ./...
```

## Coverage

```bash
go test -cover ./...
```

## Reference

See skill: `golang-testing` for detailed Go testing patterns and helpers.

---

**ECC Original:** \`ECC/rules/golang/testing.md\`
**Atualizado em:** 2026-07-02 23:01:51
