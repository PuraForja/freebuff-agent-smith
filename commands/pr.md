# ⚡ Comando: pr

> **Adaptado do ECC:** \`ECC/commands/pr.md\`

## Descrição

Create a GitHub PR from current branch with unpushed commits — discovers templates, analyzes changes, pushes

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: "Create a GitHub PR from current branch with unpushed commits — discovers templates, analyzes changes, pushes"
argument-hint: "[base-branch] (default: main)"
---

# Create Pull Request

**Input**: `$ARGUMENTS` — optional, may contain a base branch name and/or flags (e.g., `--draft`).

**Parse `$ARGUMENTS`**:
- Extract any recognized flags (`--draft`)
- Treat remaining non-flag text as the base branch name
- Default base branch to `main` if none specified

---

## Phase 1 — VALIDATE

Check preconditions:

```bash
git branch --show-current
git status --short
git log origin/<base>..HEAD --oneline
```

| Check | Condition | Action if Failed |
|---|---|---|
| Not on base branch | Current branch ≠ base | Stop: "Switch to a feature branch first." |
| Clean working directory | No uncommitted changes | Warn: "You have uncommitted changes. Commit or stash first." |
| Has commits ahead | `git log origin/<base>..HEAD` not empty | Stop: "No commits ahead of `<base>`. Nothing to PR." |
| No existing PR | `gh pr list --head <branch> --json number` is empty | Stop: "PR already exists: #<number>. Use `gh pr view <number> --web` to open it." |

If all checks pass, proceed.

---

## Phase 2 — DISCOVER

### PR Template

Search for PR template in order:

1. `.github/PULL_REQUEST_TEMPLATE/` directory — if exists, list files and let user choose (or use `default.md`)
2. `.github/PULL_REQUEST_TEMPLATE.md`
3. `.github/pull_request_template.md`
4. `docs/pull_request_template.md`

If found, read it and use its structure for the PR body.

### Commit Analysis

```bash
git log origin/<base>..HEAD --format="%h %s" --reverse
```

Analyze commits to determine:
- **PR title**: Use conventional commit format with type prefix — `feat: ...`, `fix: ...`, etc.
  - If multiple types, use the dominant one
  - If single commit, use its message as-is
- **Change summary**: Group commits by type/area

### File Analysis

```bash
git diff origin/<base>..HEAD --stat
git diff origin/<base>..HEAD --name-only
```

Categorize changed files: source, tests, docs, config, migrations.

### Planning Artifacts

Check for related artifacts produced by `/plan-prd`, `/plan`, or the legacy PRP workflow:
- `.claude/prds/` — PRDs this PR implements a milestone of
- `.claude/plans/` — Plans executed by this PR
- `.claude/PRPs/prds/` — legacy PRP PRDs
- `.claude/PRPs/plans/` — legacy PRP implementation plans
- `.claude/PRPs/reports/` — legacy PRP implementation reports

---

**ECC Original:** \`ECC/commands/pr.md\`
**Atualizado em:** 2026-07-02 23:01:59
