# 📏 Regra: arkts — coding-style

> **Adaptada do ECC:** \`rules/arkts/coding-style.md\`
> **Fonte original:** \`ECC/rules/arkts/coding-style.md\`

## Descrição

Regra ECC para arkts: coding-style

---

## Conteúdo Adaptado

---
paths:
  - "**/*.ets"
  - "**/*.ts"
  - "**/module.json5"
  - "**/oh-package.json5"
  - "**/build-profile.json5"
---
# HarmonyOS / ArkTS Coding Style

> This file extends [common/coding-style.md](../common/coding-style.md) with HarmonyOS and ArkTS-specific content.

## ArkTS Language Constraints

ArkTS is a strict, statically-typed subset of TypeScript. Violating these constraints causes **compilation failures**.

### Type System

- No `any` or `unknown` types - always use explicit types
- No index access types - use type names directly
- No conditional type aliases or `infer` keyword
- No intersection types - use inheritance
- No mapped types - use classes and regular idioms
- No `typeof` for type annotations - use explicit type declarations
- No `as const` assertions - use explicit type annotations
- No structural typing - use inheritance, interfaces, or type aliases
- No TypeScript utility types except `Partial`, `Required`, `Readonly`, `Record`
- For `Record<K, V>`, index expression type is `V | undefined`
- Omit type annotations in `catch` clauses (ArkTS does not support `any`/`unknown`)

### Functions & Classes

- No function expressions - use arrow functions
- No nested functions - use lambdas
- No generator functions - use `async`/`await` for multitasking
- No `Function.apply`, `Function.call`, `Function.bind` - follow traditional OOP for `this`
- No constructor type expressions - use lambdas
- No constructor signatures in interfaces or object types - use methods or classes
- No declaring class fields in constructors - declare in class body
- No `this` in standalone functions or static methods - only in instance methods
- No `new.target`
- No definite assignment assertions (`let v!: T`) - use initialized declarations
- No class literals - introduce named class types
- No using classes as objects (assigning to variables) - class declarations introduce types, not values
- Only one static block per class - merge all static statements

### Object & Property Access

- No dynamic field declaration or `obj["field"]` access - use `obj.field` syntax
- No `delete` operator - use nullable type with `null` to mark absence
- No prototype assignment - use classes and interfaces
- No `in` operator - use `instanceof`
- No reassigning object methods - use wrapper functions or inheritance
- No `Symbol()` API (except `Symbol.iterator`)
- No `globalThis` or global scope - use explicit module exports/imports
- No namespaces as objects - use classes or modules
- No statements inside namespaces - use functions

### Destructuring & Spread

- No destructuring assignments or variable declarations - use intermediate objects and field-by-field access
- No destructuring parameter declarations - pass parameters directly, assign local names manually
- Spread operator only for expanding arrays (or array-derived classes) into rest parameters or array literals

### Modules & Imports

- No `require()` - use regular `import` syntax
- No `export = ...` - use normal expor

---

**ECC Original:** \`ECC/rules/arkts/coding-style.md\`
**Atualizado em:** 2026-07-02 23:01:49
