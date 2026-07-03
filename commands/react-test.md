# ⚡ Comando: react-test

> **Adaptado do ECC:** \`ECC/commands/react-test.md\`

## Descrição

Enforce TDD workflow for React. Write React Testing Library tests first (behavior-focused, accessibility-first), then implement components. Detects Vitest or Jest and verifies coverage targets.

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: Enforce TDD workflow for React. Write React Testing Library tests first (behavior-focused, accessibility-first), then implement components. Detects Vitest or Jest and verifies coverage targets.
---

# React TDD Command

This command enforces test-driven development for React using React Testing Library plus Vitest or Jest, detected at runtime.

## What This Command Does

1. **Define Component Signature**: Scaffold the component, prop type, and exports
2. **Write Behavior Tests First**: RTL queries (role-first), `userEvent`, MSW for network — RED
3. **Run Tests**: Verify they fail for the right reason
4. **Implement Minimal Code**: Just enough to pass — GREEN
5. **Refactor**: Improve while keeping tests green
6. **Check Coverage**: Hit the targets in [rules/react/testing.md](../rules/react/testing.md)

## When to Use

Use `/react-test` when:

- Implementing a new React component or custom hook
- Adding test coverage to an untested component
- Fixing a bug (write failing test first that reproduces it)
- Building forms, state machines, or accessibility-critical UI
- Onboarding to RTL + Vitest/Jest workflow

## TDD Cycle

```
RED      -> Write failing test for the next behavior
GREEN    -> Implement minimal component code to pass
REFACTOR -> Improve component, tests stay green
REPEAT   -> Next behavior
```

## Runner Detection

```bash
test -f vitest.config.ts -o -f vitest.config.js -o -f vite.config.ts   # Vitest
grep -l '"jest"' package.json                                          # Jest
```

Prefer Vitest for new Vite-based projects; respect Jest for existing setups.

## Example Session

````text
User: /react-test I need a SearchInput component with debounced search

Agent:
# TDD Session: SearchInput

## Step 1: Define Signature

```tsx
// src/components/SearchInput.tsx
type Props = {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
};

export function SearchInput({ onSearch, placeholder, debounceMs }: Props) {
  throw new Error("not implemented");
}
```

## Step 2: Write Behavior Tests (RED)

```tsx
// src/components/SearchInput.test.tsx
import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchInput } from "./SearchInput";

describe("SearchInput", () => {
  test("renders with placeholder", () => {
    render(<SearchInput onSearch={() => {}} placeholder="Search users" />);

---

**ECC Original:** \`ECC/commands/react-test.md\`
**Atualizado em:** 2026-07-02 23:02:00
