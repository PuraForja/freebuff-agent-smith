# ⚡ Comando: multi-execute

> **Adaptado do ECC:** \`ECC/commands/multi-execute.md\`

## Descrição

Execute a multi-model implementation plan while preserving Claude as the only filesystem writer.

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: Execute a multi-model implementation plan while preserving Claude as the only filesystem writer.
---

# Execute - Multi-Model Collaborative Execution

Multi-model collaborative execution - Get prototype from plan → Claude refactors and implements → Multi-model audit and delivery.

> **Prerequisite:** Requires the external `ccg-workflow` runtime, which is **not** part of the base ECC install. Initialize it with `npx ccg-workflow` to provision `~/.claude/bin/codeagent-wrapper` and the `~/.claude/.ccg/prompts/*` role files this command depends on. Without that runtime, this command will not run correctly.

$ARGUMENTS

---

## Core Protocols

- **Language Protocol**: Use **English** when interacting with tools/models, communicate with user in their language
- **Code Sovereignty**: External models have **zero filesystem write access**, all modifications by Claude
- **Dirty Prototype Refactoring**: Treat Codex/Gemini Unified Diff as "dirty prototype", must refactor to production-grade code
- **Stop-Loss Mechanism**: Do not proceed to next phase until current phase output is validated
- **Prerequisite**: Only execute after user explicitly replies "Y" to `/ccg:plan` output (if missing, must confirm first)

---

## Multi-Model Call Specification

**Call Syntax** (parallel: use `run_in_background: true`):

```
# Resume session call (recommended) - Implementation Prototype
Bash({
  command: "~/.claude/bin/codeagent-wrapper {{LITE_MODE_FLAG}}--backend <codex|gemini> {{GEMINI_MODEL_FLAG}}resume <SESSION_ID> - \"$PWD\" <<'EOF'
ROLE_FILE: <role prompt path>
<TASK>
Requirement: <task description>
Context: <plan content + target files>
</TASK>
OUTPUT: Unified Diff Patch ONLY. Strictly prohibit any actual modifications.
EOF",
  run_in_background: true,
  timeout: 3600000,
  description: "Brief description"
})

# New session call - Implementation Prototype
Bash({
  command: "~/.claude/bin/codeagent-wrapper {{LITE_MODE_FLAG}}--backend <codex|gemini> {{GEMINI_MODEL_FLAG}}- \"$PWD\" <<'EOF'
ROLE_FILE: <role prompt path>
<TASK>
Requirement: <task description>
Context: <plan content + target files>
</TASK>
OUTPUT: Unified Diff Patch ONLY. Strictly prohibit any actual modifications.
EOF",
  run_in_background: true,
  timeout: 3600000,
  description: "Brief description"
})
```

**Audit Call Syntax** (Code Review / Audit):

```
Bash({
  command: "~/.claude/bin/codeagent-wrapper {{LITE_MODE_FLAG}}--backend <codex|gemini> {{GEMINI_MODEL_FLAG}}resume <SESSION_ID> - \"$PWD\" <<'EOF'
ROLE_FILE: <role prompt path>
<TASK>
Scope: Audit the final code changes.
Inputs:
- The applied patch (git diff / final unified diff)
- The touched files (relevant excerpts if needed)
Constraints:
- Do NOT modify any files.
- Do NOT output tool commands that assume filesystem access.
</TASK>
OUTPUT:
1) A prioritized list of issues (severity, file, rationale)
2) Concrete fixes; if code changes are needed, include a Unified Diff Patch in a fenced code block.
EOF",
  run_in_background

---

**ECC Original:** \`ECC/commands/multi-execute.md\`
**Atualizado em:** 2026-07-02 23:01:58
