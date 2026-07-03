# ⚡ Comando: prp-plan

> **Adaptado do ECC:** \`ECC/commands/prp-plan.md\`

## Descrição

Create comprehensive feature implementation plan with codebase analysis and pattern extraction

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: Create comprehensive feature implementation plan with codebase analysis and pattern extraction
argument-hint: <feature description | path/to/prd.md>
---

> Adapted from PRPs-agentic-eng by Wirasm. Part of the PRP workflow series.

# PRP Plan

Create a detailed, self-contained implementation plan that captures all codebase patterns, conventions, and context needed to implement a feature in a single pass.

**Core Philosophy**: A great plan contains everything needed to implement without asking further questions. Every pattern, every convention, every gotcha — captured once, referenced throughout.

**Golden Rule**: If you would need to search the codebase during implementation, capture that knowledge NOW in the plan.

---

## Phase 0 — DETECT

Determine input type from `$ARGUMENTS`:

| Input Pattern | Detection | Action |
|---|---|---|
| Path ending in `.prd.md` | File path to PRD | Parse PRD, find next pending phase |
| Path to `.md` with "Implementation Phases" | PRD-like document | Parse phases, find next pending |
| Path to any other file | Reference file | Read file for context, treat as free-form |
| Free-form text | Feature description | Proceed directly to Phase 1 |
| Empty / blank | No input | Ask user what feature to plan |

### PRD Parsing (when input is a PRD)

1. Read the PRD file with `cat "$PRD_PATH"`
2. Parse the **Implementation Phases** section
3. Find phases by status:
   - Look for `pending` phases
   - Check dependency chains (a phase may depend on prior phases being `complete`)
   - Select the **next eligible pending phase**
4. Extract from the selected phase:
   - Phase name and description
   - Acceptance criteria
   - Dependencies on prior phases
   - Any scope notes or constraints
5. Use the phase description as the feature to plan

If no pending phases remain, report that all phases are complete.

---

## Phase 1 — PARSE

Extract and clarify the feature requirements.

### Feature Understanding

From the input (PRD phase or free-form description), identify:

- **What** is being built (concrete deliverable)
- **Why** it matters (user value)
- **Who** uses it (target user/system)
- **Where** it fits (which part of the codebase)

### User Story

Format as:
```
As a [type of user],
I want [capability],
So that [benefit].
```

### Complexity Assessment

| Level | Indicators | Typical Scope |
|---|---|---|
| **Small** | Single file, isolated change, no new dependencies | 1-3 files, <100 lines |
| **Medium** | Multiple files, follows existing patterns, minor new concepts | 3-10 files, 100-500 lines |
| **Large** | Cross-cutting concerns, new patterns, external integrations | 10+ files, 500+ lines |
| **XL** | Architectural changes, new subsystems, migration needed | 20+ files, consider splitting |

### Ambiguity Gate

---

**ECC Original:** \`ECC/commands/prp-plan.md\`
**Atualizado em:** 2026-07-02 23:01:59
