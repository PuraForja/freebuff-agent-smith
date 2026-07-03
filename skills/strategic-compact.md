# 🧠 Skill: strategic-compact

> **Adaptada do ECC:** `strategic-compact` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/strategic-compact/SKILL.md`

## Descrição

Suggests manual context compaction at logical intervals to preserve context through task phases rather than arbitrary auto-compaction.

---

## ⚠️ Adaptação para Codebuff

> ⚠️ Esta skill original usava hooks do Claude Code. Adaptada para Codebuff.

| Conceito ECC (Claude) | Equivalente Codebuff |
|-----------------------|---------------------|
| Hooks | Instruções no `.codebuff/instructions.md` |
| Comandos slash | Skills via `skill` tool |
| `settings.json` | `.codebuff/instructions.md` |
| Rules em `~/.claude/rules/` | Skills em `.agents/skills/` |

---

## Conteúdo Adaptado

# Strategic Compact Skill

Suggests manual `/compact` at strategic points in your workflow rather than relying on arbitrary auto-compaction.

## When to Activate

- Running long sessions that approach context limits (200K+ tokens)
- Working on multi-phase tasks (research → plan → implement → test)
- Switching between unrelated tasks within the same session
- After completing a major milestone and starting new work
- When responses slow down or become less coherent (context pressure)

## Why Strategic Compaction?

Auto-compaction triggers at arbitrary points:
- Often mid-task, losing important context
- No awareness of logical task boundaries
- Can interrupt complex multi-step operations

Strategic compaction at logical boundaries:
- **After exploration, before execution** — Compact research context, keep implementation plan
- **After completing a milestone** — Fresh start for next phase
- **Before major context shifts** — Clear exploration context before different task

## How It Works

The `suggest-compact.js` script runs on PreToolUse (Edit/Write) and combines two signals:

1. **Context size (primary)** — Reads the latest `usage` record from the session transcript (`transcript_path` in the hook payload) and sums `input_tokens + cache_read_input_tokens + cache_creation_input_tokens` (the true context size of the turn). Suggests `/compact` at a window-scaled threshold — 160k tokens on a 200k window, 250k on a 1M window (detected from a `[1m]` model marker, or inferred when observed tokens already exceed 200k) — and re-reminds after every additional 60k tokens of context growth
2. **Tool-call count (secondary)** — Counts tool invocations in session; suggests at a configurable threshold (default: 50 calls), then every 25 calls after

Tool count alone is a weak proxy for window pressure: a few large file reads or MCP responses can fill the window in very few calls, while many tiny calls can cross 50 with a near-empty window. The context-size signal fires when it actually matters.

## Hook Setup

Add to your `~/.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit",
        "hooks": [{ "type": "command", "command": "node ~/.claude/scripts/hooks/suggest-compact.js" }]
      },
      {
        "matcher": "Write",
        "hooks": [{ "type": "command", "command": "node ~/.claude/scripts/hooks/suggest-compact.js" }]
      }
    ]
  }
}
```

## Configuration

Environment variables:
- `COMPACT_THRESHOLD` — Tool calls before first suggestion (default: 50)
- `COMPACT_CONTEXT_THRESHOLD` — Context tokens before the context-size suggestion (default: 160000 on a 200k window, 250000 on a 1M window; `0` disables the context signal)
- `COMPACT_CONTEXT_INTERVAL` — Additional context tokens before the suggestion repeats (default: 60000)
- `COMPACT_STATE_TTL_DAYS` — Days before stale per-session state files in the temp dir are swept (default: 14)

## Compaction Decision Guide

Use this table to decide when to compact:

| 

---

**ECC Original:** `ECC/skills/strategic-compact/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:33
