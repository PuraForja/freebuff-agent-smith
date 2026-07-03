# ⚡ Comando: plan

> **Adaptado do ECC:** \`ECC/commands/plan.md\`

## Descrição

Restate requirements, assess risks, and create step-by-step implementation plan. WAIT for user CONFIRM before touching any code.

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: Restate requirements, assess risks, and create step-by-step implementation plan. WAIT for user CONFIRM before touching any code.
argument-hint: "[feature description | path/to/*.prd.md]"
---

# Plan Command

This command creates a comprehensive implementation plan before writing any code. It accepts either free-form requirements or a PRD markdown file.

Run inline by default. Do not call the Task tool or any subagent by default. This keeps `/plan` usable from plugin installs that ship commands without agent files.

## What This Command Does

1. **Restate Requirements** - Clarify what needs to be built
2. **Identify Risks** - Surface potential issues and blockers
3. **Create Step Plan** - Break down implementation into phases
4. **Wait for Confirmation** - MUST receive user approval before proceeding

## When to Use

Use `/plan` when:
- Starting a new feature
- Making significant architectural changes
- Working on complex refactoring
- Multiple files/components will be affected
- Requirements are unclear or ambiguous

## How It Works

The assistant will:

1. **Analyze the request** and restate requirements in clear terms
2. **Ground the plan** in relevant codebase patterns when the repo is available
3. **Break down into phases** with specific, actionable steps
4. **Identify dependencies** between components
5. **Assess risks** and potential blockers
6. **Estimate complexity** (High/Medium/Low)
7. **Present the plan** and WAIT for your explicit confirmation

## Input Modes

| Input | Mode | Behavior |
|---|---|---|
| `path/to/name.prd.md` | PRD artifact mode | Read the PRD, pick the next pending delivery milestone or implementation phase, and write `.claude/plans/{name}.plan.md` |
| Any other markdown path | Reference mode | Read the file as context and produce an inline plan |
| Free-form text | Conversational mode | Produce an inline plan |
| Empty input | Clarification mode | Ask what should be planned |

In PRD artifact mode, create `.claude/plans/` if needed. If the PRD contains a `Delivery Milestones` table, update only the selected row from `pending` to `in-progress` and set its `Plan` cell to the generated plan path. If the PRD uses the legacy `.claude/PRPs/prds/` format with `Implementation Phases`, read it without migrating paths.

## Pattern Grounding

Before writing the plan, search the codebase for conventions the implementation should mirror. Capture the top example for each relevant category with file references:

| Category | What to capture |
|---|---|
| Naming | File, function, type, command, or script naming in the affected area |
| Error handling | How failures are raised, returned, logged, or handled gracefully |
| Logging | Levels, format, and what gets logged |
| Data access | Repository, service, query, or filesystem patterns |
| Tests | Test file location, framework, fixtures, and assertion style |

If no similar code exists, state that explicitly. Do not invent a pattern.

## PRD Artifact Output

When call

---

**ECC Original:** \`ECC/commands/plan.md\`
**Atualizado em:** 2026-07-02 23:01:59
