# ⚡ Comando: react-review

> **Adaptado do ECC:** \`ECC/commands/react-review.md\`

## Descrição

Comprehensive React/JSX code review for hook correctness, render performance, server/client component boundaries, accessibility, and React-specific security. Invokes the react-reviewer agent (and typescript-reviewer alongside on TSX/JSX changes).

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: Comprehensive React/JSX code review for hook correctness, render performance, server/client component boundaries, accessibility, and React-specific security. Invokes the react-reviewer agent (and typescript-reviewer alongside on TSX/JSX changes).
---

# React Code Review

This command invokes the **react-reviewer** agent for React-specific code review. For pull requests touching `.tsx`/`.jsx` files, both `react-reviewer` and `typescript-reviewer` should run — each owns a distinct lane.

## What This Command Does

1. **Identify React Changes**: Find modified `.tsx`/`.jsx` files (and React-containing `.ts`/`.js` files) via `git diff`
2. **Run Lint**: Execute `eslint` with `eslint-plugin-react-hooks` and `eslint-plugin-jsx-a11y`
3. **Typecheck**: Run `tsc --noEmit` or the project's canonical typecheck command
4. **Review React Lanes Only**: Hook rules, RSC boundaries, accessibility, render performance, React-specific security
5. **Generate Report**: Categorize issues by severity (CRITICAL / HIGH / MEDIUM)

## When to Use

Use `/react-review` when:

- A PR or commit touches `.tsx`/`.jsx` files
- After writing or modifying React components, custom hooks, or pages
- Before merging React code
- Auditing accessibility on UI components
- Reviewing a new hook for rules-of-hooks and dependency correctness
- Auditing a Next.js App Router server/client component boundary

For pure `.ts`/`.js` changes with no React imports, use `/code-review` (general) or invoke `typescript-reviewer` directly.

## Scope vs `/code-review` and TypeScript Review

| Tool | Scope |
|---|---|
| `react-reviewer` (this command) | Hooks rules, JSX, RSC, a11y, React-specific security, render perf |
| `typescript-reviewer` | Generic TS/JS — `any` abuse, async correctness, Node security |
| `security-reviewer` | Project-wide security audit |
| `/code-review` | Generic uncommitted-changes or PR review |

On a TSX/JSX PR, invoke both `react-reviewer` and `typescript-reviewer`. Findings from each are non-overlapping by design.

## Review Categories

### CRITICAL (Must Fix)

- `dangerouslySetInnerHTML` with unsanitized input
- `href`/`src` with unvalidated user URLs (`javascript:`, `data:`)
- Server Action without input validation
- Secret in client bundle (`NEXT_PUBLIC_*`, `VITE_*`, `REACT_APP_*`)
- `localStorage`/`sessionStorage` for session tokens
- Conditional hook calls (violates Rules of Hooks)
- Direct state mutation
- Hook called outside a component or custom hook

### HIGH (Should Fix)

- Missing `useEffect`/`useMemo`/`useCallback` deps (disabled `exhaustive-deps` without justification)
- Effect for derived state
- Effect missing cleanup
- Stale closures in handlers/intervals
- Server-only imports in Client Components
- Sensitive data leaked via props to Client Components
- Server Actions without auth checks
- Accessibility violations (missing labels, non-semantic interactive elements, ARIA misuse)
- `key={index}` in dynamic lists
- Duplicated state, useEffect chains

---

**ECC Original:** \`ECC/commands/react-review.md\`
**Atualizado em:** 2026-07-02 23:01:59
