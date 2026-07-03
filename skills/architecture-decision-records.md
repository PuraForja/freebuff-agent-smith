# 🧠 Skill: architecture-decision-records

> **Adaptada do ECC:** `architecture-decision-records` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/architecture-decision-records/SKILL.md`

## Descrição

Capture architectural decisions made during Claude Code sessions as structured ADRs. Auto-detects decision moments, records context, alternatives considered, and rationale. Maintains an ADR log so future developers understand why the codebase is shaped the way it is.

---

## ⚠️ Adaptação para Codebuff

Esta skill foi convertida automaticamente do ECC (formato Claude Code) para o
formato Codebuff. Ela mantém o conteúdo essencial do ECC, adaptando
referências específicas do Claude Code:

| Conceito ECC (Claude) | Equivalente Codebuff |
|-----------------------|---------------------|
| Hooks (PreToolUse/PostToolUse) | Instruções no `.codebuff/instructions.md` |
| Comandos slash (/multi-plan, etc.) | Skills carregadas via `skill` tool |
| `settings.json` | `.codebuff/instructions.md` |
| Rules em `~/.claude/rules/` | Skills em `.agents/skills/` |



---

## Conteúdo Adaptado

# Architecture Decision Records

Capture architectural decisions as they happen during coding sessions. Instead of decisions living only in Slack threads, PR comments, or someone's memory, this skill produces structured ADR documents that live alongside the code.

## When to Activate

- User explicitly says "let's record this decision" or "ADR this"
- User chooses between significant alternatives (framework, library, pattern, database, API design)
- User says "we decided to..." or "the reason we're doing X instead of Y is..."
- User asks "why did we choose X?" (read existing ADRs)
- During planning phases when architectural trade-offs are discussed

## ADR Format

Use the lightweight ADR format proposed by Michael Nygard, adapted for AI-assisted development:

```markdown
# ADR-NNNN: [Decision Title]

**Date**: YYYY-MM-DD
**Status**: proposed | accepted | deprecated | superseded by ADR-NNNN
**Deciders**: [who was involved]

## Context

What is the issue that we're seeing that is motivating this decision or change?

[2-5 sentences describing the situation, constraints, and forces at play]

## Decision

What is the change that we're proposing and/or doing?

[1-3 sentences stating the decision clearly]

## Alternatives Considered

### Alternative 1: [Name]
- **Pros**: [benefits]
- **Cons**: [drawbacks]
- **Why not**: [specific reason this was rejected]

### Alternative 2: [Name]
- **Pros**: [benefits]
- **Cons**: [drawbacks]
- **Why not**: [specific reason this was rejected]

## Consequences

What becomes easier or more difficult to do because of this change?

### Positive
- [benefit 1]
- [benefit 2]

### Negative
- [trade-off 1]
- [trade-off 2]

### Risks
- [risk and mitigation]
```

## Workflow

### Capturing a New ADR

When a decision moment is detected:

1. **Initialize (first time only)** — if `docs/adr/` does not exist, ask the user for confirmation before creating the directory, a `README.md` seeded with the index table header (see ADR Index Format below), and a blank `template.md` for manual use. Do not create files without explicit consent.
2. **Identify the decision** — extract the core architectural choice being made
3. **Gather context** — what problem prompted this? What constraints exist?
4. **Document alternatives** — what other options were considered? Why were they rejected?
5. **State consequences** — what are the trade-offs? What becomes easier/harder?
6. **Assign a number** — scan existing ADRs in `docs/adr/` and increment
7. **Confirm and write** — present the draft ADR to the user for review. Only write to `docs/adr/NNNN-decision-title.md` after explicit approval. If the user declines, discard the draft without writing any files.
8. **Update the index** — append to `docs/adr/README.md`

### Reading Existing ADRs

When a user asks "why did we choose X?":

1. Check if `docs/adr/` exists — if not, respond: "No ADRs found in this project. Would you like to start recording architectural decisions?"
2. If it exists, scan `docs/adr/README.md` index for relevant entries
3. Read matching ADR files and present the Context and Decision sections
4. If no match is found, respond: "No ADR found for that decision. Would you like to record one now?"

### ADR Directory Structure

```
docs/
└── adr/
    ├── README.md              ← index of all ADRs
    ├── 0001-use-nextjs.md
    ├── 0002-postgres-over-mongo.md
    ├── 0003-rest-over-graphql.md
    └── template.md            ← blank template for manual use
```

### ADR Index Format

---

## Referência

- **ECC Original:** `ECC/skills/architecture-decision-records/SKILL.md`
- **Atualizado em:** 2026-07-01 11:58:49
