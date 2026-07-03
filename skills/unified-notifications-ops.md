# 🧠 Skill: unified-notifications-ops

> **Adaptada do ECC:** `unified-notifications-ops` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/unified-notifications-ops/SKILL.md`

## Descrição

Operate notifications as one ECC-native workflow across GitHub, Linear, desktop alerts, hooks, and connected communication surfaces. Use when the real problem is alert routing, deduplication, escalation, or inbox collapse.

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

# Unified Notifications Ops

Use this skill when the real problem is not a missing ping. The real problem is a fragmented notification system.

The job is to turn scattered events into one operator surface with:
- clear severity
- clear ownership
- clear routing
- clear follow-up action

## When to Use

- the user wants a unified notification lane across GitHub, Linear, local hooks, desktop alerts, chat, or email
- CI failures, review requests, issue updates, and operator events are arriving in disconnected places
- the current setup creates noise instead of action
- the user wants to consolidate overlapping notification branches or backlog proposals into one ECC-native lane
- the workspace already has hooks, MCPs, or connected tools, but no coherent notification policy

## Preferred Surface

Start from what already exists:
- GitHub issues, PRs, reviews, comments, and CI
- Linear issue/project movement
- local hook events and session lifecycle signals
- desktop notification primitives
- connected email/chat surfaces when they actually exist

Prefer ECC-native orchestration over telling the user to adopt a separate notification product.

## Non-Negotiable Rules

- never expose tokens, secrets, webhook secrets, or internal identifiers
- separate:
  - event source
  - severity
  - routing channel
  - operator action
- default to digest-first when interruption cost is unclear
- do not fan out every event to every channel
- if the real fix is better issue triage, hook policy, or project flow, say so explicitly

## Event Pipeline

Treat the lane as:

1. **Capture** the event
2. **Classify** urgency and owner
3. **Route** to the correct channel
4. **Collapse** duplicates and low-signal churn
5. **Attach** the next operator action

The goal is fewer, better notifications.

## Default Severity Model

| Class | Examples | Default handling |
| --- | --- | --- |
| Critical | broken default-branch CI, security issue, blocked release, failed deploy | interrupt now |
| High | review requested, failing PR, owner-blocking handoff | same-day alert |
| Medium | issue state changes, notable comments, backlog movement | digest or queue |
| Low | repeat successes, routine churn, redundant lifecycle markers | suppress or fold |

If the workspace has no severity model, build one before proposing automation.

## Workflow

### 1. Inventory the current surface

List:
- event sources
- current channels
- existing hooks/scripts that emit alerts
- duplicate paths for the same event
- silent failure cases where important things are not being surfaced

Call out what ECC already owns.

### 2. Decide what deserves interruption

For each event family, answer:
- who needs to know?
- how fast do they need to know?
- should this interrupt, batch, or just log?

Use these defaults:
- interrupt for release, CI, security, and owner-blocking events
- digest for medium-signal updates
- log-only for telemetry and low-signal lifecycle markers

### 3. Collapse duplicates before adding channel

---

**ECC Original:** `ECC/skills/unified-notifications-ops/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:34
