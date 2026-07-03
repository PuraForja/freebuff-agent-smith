# 🧠 Skill: skill-stocktake

> **Adaptada do ECC:** `skill-stocktake` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/skill-stocktake/SKILL.md`

## Descrição

Use when auditing Claude skills and commands for quality. Supports Quick Scan (changed skills only) and Full Stocktake modes with sequential subagent batch evaluation.

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

# skill-stocktake

Slash command (`/skill-stocktake`) that audits all Claude skills and commands using a quality checklist + AI holistic judgment. Supports two modes: Quick Scan for recently changed skills, and Full Stocktake for a complete review.

## Scope

The command targets the following paths **relative to the directory where it is invoked**:

| Path | Description |
|------|-------------|
| `~/.claude/skills/` | Global skills (all projects) |
| `{cwd}/.claude/skills/` | Project-level skills (if the directory exists) |

**At the start of Phase 1, the command explicitly lists which paths were found and scanned.**

### Targeting a specific project

To include project-level skills, run from that project's root directory:

```bash
cd ~/path/to/my-project
/skill-stocktake
```

If the project has no `.claude/skills/` directory, only global skills and commands are evaluated.

## Modes

| Mode | Trigger | Duration |
|------|---------|---------|
| Quick Scan | `results.json` exists (default) | 5–10 min |
| Full Stocktake | `results.json` absent, or `/skill-stocktake full` | 20–30 min |

**Results cache:** `~/.claude/skills/skill-stocktake/results.json`

## Quick Scan Flow

Re-evaluate only skills that have changed since the last run (5–10 min).

1. Read `~/.claude/skills/skill-stocktake/results.json`
2. Run: `bash ~/.claude/skills/skill-stocktake/scripts/quick-diff.sh          ~/.claude/skills/skill-stocktake/results.json`
   (Project dir is auto-detected from `$PWD/.claude/skills`; pass it explicitly only if needed)
3. If output is `[]`: report "No changes since last run." and stop
4. Re-evaluate only those changed files using the same Phase 2 criteria
5. Carry forward unchanged skills from previous results
6. Output only the diff
7. Run: `bash ~/.claude/skills/skill-stocktake/scripts/save-results.sh          ~/.claude/skills/skill-stocktake/results.json <<< "$EVAL_RESULTS"`

## Full Stocktake Flow

### Phase 1 — Inventory

Run: `bash ~/.claude/skills/skill-stocktake/scripts/scan.sh`

The script enumerates skill files, extracts frontmatter, and collects UTC mtimes.
Project dir is auto-detected from `$PWD/.claude/skills`; pass it explicitly only if needed.
Present the scan summary and inventory table from the script output:

```
Scanning:
  ✓ ~/.claude/skills/         (17 files)
  ✗ {cwd}/.claude/skills/    (not found — global skills only)
```

| Skill | 7d use | 30d use | Description |
|-------|--------|---------|-------------|

### Phase 2 — Quality Evaluation

Launch an Agent tool subagent (**general-purpose agent**) with the full inventory and checklist:

```text
Agent(
  subagent_type="general-purpose",
  prompt="
Evaluate the following skill inventory against the checklist.

[INVENTORY]

[CHECKLIST]

Return JSON for each skill:
{ "verdict": "Keep"|"Improve"|"Update"|"Retire"|"Merge into [X]", "reason": "..." }
"
)
```

The subagent reads each skill, applies the checklist, and returns per-skill JSON:

`{ "verdict": "Keep"|"Improve"|"Update"|"Ret

---

**ECC Original:** `ECC/skills/skill-stocktake/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:32
