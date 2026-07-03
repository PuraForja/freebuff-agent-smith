# 🧠 Skill: config-gc

> **Adaptada do ECC:** `config-gc` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/config-gc/SKILL.md`

## Descrição

Garbage collection for your Claude Code configuration. Periodically scans ~/.claude (skills, memory, hooks, permissions, MCP servers, caches) for redundant, stale, orphaned, or low-value items, then walks the user through a confirm-each-deletion cleanup. Use when the user says clean up my config, config GC, too many skills, audit my setup, my .claude is bloated, or asks for a periodic config review.

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

# Config GC — Garbage Collection for Claude Code Setups

Borrowed from runtime garbage collection: periodically scan for objects that are no longer referenced, redundant, expired, or low-value, and reclaim the space. The critical difference: **here, collection requires a human in the loop. Never delete autonomously.**

## When to Activate

- The user asks to clean up, audit, or slim down their Claude Code configuration
- The user complains about too many skills, noisy hooks, or slow session startup
- A monthly/periodic config review is due
- After installing a large skill pack (e.g. this repo), to reconcile overlaps with existing setup

Do NOT activate for: cleaning project source code (that's refactoring), clearing chat history, or uninstalling Claude Code itself.

## Design Philosophy

1. **Append-only configs leak.** Skills, memory files, hooks, and permission entries only ever get added. Without periodic review they rot silently.
2. **Regular audits beat one-time purges.** Scan every ~30 days, propose a small batch of candidates each time.
3. **Per-channel strategies.** Each accumulation type (skills, hooks, permissions, ...) has its own staleness signals — don't apply one rule everywhere.
4. **Soft-delete first.** Rename to `.disabled` > move to `~/.claude/_gc_trash/` > real deletion. Always keep an undo path.
5. **Forced human-in-the-loop.** Every candidate gets its own `[y/n/skip]` confirmation. No "yes to all" shortcut.
6. **Keep a log.** Every GC run appends to `~/.claude/gc_log.md`: what was touched, why, and how to undo it.

## Scan Channels

| # | Channel | Path | Staleness / redundancy signals |
|---|---------|------|--------------------------------|
| 1 | Skills | `~/.claude/skills/*/` | Heavily overlapping names; never triggered in recent transcripts; domain mismatch with the user's actual work; broken or empty SKILL.md |
| 2 | Memory | `~/.claude/**/memory/*.md` + its index | Multiple index entries for one topic; contents contradicting newer entries; dates that have passed; orphan files missing from the index; sub-100-word fragments that should merge |
| 3 | Hooks | `~/.claude/hooks/` + settings | Scripts present on disk but referenced by no hook config; old versions superseded by rewrites |
| 4 | Permissions | `permissions.allow` in `settings.json` / `settings.local.json` | Duplicate entries; specific entries already covered by a wildcard (e.g. `Bash(git push)` when `Bash(*)` is allowed); one-off grants from past experiments |
| 5 | MCP servers | `~/.claude.json` or project `.mcp.json` | Servers that fail to connect; functional duplicates; long-unused |
| 6 | Scheduled reminders / jobs | wherever the user keeps them | Fired one-shots older than 30 days; jobs whose target scripts no longer exist |
| 7 | Project history | `~/.claude/projects/*/` | Stale handoff snapshots; session records superseded by newer state |
| 8 | Runtime caches | `cache/`, `file-history/`, `logs/`, `shell-snapshots/` | Sort by size and mtime; propose items 

---

**ECC Original:** `ECC/skills/config-gc/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:20
