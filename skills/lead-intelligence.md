# 🧠 Skill: lead-intelligence

> **Adaptada do ECC:** `lead-intelligence` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/lead-intelligence/SKILL.md`

## Descrição

AI-native lead intelligence and outreach pipeline. Replaces Apollo, Clay, and ZoomInfo with agent-powered signal scoring, mutual ranking, warm path discovery, source-derived voice modeling, and channel-specific outreach across email, LinkedIn, and X. Use when the user wants to find, qualify, and reach high-value contacts.

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

# Lead Intelligence

Agent-powered lead intelligence pipeline that finds, scores, and reaches high-value contacts through social graph analysis and warm path discovery.

## When to Activate

- User wants to find leads or prospects in a specific industry
- Building an outreach list for partnerships, sales, or fundraising
- Researching who to reach out to and the best path to reach them
- User says "find leads", "outreach list", "who should I reach out to", "warm intros"
- Needs to score or rank a list of contacts by relevance
- Wants to map mutual connections to find warm introduction paths

## Tool Requirements

### Required
- **Exa MCP** — Deep web search for people, companies, and signals (`web_search_exa`)
- **X API** — Follower/following graph, mutual analysis, recent activity (`X_BEARER_TOKEN`, plus write-context credentials such as `X_CONSUMER_KEY`, `X_CONSUMER_SECRET`, `X_ACCESS_TOKEN`, `X_ACCESS_TOKEN_SECRET`)

### Optional (enhance results)
- **LinkedIn** — Direct API if available, otherwise browser control for search, profile inspection, and drafting
- **Apollo/Clay API** — For enrichment cross-reference if user has access
- **GitHub MCP** — For developer-centric lead qualification
- **Apple Mail / Mail.app** — Draft cold or warm email without sending automatically
- **Browser control** — For LinkedIn and X when API coverage is missing or constrained

## Pipeline Overview

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│ 1. Signal   │────>│ 2. Mutual    │────>│ 3. Warm Path    │────>│ 4. Enrich    │────>│ 5. Outreach     │
│    Scoring  │     │    Ranking   │     │    Discovery    │     │              │     │    Draft        │
└─────────────┘     └──────────────┘     └─────────────────┘     └──────────────┘     └─────────────────┘
```

## Voice Before Outreach

Do not draft outbound from generic sales copy.

Run `brand-voice` first whenever the user's voice matters. Reuse its `VOICE PROFILE` instead of re-deriving style ad hoc inside this skill.

If live X access is available, pull recent original posts before drafting. If not, use supplied examples or the best repo/site material available.

## Stage 1: Signal Scoring

Search for high-signal people in target verticals. Assign a weight to each based on:

| Signal | Weight | Source |
|--------|--------|--------|
| Role/title alignment | 30% | Exa, LinkedIn |
| Industry match | 25% | Exa company search |
| Recent activity on topic | 20% | X API search, Exa |
| Follower count / influence | 10% | X API |
| Location proximity | 10% | Exa, LinkedIn |
| Engagement with your content | 5% | X API interactions |

### Signal Search Approach

```python
# Step 1: Define target parameters
target_verticals = ["prediction markets", "AI tooling", "developer tools"]
target_roles = ["founder", "CEO", "CTO", "VP Engineering", "investor", "partner"]
target_locations = ["San Francisco", "New York", "London", "remote"]

# Step 2: Exa deep search fo

---

**ECC Original:** `ECC/skills/lead-intelligence/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:27
