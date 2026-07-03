# 🧠 Skill: council

> **Adaptada do ECC:** `council` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/council/SKILL.md`

## Descrição

Convene a four-voice council for ambiguous decisions, tradeoffs, and go/no-go calls. Use when multiple valid paths exist and you need structured disagreement before choosing.

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

# Council

Convene four advisors for ambiguous decisions:
- the in-context Claude voice
- a Skeptic subagent
- a Pragmatist subagent
- a Critic subagent

This is for **decision-making under ambiguity**, not code review, implementation planning, or architecture design.

## When to Use

Use council when:
- a decision has multiple credible paths and no obvious winner
- you need explicit tradeoff surfacing
- the user asks for second opinions, dissent, or multiple perspectives
- conversational anchoring is a real risk
- a go / no-go call would benefit from adversarial challenge

Examples:
- monorepo vs polyrepo
- ship now vs hold for polish
- feature flag vs full rollout
- simplify scope vs keep strategic breadth

## When NOT to Use

| Instead of council | Use |
| --- | --- |
| Verifying whether output is correct | `santa-method` |
| Breaking a feature into implementation steps | `planner` |
| Designing system architecture | `architect` |
| Reviewing code for bugs or security | `code-reviewer` or `santa-method` |
| Straight factual questions | just answer directly |
| Obvious execution tasks | just do the task |

## Roles

| Voice | Lens |
| --- | --- |
| Architect | correctness, maintainability, long-term implications |
| Skeptic | premise challenge, simplification, assumption breaking |
| Pragmatist | shipping speed, user impact, operational reality |
| Critic | edge cases, downside risk, failure modes |

The three external voices should be launched as fresh subagents with **only the question and relevant context**, not the full ongoing conversation. That is the anti-anchoring mechanism.

## Workflow

### 1. Extract the real question

Reduce the decision to one explicit prompt:
- what are we deciding?
- what constraints matter?
- what counts as success?

If the question is vague, ask one clarifying question before convening the council.

### 2. Gather only the necessary context

If the decision is codebase-specific:
- collect the relevant files, snippets, issue text, or metrics
- keep it compact
- include only the context needed to make the decision

If the decision is strategic/general:
- skip repo snippets unless they materially change the answer

### 3. Form the Architect position first

Before reading other voices, write down:
- your initial position
- the three strongest reasons for it
- the main risk in your preferred path

Do this first so the synthesis does not simply mirror the external voices.

### 4. Launch three independent voices in parallel

Each subagent gets:
- the decision question
- compact context if needed
- a strict role
- no unnecessary conversation history

Prompt shape:

```text
You are the [ROLE] on a four-voice decision council.

Question:
[decision question]

Context:
[only the relevant snippets or constraints]

Respond with:
1. Position — 1-2 sentences
2. Reasoning — 3 concise bullets
3. Risk — biggest risk in your recommendation
4. Surprise — one thing the other voices may miss

Be direct. No hedging. Keep it under 300 w

---

**ECC Original:** `ECC/skills/council/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:21
