# 🧠 Skill: opensource-pipeline

> **Adaptada do ECC:** `opensource-pipeline` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/opensource-pipeline/SKILL.md`

## Descrição

Open-source pipeline: fork, sanitize, and package private projects for safe public release. Chains 3 agents (forker, sanitizer, packager). Triggers: '/opensource', 'open source this', 'make this public', 'prepare for open source'.

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

# Open-Source Pipeline Skill

Safely open-source any project through a 3-stage pipeline: **Fork** (strip secrets) → **Sanitize** (verify clean) → **Package** (CLAUDE.md + setup.sh + README).

## When to Activate

- User says "open source this project" or "make this public"
- User wants to prepare a private repo for public release
- User needs to strip secrets before pushing to GitHub
- User invokes `/opensource fork`, `/opensource verify`, or `/opensource package`

## Commands

| Command | Action |
|---------|--------|
| `/opensource fork PROJECT` | Full pipeline: fork + sanitize + package |
| `/opensource verify PROJECT` | Run sanitizer on existing repo |
| `/opensource package PROJECT` | Generate CLAUDE.md + setup.sh + README |
| `/opensource list` | Show all staged projects |
| `/opensource status PROJECT` | Show reports for a staged project |

## Protocol

### /opensource fork PROJECT

**Full pipeline — the main workflow.**

#### Step 1: Gather Parameters

Resolve the project path. If PROJECT contains `/`, treat as a path (absolute or relative). Otherwise check: current working directory, `$HOME/PROJECT`, then ask the user.

```
SOURCE_PATH="<resolved absolute path>"
STAGING_PATH="$HOME/opensource-staging/${PROJECT_NAME}"
```

Ask the user:
1. "Which project?" (if not found)
2. "License? (MIT / Apache-2.0 / GPL-3.0 / BSD-3-Clause)"
3. "GitHub org or username?" (default: detect via `gh api user -q .login`)
4. "GitHub repo name?" (default: project name)
5. "Description for README?" (analyze project for suggestion)

#### Step 2: Create Staging Directory

```bash
mkdir -p $HOME/opensource-staging/
```

#### Step 3: Run Forker Agent

Spawn the `opensource-forker` agent:

```
Agent(
  description="Fork {PROJECT} for open-source",
  subagent_type="opensource-forker",
  prompt="""
Fork project for open-source release.

Source: {SOURCE_PATH}
Target: {STAGING_PATH}
License: {chosen_license}

Follow the full forking protocol:
1. Copy files (exclude .git, node_modules, __pycache__, .venv)
2. Strip all secrets and credentials
3. Replace internal references with placeholders
4. Generate .env.example
5. Clean git history
6. Generate FORK_REPORT.md in {STAGING_PATH}/FORK_REPORT.md
"""
)
```

Wait for completion. Read `{STAGING_PATH}/FORK_REPORT.md`.

#### Step 4: Run Sanitizer Agent

Spawn the `opensource-sanitizer` agent:

```
Agent(
  description="Verify {PROJECT} sanitization",
  subagent_type="opensource-sanitizer",
  prompt="""
Verify sanitization of open-source fork.

Project: {STAGING_PATH}
Source (for reference): {SOURCE_PATH}

Run ALL scan categories:
1. Secrets scan (CRITICAL)
2. PII scan (CRITICAL)
3. Internal references scan (CRITICAL)
4. Dangerous files check (CRITICAL)
5. Configuration completeness (WARNING)
6. Git history audit

Generate SANITIZATION_REPORT.md inside {STAGING_PATH}/ with PASS/FAIL verdict.
"""
)
```

Wait for completion. Read `{STAGING_PATH}/SANITIZATION_REPORT.md`.

**If FAIL:** Show findings to user. Ask: "Fix these and re-s

---

**ECC Original:** `ECC/skills/opensource-pipeline/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:28
