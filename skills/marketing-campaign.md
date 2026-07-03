# 🧠 Skill: marketing-campaign

> **Adaptada do ECC:** `marketing-campaign` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/marketing-campaign/SKILL.md`

## Descrição

End-to-end marketing campaign planning and execution. Covers audience research, positioning, campaign angle definition, landing page copy, email sequences, social posts, ad copy, short-form video scripts, and content calendars. Use as the orchestration layer for multi-channel product launches.

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

# Marketing Campaign

Plan and execute launch campaigns that convert — not just campaigns that ship.

## When to Activate

- planning a product or feature launch
- building a full content suite from a single product brief
- defining positioning and campaign angle before writing any copy
- orchestrating multiple content types across channels
- reviewing copy for conversion quality and brand consistency

## Non-Negotiables

1. Define positioning before writing any copy. All copy flows from the angle.
2. Research the audience before assuming you know their language or fears.
3. Each deliverable must serve one clear purpose in the campaign arc.
4. Specificity beats adjectives in every format and on every channel.
5. The same voice must run across every channel and every piece.
6. No copy ships without passing the quality gate.

## Campaign Workflow

### Phase 1: Research

Use `market-research` to:
- profile the target audience (jobs-to-be-done, fears, language, alternatives they use)
- map 3+ direct or adjacent competitors (positioning, gaps, messaging weaknesses)
- identify 1–3 audience insights the campaign angle will exploit

Deliverable: a short research brief (audience profile + competitive summary + key insights).

### Phase 2: Positioning

Produce:
- core benefit statement (one sentence, no feature list, no jargon)
- positioning formula: "[Product] helps [audience] [achieve outcome] by [mechanism]"
- campaign angle: the specific tension, insight, or moment the whole campaign lives in
- tone profile: lock before writing (delegate to `brand-voice` for durable, session-reusable voice capture)

Do not write any copy until positioning and angle are approved.

### Phase 3: Content Production

Produce in this order — each layer informs the next:

1. **Landing page copy** (all sections: hero, problem, solution, features, how it works, proof, CTA)
2. **Email sequence** (each email has one purpose; follow the arc: problem → education → agitation → solution → proof → urgency → final CTA)
3. **Social posts** (platform-native via `content-engine`; LinkedIn and X are different formats, not the same copy resized)
4. **Short-form video scripts** (timestamp-blocked; written for screen and ear, not the page)
5. **Ad copy variants** (3–4 variants testing different angles or audience segments)
6. **Content calendar** (day-by-day schedule with channel, type, timing, and dependencies)

### Phase 4: Review

Gate every deliverable:
- 5-second test on all hero / above-fold copy (clear who it's for, what it does, why act now)
- CTA audit (one per piece, specific, earned — not demanded)
- Tone consistency check across all channels
- Claim audit (every claim is specific and supportable)
- Cross-channel consistency (ad claims match landing page; email body matches subject)

## Output Contract

A full campaign delivers:

1. **Positioning brief** — angle, core benefit statement, tone profile
2. **Landing page copy** — hero, problem, solution, features, how it works, proof, 

---

**ECC Original:** `ECC/skills/marketing-campaign/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:27
