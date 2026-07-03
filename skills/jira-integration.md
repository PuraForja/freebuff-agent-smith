# 🧠 Skill: jira-integration

> **Adaptada do ECC:** `jira-integration` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/jira-integration/SKILL.md`

## Descrição

Use this skill when retrieving Jira tickets, analyzing requirements, updating ticket status, adding comments, or transitioning issues. Provides Jira API patterns via MCP or direct REST calls.

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

# Jira Integration Skill

Retrieve, analyze, and update Jira tickets directly from your AI coding workflow. Supports both **MCP-based** (recommended) and **direct REST API** approaches.

## When to Activate

- Fetching a Jira ticket to understand requirements
- Extracting testable acceptance criteria from a ticket
- Adding progress comments to a Jira issue
- Transitioning a ticket status (To Do → In Progress → Done)
- Linking merge requests or branches to a Jira issue
- Searching for issues by JQL query

## Prerequisites

### Option A: MCP Server (Recommended)

Install the `mcp-atlassian` MCP server. This exposes Jira tools directly to your AI agent.

**Requirements:**
- Python 3.10+
- `uvx` (from `uv`), installed via your package manager or the official `uv` installation documentation

**Add to your MCP config** (e.g., `~/.claude.json` → `mcpServers`):

```json
{
  "jira": {
    "command": "uvx",
    "args": ["mcp-atlassian==0.21.0"],
    "env": {
      "JIRA_URL": "https://YOUR_ORG.atlassian.net",
      "JIRA_EMAIL": "your.email@example.com",
      "JIRA_API_TOKEN": "your-api-token"
    },
    "description": "Jira issue tracking — search, create, update, comment, transition"
  }
}
```

> **Security:** Never hardcode secrets. Prefer setting `JIRA_URL`, `JIRA_EMAIL`, and `JIRA_API_TOKEN` in your system environment (or a secrets manager). Only use the MCP `env` block for local, uncommitted config files.

**To get a Jira API token:**
1. Go to <https://id.atlassian.com/manage-profile/security/api-tokens>
2. Click **Create API token**
3. Copy the token — store it in your environment, never in source code

### Option B: Direct REST API

If MCP is not available, use the Jira REST API v3 directly via `curl` or a helper script.

**Required environment variables:**

| Variable | Description |
|----------|-------------|
| `JIRA_URL` | Your Jira instance URL (e.g., `https://yourorg.atlassian.net`) |
| `JIRA_EMAIL` | Your Atlassian account email |
| `JIRA_API_TOKEN` | API token from id.atlassian.com |

Store these in your shell environment, secrets manager, or an untracked local env file. Do not commit them to the repo.

For direct `curl` examples, keep credentials out of command-line arguments by passing the Jira user config on stdin:

```bash
jira_curl() {
  printf 'user = "%s:%s"
' "$JIRA_EMAIL" "$JIRA_API_TOKEN" |
    curl -s -K - "$@"
}
```

## MCP Tools Reference

When the `mcp-atlassian` MCP server is configured, these tools are available:

| Tool | Purpose | Example |
|------|---------|---------|
| `jira_search` | JQL queries | `project = PROJ AND status = "In Progress"` |
| `jira_get_issue` | Fetch full issue details by key | `PROJ-1234` |
| `jira_create_issue` | Create issues (Task, Bug, Story, Epic) | New bug report |
| `jira_update_issue` | Update fields (summary, description, assignee) | Change assignee |
| `jira_transition_issue` | Change status | Move to "In Review" |
| `jira_add_comment` | Add comments | Progress update |
| `jira_get_sprint_i

---

**ECC Original:** `ECC/skills/jira-integration/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:25
