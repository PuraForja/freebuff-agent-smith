# 🧠 Skill: regex-vs-llm-structured-text

> **Adaptada do ECC:** `regex-vs-llm-structured-text` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/regex-vs-llm-structured-text/SKILL.md`

## Descrição

Decision framework for choosing between regex and LLM when parsing structured text — start with regex, add LLM only for low-confidence edge cases.

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

# Regex vs LLM for Structured Text Parsing

A practical decision framework for parsing structured text (quizzes, forms, invoices, documents). The key insight: regex handles 95-98% of cases cheaply and deterministically. Reserve expensive LLM calls for the remaining edge cases.

## When to Activate

- Parsing structured text with repeating patterns (questions, forms, tables)
- Deciding between regex and LLM for text extraction
- Building hybrid pipelines that combine both approaches
- Optimizing cost/accuracy tradeoffs in text processing

## Decision Framework

```
Is the text format consistent and repeating?
├── Yes (>90% follows a pattern) → Start with Regex
│   ├── Regex handles 95%+ → Done, no LLM needed
│   └── Regex handles <95% → Add LLM for edge cases only
└── No (free-form, highly variable) → Use LLM directly
```

## Architecture Pattern

```
Source Text
    │
    ▼
[Regex Parser] ─── Extracts structure (95-98% accuracy)
    │
    ▼
[Text Cleaner] ─── Removes noise (markers, page numbers, artifacts)
    │
    ▼
[Confidence Scorer] ─── Flags low-confidence extractions
    │
    ├── High confidence (≥0.95) → Direct output
    │
    └── Low confidence (<0.95) → [LLM Validator] → Output
```

## Implementation

### 1. Regex Parser (Handles the Majority)

```python
import re
from dataclasses import dataclass

@dataclass(frozen=True)
class ParsedItem:
    id: str
    text: str
    choices: tuple[str, ...]
    answer: str
    confidence: float = 1.0

def parse_structured_text(content: str) -> list[ParsedItem]:
    """Parse structured text using regex patterns."""
    pattern = re.compile(
        r"(?P<id>\d+)\.\s*(?P<text>.+?)
"
        r"(?P<choices>(?:[A-D]\..+?
)+)"
        r"Answer:\s*(?P<answer>[A-D])",
        re.MULTILINE | re.DOTALL,
    )
    items = []
    for match in pattern.finditer(content):
        choices = tuple(
            c.strip() for c in re.findall(r"[A-D]\.\s*(.+)", match.group("choices"))
        )
        items.append(ParsedItem(
            id=match.group("id"),
            text=match.group("text").strip(),
            choices=choices,
            answer=match.group("answer"),
        ))
    return items
```

### 2. Confidence Scoring

Flag items that may need LLM review:

```python
@dataclass(frozen=True)
class ConfidenceFlag:
    item_id: str
    score: float
    reasons: tuple[str, ...]

def score_confidence(item: ParsedItem) -> ConfidenceFlag:
    """Score extraction confidence and flag issues."""
    reasons = []
    score = 1.0

    if len(item.choices) < 3:
        reasons.append("few_choices")
        score -= 0.3

    if not item.answer:
        reasons.append("missing_answer")
        score -= 0.5

    if len(item.text) < 10:
        reasons.append("short_text")
        score -= 0.2

    return ConfidenceFlag(
        item_id=item.id,
        score=max(0.0, score),
        reasons=tuple(reasons),
    )

def identify_low_confidence(
    items: list[ParsedItem],
    threshold: float = 0.95,
) -> list[Confidence

---

**ECC Original:** `ECC/skills/regex-vs-llm-structured-text/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:31
