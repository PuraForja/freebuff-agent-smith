# 🧠 Skill: agent-self-evaluation

> **Adaptada do ECC:** `agent-self-evaluation` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/agent-self-evaluation/SKILL.md`

## Descrição

Use after completing any non-trivial task. The agent self-rates its output on 5 axes — accuracy, completeness, clarity, actionability, conciseness — with concrete evidence per criterion. Produces a structured 1-5 scorecard with specific improvement suggestions.

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

> ⚠️ **Atenção:** Esta skill original usava hooks do Claude Code. A versão adaptada substitui hooks por instruções no `.codebuff/instructions.md`.

---

## Conteúdo Adaptado

# Agent Self-Evaluation

After completing a complex task, the agent pauses to rate its own output against a structured 5-axis rubric. This is NOT a pass/fail gate — it's a deliberate reflection step that catches omissions, flags overconfidence, and surface areas for improvement before the user has to.

## When to Activate

- After writing code that spans 3+ files or 50+ lines
- After completing a multi-step workflow (implement → test → review)
- After a debugging session that involved 3+ attempts
- After producing a design document, architecture decision, or written analysis
- When the user asks "how good was that?" or "rate yourself"
- At the end of any session Stop hook (if configured — see `references/hook-integration.md`)

## Core Concepts

### The 5 Evaluation Axes

| Axis | Question | What it catches |
|---|---|---|
| **Accuracy** | Are the facts, claims, and outputs correct? | Hallucinations, wrong API names, incorrect syntax, false statements |
| **Completeness** | Did it cover everything the user asked for? | Missed edge cases, unhandled error paths, forgotten requirements, skipped subtasks |
| **Clarity** | Is the explanation understandable and well-structured? | Confusing explanations, jargon without definition, missing context, rambling |
| **Actionability** | Can the user act on the output immediately? | Vague suggestions, missing steps, "you should X" without showing how, no verification path |
| **Conciseness** | Did it use the minimum words/tokens needed? | Redundancy, over-explanation, repeating the user's question verbatim, filler content |

### Scoring Scale

```
5 — Exceptional: no reasonable improvement possible
4 — Good: minor nits only, no substantive gaps
3 — Adequate: meets the request but has a notable weakness on at least one axis
2 — Weak: has a clear gap that affects usability or correctness
1 — Poor: fundamentally misses the request or contains significant errors
```

### The Evidence Rule

Every score below 5 MUST cite specific evidence. A score of 3 cannot just say "could be better" — it must say exactly what is missing or wrong. The mantra: **"Show the gap, don't just name it."**

## Workflow

### Step 1: Collect the Raw Material

Gather what you'll evaluate:

```
- The original user request (read back from conversation)
- Your final response/output (the deliverable)
- Any tool outputs that verify correctness (test results, exit codes, lint output)
- Any user feedback received during the task (corrections, "try again", "that's not right")
```

### Step 2: Score Each Axis Independently

Work through the 5 axes one at a time. For each:

1. Read the axis question
2. Find evidence (or lack of evidence) in the output
3. Assign a score 1-5
4. If score < 5, write a one-sentence improvement note citing the gap

Do NOT average the scores in your head first and then work backwards. Score each axis fresh.

### Step 3: Produce the Evaluation Report

Use the template from `templates/evaluation-report.md`. The report must include:

```
- One-line summary
- 5-axis scorecard (score + evidence per axis)
- Overall score (simple average, rounded to 1 decimal)
- 1-3 specific improvements ranked by impact
- Self-check: "Would the user agree with this assessment?"
```

### Step 4: Apply the Improvement

If any axis scored 3 or below:

1. State what you would do differently
2. If the gap is fixable in < 30 seconds (missing link, unclear phrasing), fix it now
3. If the gap requires rework, flag it explicitly: "This axis scored [reason] because [evidence]. Re-running with [specific fix] would likely raise it to [score]."

## Code Examples

### Example: Good Evaluation (Score 4+)

```
Task: Add retry logic to HTTP client

Scorecard:
  Accuracy:    5 — All API calls correct. Verified: retries use
                  exponential backoff. No hallucinated methods.
  Completeness: 4 — Covered happy path + 3 error cases. Missing:
                  timeout handling for hung connections.
  Clarity:      5 — Code comments explain backoff formula.
                  PR description links to incident that motivated this.
  Actionability:5 — Single merge. No follow-up tasks. Tests pass.
  Conciseness:  4 — 47 lines total. The retry loop could be extracted
                  into a helper to drop ~8 lines.

---

## Referência

- **ECC Original:** `ECC/skills/agent-self-evaluation/SKILL.md`
- **Atualizado em:** 2026-07-01 11:58:49
