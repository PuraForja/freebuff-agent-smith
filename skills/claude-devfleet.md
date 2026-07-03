# 🧠 Skill: claude-devfleet

> **Adaptada do ECC:** `claude-devfleet` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/claude-devfleet/SKILL.md`

## Descrição

Orchestrate multi-agent coding tasks via Claude DevFleet — plan projects, dispatch parallel agents in isolated worktrees, monitor progress, and read structured reports.

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

# Claude DevFleet Multi-Agent Orchestration

## When to Use

Use this skill when you need to dispatch multiple Claude Code agents to work on coding tasks in parallel. Each agent runs in an isolated git worktree with full tooling.

## Setup

The DevFleet server is a separate project, not bundled with ECC. Install and
run it from its repository first: <https://github.com/LEC-AI/claude-devfleet>

Then connect the running instance via MCP:
```bash
claude mcp add devfleet --transport http http://localhost:18801/mcp
```

Before first use, verify the process listening on port 18801 is the DevFleet
binary you installed (see SECURITY.md on localhost MCP servers).

## How It Works

```
User → "Build a REST API with auth and tests"
  ↓
plan_project(prompt) → project_id + mission DAG
  ↓
Show plan to user → get approval
  ↓
dispatch_mission(M1) → Agent 1 spawns in worktree
  ↓
M1 completes → auto-merge → auto-dispatch M2 (depends_on M1)
  ↓
M2 completes → auto-merge
  ↓
get_report(M2) → files_changed, what_done, errors, next_steps
  ↓
Report back to user
```

### Tools

| Tool | Purpose |
|------|---------|
| `plan_project(prompt)` | AI breaks a description into a project with chained missions |
| `create_project(name, path?, description?)` | Create a project manually, returns `project_id` |
| `create_mission(project_id, title, prompt, depends_on?, auto_dispatch?)` | Add a mission. `depends_on` is a list of mission ID strings (e.g., `["abc-123"]`). Set `auto_dispatch=true` to auto-start when deps are met. |
| `dispatch_mission(mission_id, model?, max_turns?)` | Start an agent on a mission |
| `cancel_mission(mission_id)` | Stop a running agent |
| `wait_for_mission(mission_id, timeout_seconds?)` | Block until a mission completes (see note below) |
| `get_mission_status(mission_id)` | Check mission progress without blocking |
| `get_report(mission_id)` | Read structured report (files changed, tested, errors, next steps) |
| `get_dashboard()` | System overview: running agents, stats, recent activity |
| `list_projects()` | Browse all projects |
| `list_missions(project_id, status?)` | List missions in a project |

> **Note on `wait_for_mission`:** This blocks the conversation for up to `timeout_seconds` (default 600). For long-running missions, prefer polling with `get_mission_status` every 30–60 seconds instead, so the user sees progress updates.

### Workflow: Plan → Dispatch → Monitor → Report

1. **Plan**: Call `plan_project(prompt="...")` → returns `project_id` + list of missions with `depends_on` chains and `auto_dispatch=true`.
2. **Show plan**: Present mission titles, types, and dependency chain to the user.
3. **Dispatch**: Call `dispatch_mission(mission_id=<first_mission_id>)` on the root mission (empty `depends_on`). Remaining missions auto-dispatch as their dependencies complete (because `plan_project` sets `auto_dispatch=true` on them).
4. **Monitor**: Call `get_mission_status(mission_id=...)` or `get_dashboard()` to check progress.
5. **Report**:

---

**ECC Original:** `ECC/skills/claude-devfleet/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:20
