# 🧠 Skill: context-budget

> **Adaptada do ECC:** `context-budget` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/context-budget/SKILL.md`

## Descrição

Audits Claude Code context window consumption across agents, skills, MCP servers, and rules. Identifies bloat, redundant components, and produces prioritized token-savings recommendations.

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

# Context Budget

Analyze token overhead across every loaded component in a Claude Code session and surface actionable optimizations to reclaim context space.

## When to Use

- Session performance feels sluggish or output quality is degrading
- You've recently added many skills, agents, or MCP servers
- You want to know how much context headroom you actually have
- Planning to add more components and need to know if there's room
- Running `/context-budget` command (this skill backs it)

## How It Works

### Phase 1: Inventory

Scan all component directories and estimate token consumption:

**Agents** (`agents/*.md`)
- Count lines and tokens per file (words × 1.3)
- Extract `description` frontmatter length
- Flag: files >200 lines (heavy), description >30 words (bloated frontmatter)

**Skills** (`skills/*/SKILL.md`)
- Count tokens per SKILL.md
- Flag: files >400 lines
- Check for duplicate copies in `.agents/skills/` — skip identical copies to avoid double-counting

**Rules** (`rules/**/*.md`)
- Count tokens per file
- Flag: files >100 lines
- Detect content overlap between rule files in the same language module

**MCP Servers** (`.mcp.json` or active MCP config)
- Count configured servers and total tool count
- Estimate schema overhead at ~500 tokens per tool
- Flag: servers with >20 tools, servers that wrap simple CLI commands (`gh`, `git`, `npm`, `supabase`, `vercel`)

**CLAUDE.md** (project + user-level)
- Count tokens per file in the CLAUDE.md chain
- Flag: combined total >300 lines

### Phase 2: Classify

Sort every component into a bucket:

| Bucket | Criteria | Action |
|--------|----------|--------|
| **Always needed** | Referenced in CLAUDE.md, backs an active command, or matches current project type | Keep |
| **Sometimes needed** | Domain-specific (e.g. language patterns), not referenced in CLAUDE.md | Consider on-demand activation |
| **Rarely needed** | No command reference, overlapping content, or no obvious project match | Remove or lazy-load |

### Phase 3: Detect Issues

Identify the following problem patterns:

- **Bloated agent descriptions** — description >30 words in frontmatter loads into every Task tool invocation
- **Heavy agents** — files >200 lines inflate Task tool context on every spawn
- **Redundant components** — skills that duplicate agent logic, rules that duplicate CLAUDE.md
- **MCP over-subscription** — >10 servers, or servers wrapping CLI tools available for free
- **CLAUDE.md bloat** — verbose explanations, outdated sections, instructions that should be rules

### Phase 4: Report

Produce the context budget report:

```
Context Budget Report
═══════════════════════════════════════

Total estimated overhead: ~XX,XXX tokens
Context model: Claude Sonnet (200K window)
Effective available context: ~XXX,XXX tokens (XX%)

Component Breakdown:
┌─────────────────┬────────┬───────────┐
│ Component       │ Count  │ Tokens    │
├─────────────────┼────────┼───────────┤
│ Agents          │ N      │ ~X,XXX    │
│ Skills          │ N      │ ~X,XXX    │
│ Rules           │ N      │ ~X,XXX    │
│ MCP tools       │ N      │ ~XX,XXX   │
│ CLAUDE.md       │ N      │ ~X,XXX    │
└─────────────────┴────────┴───────────┘

WARNING: Issues Found (N):
[ranked by token savings]

Top 3 Optimizations:
1. [action] → save ~X,XXX tokens
2. [action] → save ~X,XXX tokens
3. [action] → save ~X,XXX tokens

Potential savings: ~XX,XXX tokens (XX% of current overhead)
```

In verbose mode, additionally output per-file token counts, line-by-line breakdown of the heaviest files, specific redundant lines between overlapping components, and MCP tool list with per-tool schema size estimates.

## Examples

---

## Referência

- **ECC Original:** `ECC/skills/context-budget/SKILL.md`
- **Atualizado em:** 2026-07-01 11:58:49
