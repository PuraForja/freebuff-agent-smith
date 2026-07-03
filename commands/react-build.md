# ⚡ Comando: react-build

> **Adaptado do ECC:** \`ECC/commands/react-build.md\`

## Descrição

Fix React build failures (Vite, webpack, Next.js, CRA, Parcel, esbuild, Bun) incrementally — JSX/TSX compile errors, hydration mismatches, server/client component boundary failures, missing types. Invokes the react-build-resolver agent for minimal, surgical fixes.

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: Fix React build failures (Vite, webpack, Next.js, CRA, Parcel, esbuild, Bun) incrementally — JSX/TSX compile errors, hydration mismatches, server/client component boundary failures, missing types. Invokes the react-build-resolver agent for minimal, surgical fixes.
---

# React Build and Fix

This command invokes the **react-build-resolver** agent to incrementally fix React build errors with minimal changes.

## What This Command Does

1. **Detect Build System**: Identify Vite, webpack, Next.js, CRA, Parcel, esbuild, or Bun
2. **Run Build**: Execute the project's build script
3. **Parse Errors**: Group by layer (TypeScript / bundler config / runtime / hydration)
4. **Fix Incrementally**: One error at a time, re-running build after each change
5. **Report Summary**: Show what was fixed and what remains

## When to Use

Use `/react-build` when:

- `npm run build` (or pnpm/yarn/bun equivalent) fails
- JSX/TSX compile errors after a TypeScript or React upgrade
- Next.js hydration mismatch errors at runtime
- Server/Client Component boundary errors in App Router
- After installing or upgrading `react`, `react-dom`, `@types/react`, or a bundler
- Missing types or "module not found" errors involving React

## Scope

This command owns **React build/bundler/runtime hydration** failures. For pure TypeScript type errors with no React involvement, use `/build-fix` (generic) instead.

## Diagnostic Commands Run

```bash
# Project build script (preferred)
npm run build --if-present
pnpm build 2>/dev/null
yarn build 2>/dev/null
bun run build 2>/dev/null

# Standalone typecheck
npm run typecheck --if-present
tsc --noEmit -p tsconfig.json

# Bundler-specific fallback
next build                          # Next.js
vite build                          # Vite
react-scripts build                 # CRA
webpack --mode=production           # webpack
parcel build src/index.html         # Parcel
bun build ./src/index.tsx --outdir=dist
```

## Example Session

````text
User: /react-build

Agent:
# React Build Resolution

## Build System Detected
Vite (vite.config.ts present, @vitejs/plugin-react in deps)

## Initial Diagnostics

```bash
$ npm run build
> tsc -b && vite build

src/components/UserCard.tsx:1:8 - error TS6133: 'React' is declared but its value is never read.
src/components/Modal.tsx:12:15 - error TS7016: Could not find a declaration file for module 'react-portal'.
src/pages/Home.tsx:42:5 - error: 'useState' is not defined
```

Errors found: 3

## Fix 1: Old JSX transform leftover

File: src/components/UserCard.tsx:1

---

**ECC Original:** \`ECC/commands/react-build.md\`
**Atualizado em:** 2026-07-02 23:01:59
