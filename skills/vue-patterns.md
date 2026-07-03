# 🧠 Skill: vue-patterns

> **Adaptada do ECC:** `vue-patterns` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/vue-patterns/SKILL.md`

## Descrição

Vue.js 3 Composition API patterns, component architecture, reactivity best practices, Pinia state management, Vue Router navigation, and Nuxt SSR patterns. Activates for Vue, Nuxt, Vite, or Pinia projects.

---

## ⚠️ Adaptação para Codebuff

> ⚠️ Esta skill original usava hooks do Claude Code. Adaptada para Codebuff.

| Conceito ECC (Claude) | Equivalente Codebuff |
|-----------------------|---------------------|
| Hooks | Instruções no `.codebuff/instructions.md` |
| Comandos slash | Skills via `skill` tool |
| `settings.json` | `.codebuff/instructions.md` |
| Rules em `~/.claude/rules/` | Skills em `.agents/skills/` |

---

## Conteúdo Adaptado

# Vue.js Patterns and Best Practices

Comprehensive guide for Vue.js 3 development using Composition API (`<script setup>`), covering component design, reactivity, state management, routing, testing, and SSR patterns. Nuxt-specific guidance is included where it differs from vanilla Vue.

## When to Activate

Activate this skill when:
- The project uses Vue.js (any version), Nuxt, Vite + Vue, or Pinia.
- The user asks about Vue component architecture, composables, reactivity, or state management.
- Reviewing Vue Single-File Components (`.vue` files).
- Setting up Vue Router, Pinia stores, or Vite/Vitest configuration.
- Discussing Vue-specific performance, security, or SSR patterns.

---

## 1. Project Structure

### Recommended Layout (Feature-First)

```
src/
├── api/              # API client and endpoint definitions
├── assets/           # Static assets (images, fonts, icons)
├── components/       # Shared/reusable components
│   ├── base/         # Base UI primitives (Button, Input, Modal)
│   └── features/     # Feature-specific shared components
├── composables/      # Reusable Composition API logic
├── layouts/          # Page layouts (optional)
├── pages/            # Route-level page components
├── router/           # Vue Router configuration
├── stores/           # Pinia stores
├── types/            # TypeScript type definitions
├── utils/            # Pure utility functions
└── App.vue           # Root component
```

### File Naming

| Convention | When to Use |
|-----------|-------------|
| `PascalCase.vue` | All components (enforced by `vue/multi-word-component-names`) |
| `useCamelCase.ts` | Composables |
| `camelCase.ts` | Utilities, API clients, types |
| `kebab-case` directories | Route segments, feature folders |

---

## 2. Component Architecture

### Single-File Component Order

```vue
<script setup lang="ts">
// 1. Imports (vue → ecosystem → absolute → relative)
// 2. Props & Emits & Slots
// 3. Composables
// 4. Local state (ref/reactive)
// 5. Computed properties
// 6. Methods
// 7. Watchers
// 8. Lifecycle hooks
</script>

<template>
  <!-- Template content -->
</template>

<style scoped>
  /* Scoped styles */
</style>
```

### Presentational vs Container

- **Container components**: Own data fetching, state, and side effects. Render presentational components.
- **Presentational components**: Receive props, emit events. No API calls, no store access. Pure rendering.

### Props Best Practices

```ts
// Type-based props with defaults
interface Props {
  label: string;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  items: Item[];
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  disabled: false,
});
```

- Always provide `type`, and `required`/`default` where appropriate.
- Boolean props: `isXxx`, `hasXxx`, `canXxx`.
- Never mutate props — emit events instead.
- For v-model binding, use `defineModel()` (Vue 3.4+) or `modelValue` + `update:modelValue`.

### Events

```ts
const emit = d

---

**ECC Original:** `ECC/skills/vue-patterns/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:34
