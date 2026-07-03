# 🧠 Skill: benchmark-methodology

> **Adaptada do ECC:** `benchmark-methodology` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/benchmark-methodology/SKILL.md`

## Descrição

>-

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

# Benchmark Methodology

Use this skill to turn a scoped competitor set into **comparable, defensible
scores**. Each competitor is assessed on the same nine dimensions, with
explicit 1–5 rubrics, then captured in a uniform profile card. Consistency is
the point: scores are only useful if the same evidence would earn the same
number for any competitor.

## When to Activate

- A scoped, tiered competitor set from competitive-platform-analysis is ready to score.
- Need comparable, evidence-anchored scores across competitors — not gut-feel rankings.
- Client's strategic tension (the paired axes defining their target white-space) has been established.
- Preparing to produce profile cards for assembly in competitive-report-structure.

## Client positioning brief (establish first)

Before scoring, establish the client's positioning brief. It supplies:

- **Strategic tension** — the two axes (e.g., memorability × hireability) whose
  intersection marks the client's target white-space. Dimension 9 is always
  the client's named tension; report both poles separately, never averaged.
- **Differentiator** — what makes the client's moat. This informs which
  dimensions matter most for the client's positioning argument.
- **Brand balance** — the intended mix of distinct strategic emphases. Strategic
  recommendations must not break this balance without flagging it.

## Why these dimensions

The client competes on a **specific tension held across two poles**, not on
service breadth. The dimensions are weighted to reflect that moat. Two
dimensions — the tension poles — are scored **separately and never averaged
together**, because the client's strategic question is precisely whether a rival
achieves both simultaneously.

## The nine dimensions (with weights)

Weights guide synthesis emphasis, not a single blended score (avoid a false
composite — see Bias controls). Sum = 100%.

1. **Positioning clarity & distinctiveness** (18%) — Is the studio's position
   sharp, ownable, and instantly legible? Or generic?
2. **Brand voice / verbal distinctiveness** (15%) — Does the copy have an
   ownable register, or is it interchangeable agency-speak?
3. **Visual identity & site craft** (15%) — Quality and ownership of the visual
   system; site as proof-of-craft.
4. **Service offer & packaging** (12%) — Productized and legible (named
   sprints/audits) vs vague. Packaging maturity.
5. **Evidence & credibility** (12%) — Named clients, quantified outcomes,
   case-study depth. Proof beyond assertion.
6. **Enterprise-readiness / commercial maturity** (10%) — Signals they can land
   and hold SaaS/fintech/B2B/enterprise work (process, logos, scale, contracts).
7. **Thought leadership / content presence** (8%) — Owned POV: writing, talks,
   newsletters, frameworks. Depth over volume.
8. **Pricing transparency & engagement model** (5%) — Is pricing/engagement
   legible? Productized vs bespoke vs opaque.
9. **[Client's strategic tension]** (5% as a flag; **score BOTH poles,
   report separately**) — Read the tension name and axis descriptions from the
   client's positioning brief. Plot both; the gap is the insight. The client's
   target quadrant is the single most important finding: who else is already
   there?

## Scoring rubric (1–5, applies to dimensions 1–8)

Anchor every score to observable evidence. Generic descriptors below; adapt the
specifics per dimension but keep the level meaning constant.

- **1 — Absent / generic.** No discernible position or craft; indistinguishable
  from a template. Active liability.
- **2 — Below par.** Some intent but inconsistent, derivative, or unconvincing.
  Wouldn't survive a side-by-side.
- **3 — Competent / table-stakes.** Solid, professional, unremarkable. Meets
  expectation, ownable by nobody.
- **4 — Strong / distinctive.** Clearly above peers; a real strength a buyer
  would notice and cite.
- **5 — Category-defining.** Best-in-class, ownable, hard to imitate. Sets the
  bar others react to.

### Tension axes (dimension 9) — score each 1–5

Read the axis labels and their 1/3/5 anchors from the client's positioning
brief. Example anchors for a memorability × credibility tension:

- **Memorability** — 1: forgotten instantly · 3: recognizable in context ·
  5: unforgettable, talked-about, distinctively owned.
- **Credibility** — 1: feels risky/amateur · 3: safe, competent,
  unexciting · 5: enterprise-trusted, obvious safe choice.

Plot competitors on the tension 2×2. The client's target quadrant is named in
the positioning brief. Who else occupies that quadrant is the single most
important finding of the benchmark.

## How to collect the data

For each competitor, work the dimensions in this order (cheapest signal first):

1. **Competitor's own site** — positioning, voice, offer packaging, pricing
   posture, named clients, manifesto/POV. Screenshot the homepage + one case
   study.
2. **Case studies / work** — evidence depth, quantified outcomes, client names.

---

## Referência

- **ECC Original:** `ECC/skills/benchmark-methodology/SKILL.md`
- **Atualizado em:** 2026-07-01 11:58:49
