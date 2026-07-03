# 📏 Regra: arkts — patterns

> **Adaptada do ECC:** \`rules/arkts/patterns.md\`
> **Fonte original:** \`ECC/rules/arkts/patterns.md\`

## Descrição

Regra ECC para arkts: patterns

---

## Conteúdo Adaptado

---
paths:
  - "**/*.ets"
  - "**/*.ts"
---
# HarmonyOS / ArkTS Patterns

> This file extends [common/patterns.md](../common/patterns.md) with HarmonyOS and ArkTS-specific patterns.

## State Management: V2 Only

**MUST use** ArkUI State Management V2. V1 decorators are deprecated and must not be used.

### V2 Decorators

| Decorator | Purpose |
|-----------|---------|
| `@ComponentV2` | Marks a struct as a V2 component |
| `@Local` | Local state within a component |
| `@Param` | Props received from parent (read-only) |
| `@Event` | Callback events from child to parent |
| `@Provider` | Provides state to descendant components |
| `@Consumer` | Consumes state from ancestor `@Provider` |
| `@Monitor` | Watches for state changes (replaces V1 `@Watch`) |
| `@Computed` | Derived/computed values |
| `@ObservedV2` | Makes a class observable for V2 state management |
| `@Trace` | Marks observable properties in `@ObservedV2` classes |

### Prohibited V1 Decorators

Never use: `@State`, `@Prop`, `@Link`, `@ObjectLink`, `@Observed`, `@Provide`, `@Consume`, `@Watch`, `@Component` (use `@ComponentV2` instead).

### V2 Component Example

```typescript
@ObservedV2
class UserModel {
  @Trace name: string = ''
  @Trace age: number = 0
}

@ComponentV2
struct UserCard {
  @Param user: UserModel = new UserModel()
  @Event onDelete: () => void = () => {}

  build() {
    Column() {
      Text(this.user.name)
        .fontSize($r('app.float.font_size_title'))
      Text(`${this.user.age}`)
        .fontSize($r('app.float.font_size_body'))
      Button($r('app.string.delete'))
        .onClick(() => this.onDelete())
    }
  }
}
```

### State Synchronization

```typescript
@ComponentV2
struct ParentPage {
  @Provider('userState') userModel: UserModel = new UserModel()

  build() {
    Column() {
      ChildComponent()  // automatically receives @Consumer('userState')
    }
  }
}

@ComponentV2
struct ChildComponent {
  @Consumer('userState') userModel: UserModel = new UserModel()

  build() {
    Text(this.userModel.name)
  }
}
```

## Routing: Navigation Only

**MUST use** `Navigation` component with `NavPathStack`. Never use `@ohos.router`.

### Navigation Setup

```typescript
@ComponentV2
struct MainPage {
  @Local navPathStack: NavPathStack = new NavPathStack()

  build() {
    Navigation(this.navPathStack) {
      // Home content
    }
    .navDestination(this.routerMap)
  }

---

**ECC Original:** \`ECC/rules/arkts/patterns.md\`
**Atualizado em:** 2026-07-02 23:01:50
