# 🧠 Skill: competitive-report-structure

> **Adaptada do ECC:** `competitive-report-structure` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/competitive-report-structure/SKILL.md`

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

# Competitive Report Structure

Use this skill to assemble scored competitor cards into a decision-grade report.
The report must answer three questions for the client: **who do we compete with,
how do we compete, and where is our defensible white-space?** Every section
earns its place by moving toward those answers — cut anything that doesn't.

## When to Activate

- All competitor profile cards from benchmark-methodology are complete and ready to assemble.
- Need to present competitive findings to a founder, leadership team, or board.
- The report must drive decisions (who to compete with, how, where the moat is) — not just document the landscape.
- Preparing a client deliverable that must be auditable and defensible.

## Client positioning brief (establish first)

Before assembling the report, establish the client's positioning brief. It
supplies:

- **Strategic tension** — the paired axes (e.g., memorability × hireability)
  that define the client's target white-space. All maps and synthesis resolve
  back to this tension.
- **Brand balance** — the intended proportional mix of the client's strategic
  emphases (e.g., 60% strategy/evidence, 25% distinctiveness, 15% craft).
  Every recommendation must be checked against this balance; flag any that
  would shift it.
- **Differentiator** — the framing principle for the executive summary and
  white-space section.
- **Target quadrant** — where the client intends to sit in the tension map;
  confirming whether that quadrant is genuinely open is the report's central
  empirical question.

## Framing principle

The whole report is organized around the client's strategic tension and
recommendations resolve back to the client's deliberate brand balance.
Recommendations that would break that balance must be flagged against it
explicitly — "this move shifts the balance from X/Y/Z toward A/B/C; confirm
intent."

## Report sections

### 1. Executive summary
3–5 takeaways, decision-first. State the most important findings in plain
language: where the client is strong, where it's exposed, who occupies its
target white-space, and the top 2–3 moves. Written so a founder/PM reads only
this and knows what to do. No methodology here.

### 2. Market landscape & category framing
Define the category and map it. Use a **multi-axis map** — at minimum a 2×2
(e.g., *brand-led <-> capability-led* × *boutique <-> enterprise-scale*), and
ideally the **client's tension plot** from `benchmark-methodology` as the
headline map. Place every profiled competitor and the client. The map should
make the client's intended position visually obvious and show how crowded (or
empty) it is.

### 3. Competitor tiers
Organize the set into **Direct / Adjacent / Aspirational** (from
`competitive-platform-analysis`). One short paragraph per tier explaining who's
in it and why it matters to the client. This sets reader expectations before
the detail.

### 4. Benchmarking matrix
The full **competitors × dimensions** table — the quantitative spine. Rows =
competitors (grouped by tier), columns = the nine benchmark dimensions (note:
dimension 9 — strategic tension — has two poles (e.g., Memorability and
Hireability for a brand-studio client; substitute the client's own paired axes);
represent them as two separate sub-columns rather than averaging them). Include
the client's own honest self-assessment as a row for contrast. Use a **heatmap**
(color or symbol scale) so strength/weakness patterns are scannable. Do **not**
add a blended total column — report dimensions separately (per the bias
controls). Call out the columns where the client leads and where it trails.

### 5. Deep dives
3–5 most instructive competitors in narrative form (from their profile cards).
Choose for instruction, not ranking: the best exemplar of the target tension
(high on both poles), the cautionary "one pole only" case, the "competent but
forgettable" archetype the client defines against, plus any direct threat. Each
deep dive: what they do, what the client should learn, what the client should
avoid.

### 6. White-space & threats
The strategic heart. Two parts:

- **White-space:** the position the client can own that rivals don't — argued
  from the maps and matrix, not asserted. Confirm whether the target quadrant
  (from the positioning brief) is genuinely open.
- **Threats:** who/what pressures the client — a rival closing the gap,
  substitutes (no-code/AI tools, in-house teams, generalist freelancers), or
  category shifts. Be honest about the client's own risks (e.g., a bold identity
  reading as un-serious to risk-averse buyers).

### 7. Strategic recommendations
Concrete, prioritized moves: who the client competes with, how it differentiates,
and where to invest (offer packaging, evidence/case studies, thought leadership,
brand sharpening). **Tie every recommendation back to the brand balance from the
positioning brief** and flag any that would shift it. Sequence by impact ×
effort.

### 8. Sources / methodology appendix

---

## Referência

- **ECC Original:** `ECC/skills/competitive-report-structure/SKILL.md`
- **Atualizado em:** 2026-07-01 11:58:49
