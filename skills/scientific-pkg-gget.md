# 🧠 Skill: scientific-pkg-gget

> **Adaptada do ECC:** `scientific-pkg-gget` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/scientific-pkg-gget/SKILL.md`

## Descrição

gget CLI and Python workflow for quick genomic database queries, sequence lookup, BLAST-style searches, enrichment checks, and reproducible bioinformatics evidence logs.

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

# gget

Use this skill when a task needs quick bioinformatics lookup across genomic
reference databases with the `gget` CLI or Python package.

## When to Use

- Finding Ensembl IDs, gene metadata, transcript details, or sequences.
- Running quick BLAST or BLAT lookups without building a full local pipeline.
- Fetching reference genome links and annotations from Ensembl.
- Querying protein structure, pathway, cancer, expression, or disease-association
  modules through a single interface.
- Creating a reproducible first-pass evidence log before moving to heavier
  tools such as Biopython, Snakemake, Nextflow, BLAST+, or database-specific
  clients.

Use a dedicated workflow instead of `gget` when the task requires regulated
clinical interpretation, high-throughput production pipelines, or fine-grained
control over database versions and local indexes.

## Installation

Use a clean Python environment.

```bash
python -m venv .venv
. .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install --upgrade gget
gget --help
```

If `uv` is available:

```bash
uv venv
. .venv/bin/activate
uv pip install gget
```

Before relying on an older environment, upgrade `gget` and re-check the module
docs. The upstream databases queried by `gget` change over time.

## Basic Patterns

CLI shape:

```bash
gget <module> [arguments] [options]
```

Python shape:

```python
import gget

result = gget.search(["BRCA1"], species="human")
print(result)
```

Common workflow:

1. Identify the species, assembly, gene ID type, and database needed.
2. Check the current module documentation for arguments.
3. Run a small query first.
4. Save output with an explicit filename and date.
5. Record module name, version, arguments, and database assumptions.

## Common Modules

Use current upstream docs for exact arguments. These modules are common first
choices:

- `gget search`: find Ensembl IDs from search terms.
- `gget info`: retrieve metadata for Ensembl, UniProt, or related IDs.
- `gget seq`: fetch nucleotide or amino-acid sequences.
- `gget ref`: retrieve reference genome download links.
- `gget blast`: run a quick BLAST query.
- `gget blat`: locate a sequence against supported genome assemblies.
- `gget muscle`: run multiple sequence alignment.
- `gget diamond`: run local sequence alignment against reference sequences.
- `gget alphafold` and `gget pdb`: inspect protein-structure references.
- `gget enrichr`, `gget opentargets`, `gget archs4`, `gget bgee`, `gget cbio`,
  and `gget cosmic`: explore enrichment, target, expression, cancer, and disease
  association data.

Do not assume every module supports every Python version or dependency set.
Some optional scientific dependencies have narrower version support than the
core package.

## Quick Examples

Find genes:

```bash
gget search -s human brca1 dna repair -o brca1-search.json
```

Fetch gene metadata:

```bash
gget info ENSG00000012048 -o brca1-info.json
```

Fetch a sequence:

```bash
gget seq ENSG0000001204

---

**ECC Original:** `ECC/skills/scientific-pkg-gget/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:32
