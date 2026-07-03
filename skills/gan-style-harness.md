# 🧠 Skill: gan-style-harness

> **Adaptada do ECC:** `gan-style-harness` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/gan-style-harness/SKILL.md`

## Descrição

GAN-inspired Generator-Evaluator agent harness for building high-quality applications autonomously. Based on Anthropic's March 2026 harness design paper.

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

# GAN-Style Harness Skill

> Inspired by [Anthropic's Harness Design for Long-Running Application Development](https://www.anthropic.com/engineering/harness-design-long-running-apps) (March 24, 2026)

A multi-agent harness that separates **generation** from **evaluation**, creating an adversarial feedback loop that drives quality far beyond what a single agent can achieve.

## Core Insight

> When asked to evaluate their own work, agents are pathological optimists — they praise mediocre output and talk themselves out of legitimate issues. But engineering a **separate evaluator** to be ruthlessly strict is far more tractable than teaching a generator to self-critique.

This is the same dynamic as GANs (Generative Adversarial Networks): the Generator produces, the Evaluator critiques, and that feedback drives the next iteration.

## When to Use

- Building complete applications from a one-line prompt
- Frontend design tasks requiring high visual quality
- Full-stack projects that need working features, not just code
- Any task where "AI slop" aesthetics are unacceptable
- Projects where you want to invest $50-200 for production-quality output

## When NOT to Use

- Quick single-file fixes (use standard `claude -p`)
- Tasks with tight budget constraints (<$10)
- Simple refactoring (use de-sloppify pattern instead)
- Tasks that are already well-specified with tests (use TDD workflow)

## Architecture

```
                    ┌─────────────┐
                    │   PLANNER   │
                    │  (Opus 4.6) │
                    └──────┬──────┘
                           │ Product Spec
                           │ (features, sprints, design direction)
                           ▼
              ┌────────────────────────┐
              │                        │
              │   GENERATOR-EVALUATOR  │
              │      FEEDBACK LOOP     │
              │                        │
              │  ┌──────────┐          │
              │  │GENERATOR │--build-->│──┐
              │  │(Opus 4.6)│          │  │
              │  └────▲─────┘          │  │
              │       │                │  │ live app
              │    feedback             │  │
              │       │                │  │
              │  ┌────┴─────┐          │  │
              │  │EVALUATOR │<-test----│──┘
              │  │(Opus 4.6)│          │
              │  │+Playwright│         │
              │  └──────────┘          │
              │                        │
              │   5-15 iterations      │
              └────────────────────────┘
```

## The Three Agents

### 1. Planner Agent

**Role:** Product manager — expands a brief prompt into a full product specification.

**Key behaviors:**
- Takes a one-line prompt and produces a 16-feature, multi-sprint specification
- Defines user stories, technical requirements, and visual design direction
- Is deliberately **ambitious** — conservative planning leads to underwhelming results
- Produces evaluation criteria that the Ev

---

**ECC Original:** `ECC/skills/gan-style-harness/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:23
