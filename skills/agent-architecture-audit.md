# 🧠 Skill: agent-architecture-audit

> **Adaptada do ECC:** `agent-architecture-audit` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/agent-architecture-audit/SKILL.md`

## Descrição

Full-stack diagnostic for agent and LLM applications. Audits the 12-layer agent stack for wrapper regression, memory pollution, tool discipline failures, hidden repair loops, and rendering corruption. Produces severity-ranked findings with code-first fixes. Essential for developers building agent applications, autonomous loops, or any LLM-powered feature.

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

# Agent Architecture Audit

A diagnostic workflow for agent systems that hide failures behind wrapper layers, stale memory, retry loops, or transport/rendering mutations.

## When to Activate

**MANDATORY for:**
- Releasing any agent or LLM-powered application to production
- Shipping features with tool calling, memory, or multi-step workflows
- Agent behavior degrades after adding wrapper layers
- User reports "the agent is getting worse" or "tools are flaky"
- Same model works in playground but breaks inside your wrapper
- Debugging agent behavior for more than 15 minutes without finding root cause

**Especially critical when:**
- You've added new prompt layers, tool definitions, or memory systems
- Different agents in your system behave inconsistently
- The model was fine yesterday but is hallucinating today
- You suspect hidden repair/retry loops silently mutating responses

**Do not use for:**
- General code debugging — use `agent-introspection-debugging`
- Code review — use language-specific reviewer agents
- Security scanning — use `security-review` or `security-review/scan`
- Agent performance benchmarking — use `agent-eval`
- Writing new features — use the appropriate workflow skill

## The 12-Layer Stack

Every agent system has these layers. Any of them can corrupt the answer:

| # | Layer | What Goes Wrong |
|---|-------|----------------|
| 1 | System prompt | Conflicting instructions, instruction bloat |
| 2 | Session history | Stale context injection from previous turns |
| 3 | Long-term memory | Pollution across sessions, old topics in new conversations |
| 4 | Distillation | Compressed artifacts re-entering as pseudo-facts |
| 5 | Active recall | Redundant re-summary layers wasting context |
| 6 | Tool selection | Wrong tool routing, model skips required tools |
| 7 | Tool execution | Hallucinated execution — claims to call but doesn't |
| 8 | Tool interpretation | Misread or ignored tool output |
| 9 | Answer shaping | Format corruption in final response |
| 10 | Platform rendering | Transport-layer mutation (UI, API, CLI mutates valid answers) |
| 11 | Hidden repair loops | Silent fallback/retry agents running second LLM pass |
| 12 | Persistence | Expired state or cached artifacts reused as live evidence |

## Common Failure Patterns

### 1. Wrapper Regression

The base model produces correct answers, but the wrapper layers make it worse.

**Symptoms:**
- Model works fine in playground or direct API call, breaks in your agent
- Added a new prompt layer, existing behavior degraded
- Agent sounds confident but is confidently wrong
- "It was working before the last update"

### 2. Memory Contamination

Old topics leak into new conversations through history, memory retrieval, or distillation.

**Symptoms:**
- Agent brings up unrelated past topics
- User corrections don't stick (old memory overwrites new)
- Same-session artifacts re-enter as pseudo-facts
- Memory grows without bound, degrading response quality over time

### 3. Tool 

---

**ECC Original:** `ECC/skills/agent-architecture-audit/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:18
