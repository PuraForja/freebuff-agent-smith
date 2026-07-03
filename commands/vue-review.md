# ⚡ Comando: vue-review

> **Adaptado do ECC:** \`ECC/commands/vue-review.md\`

## Descrição

Comprehensive Vue.js code review for Composition API correctness, reactivity, composable patterns, template security, accessibility, and Vue-specific performance. Invokes the vue-reviewer agent (and typescript-reviewer alongside on .vue/.ts changes).

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: Comprehensive Vue.js code review for Composition API correctness, reactivity, composable patterns, template security, accessibility, and Vue-specific performance. Invokes the vue-reviewer agent (and typescript-reviewer alongside on .vue/.ts changes).
---

# Vue Code Review

This command invokes the **vue-reviewer** agent for Vue-specific code review. For pull requests touching `.vue` files or Vue-containing `.ts`/`.js` files, both `vue-reviewer` and `typescript-reviewer` should run — each owns a distinct lane.

## What This Command Does

1. **Identify Vue Changes**: Find modified `.vue` files and Vue-related `.ts`/`.js` files via `git diff`
2. **Run Lint**: Execute `eslint` with `eslint-plugin-vue`
3. **Typecheck**: Run `vue-tsc --noEmit` or the project's canonical typecheck command
4. **Review Vue Lanes Only**: Reactivity, composables, template security, accessibility, Vue-specific performance
5. **Generate Report**: Categorize issues by severity (CRITICAL / HIGH / MEDIUM)

## When to Use

Use `/vue-review` when:

- A PR or commit touches `.vue` files
- After writing or modifying Vue components, composables, or Pinia stores
- Before merging Vue code
- Auditing template security (`v-html`, URL bindings)
- Reviewing a new composable for correctness
- Auditing Vue Router guards and navigation
- Reviewing Nuxt server routes or SSR-specific code

For pure `.ts`/`.js` changes with no Vue imports, use `/code-review` (general) or invoke `typescript-reviewer` directly.

## Scope vs `/code-review` and TypeScript Review

| Tool | Scope |
|---|---|
| `vue-reviewer` (this command) | Reactivity, composables, template security, a11y, Vue performance, Pinia/Router |
| `typescript-reviewer` | Generic TS/JS — `any` abuse, async correctness, Node security |
| `security-reviewer` | Project-wide security audit |
| `/code-review` | Generic uncommitted-changes or PR review |

On a `.vue` / Vue-related PR, invoke both `vue-reviewer` and `typescript-reviewer`. Findings from each are non-overlapping by design.

## Review Categories

### CRITICAL (Must Fix)

- `v-html` with unsanitized input
- `:href`/`:src` with unvalidated user URLs (`javascript:`, `data:`)
- Secret in client bundle (`VITE_*`, Nuxt `public` runtimeConfig)
- Server endpoint without input validation (Nuxt Nitro)
- `localStorage`/`sessionStorage` for session tokens
- Destructuring reactive props in Vue < 3.5 (breaks reactivity)
- `reactive()` object replacement (breaks watchers)
- Watcher source tracking a ref object instead of `.value`

### HIGH (Should Fix)

- Composable with module-scope side effects
- Missing cleanup in composable (watcher, interval, listener)
- `v-for` without `:key` or with `key={index}`
- `v-if` + `v-for` on same element
- Props mutation
- Missing prop validation
- Route guard returning false without redirect
- `useRoute().params` destructured at top-level (snapshot)
- `v-model` bound to computed without setter
- Accessibility violations (missing labels, non-semanti

---

**ECC Original:** \`ECC/commands/vue-review.md\`
**Atualizado em:** 2026-07-02 23:02:00
