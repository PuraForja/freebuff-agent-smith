# 🧠 Skill: taste

> **Adaptada do ECC:** `taste` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/taste/SKILL.md`

## Descrição

A creative-direction (taste) layer for music videos and short-form edits in the angelcore / cloud-trance / hyperpop visual family. Distills a named-genre aesthetic vocabulary, a mood + color + light system, and a beat-synced editing grammar, then chains ECC's video skills (video-editing, fal-ai-media, remotion-video-creation, motion-*, content-engine) into one production pipeline. Use when the work is not just making a video function but making it feel intentional, when building a music video, a fancam/edit, a moodboard-driven reel, or when choosing a coherent visual direction for AI-generated b-roll.

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

# Taste

Most AI video advice stops at *how to render frames*. This skill is the layer above
that: **what the frames should look like, in what order, cut to what rhythm, so the
result reads as one intentional thing instead of a pile of generations.**

It encodes a specific taste — the **angelcore / cloud-trance / hyperpop** family
(Bladee "Silver Surfer"-era ethereal trance crossed with heavy angelcore) — distilled
from a corpus of saved Reels and a tour through a ~70-entry visual-genre library. It
is opinionated on purpose. Taste is a point of view, not a menu.

> The companion file `references/genre-taxonomy.md` holds the full named-genre catalog.
> This file is the actionable layer: mood, grammar, pipeline, and a beat-mapped shot plan.

## When to Activate

- Building a **music video**, lyric video, fancam, or visualizer.
- Making a short-form **edit / reel** where the *feel* matters more than the information.
- Driving **AI b-roll generation** (fal.ai, Veo, Kling, etc.) and the prompts need a
  coherent direction instead of one-off vibes.
- Assembling a **moodboard** or choosing a visual genre before any rendering.
- The user says "taste", "make it feel like X", "give it a direction", "angelcore",
  "cloud trance", "hyperpop edit", "Bladee", "dreamcore", or names a saved reference.
- The current edit works but reads as flat, generic, AI-slop, or stylistically incoherent.

This skill sits **on top of** `video-editing` (the mechanics) and `remotion-video-creation`
(the renderer). Use those for *how*. Use this for *what and why*.

## Core Thesis

1. **Taste is the last layer, and it must be decided first.** `video-editing` correctly
   says taste is the final human pass. The trap: if you only decide taste at the end, every
   generation and cut upstream was a guess. Pick the direction *before* the first prompt,
   then let it constrain everything.
2. **Coherence beats novelty.** One look executed across 30 shots beats 30 looks. A named
   genre (below) is a constraint that buys coherence for free.
3. **Cut to the song, not to the footage.** In a music video the timeline is the waveform.
   Every hard cut lands on a beat or a transient. Frame math is in the pipeline section.
4. **Generate selectively, edit ruthlessly.** AI makes b-roll that does not exist; it does
   not make taste. You still throw away 80%.

## The Aesthetic Vocabulary (distilled)

The reference corpus tours a large library of *named* visual genres. The full list lives in
`references/genre-taxonomy.md`. The useful move is not memorizing 70 names — it is seeing
that **a genre name is a complete prompt-and-grade preset.** When you pick one, you inherit
its palette, texture, lighting, and subject matter as a unit.

The genres cluster into families. Pick a **primary** family and at most **one accent**:

| Family | Genres in it | Reads as |
|--------|-------------|----------|
| **Ethereal / divine** | spiritualism, glacial folk, beacons, zen core, fairy tale | weightless, holy, glowi

---

**ECC Original:** `ECC/skills/taste/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:33
