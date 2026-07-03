# 🧠 Skill: agentic-os

> **Adaptada do ECC:** `agentic-os` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/agentic-os/SKILL.md`

## Descrição

Build persistent multi-agent operating systems on Claude Code. Covers kernel architecture, specialist agents, slash commands, file-based memory, scheduled automation, and state management without external databases.

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

# Agentic OS

Treat Claude Code as a persistent runtime / operating system rather than a chat session. This skill codifies the architecture used by production agentic setups: a kernel config that routes tasks to specialist agents, persistent file-based memory, scheduled automation, and a JSON/markdown data layer.

## When to Activate

- Building a multi-agent workflow inside Claude Code
- Setting up persistent Claude Code automation that survives session restarts
- Creating a "personal OS" or "agentic OS" for recurring tasks
- User says "agentic OS", "personal OS", "multi-agent", "agent coordinator", "persistent agent"
- Structuring long-running projects where context must survive across sessions

## Architecture Overview

The Agentic OS has four layers. Each layer is a directory in your project root.

```
project-root/
├── CLAUDE.md          # Kernel: identity, routing rules, agent registry
├── agents/            # Specialist agent definitions (markdown prompts)
├── .claude/commands/  # Slash commands: user-facing CLI
├── scripts/           # Daemon scripts: scheduled or event-driven tasks
└── data/              # State: JSON/markdown filesystem, no external DB
```

### Layer Responsibilities

| Layer | Purpose | Persistence |
|---|---|---|
| Kernel (`CLAUDE.md`) | Identity, routing, model policies, agent registry | Git-tracked |
| Agents (`agents/`) | Specialist identities with scoped tools and memory | Git-tracked |
| Commands (`.claude/commands/`) | User-facing slash commands (`/daily-sync`, `/outreach`) | Git-tracked |
| Scripts (`scripts/`) | Python/JS daemons triggered by cron or webhooks | Git-tracked |
| State (`data/`) | Append-only logs, project state, decision records | Git-ignored or tracked |

## The Kernel

`CLAUDE.md` is the kernel. It acts as the COO / orchestrator. Claude reads it at session start and uses it to route work.

### Kernel Structure

```markdown
# CLAUDE.md - Agentic OS Kernel

## Identity
You are the COO of [project-name]. You route tasks to specialist agents.
You never write code directly. You delegate to the right agent and synthesize results.

## Agent Registry

| Agent | Role | Trigger |
|---|---|---|
| @dev | Code, architecture, debugging | User says "build", "fix", "refactor" |
| @writer | Documentation, content, emails | User says "write", "draft", "blog" |
| @researcher | Research, analysis, fact-checking | User says "research", "analyze", "compare" |
| @ops | DevOps, deployment, infrastructure | User says "deploy", "CI", "server" |

## Routing Rules
1. Parse the user request for intent keywords
2. Match to the Agent Registry trigger column
3. Load the corresponding agent file from `agents/<name>.md`
4. Hand off execution with full context
5. Synthesize and present the result back to the user

## Model Policies
- Default model: use the repository or harness default.
- @dev tasks: prefer a higher-reasoning model for complex architecture.
- @researcher tasks: use the configured research-capable model and appr

---

**ECC Original:** `ECC/skills/agentic-os/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:19
