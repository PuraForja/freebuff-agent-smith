# 🧠 Skill: plan-orchestrate

> **Adaptada do ECC:** `plan-orchestrate` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/plan-orchestrate/SKILL.md`

## Descrição

Read a plan document, decompose it into steps, design a per-step agent chain from the ECC catalogue, and emit ready-to-paste /orchestrate custom prompts. Generative only — never invokes /orchestrate itself. Use when the user has a multi-step plan and wants to drive it through orchestrate without composing chains by hand.

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

# Plan Orchestrate

Bridge a plan document to `/orchestrate custom` by emitting one ready-to-paste invocation per step. The skill is generative only — it never executes `/orchestrate`. The user pastes each line when ready.

## When to Activate

- User has a multi-step plan document (PRD, RFC, implementation plan) and wants to drive it through `/orchestrate`.
- User says "orchestrate this plan", "give me orchestrate prompts for each step", "compose chains for this plan".
- A step-by-step plan exists but the user does not want to manually pick agents per step.

Skip when:
- The work is one ad-hoc step → call `/orchestrate custom` directly.
- The plan is unreadable or empty. Lack of explicit numbering alone is not a skip condition — see the "No clear steps" edge case below.

## Inputs

```
<plan-doc-path> [--lang=python|typescript|go|rust|cpp|java|kotlin|flutter|auto] [--scope=all|step:<n>|range:<a>-<b>] [--dry-run]
```

- `<plan-doc-path>` — required; relative or absolute path (`@docs/...` accepted).
- `--lang` — reviewer language variant; defaults to `auto` (detected from project).
- `--scope` — limits emitted steps; defaults to `all`.
- `--dry-run` — print decomposition + chain rationale only; do not emit final prompts.

## Authoritative `/orchestrate` shape (do not deviate)

```
{ORCH_CMD} custom "<agent1>,<agent2>,...,<agentN>" "<task description>"
```

Where `{ORCH_CMD}` is determined in Phase 0 (see below). The command string in the emitted output **always uses one concrete form** — never both, never a placeholder.

- `custom` is a sequential chain; each agent's HANDOFF feeds the next.
- Comma-separated agent list. No spaces preferred; one space tolerated.
- No `--mode` / `--gate` / `--agents=...` flags exist — never invent them.
- Agent names come from the catalogue in this skill. Embedded double quotes in the task description are escaped as `"`.

## ECC install form and namespacing

Two install forms determine the prefix on **both** the slash command and every agent name. The two MUST stay in sync — one form per output, never mixed:

Let `<claude-home>` denote the Claude Code home directory: `~/.claude` on macOS/Linux, `%USERPROFILE%\.claude` on Windows. Resolve it the way the host platform resolves the user home directory (do not hardcode `~`).

| Form | Detection | `{ORCH_CMD}` | Agent name format |
|---|---|---|---|
| Plugin install (1.9.0+) | `<claude-home>/plugins/marketplaces/everything-claude-code/` exists | `/everything-claude-code:orchestrate` | `everything-claude-code:<name>` |
| Legacy bare install | Above absent; agent files under `<claude-home>/agents/` | `/orchestrate` | `<name>` |

Why this matters: under the plugin install, agents register as `everything-claude-code:tdd-guide`. Bare names force fuzzy matching, which fails intermittently under parallel calls. Under legacy, the prefixed forms are not registered and fail outright.

## Available agent catalogue (must pick from these)

General:
- `planner` — requirement restateme

---

**ECC Original:** `ECC/skills/plan-orchestrate/SKILL.md`
**Atualizado em:** 2026-07-01 13:21:04
