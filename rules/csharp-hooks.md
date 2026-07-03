# 📏 Regra: csharp — hooks

> **Adaptada do ECC:** \`rules/csharp/hooks.md\`
> **Fonte original:** \`ECC/rules/csharp/hooks.md\`

## Descrição

Regra ECC para csharp: hooks

---

## Conteúdo Adaptado

---
paths:
  - "**/*.cs"
  - "**/*.csx"
  - "**/*.csproj"
  - "**/*.sln"
  - "**/Directory.Build.props"
  - "**/Directory.Build.targets"
---
# C# Hooks

> This file extends [common/hooks.md](../common/hooks.md) with C#-specific content.

## PostToolUse Hooks

Configure in `~/.claude/settings.json`:

- **dotnet format**: Auto-format edited C# files and apply analyzer fixes
- **dotnet build**: Verify the solution or project still compiles after edits
- **dotnet test --no-build**: Re-run the nearest relevant test project after behavior changes

## Stop Hooks

- Run a final `dotnet build` before ending a session with broad C# changes
- Warn on modified `appsettings*.json` files so secrets do not get committed

---

**ECC Original:** \`ECC/rules/csharp/hooks.md\`
**Atualizado em:** 2026-07-02 23:01:51
