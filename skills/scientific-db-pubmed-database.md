# 🧠 Skill: scientific-db-pubmed-database

> **Adaptada do ECC:** `scientific-db-pubmed-database` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/scientific-db-pubmed-database/SKILL.md`

## Descrição

Direct PubMed and NCBI E-utilities search workflows for biomedical literature, MeSH queries, PMID lookup, citation retrieval, and API-backed literature monitoring.

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

# PubMed Database

Use this skill when a task needs biomedical literature from PubMed rather than
general web search.

## When to Use

- Searching MEDLINE or life-sciences literature.
- Building PubMed queries with MeSH terms, field tags, dates, or article types.
- Looking up PMIDs, abstracts, publication metadata, or related citations.
- Running systematic-review search passes that need repeatable search strings.
- Using NCBI E-utilities directly from Python, shell, or another HTTP client.

## Query Construction

Start with the research question, split it into concepts, then combine concepts
with Boolean operators.

```text
concept_1 AND concept_2 AND filter
synonym_a OR synonym_b
NOT exclusion_term
```

Useful PubMed field tags:

- `[ti]`: title
- `[ab]`: abstract
- `[tiab]`: title or abstract
- `[au]`: author
- `[ta]`: journal title abbreviation
- `[mh]`: MeSH term
- `[majr]`: major MeSH topic
- `[pt]`: publication type
- `[dp]`: date of publication
- `[la]`: language

Examples:

```text
diabetes mellitus[mh] AND treatment[tiab] AND systematic review[pt] AND 2023:2026[dp]
(metformin[nm] OR insulin[nm]) AND diabetes mellitus, type 2[mh] AND randomized controlled trial[pt]
smith ja[au] AND cancer[tiab] AND 2026[dp] AND english[la]
```

## MeSH and Subheadings

Prefer MeSH when the concept has a stable controlled-vocabulary term. Combine
MeSH with title/abstract terms when the topic is new or terminology varies.

Correct subheading syntax puts the subheading before the field tag:

```text
diabetes mellitus, type 2/drug therapy[mh]
cardiovascular diseases/prevention & control[mh]
```

Use `[majr]` only when the topic must be central to the paper. It can improve
precision but may miss relevant work.

## Filters

Publication types:

- `clinical trial[pt]`
- `meta-analysis[pt]`
- `randomized controlled trial[pt]`
- `review[pt]`
- `systematic review[pt]`
- `guideline[pt]`

Date filters:

```text
2026[dp]
2020:2026[dp]
2026/03/15[dp]
```

Availability filters:

```text
free full text[sb]
hasabstract[text]
```

## E-utilities Workflow

NCBI E-utilities supports repeatable API workflows:

1. `esearch.fcgi`: search and return PMIDs.
2. `esummary.fcgi`: return lightweight article metadata.
3. `efetch.fcgi`: fetch abstracts or full records in XML, MEDLINE, or text.
4. `elink.fcgi`: find related articles and linked resources.

Use an email and API key for production scripts. Store API keys in environment
variables, never in committed files or command history.

```python
import os
import time
import requests

BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils"


def esearch(query: str, retmax: int = 20) -> list[str]:
    params = {
        "db": "pubmed",
        "term": query,
        "retmode": "json",
        "retmax": retmax,
        "tool": "ecc-pubmed-search",
        "email": os.environ.get("NCBI_EMAIL", ""),
    }
    api_key = os.environ.get("NCBI_API_KEY")
    if api_key:
        params["api_key"] = api_key

    response = requests.get(f"{BASE}/e

---

**ECC Original:** `ECC/skills/scientific-db-pubmed-database/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:32
