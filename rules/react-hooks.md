# 📏 Regra: react — hooks

> **Adaptada do ECC:** \`rules/react/hooks.md\`
> **Fonte original:** \`ECC/rules/react/hooks.md\`

## Descrição

Regra ECC para react: hooks

---

## Conteúdo Adaptado

---
paths:
  - "**/*.tsx"
  - "**/*.jsx"
  - "**/hooks/**/*.ts"
  - "**/hooks/**/*.js"
  - "**/use-*.ts"
  - "**/use-*.tsx"
---
# React Hooks

> This file covers **React hooks** (`useState`, `useEffect`, `useMemo`, `useCallback`, custom hooks) — NOT the Claude Code `hooks/` runtime system. Naming matches the per-language convention `rules/<lang>/hooks.md` used across this repo.
>
> Extends [typescript/patterns.md](../typescript/patterns.md) and [common/patterns.md](../common/patterns.md).

## Rules of Hooks

Enforce `eslint-plugin-react-hooks` with `react-hooks/rules-of-hooks` set to error.

1. Hooks only at the top level of a function component or another hook
2. Never in loops, conditionals, nested functions, or after early returns
3. Always called in the same order on every render
4. Only inside React function components or custom hooks (functions starting with `use`)

```tsx
// WRONG: conditional hook
function Foo({ enabled }: { enabled: boolean }) {
  if (enabled) {
    const [x, setX] = useState(0); // rule violation
  }
}

// CORRECT: hook unconditional, condition inside
function Foo({ enabled }: { enabled: boolean }) {
  const [x, setX] = useState(0);
  if (!enabled) return null;
  return <span>{x}</span>;
}
```

## `useEffect` — When NOT to Use

`useEffect` is for synchronizing with external systems (subscriptions, browser APIs, third-party libraries). It is **not** the right tool for:

- Derived state — compute it during render
- Transforming data for rendering — compute it during render
- Resetting state when a prop changes — use a `key` on the parent or derive from props
- Notifying parents of state changes — call the callback in the event handler
- Initializing app-level singletons — call the function module-side or in `main.tsx`

```tsx
// WRONG: effect for derived state
const [fullName, setFullName] = useState("");
useEffect(() => {
  setFullName(`${first} ${last}`);
}, [first, last]);

// CORRECT: derive during render
const fullName = `${first} ${last}`;
```

## Dependency Arrays

- Always include every reactive value referenced inside the effect/callback
- Enable `react-hooks/exhaustive-deps` lint rule — never silence it without a comment explaining why
- If the dep array grows unwieldy, the effect is doing too much — split it
- Stable identity for functions passed in deps: wrap in `useCallback` only when the function is itself a dependency of another hook or passed to a memoized child

## Cleanup

Every subscription, interval, listener, or in-flight request must clean up.

```tsx
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal }).then(handleResponse);
  return () => controller.abort();
}, [url]);
```

```tsx
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
}, []);
```

Missing cleanup = race conditions when deps change, memory leaks on unmount.

## `useMemo` and `useCallback` — When Worth It

Default position: **do not memoize**. Add 

---

**ECC Original:** \`ECC/rules/react/hooks.md\`
**Atualizado em:** 2026-07-02 23:01:54
