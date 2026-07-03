# ⚡ Comando: jira

> **Adaptado do ECC:** \`ECC/commands/jira.md\`

## Descrição

Retrieve a Jira ticket, analyze requirements, update status, or add comments. Uses the jira-integration skill and MCP or REST API.

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: Retrieve a Jira ticket, analyze requirements, update status, or add comments. Uses the jira-integration skill and MCP or REST API.
---

# Jira Command

Interact with Jira tickets directly from your workflow — fetch tickets, analyze requirements, add comments, and transition status.

## Usage

```
/jira get <TICKET-KEY>          # Fetch and analyze a ticket
/jira comment <TICKET-KEY>      # Add a progress comment
/jira transition <TICKET-KEY>   # Change ticket status
/jira search <JQL>              # Search issues with JQL
```

## What This Command Does

1. **Get & Analyze** — Fetch a Jira ticket and extract requirements, acceptance criteria, test scenarios, and dependencies
2. **Comment** — Add structured progress updates to a ticket
3. **Transition** — Move a ticket through workflow states (To Do → In Progress → Done)
4. **Search** — Find issues using JQL queries

## How It Works

### `/jira get <TICKET-KEY>`

1. Fetch the ticket from Jira (via MCP `jira_get_issue` or REST API)
2. Extract all fields: summary, description, acceptance criteria, priority, labels, linked issues
3. Optionally fetch comments for additional context
4. Produce a structured analysis:

```
Ticket: PROJ-1234
Summary: [title]
Status: [status]
Priority: [priority]
Type: [Story/Bug/Task]

Requirements:
1. [extracted requirement]
2. [extracted requirement]

Acceptance Criteria:
- [ ] [criterion from ticket]

Test Scenarios:
- Happy Path: [description]
- Error Case: [description]
- Edge Case: [description]

Dependencies:
- [linked issues, APIs, services]

Recommended Next Steps:
- /plan to create implementation plan
- `tdd-workflow` skill to implement with tests first
```

### `/jira comment <TICKET-KEY>`

1. Summarize current session progress (what was built, tested, committed)
2. Format as a structured comment
3. Post to the Jira ticket

### `/jira transition <TICKET-KEY>`

1. Fetch available transitions for the ticket
2. Show options to user
3. Execute the selected transition

### `/jira search <JQL>`

1. Execute the JQL query against Jira
2. Return a summary table of matching issues

## Prerequisites

This command requires Jira credentials. Choose one:

---

**ECC Original:** \`ECC/commands/jira.md\`
**Atualizado em:** 2026-07-02 23:01:58
