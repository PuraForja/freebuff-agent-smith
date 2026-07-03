# ⚡ Comando: save-session

> **Adaptado do ECC:** \`ECC/commands/save-session.md\`

## Descrição

Save current session state to a dated file in ~/.claude/session-data/ so work can be resumed in a future session with full context.

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: Save current session state to a dated file in ~/.claude/session-data/ so work can be resumed in a future session with full context.
---

# Save Session Command

Capture everything that happened in this session — what was built, what worked, what failed, what's left — and write it to a dated file so the next session can pick up exactly where this one left off.

## When to Use

- End of a work session before closing Claude Code
- Before hitting context limits (run this first, then start a fresh session)
- After solving a complex problem you want to remember
- Any time you need to hand off context to a future session

## Process

### Step 1: Gather context

Before writing the file, collect:

- Read all files modified during this session (use git diff or recall from conversation)
- Review what was discussed, attempted, and decided
- Note any errors encountered and how they were resolved (or not)
- Check current test/build status if relevant

### Step 2: Create the sessions folder if it doesn't exist

Create the canonical sessions folder in the user's Claude home directory:

```bash
mkdir -p ~/.claude/session-data
```

### Step 3: Write the session file

Create `~/.claude/session-data/YYYY-MM-DD-<short-id>-session.tmp`, using today's actual date and a short-id that satisfies the rules enforced by `SESSION_FILENAME_REGEX` in `session-manager.js`:

- Compatibility characters: letters `a-z` / `A-Z`, digits `0-9`, hyphens `-`, underscores `_`
- Compatibility minimum length: 1 character
- Recommended style for new files: lowercase letters, digits, and hyphens with 8+ characters to avoid collisions

Valid examples: `abc123de`, `a1b2c3d4`, `frontend-worktree-1`, `ChezMoi_2`
Avoid for new files: `A`, `test_id1`, `ABC123de`

Full valid filename example: `2024-01-15-abc123de-session.tmp`

The legacy filename `YYYY-MM-DD-session.tmp` is still valid, but new session files should prefer the short-id form to avoid same-day collisions.

### Step 4: Populate the file with all sections below

Write every section honestly. Do not skip sections — write "Nothing yet" or "N/A" if a section genuinely has no content. An incomplete file is worse than an honest empty section.

### Step 5: Show the file to the user

After writing, display the full contents and ask:

```
Session saved to [actual resolved path to the session file]

Does this look accurate? Anything to correct or add before we close?
```

Wait for confirmation. Make edits if requested.

---

## Session File Format

```markdown
# Session: YYYY-MM-DD

**Started:** [approximate time if known]
**Last Updated:** [current time]
**Project:** [project name or path]
**Topic:** [one-line summary of what this session was about]

---

## What We Are Building

---

**ECC Original:** \`ECC/commands/save-session.md\`
**Atualizado em:** 2026-07-02 23:02:00
