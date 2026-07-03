# 🧠 Skill: scientific-db-uspto-database

> **Adaptada do ECC:** `scientific-db-uspto-database` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/scientific-db-uspto-database/SKILL.md`

## Descrição

USPTO patent and trademark data workflow for official record lookup, PatentSearch queries, TSDR checks, assignment data, and reproducible IP research logs.

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

# USPTO Database

Use this skill when a task needs official United States patent or trademark
records from USPTO systems.

## When to Use

- Searching granted patents or pre-grant publications.
- Checking patent application status, file-wrapper data, assignments, or
  public prosecution history.
- Looking up trademark status, documents, or assignment history.
- Building reproducible prior-art, portfolio, or IP landscape research logs.
- Comparing USPTO records with secondary tools such as Google Patents,
  Lens.org, Semantic Scholar, or company patent pages.

Do not use this skill to give legal advice. Treat it as a data-gathering and
record-verification workflow.

## Source Selection

Prefer official USPTO or USPTO-supported surfaces first:

- Open Data Portal (ODP): current home for migrated USPTO datasets and APIs.
- Patent File Wrapper: public patent application bibliographic data and file
  wrapper records.
- PatentSearch API: PatentsView search API for granted patents and pre-grant
  publication datasets.
- TSDR Data API: trademark status and document retrieval.
- Patent and Trademark Assignment Search: ownership transfer records.
- PTAB data in ODP: Patent Trial and Appeal Board proceedings.

Use secondary sources only as convenience indexes. When the answer matters,
cross-check the official record.

## Authentication and Secrets

Many USPTO API flows require an API key. Store keys in environment variables or
a secret manager, never in committed files or pasted transcripts.

Common environment names:

```bash
export USPTO_API_KEY="..."
export PATENTSVIEW_API_KEY="..."
```

For PatentSearch, send the key with the `X-Api-Key` header. For TSDR, follow
the current USPTO API Manager instructions and rate-limit guidance.

## PatentSearch Workflow

Use PatentSearch for broad patent and pre-grant publication search when the
question is about trends, inventors, assignees, classifications, dates, or
portfolio slices.

Workflow:

1. Identify the endpoint from the current PatentSearch reference or Swagger UI.
2. Build a JSON query with explicit filters.
3. Request only the fields needed for the analysis.
4. Sort and paginate deterministically.
5. Record the endpoint, query body, date, data currency note, and result count.

Python request skeleton:

```python
import os
import requests

API_KEY = os.environ["PATENTSVIEW_API_KEY"]
BASE = "https://search.patentsview.org/api/v1"

payload = {
    "q": {
        "_and": [
            {"patent_date": {"_gte": "2024-01-01"}},
            {"assignees.assignee_organization": {"_text_any": ["Google", "Alphabet"]}},
        ]
    },
    "f": ["patent_id", "patent_title", "patent_date"],
    "s": [{"patent_date": "desc"}],
    "o": {"per_page": 100, "page": 1},
}

response = requests.post(
    f"{BASE}/patent/",
    headers={"X-Api-Key": API_KEY, "Content-Type": "application/json"},
    json=payload,
    timeout=30,
)
response.raise_for_status()
print(response.json())
```

Before reusing a query, verify current end

---

**ECC Original:** `ECC/skills/scientific-db-uspto-database/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:32
