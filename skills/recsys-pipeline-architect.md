# 🧠 Skill: recsys-pipeline-architect

> **Adaptada do ECC:** `recsys-pipeline-architect` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/recsys-pipeline-architect/SKILL.md`

## Descrição

Design composable recommendation, ranking, and feed pipelines using the six-stage Source→Hydrator→Filter→Scorer→Selector→SideEffect framework popularized by xAI's open-sourced For You algorithm. Use this skill whenever the user is building any system that picks the top K items for a (user, context) — social feeds, content CMSs, RAG rerankers, task prioritizers, notification triage, search reranking, ad ranking.

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

# recsys-pipeline-architect

A spec-and-scaffold skill for building composable recommendation, ranking, and feed pipelines. It encodes the **six-stage pattern** — Source → Hydrator → Filter → Scorer → Selector → SideEffect — popularized by xAI's open-sourced [For You algorithm](https://github.com/xai-org/x-algorithm) (Apache 2.0). This skill is an independent reimplementation of the pattern (MIT) — no code copied from the original.

Upstream: <https://github.com/mturac/recsys-pipeline-architect>

## When to Use

- User wants to build any system that picks "the top K items for a user/context"
- User asks "how should I rank X" or describes a feed/personalization problem
- User has a scoring function and needs the pipeline plumbing around it
- User wants to migrate from a single relevance score to multi-action prediction with tunable weights
- User is wrapping an LLM/ML scorer and needs filters, hydrators, side-effects, and a runnable scaffold in their stack (TypeScript / Go / Python)
- Triggers: "recommendation system", "feed algorithm", "ranking pipeline", "for you feed", "candidate pipeline", "content recommender", "pipeline architecture for recsys", "RAG retrieval reranker"

## When NOT to Use

- Model architecture work (transformer design, two-tower retrieval, embedding training) — this skill is plumbing *around* the model, not the model itself
- Pure ML training pipelines — the scoring function is the user's responsibility
- Operating a deployed pipeline (monitoring, autoscaling) — out of scope

## The six-stage framework

| # | Stage | Job | Parallel? |
|---|---|---|---|
| 1 | **Source** | Fetch candidates from one or more origins | Yes — multiple sources run in parallel |
| 2 | **Hydrator** | Enrich each candidate with metadata needed for filtering and scoring | Yes — independent hydrators run in parallel |
| 3 | **Filter** | Drop candidates that should never be shown (blocked, expired, duplicate, ineligible) | Sequential — each filter sees fewer items |
| 4 | **Scorer** | Assign each surviving candidate one or more scores | Sequential — later scorers see earlier scores |
| 5 | **Selector** | Sort by final score, return top K | Single op |
| 6 | **SideEffect** | Cache served IDs, log impressions, emit events, update counters | Async — must never block the response |

### Why this exact order

- Sources before hydration: know what candidates exist before paying to enrich them
- Hydration before filtering: many filters need metadata the source did not provide
- Filtering before scoring: scoring is the expensive stage; drop the ineligible first
- Scorer chain (not single scorer): real systems compose ML scoring + diversity reranking + business rules
- Selector after scoring: keeps scoring deterministic and cacheable
- SideEffects last and async: side effects must never block the user response

## Workflow when invoked

Walk the user through these eight steps:

1. **Clarify the use case** (one round, three questions): items being ranked? input c

---

**ECC Original:** `ECC/skills/recsys-pipeline-architect/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:31
