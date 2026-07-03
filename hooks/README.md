# 🔌 Hook ECC: README

> **Adaptado do ECC:** \`ECC/hooks/README\`

## Descrição

Hooks

---

## ⚠️ Adaptação para Codebuff

No ECC (Claude Code), hooks controlam comportamento pré/pós-ação via
\`PreToolUse\`, \`PostToolUse\`, etc. No Codebuff, funcionalidades similares
são configuradas via \`.codebuff/instructions.md\`.

---

## Conteúdo Adaptado

# Hooks

Hooks are event-driven automations that fire before or after Claude Code tool executions. They enforce code quality, catch mistakes early, and automate repetitive checks.

## How Hooks Work

```
User request → Claude picks a tool → PreToolUse hook runs → Tool executes → PostToolUse hook runs
```

- **PreToolUse** hooks run before the tool executes. They can **block** (exit code 2) or **warn** (stderr without blocking).
- **PostToolUse** hooks run after the tool completes. They can analyze output but cannot block.
- **Stop** hooks run after each Claude response.
- **SessionStart/SessionEnd** hooks run at session lifecycle boundaries.
- **PreCompact** hooks run before context compaction, useful for saving state.

## Hooks in This Plugin

Memory persistence lifecycle definitions live in `hooks/memory-persistence/`.
The executable hook graph remains `hooks/hooks.json`; the memory persistence directory is the stable contract for SessionStart, PreCompact, observation, activity tracking, and SessionEnd behavior.

## Installing These Hooks Manually

For Claude Code manual installs, do not paste the raw repo `hooks.json` into `~/.claude/settings.json` or copy it directly into `~/.claude/hooks/hooks.json`. The checked-in file is plugin/repo-oriented and is meant to be installed through the ECC installer or loaded as a plugin.

Use the installer instead so hook commands are rewritten against your actual Claude root:

```bash
bash ./install.sh --target claude --modules hooks-runtime
```

```powershell
pwsh -File .\install.ps1 --target claude --modules hooks-runtime
```

That installs resolved hooks to `~/.claude/hooks/hooks.json`. On Windows, the Claude config root is `%USERPROFILE%\\.claude`.

### PreToolUse Hooks

| Hook | Matcher | Behavior | Exit Code |
|------|---------|----------|-----------|
| **Dev server blocker** | `Bash` | Blocks `npm run dev` etc. outside tmux — ensures log access | 2 (blocks) |
| **Tmux reminder** | `Bash` | Suggests tmux for long-running commands (npm test, cargo build, docker) | 0 (warns) |
| **Git push reminder** | `Bash` | Reminds to review changes before `git push` | 0 (warns) |
| **Pre-commit quality check** | `Bash` | Runs quality checks before `git commit`: lints staged files, validates commit message format when provided via `-m/--message`, detects console.log/debugger/secrets | 2 (blocks critical) / 0 (warns) |
| **Doc file warning** | `Write` | Warns about non-standard `.md`/`.txt` files (allows README, CLAUDE, CONTRIBUTING, CHANGELOG, LICENSE, SKILL, docs/, skills/); cross-platform path handling | 0 (warns) |
| **Strategic compact** | `Edit\|Write` | Suggests manual `/compact` at logical intervals (every ~50 tool calls) | 0 (warns) |

### PostToolUse Hooks

| Hook | Matcher | What It Does |
|------|---------|-------------|
| **PR logger** | `Bash` | Logs PR URL and review command after `gh pr create` |
| **Build analysis** | `Bash` | Background analysis after build commands (async, non-blocking) |
| **Qualit

---

**ECC Original:** \`ECC/hooks/README\`
**Atualizado em:** 2026-07-02 23:02:00
