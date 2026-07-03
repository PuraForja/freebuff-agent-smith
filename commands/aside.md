# ⚡ Comando: aside

> **Adaptado do ECC:** \`ECC/commands/aside.md\`

## Descrição

Answer a quick side question without interrupting or losing context from the current task. Resume work automatically after answering.

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: Answer a quick side question without interrupting or losing context from the current task. Resume work automatically after answering.
---

# Aside Command

Ask a question mid-task and get an immediate, focused answer — then continue right where you left off. The current task, files, and context are never modified.

## When to Use

- You're curious about something while Claude is working and don't want to lose momentum
- You need a quick explanation of code Claude is currently editing
- You want a second opinion or clarification on a decision without derailing the task
- You need to understand an error, concept, or pattern before Claude proceeds
- You want to ask something unrelated to the current task without starting a new session

## Usage

```
/aside <your question>
/aside what does this function actually return?
/aside is this pattern thread-safe?
/aside why are we using X instead of Y here?
/aside what's the difference between foo() and bar()?
/aside should we be worried about the N+1 query we just added?
```

## Process

### Step 1: Freeze the current task state

Before answering anything, mentally note:
- What is the active task? (what file, feature, or problem was being worked on)
- What step was in progress at the moment `/aside` was invoked?
- What was about to happen next?

Do NOT touch, edit, create, or delete any files during the aside.

### Step 2: Answer the question directly

Answer the question in the most concise form that is still complete and useful.

- Lead with the answer, not the reasoning
- Keep it short — if a full explanation is needed, offer to go deeper after the task
- If the question is about the current file or code being worked on, reference it precisely (file path and line number if relevant)
- If answering requires reading a file, read it — but read only, never write

Format the response as:

```
ASIDE: [restate the question briefly]

[Your answer here]

— Back to task: [one-line description of what was being done]
```

### Step 3: Resume the main task

After delivering the answer, immediately continue the active task from the exact point it was paused. Do not ask for permission to resume unless the aside answer revealed a blocker or a reason to reconsider the current approach (see Edge Cases).

---

## Edge Cases

**No question provided (`/aside` with nothing after it):**
Respond:
```
ASIDE: no question provided

What would you like to know? (ask your question and I'll answer without losing the current task context)

— Back to task: [one-line description of what was being done]
```

**Question reveals a potential problem with the current task:**
Flag it clearly before resuming:
```
ASIDE: [answer]

---

**ECC Original:** \`ECC/commands/aside.md\`
**Atualizado em:** 2026-07-02 23:01:56
