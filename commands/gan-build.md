# ⚡ Comando: gan-build

> **Adaptado do ECC:** \`ECC/commands/gan-build.md\`

## Descrição

Run a generator/evaluator build loop for implementation tasks with bounded iterations and scoring.

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: Run a generator/evaluator build loop for implementation tasks with bounded iterations and scoring.
---

Parse the following from $ARGUMENTS:
1. `brief` — the user's one-line description of what to build
2. `--max-iterations N` — (optional, default 15) maximum generator-evaluator cycles
3. `--pass-threshold N` — (optional, default 7.0) weighted score to pass
4. `--skip-planner` — (optional) skip planner, assume spec.md already exists
5. `--eval-mode MODE` — (optional, default "playwright") one of: playwright, screenshot, code-only

## GAN-Style Harness Build

This command orchestrates a three-agent build loop inspired by Anthropic's March 2026 harness design paper.

### Phase 0: Setup
1. Create `gan-harness/` directory in project root
2. Create subdirectories: `gan-harness/feedback/`, `gan-harness/screenshots/`
3. Initialize git if not already initialized
4. Log start time and configuration

### Phase 1: Planning (Planner Agent)
Unless `--skip-planner` is set:
1. Launch the `gan-planner` agent via Task tool with the user's brief
2. Wait for it to produce `gan-harness/spec.md` and `gan-harness/eval-rubric.md`
3. Display the spec summary to the user
4. Proceed to Phase 2

### Phase 2: Generator-Evaluator Loop
```
iteration = 1
while iteration <= max_iterations:

    # GENERATE
    Launch gan-generator agent via Task tool:
    - Read spec.md
    - If iteration > 1: read feedback/feedback-{iteration-1}.md
    - Build/improve the application
    - Ensure dev server is running
    - Commit changes

    # Wait for generator to finish

    # EVALUATE
    Launch gan-evaluator agent via Task tool:
    - Read eval-rubric.md and spec.md
    - Test the live application (mode: playwright/screenshot/code-only)
    - Score against rubric
    - Write feedback to feedback/feedback-{iteration}.md

    # Wait for evaluator to finish

    # CHECK SCORE
    Read feedback/feedback-{iteration}.md
    Extract weighted total score

    if score >= pass_threshold:
        Log "PASSED at iteration {iteration} with score {score}"
        Break

    if iteration >= 3 and score has not improved in last 2 iterations:
        Log "PLATEAU detected — stopping early"
        Break

    iteration += 1
```

### Phase 3: Summary
1. Read all feedback files
2. Display final scores and iteration history
3. Show score progression: `iteration 1: 4.2 → iteration 2: 5.8 → ... → iteration N: 7.5`
4. List any remaining issues from the final evaluation
5. Report total time and estimated cost

### Output

```markdown
## GAN Harness Build Report

**Brief:** [original prompt]

---

**ECC Original:** \`ECC/commands/gan-build.md\`
**Atualizado em:** 2026-07-02 23:01:57
