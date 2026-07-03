# 🧠 Skill: swiftui-patterns

> **Adaptada do ECC:** `swiftui-patterns` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/swiftui-patterns/SKILL.md`

## Descrição

SwiftUI architecture patterns, state management with @Observable, view composition, navigation, performance optimization, and modern iOS/macOS UI best practices.

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

# SwiftUI Patterns

Modern SwiftUI patterns for building declarative, performant user interfaces on Apple platforms. Covers the Observation framework, view composition, type-safe navigation, and performance optimization.

## When to Activate

- Building SwiftUI views and managing state (`@State`, `@Observable`, `@Binding`)
- Designing navigation flows with `NavigationStack`
- Structuring view models and data flow
- Optimizing rendering performance for lists and complex layouts
- Working with environment values and dependency injection in SwiftUI

## State Management

### Property Wrapper Selection

Choose the simplest wrapper that fits:

| Wrapper | Use Case |
|---------|----------|
| `@State` | View-local value types (toggles, form fields, sheet presentation) |
| `@Binding` | Two-way reference to parent's `@State` |
| `@Observable` class + `@State` | Owned model with multiple properties |
| `@Observable` class (no wrapper) | Read-only reference passed from parent |
| `@Bindable` | Two-way binding to an `@Observable` property |
| `@Environment` | Shared dependencies injected via `.environment()` |

### @Observable ViewModel

Use `@Observable` (not `ObservableObject`) — it tracks property-level changes so SwiftUI only re-renders views that read the changed property:

```swift
@Observable
final class ItemListViewModel {
    private(set) var items: [Item] = []
    private(set) var isLoading = false
    var searchText = ""

    private let repository: any ItemRepository

    init(repository: any ItemRepository = DefaultItemRepository()) {
        self.repository = repository
    }

    func load() async {
        isLoading = true
        defer { isLoading = false }
        items = (try? await repository.fetchAll()) ?? []
    }
}
```

### View Consuming the ViewModel

```swift
struct ItemListView: View {
    @State private var viewModel: ItemListViewModel

    init(viewModel: ItemListViewModel = ItemListViewModel()) {
        _viewModel = State(initialValue: viewModel)
    }

    var body: some View {
        List(viewModel.items) { item in
            ItemRow(item: item)
        }
        .searchable(text: $viewModel.searchText)
        .overlay { if viewModel.isLoading { ProgressView() } }
        .task { await viewModel.load() }
    }
}
```

### Environment Injection

Replace `@EnvironmentObject` with `@Environment`:

```swift
// Inject
ContentView()
    .environment(authManager)

// Consume
struct ProfileView: View {
    @Environment(AuthManager.self) private var auth

    var body: some View {
        Text(auth.currentUser?.name ?? "Guest")
    }
}
```

## View Composition

### Extract Subviews to Limit Invalidation

Break views into small, focused structs. When state changes, only the subview reading that state re-renders:

```swift
struct OrderView: View {
    @State private var viewModel = OrderViewModel()

    var body: some View {
        VStack {
            OrderHeader(title: viewModel.title)
            OrderItemList(items: viewModel.item

---

**ECC Original:** `ECC/skills/swiftui-patterns/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:33
