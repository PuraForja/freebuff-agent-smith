# ⚡ Comando: instinct-import

> **Adaptado do ECC:** \`ECC/commands/instinct-import.md\`

## Descrição

Import instincts from file or URL into project/global scope

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
name: instinct-import
description: Import instincts from file or URL into project/global scope
command: true
---

# Instinct Import Command

## Implementation

Run the instinct CLI using the plugin root path:

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/skills/continuous-learning-v2/scripts/instinct-cli.py" import <file-or-url> [--dry-run] [--force] [--min-confidence 0.7] [--scope project|global]
```

Or if `CLAUDE_PLUGIN_ROOT` is not set (manual installation):

```bash
python3 ~/.claude/skills/continuous-learning-v2/scripts/instinct-cli.py import <file-or-url>
```

Import instincts from local file paths or HTTP(S) URLs.

## Usage

```
/instinct-import team-instincts.yaml
/instinct-import https://github.com/org/repo/instincts.yaml
/instinct-import team-instincts.yaml --dry-run
/instinct-import team-instincts.yaml --scope global --force
```

## What to Do

1. Fetch the instinct file (local path or URL)
2. Parse and validate the format
3. Check for duplicates with existing instincts
4. Merge or add new instincts
5. Save to inherited instincts directory:
   - Project scope: `~/.claude/homunculus/projects/<project-id>/instincts/inherited/`
   - Global scope: `~/.claude/homunculus/instincts/inherited/`

## Import Process

```
 Importing instincts from: team-instincts.yaml
================================================

Found 12 instincts to import.

Analyzing conflicts...

## New Instincts (8)
These will be added:
  ✓ use-zod-validation (confidence: 0.7)
  ✓ prefer-named-exports (confidence: 0.65)
  ✓ test-async-functions (confidence: 0.8)
  ...

## Duplicate Instincts (3)
Already have similar instincts:
  WARNING: prefer-functional-style
     Local: 0.8 confidence, 12 observations
     Import: 0.7 confidence
     → Keep local (higher confidence)

  WARNING: test-first-workflow
     Local: 0.75 confidence
     Import: 0.9 confidence
     → Update to import (higher confidence)

Import 8 new, update 1?
```

## Merge Behavior

When importing an instinct with an existing ID:
- Higher-confidence import becomes an update candidate
- Equal/lower-confidence import is skipped

---

**ECC Original:** \`ECC/commands/instinct-import.md\`
**Atualizado em:** 2026-07-02 23:01:57
