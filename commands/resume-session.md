# ⚡ Comando: resume-session

> **Adaptado do ECC:** \`ECC/commands/resume-session.md\`

## Descrição

Load the most recent session file from ~/.claude/session-data/ and resume work with full context from where the last session ended.

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: Load the most recent session file from ~/.claude/session-data/ and resume work with full context from where the last session ended.
---

# Resume Session Command

Load the last saved session state and orient fully before doing any work.
This command is the counterpart to `/save-session`.

## When to Use

- Starting a new session to continue work from a previous day
- After starting a fresh session due to context limits
- When handing off a session file from another source (just provide the file path)
- Any time you have a session file and want Claude to fully absorb it before proceeding

## Usage

```
/resume-session                                                      # loads most recent file in ~/.claude/session-data/
/resume-session 2024-01-15                                           # loads most recent session for that date
/resume-session ~/.claude/session-data/2024-01-15-abc123de-session.tmp  # loads a current short-id session file
/resume-session ~/.claude/sessions/2024-01-15-session.tmp               # loads a specific legacy-format file
```

## Process

### Step 1: Find the session file

If no argument provided:

1. Check `~/.claude/session-data/`
2. Pick the most recently modified `*-session.tmp` file
3. If the folder does not exist or has no matching files, tell the user:
   ```
   No session files found in ~/.claude/session-data/
   Run /save-session at the end of a session to create one.
   ```
   Then stop.

If an argument is provided:

- If it looks like a date (`YYYY-MM-DD`), search `~/.claude/session-data/` first, then the legacy
  `~/.claude/sessions/`, for files matching `YYYY-MM-DD-session.tmp` (legacy format) or
  `YYYY-MM-DD-<shortid>-session.tmp` (current format)
  and load the most recently modified variant for that date
- If it looks like a file path, read that file directly
- If not found, report clearly and stop

### Step 2: Read the entire session file

Read the complete file. Do not summarize yet.

### Step 3: Confirm understanding

Respond with a structured briefing in this exact format:

```
SESSION LOADED: [actual resolved path to the file]
════════════════════════════════════════════════

PROJECT: [project name / topic from file]

WHAT WE'RE BUILDING:
[2-3 sentence summary in your own words]

CURRENT STATE:
PASS: Working: [count] items confirmed
 In Progress: [list files that are in progress]
 Not Started: [list planned but untouched]

WHAT NOT TO RETRY:
[list every failed approach with its reason — this is critical]

OPEN QUESTIONS / BLOCKERS:
[list any blockers or unanswered questions]

NEXT STEP:
[exact next step if defined in the file]
[if not defined: "No next step defined — recommend reviewing 'What Has NOT Been Tried Yet' together before starting"]

---

**ECC Original:** \`ECC/commands/resume-session.md\`
**Atualizado em:** 2026-07-02 23:02:00
