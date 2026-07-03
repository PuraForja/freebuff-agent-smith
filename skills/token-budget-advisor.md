# 🧠 Skill: token-budget-advisor

> **Adaptada do ECC:** `token-budget-advisor` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/token-budget-advisor/SKILL.md`

## Descrição

>-

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

# Token Budget Advisor (TBA)

Intercept the response flow to offer the user a choice about response depth **before** Claude answers.

## When to Use

- User wants to control how long or detailed a response is
- User mentions tokens, budget, depth, or response length
- User says "short version", "tldr", "brief", "al 25%", "exhaustive", etc.
- Any time the user wants to choose depth/detail level upfront

**Do not trigger** when: user already set a level this session (maintain it silently), or the answer is trivially one line.

## How It Works

### Step 1 — Estimate input tokens

Use the repository's canonical context-budget heuristics to estimate the prompt's token count mentally.

Use the same calibration guidance as [context-budget](../context-budget/SKILL.md):

- prose: `words × 1.3`
- code-heavy or mixed/code blocks: `chars / 4`

For mixed content, use the dominant content type and keep the estimate heuristic.

### Step 2 — Estimate response size by complexity

Classify the prompt, then apply the multiplier range to get the full response window:

| Complexity   | Multiplier range | Example prompts                                      |
|--------------|------------------|------------------------------------------------------|
| Simple       | 3× – 8×          | "What is X?", yes/no, single fact                   |
| Medium       | 8× – 20×         | "How does X work?"                                  |
| Medium-High  | 10× – 25×        | Code request with context                           |
| Complex      | 15× – 40×        | Multi-part analysis, comparisons, architecture      |
| Creative     | 10× – 30×        | Stories, essays, narrative writing                  |

Response window = `input_tokens × mult_min` to `input_tokens × mult_max` (but don’t exceed your model’s configured output-token limit).

### Step 3 — Present depth options

Present this block **before** answering, using the actual estimated numbers:

```
Analyzing your prompt...

Input: ~[N] tokens  |  Type: [type]  |  Complexity: [level]  |  Language: [lang]

Choose your depth level:

[1] Essential   (25%)  ->  ~[tokens]   Direct answer only, no preamble
[2] Moderate    (50%)  ->  ~[tokens]   Answer + context + 1 example
[3] Detailed    (75%)  ->  ~[tokens]   Full answer with alternatives
[4] Exhaustive (100%)  ->  ~[tokens]   Everything, no limits

Which level? (1-4 or say "25% depth", "50% depth", "75% depth", "100% depth")

Precision: heuristic estimate ~85-90% accuracy (±15%).
```

Level token estimates (within the response window):
- 25%  → `min + (max - min) × 0.25`
- 50%  → `min + (max - min) × 0.50`
- 75%  → `min + (max - min) × 0.75`
- 100% → `max`

### Step 4 — Respond at the chosen level

| Level            | Target length       | Include                                             | Omit                                              |
|------------------|---------------------|-----------------------------------------------------|-----------------------------------------

---

**ECC Original:** `ECC/skills/token-budget-advisor/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:34
