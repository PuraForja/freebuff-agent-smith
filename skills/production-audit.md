# 🧠 Skill: production-audit

> **Adaptada do ECC:** `production-audit` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/production-audit/SKILL.md`

## Descrição

Local-evidence production readiness audit for shipped apps, pre-launch reviews, post-merge checks, and what breaks in prod? questions without sending repo data to an external audit service.

---

## ⚠️ Adaptação para Codebuff

> ⚠️ Esta skill original usava hooks do Claude Code. Adaptada para Codebuff.

| Conceito ECC (Claude) | Equivalente Codebuff |
|-----------------------|---------------------|
| Hooks | Instruções no `.codebuff/instructions.md` |
| Comandos slash | Skills via `skill` tool |
| `settings.json` | `.codebuff/instructions.md` |
| Rules em `~/.claude/rules/` | Skills em `.agents/skills/` |

---

## Conteúdo Adaptado

# Production Audit

Use this skill when the user asks whether an application is ready to ship, what
could break in production, or what must be fixed before a launch. This is a
maintainer-safe rewrite of the stale community production-audit idea: it keeps
the useful production-readiness lens and removes unpinned external execution and
third-party data sharing.

## When to Use

- The user asks "is this production-ready", "what would break in prod", "what
  did we miss", "audit this repo", or "ready to ship?"
- A feature was merged and needs a pre-deploy or post-merge risk pass.
- A public launch, demo, customer rollout, or investor walkthrough is close.
- CI is green but the user wants production risk, not only test status.
- A deployed URL, release branch, PR, or current checkout is available for
  evidence gathering.

## When Not to Use

- During active implementation when the right lens is line-level secure coding;
  use `security-review` first.
- For pure libraries, templates, docs-only repos, or scaffolds unless the user
  wants packaging/release readiness rather than application readiness.
- When the user asks for a formal compliance audit. This skill is engineering
  triage, not legal, financial, medical, or regulatory certification.
- When the only available evidence is a product idea with no repo, deployment,
  CI, or runtime surface.

## How It Works

Build the audit from local and user-authorized evidence. Do not run unpinned
remote code, upload repository contents to third-party services, or call
external scanners unless the user explicitly approves that specific tool and
data flow.

Use this order:

1. Establish the release surface.
2. Read recent changes and current branch state.
3. Inspect runtime, auth, data, payment, background-job, AI, and deployment
   boundaries that actually exist in the repo.
4. Check CI, tests, migrations, environment documentation, and rollback path.
5. Produce a short ship/block recommendation with specific fixes.

## Evidence Checklist

Start with cheap, local signals:

```text
git status --short --branch
git log --oneline --decorate -20
git diff --stat origin/main...HEAD
```

Then inspect the project-specific surface:

- Package scripts, CI workflows, release scripts, Docker files, and deployment
  manifests.
- API routes, webhooks, auth middleware, background workers, cron jobs, and
  database migrations.
- Environment variable documentation and startup checks.
- Observability hooks, error reporting, logs, health checks, and dashboards.
- Rollback, seed, migration, and backfill instructions.
- E2E coverage for the user paths that matter most.

If a deployed URL is in scope, use browser or HTTP checks only against that URL
and avoid credentialed actions unless the user supplies a safe test account.

## Risk Lenses

### Security And Auth

- Are public routes, API routes, and admin routes clearly separated?
- Are auth and authorization enforced server-side?
- Are secrets kept out of client bundles, logs, ex

---

**ECC Original:** `ECC/skills/production-audit/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:30
