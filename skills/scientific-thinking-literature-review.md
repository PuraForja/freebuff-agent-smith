# 🧠 Skill: scientific-thinking-literature-review

> **Adaptada do ECC:** `scientific-thinking-literature-review` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/scientific-thinking-literature-review/SKILL.md`

## Descrição

Systematic literature-review workflow for academic, biomedical, technical, and scientific topics, including search planning, source screening, synthesis, citation checks, and evidence logging.

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

# Literature Review

Use this skill when the task is to find, screen, synthesize, and cite a body of
academic or technical literature.

## When to Use

- Building a systematic, scoping, or narrative literature review.
- Synthesizing the state of the art for a research question.
- Finding gaps, contradictions, or future-work directions.
- Preparing citation-backed background sections for papers or reports.
- Comparing evidence across peer-reviewed papers, preprints, patents, and
  technical reports.

## Review Types

- **Narrative review**: broad synthesis; useful for orientation.
- **Scoping review**: maps concepts, methods, and evidence gaps.
- **Systematic review**: predefined protocol, reproducible search, explicit
  screening and exclusion.
- **Meta-analysis**: systematic review plus quantitative effect aggregation.

Ask the user which level of rigor is needed. If unspecified, default to a
scoping review for exploratory work and a systematic review for publication or
clinical claims.

## Workflow

### 1. Define the Question

Convert the prompt into a searchable research question.

For clinical or biomedical work, use PICO:

- Population
- Intervention or exposure
- Comparator
- Outcome

For technical work, use:

- system or domain
- method or intervention
- comparison baseline
- evaluation metric

### 2. Plan the Search

Create a search protocol before collecting sources:

- databases to search
- date range
- languages
- publication types
- inclusion criteria
- exclusion criteria
- exact search strings

Minimum useful database set:

- PubMed for biomedical and life-sciences literature.
- arXiv for CS, math, physics, quantitative biology, and preprints.
- Semantic Scholar or Crossref for broad academic discovery.
- Domain-specific sources when relevant, such as clinical-trial registries,
  patent databases, standards bodies, or official technical docs.

### 3. Search and Log Evidence

Keep a search log that makes the review reproducible:

```markdown
| Database | Date searched | Query | Filters | Results | Export |
| --- | --- | --- | --- | ---: | --- |
| PubMed | 2026-05-11 | `("CRISPR"[tiab] OR "Cas9"[tiab]) AND "sickle cell"[tiab]` | 2020:2026, English | 86 | PMID list |
| arXiv | 2026-05-11 | `CRISPR sickle cell gene editing` | q-bio, 2020:2026 | 9 | BibTeX |
```

Save raw IDs, URLs, DOIs, abstracts, and notes separately from the final prose.

### 4. Deduplicate

Deduplicate in this order:

1. DOI
2. PMID or arXiv ID
3. exact title
4. normalized title plus first author and year

Record how many duplicates were removed.

### 5. Screen Sources

Screen in stages:

1. title
2. abstract
3. full text

For systematic work, record exclusion reasons:

- wrong population
- wrong intervention
- wrong outcome
- not primary research
- duplicate
- unavailable full text
- outside date range

### 6. Extract Data

Use a structured extraction table:

```markdown
| Study | Design | Population/Data | Method | Comparator | Outcome | Key finding | Limitations |

---

**ECC Original:** `ECC/skills/scientific-thinking-literature-review/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:32
