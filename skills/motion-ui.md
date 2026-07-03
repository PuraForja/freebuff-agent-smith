# 🧠 Skill: motion-ui

> **Adaptada do ECC:** `motion-ui` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/motion-ui/SKILL.md`

## Descrição

Production-ready UI motion system for React/Next.js. Use when implementing animations, transitions, or motion patterns.

---

## ⚠️ Adaptação para Codebuff



| Conceito ECC (Claude) | Equivalente Codebuff |
|-----------------------|---------------------|
| Hooks | Instruções no `.codebuff/instructions.md` |
| Comandos slash | Skills via `skill` tool |
| `settings.json` | `.codebuff/instructions.md` |
| Rules em `~/.claude/rules/` | Skills em `.agents/skills/` |

---

## Conteúdo Adaptado

# Motion System v4.2

Production-ready UI motion system for React / Next.js.

Focused on **performance, accessibility, and usability** — not decoration.

## When to Use

Use this motion system when motion:

* Guides attention (e.g., onboarding, key actions)
* Communicates state (loading, success, error, transitions)
* Preserves spatial continuity (layout changes, navigation)

### Appropriate Scenarios

* Interactive components (buttons, modals, menus)
* State transitions (loading → loaded, open → closed)
* Navigation and layout continuity (shared elements, crossfade)

### Considerations

* **Accessibility**: Always support reduced motion
* **Device adaptation**: Adjust for low-end devices
* **Performance trade-offs**: Prefer responsiveness over visual smoothness

### Avoid Using Motion When

* It is purely decorative
* It reduces usability or clarity
* It impacts performance negatively

---

## How It Works

### Core Principle

Motion must:

* Guide attention
* Communicate state
* Preserve spatial continuity

If it does none → remove it.

---

### Installation

```bash
npm install motion
```

---

### Version

* `motion/react` - default for current Motion for React projects (package: `motion`)
* `framer-motion` - legacy import path for projects that still depend on Framer Motion

**Do not mix.** Mixing causes conflicting internal schedulers and broken `AnimatePresence` contexts — components from one package will not coordinate exit animations with components from the other.

To check which version your project uses:

```bash
cat package.json | grep -E '"motion"|"framer-motion"'
```

Always import from one source consistently:

```ts
// Correct (modern)
import { motion, AnimatePresence } from "motion/react"

// Correct (legacy)
import { motion, AnimatePresence } from "framer-motion"

// Never mix both in the same project
```

---

### Motion Tokens

```ts
// motionTokens.ts
export const motionTokens = {
  duration: {
    fast: 0.18,
    normal: 0.35,
    slow: 0.6
  },
  // Use these as the `ease` value inside a `transition` object:
  // transition={{ duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth }}
  easing: {
    smooth: [0.22, 1, 0.36, 1] as [number, number, number, number],
    sharp:  [0.4,  0, 0.2, 1] as [number, number, number, number]
  },
  distance: {
    sm: 8,
    md: 16,
    lg: 24
  }
}
```

Usage example:

```tsx
import { motionTokens } from "@/lib/motionTokens"

<motion.div
  initial={{ opacity: 0, y: motionTokens.distance.md }}
  animate={{ opacity: 1, y: 0 }}
  transition={{
    duration: motionTokens.duration.normal,
    ease: motionTokens.easing.smooth
  }}
/>
```

---

### Performance Rules

**Safe**

* transform
* opacity

**Avoid**

* width / height
* top / left

Rule: responsiveness > smoothness

---

### Device Adaptation

The heuristic combines CPU core count **and** available memory for a more reliable signal. `deviceMemory` is available on Chrome/Android; the fallback covers Safari and Firefox

---

**ECC Original:** `ECC/skills/motion-ui/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:28
