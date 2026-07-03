# ⚡ Comando: review-pr

> **Adaptado do ECC:** \`ECC/commands/review-pr.md\`

## Descrição

Comprehensive PR review using specialized agents

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: Comprehensive PR review using specialized agents
---

Run a comprehensive multi-perspective review of a pull request.

## Usage

`/review-pr [PR-number-or-URL] [--focus=comments|tests|errors|types|code|simplify]`

If no PR is specified, review the current branch's PR. If no focus is specified, run the full review stack.

## Steps

1. Identify the PR:
   - use `gh pr view` to get PR details, changed files, and diff
2. Find project guidance:
   - look for `CLAUDE.md`, lint config, TypeScript config, repo conventions
3. Run specialized review agents:
   - `code-reviewer`
   - `comment-analyzer`
   - `pr-test-analyzer`
   - `silent-failure-hunter`
   - `type-design-analyzer`
   - `code-simplifier`
4. Aggregate results:
   - dedupe overlapping findings
   - rank by severity
5. Report findings grouped by severity

## Confidence Rule

Only report issues with confidence >= 80:

- Critical: bugs, security, data loss
- Important: missing tests, quality problems, style violations
- Advisory: suggestions only when explicitly requested

---

**ECC Original:** \`ECC/commands/review-pr.md\`
**Atualizado em:** 2026-07-02 23:02:00
