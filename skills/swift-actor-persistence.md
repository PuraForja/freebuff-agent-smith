# 🧠 Skill: swift-actor-persistence

> **Adaptada do ECC:** `swift-actor-persistence` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/swift-actor-persistence/SKILL.md`

## Descrição

Thread-safe data persistence in Swift using actors — in-memory cache with file-backed storage, eliminating data races by design.

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

# Swift Actors for Thread-Safe Persistence

Patterns for building thread-safe data persistence layers using Swift actors. Combines in-memory caching with file-backed storage, leveraging the actor model to eliminate data races at compile time.

## When to Activate

- Building a data persistence layer in Swift 5.5+
- Need thread-safe access to shared mutable state
- Want to eliminate manual synchronization (locks, DispatchQueues)
- Building offline-first apps with local storage

## Core Pattern

### Actor-Based Repository

The actor model guarantees serialized access — no data races, enforced by the compiler.

```swift
public actor LocalRepository<T: Codable & Identifiable> where T.ID == String {
    private var cache: [String: T] = [:]
    private let fileURL: URL

    public init(directory: URL = .documentsDirectory, filename: String = "data.json") {
        self.fileURL = directory.appendingPathComponent(filename)
        // Synchronous load during init (actor isolation not yet active)
        self.cache = Self.loadSynchronously(from: fileURL)
    }

    // MARK: - Public API

    public func save(_ item: T) throws {
        cache[item.id] = item
        try persistToFile()
    }

    public func delete(_ id: String) throws {
        cache[id] = nil
        try persistToFile()
    }

    public func find(by id: String) -> T? {
        cache[id]
    }

    public func loadAll() -> [T] {
        Array(cache.values)
    }

    // MARK: - Private

    private func persistToFile() throws {
        let data = try JSONEncoder().encode(Array(cache.values))
        try data.write(to: fileURL, options: .atomic)
    }

    private static func loadSynchronously(from url: URL) -> [String: T] {
        guard let data = try? Data(contentsOf: url),
              let items = try? JSONDecoder().decode([T].self, from: data) else {
            return [:]
        }
        return Dictionary(uniqueKeysWithValues: items.map { ($0.id, $0) })
    }
}
```

### Usage

All calls are automatically async due to actor isolation:

```swift
let repository = LocalRepository<Question>()

// Read — fast O(1) lookup from in-memory cache
let question = await repository.find(by: "q-001")
let allQuestions = await repository.loadAll()

// Write — updates cache and persists to file atomically
try await repository.save(newQuestion)
try await repository.delete("q-001")
```

### Combining with @Observable ViewModel

```swift
@Observable
final class QuestionListViewModel {
    private(set) var questions: [Question] = []
    private let repository: LocalRepository<Question>

    init(repository: LocalRepository<Question> = LocalRepository()) {
        self.repository = repository
    }

    func load() async {
        questions = await repository.loadAll()
    }

    func add(_ question: Question) async throws {
        try await repository.save(question)
        questions = await repository.loadAll()
    }
}
```

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| A

---

**ECC Original:** `ECC/skills/swift-actor-persistence/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:33
