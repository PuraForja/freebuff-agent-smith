# 🧠 Skill: intent-driven-development

> **Adaptada do ECC:** `intent-driven-development` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/intent-driven-development/SKILL.md`

## Descrição

Turn ambiguous or high-impact product and engineering changes into scoped, verifiable acceptance criteria before or alongside implementation. Use when a user asks to clarify a feature, define acceptance criteria, de-risk a security/data/migration/integration change, prepare implementation requirements for another agent, or make a complex request testable. Do not trigger for trivial edits, straightforward fixes, active debugging, code review, or implementation requests whose acceptance conditions are already clear unless the user explicitly invokes this skill.

---

## ⚠️ Adaptação para Codebuff



| Conceito ECC (Claude) | Equivalente Codebuff |
|-----------------------|---------------------|
| Hooks | Instruções no `.codebuff/instructions.md` |
| Comandos slash | Skills via `skill` tool |
| `settings.json` | `.codebuff/instructions.md` |
| Rules em `~/.claude/rules/` | Skills em `.agents/skills/` |

---

## Conteúdo Adaptado

# Intent-Driven Development

Produce useful acceptance criteria without turning specification into ceremony. Inspect
available context first, expose genuine ambiguity, and choose verification methods that fit
the work and its risk.

## When to Activate

- User asks to clarify a feature, define acceptance criteria, or de-risk a change before implementation
- Request touches security, authentication, persistent data, migrations, external APIs, or compliance
- User wants to prepare a handoff artifact for another agent or team
- Request is ambiguous enough that the expected outcome is not yet observable or testable
- User explicitly invokes this skill with `/intent-driven-development`

Do not activate for trivial edits, straightforward one-line fixes, active debugging sessions,
code review requests, or implementation requests whose acceptance conditions are already clear.

## How It Works

1. **Inspect context first** — reads the repository, docs, schemas, and test infrastructure for technical facts before asking any question, while treating product/business constraints as something only the user or a product artifact can supply
2. **Choose depth** — selects Quick Capture (3-7 criteria, low/moderate risk) or Full Acceptance Brief (security, data, migration, cross-system changes) based on the risk profile
3. **Ask minimally** — only asks questions whose answers cannot be inferred and that materially change scope or behavior
4. **Write observable criteria** — each AC-NNN describes a starting condition, trigger, expected outcome, prohibited side effect, verification method, and priority; no vague words like "correctly" or "securely" without evidence
5. **Proceed or hand off** — for clear requests with no blocking risks, records criteria and continues; for risky changes, presents blockers and waits for confirmation
6. **Handle revision** — if an AC fails mid-implementation due to architectural constraints, marks it `[revised]`, updates scope or verification method, increments the revision number, and re-presents only the changed criteria

## Examples

**Quick Capture — "Add CSV export to the dashboard"**

```
Goal: Authenticated users can download dashboard data as a CSV file.
In scope: Export of currently filtered rows; filename includes date.
Out of scope: Scheduled exports, email delivery, Excel format.
Assumptions: Max row count is under 10k; no PII in exported fields.

AC-001: Export generates file with correct headers
- Scenario: authenticated user, at least one data row visible
- Action: click "Export CSV"
- Expected: browser downloads file with columns [id, name, created_at]
- Must not: expose internal fields or rows belonging to other users
- Verification: automated integration test + manual schema spot-check
- Priority: Required
```

**Full Acceptance Brief trigger — "Migrate user auth to OAuth"**

Auth change + external dependency + existing session data → Full Brief with Risk Review table,
blocking decisions on session invalidation strategy, 

---

**ECC Original:** `ECC/skills/intent-driven-development/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:25
