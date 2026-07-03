# ⚡ Comando: marketing-campaign

> **Adaptado do ECC:** \`ECC/commands/marketing-campaign.md\`

## Descrição

Plan and execute a full marketing campaign. Accepts a product brief and returns positioning, landing page copy, email sequence, social posts, ad variants, video scripts, and a content calendar. Can also review existing copy for conversion quality.

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: Plan and execute a full marketing campaign. Accepts a product brief and returns positioning, landing page copy, email sequence, social posts, ad variants, video scripts, and a content calendar. Can also review existing copy for conversion quality.
allowed_tools: ["Read", "Grep", "Glob", "WebSearch", "WebFetch", "Write"]
---

# /marketing-campaign

Plan and execute a marketing campaign from brief to full content suite.

## Usage

```
/marketing-campaign                          # Prompt for brief interactively
/marketing-campaign [product brief]          # Full campaign from inline brief
/marketing-campaign copy [type]              # Single deliverable only
/marketing-campaign review [file-or-brief]   # Copy audit for conversion and brand consistency
```

## What It Does

1. **Research** — Profiles the target audience and maps competitors before writing anything
2. **Positioning** — Locks the campaign angle and tone profile first
3. **Copy production** — Generates the full content suite in the right order (landing page → emails → social → ads → video scripts → calendar)
4. **Review** — Gates all output through a conversion and brand consistency checklist

## Modes

### Full Campaign Mode

Provide a product brief containing:
- Product name and description
- Target audience (specific, not generic)
- Core problem the product solves
- Core benefit / outcome
- Tone guidance
- Channels required
- Launch goal or timeline

The agent returns all campaign deliverables in order, with a copy review summary at the end.

### Single Deliverable Mode

```
/marketing-campaign copy landing-page
/marketing-campaign copy email-sequence
/marketing-campaign copy social-posts
/marketing-campaign copy ads
/marketing-campaign copy video-scripts
```

Requires positioning to be defined first. Run full mode or provide the angle before requesting a single deliverable.

### Copy Review Mode

```
/marketing-campaign review path/to/copy.md
/marketing-campaign review "paste copy here"
```

Returns a structured audit against:
- 5-second clarity test (above-fold copy)
- CTA quality (specific, earned, one per piece)
- Brand tone consistency
- Claim specificity and supportability
- Platform-native fit
- Cross-channel consistency

## Brief Template

```markdown
Product: [name]
Description: [1-3 sentences on what it does]
Audience: [who, specifically]
Problem: [the specific pain the product solves]
Benefit: [the outcome the user gets]
Tone: [adjectives + what to avoid]
Channels: [landing page, email, LinkedIn, X, ads, video]
Goal: [launch, waitlist, signups, awareness — and timeline]
```

---

**ECC Original:** \`ECC/commands/marketing-campaign.md\`
**Atualizado em:** 2026-07-02 23:01:58
