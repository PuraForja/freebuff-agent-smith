# 🧠 Skill: agent-eval

> **Adaptada do ECC:** `agent-eval` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/agent-eval/SKILL.md`

## Descrição

Head-to-head comparison of coding agents (Claude Code, Aider, Codex, etc.) on custom tasks with pass rate, cost, time, and consistency metrics

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

# Agent Eval Skill

A lightweight CLI tool for comparing coding agents head-to-head on reproducible tasks. Every "which coding agent is best?" comparison runs on vibes — this tool systematizes it.

## When to Activate

- Comparing coding agents (Claude Code, Aider, Codex, etc.) on your own codebase
- Measuring agent performance before adopting a new tool or model
- Running regression checks when an agent updates its model or tooling
- Producing data-backed agent selection decisions for a team

## Installation

> **Note:** Install agent-eval from its repository after reviewing the source.

## Core Concepts

### YAML Task Definitions

Define tasks declaratively. Each task specifies what to do, which files to touch, and how to judge success:

```yaml
name: add-retry-logic
description: Add exponential backoff retry to the HTTP client
repo: ./my-project
files:
  - src/http_client.py
prompt: |
  Add retry logic with exponential backoff to all HTTP requests.
  Max 3 retries. Initial delay 1s, max delay 30s.
judge:
  - type: pytest
    command: pytest tests/test_http_client.py -v
  - type: grep
    pattern: "exponential_backoff|retry"
    files: src/http_client.py
commit: "abc1234"  # pin to specific commit for reproducibility
```

### Git Worktree Isolation

Each agent run gets its own git worktree — no Docker required. This provides reproducibility isolation so agents cannot interfere with each other or corrupt the base repo.

### Metrics Collected

| Metric | What It Measures |
|--------|-----------------|
| Pass rate | Did the agent produce code that passes the judge? |
| Cost | API spend per task (when available) |
| Time | Wall-clock seconds to completion |
| Consistency | Pass rate across repeated runs (e.g., 3/3 = 100%) |

## Workflow

### 1. Define Tasks

Create a `tasks/` directory with YAML files, one per task:

```bash
mkdir tasks
# Write task definitions (see template above)
```

### 2. Run Agents

Execute agents against your tasks:

```bash
agent-eval run --task tasks/add-retry-logic.yaml --agent claude-code --agent aider --runs 3
```

Each run:
1. Creates a fresh git worktree from the specified commit
2. Hands the prompt to the agent
3. Runs the judge criteria
4. Records pass/fail, cost, and time

### 3. Compare Results

Generate a comparison report:

```bash
agent-eval report --format table
```

```
Task: add-retry-logic (3 runs each)
┌──────────────┬───────────┬────────┬────────┬─────────────┐
│ Agent        │ Pass Rate │ Cost   │ Time   │ Consistency │
├──────────────┼───────────┼────────┼────────┼─────────────┤
│ claude-code  │ 3/3       │ $0.12  │ 45s    │ 100%        │
│ aider        │ 2/3       │ $0.08  │ 38s    │  67%        │
└──────────────┴───────────┴────────┴────────┴─────────────┘
```

## Judge Types

### Code-Based (deterministic)

```yaml

---

## Referência

- **ECC Original:** `ECC/skills/agent-eval/SKILL.md`
- **Atualizado em:** 2026-07-01 11:58:49
