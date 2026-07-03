# 📏 Regra: react — testing

> **Adaptada do ECC:** \`rules/react/testing.md\`
> **Fonte original:** \`ECC/rules/react/testing.md\`

## Descrição

Regra ECC para react: testing

---

## Conteúdo Adaptado

---
paths:
  - "**/*.test.tsx"
  - "**/*.test.jsx"
  - "**/*.spec.tsx"
  - "**/*.spec.jsx"
  - "**/__tests__/**/*.ts"
  - "**/__tests__/**/*.tsx"
---
# React Testing

> This file extends [typescript/testing.md](../typescript/testing.md) and [common/testing.md](../common/testing.md) with React specific content.

## Library Choice

- **React Testing Library (RTL)** — the standard for component testing. Tests behavior through the rendered DOM.
- **Vitest** — preferred runner for new Vite-based projects. Faster than Jest, native ESM, same API.
- **Jest** — still the default for Next.js / CRA projects. RTL works identically.
- **Playwright Component Testing** — when component tests need a real browser engine (animation, layout, complex events)
- **Cypress Component Testing** — alternative real-browser component runner

Pick one component test runner per project — do not mix RTL + Playwright CT in the same repo.

## Core Principle

Test what the user sees and does, not implementation details.

- Query by accessible role first, then label, then text — fall back to `data-testid` only when nothing else fits
- Never assert on internal state, props passed to children, or which hooks were called
- Refactor without breaking tests = the test was testing behavior; that is the goal

## Query Priority

RTL exposes queries in three families. Use this priority order top-down:

1. **Accessible to everyone**
   - `getByRole(role, { name })` — primary choice
   - `getByLabelText` — for form inputs
   - `getByPlaceholderText` — when no label is available (and add a label)
   - `getByText` — for non-interactive text
   - `getByDisplayValue` — for form fields with a current value

2. **Semantic queries**
   - `getByAltText` — for images
   - `getByTitle` — last resort, low accessibility value

3. **Test IDs**
   - `getByTestId("some-id")` — escape hatch only, when none of the above work

`getBy*` throws when no match. `queryBy*` returns null (use for asserting absence). `findBy*` returns a promise (use for async).

## User Interaction

Prefer `userEvent` over `fireEvent`. `userEvent` simulates real browser sequences (focus, keydown, beforeinput, input, keyup) — `fireEvent` dispatches a single synthetic event.

```tsx
import userEvent from "@testing-library/user-event";

test("submits the form", async () => {
  const user = userEvent.setup();
  render(<UserForm onSubmit={handleSubmit} />);

  await user.type(screen.getByLabelText("Email"), "user@example.com");
  await user.click(screen.getByRole("button", { name: /save/i }));

  expect(handleSubmit).toHaveBeenCalledWith({ email: "user@example.com" });
});
```

- Always `await` `userEvent` calls — they are async
- Call `userEvent.setup()` once at the top of each test, then reuse the returned `user`

## Async Assertions

```tsx
// WRONG: synchronous query for async-rendered content
expect(screen.getByText("Loaded")).toBeInTheDocument();   // throws — not in DOM yet

// CORRECT: findBy* (returns a promise, retries)
expect(aw

---

**ECC Original:** \`ECC/rules/react/testing.md\`
**Atualizado em:** 2026-07-02 23:01:54
