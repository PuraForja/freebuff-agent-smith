# ⚡ Comando: ecc-guide

> **Adaptado do ECC:** \`ECC/commands/ecc-guide.md\`

## Descrição

Navigate ECC's current agents, skills, commands, hooks, install profiles, and docs from the live repository surface.

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: Navigate ECC's current agents, skills, commands, hooks, install profiles, and docs from the live repository surface.
---

# /ecc-guide

Use this command as a conversational map of Everything Claude Code. It should help the user discover the right ECC surface for their task without dumping the entire README or stale catalog counts.

## Usage

```text
/ecc-guide
/ecc-guide setup
/ecc-guide skills
/ecc-guide commands
/ecc-guide hooks
/ecc-guide install
/ecc-guide find: <query>
/ecc-guide <feature-or-file-name>
```

## Operating Rules

1. Read current repository files before answering when the checkout is available.
2. Prefer current filesystem/catalog data over hard-coded counts.
3. Keep the first answer short, then offer specific drill-down paths.
4. Link users to canonical files instead of copying long sections.
5. Do not invent commands, skills, agents, or install profiles that are not present.

## What To Inspect

Use these files as the canonical map:

- `README.md` for install paths, reset/uninstall guidance, and high-level positioning
- `AGENTS.md` for contributor and project-structure guidance
- `agent.yaml` for exported agent and command surface
- `commands/` for maintained slash-command shims
- `skills/*/SKILL.md` for reusable skill workflows
- `agents/*.md` for delegated agent roles
- `hooks/README.md` and `hooks/hooks.json` for hook behavior
- `manifests/install-*.json` for selective install modules, components, and profiles
- `scripts/ci/catalog.js --json` for live catalog counts when running inside ECC

## Response Patterns

### No Arguments

Give a compact menu:

- setup and install
- choosing skills
- command compatibility shims
- agents and delegation
- hooks and safety
- troubleshooting an install
- finding a specific feature

Then ask what they want to do next.

### Topic Lookup

For topics like `skills`, `commands`, `hooks`, `install`, or `agents`:

1. Summarize the current surface in 3-6 bullets.
2. Point to the canonical directories/files.
3. Suggest one or two commands that can verify the state.
4. Avoid exhaustive lists unless the user asks for one.

### Search Mode

For `find: <query>`:

1. Search the relevant files with `rg`.
2. Group results by surface: skills, commands, agents, rules, docs, hooks.
3. Return the strongest matches first with file paths.
4. Recommend the next action for each match.

### Feature Lookup

For a specific feature name:

---

**ECC Original:** \`ECC/commands/ecc-guide.md\`
**Atualizado em:** 2026-07-02 23:01:56
