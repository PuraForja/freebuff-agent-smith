# 🧠 Skill: foundation-models-on-device

> **Adaptada do ECC:** `foundation-models-on-device` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/foundation-models-on-device/SKILL.md`

## Descrição

Apple FoundationModels framework for on-device LLM — text generation, guided generation with @Generable, tool calling, and snapshot streaming in iOS 26+.

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

# FoundationModels: On-Device LLM (iOS 26)

Patterns for integrating Apple's on-device language model into apps using the FoundationModels framework. Covers text generation, structured output with `@Generable`, custom tool calling, and snapshot streaming — all running on-device for privacy and offline support.

## When to Activate

- Building AI-powered features using Apple Intelligence on-device
- Generating or summarizing text without cloud dependency
- Extracting structured data from natural language input
- Implementing custom tool calling for domain-specific AI actions
- Streaming structured responses for real-time UI updates
- Need privacy-preserving AI (no data leaves the device)

## Core Pattern — Availability Check

Always check model availability before creating a session:

```swift
struct GenerativeView: View {
    private var model = SystemLanguageModel.default

    var body: some View {
        switch model.availability {
        case .available:
            ContentView()
        case .unavailable(.deviceNotEligible):
            Text("Device not eligible for Apple Intelligence")
        case .unavailable(.appleIntelligenceNotEnabled):
            Text("Please enable Apple Intelligence in Settings")
        case .unavailable(.modelNotReady):
            Text("Model is downloading or not ready")
        case .unavailable(let other):
            Text("Model unavailable: \(other)")
        }
    }
}
```

## Core Pattern — Basic Session

```swift
// Single-turn: create a new session each time
let session = LanguageModelSession()
let response = try await session.respond(to: "What's a good month to visit Paris?")
print(response.content)

// Multi-turn: reuse session for conversation context
let session = LanguageModelSession(instructions: """
    You are a cooking assistant.
    Provide recipe suggestions based on ingredients.
    Keep suggestions brief and practical.
    """)

let first = try await session.respond(to: "I have chicken and rice")
let followUp = try await session.respond(to: "What about a vegetarian option?")
```

Key points for instructions:
- Define the model's role ("You are a mentor")
- Specify what to do ("Help extract calendar events")
- Set style preferences ("Respond as briefly as possible")
- Add safety measures ("Respond with 'I can't help with that' for dangerous requests")

## Core Pattern — Guided Generation with @Generable

Generate structured Swift types instead of raw strings:

### 1. Define a Generable Type

```swift
@Generable(description: "Basic profile information about a cat")
struct CatProfile {
    var name: String

    @Guide(description: "The age of the cat", .range(0...20))
    var age: Int

    @Guide(description: "A one sentence profile about the cat's personality")
    var profile: String
}
```

### 2. Request Structured Output

```swift
let response = try await session.respond(
    to: "Generate a cute rescue cat",
    generating: CatProfile.self
)

// Access structured fields directly
print("Na

---

**ECC Original:** `ECC/skills/foundation-models-on-device/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:23
