# 📏 Regra: arkts — hooks

> **Adaptada do ECC:** \`rules/arkts/hooks.md\`
> **Fonte original:** \`ECC/rules/arkts/hooks.md\`

## Descrição

Regra ECC para arkts: hooks

---

## Conteúdo Adaptado

---
paths:
  - "**/*.ets"
  - "**/*.ts"
  - "**/module.json5"
  - "**/oh-package.json5"
---
# HarmonyOS / ArkTS Hooks

> This file extends [common/hooks.md](../common/hooks.md) with HarmonyOS-specific build and validation hooks.

## Build Commands

### HAP Package Build

```bash
# Build HAP package (global hvigor environment)
hvigorw assembleHap -p product=default

# Build with specific module
hvigorw assembleHap -p module=entry -p product=default

# Clean build
hvigorw clean
```

### DevEco Studio CLI

```bash
# Check project structure
hvigorw --version

# Install dependencies
ohpm install

# Update dependencies
ohpm update
```

## Recommended PostToolUse Hooks

### After Editing .ets/.ts Files

Run hvigor build to check for ArkTS compilation errors:

```json
{
  "type": "PostToolUse",
  "matcher": {
    "tool": ["Edit", "Write"],
    "filePath": ["**/*.ets", "**/*.ts"]
  },
  "hooks": [
    {
      "command": "hvigorw assembleHap -p product=default 2>&1 | tail -20",
      "async": true,
      "timeout": 60000
    }
  ]
}
```

### After Editing module.json5

Validate permission and ability declarations:

```json
{
  "type": "PostToolUse",
  "matcher": {
    "tool": "Edit",
    "filePath": "**/module.json5"
  },
  "hooks": [
    {
      "command": "echo '[HarmonyOS] module.json5 modified - verify permissions and abilities'",
      "async": false
    }
  ]
}
```

### After Editing oh-package.json5

Reinstall dependencies:

```json
{
  "type": "PostToolUse",
  "matcher": {
    "tool": "Edit",
    "filePath": "**/oh-package.json5"
  },
  "hooks": [
    {
      "command": "ohpm install 2>&1 | tail -10",
      "async": true,
      "timeout": 30000
    }
  ]

---

**ECC Original:** \`ECC/rules/arkts/hooks.md\`
**Atualizado em:** 2026-07-02 23:01:50
