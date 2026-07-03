# ⚡ Comando: model-route

> **Adaptado do ECC:** \`ECC/commands/model-route.md\`

## Descrição

Recommend the best model tier for the current task based on complexity, risk, and budget.

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: Recommend the best model tier for the current task based on complexity, risk, and budget.
---

# Model Route Command

Recommend the best model tier for the current task by complexity and budget.

## Usage

`/model-route [task-description] [--budget low|med|high]`

## Routing Heuristic

- `haiku`: deterministic, low-risk mechanical changes
- `sonnet`: default for implementation and refactors
- `opus`: architecture, deep review, ambiguous requirements

## Required Output

- recommended model
- confidence level
- why this model fits
- fallback model if first attempt fails

## Arguments

$ARGUMENTS:
- `[task-description]` optional free-text
- `--budget low|med|high` optional

---

**ECC Original:** \`ECC/commands/model-route.md\`
**Atualizado em:** 2026-07-02 23:01:58
