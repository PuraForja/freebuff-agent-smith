# 🧠 Skill: fsharp-testing

> **Adaptada do ECC:** `fsharp-testing` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/fsharp-testing/SKILL.md`

## Descrição

F# testing patterns with xUnit, FsUnit, Unquote, FsCheck property-based testing, integration tests, and test organization best practices.

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

# F# Testing Patterns

Comprehensive testing patterns for F# applications using xUnit, FsUnit, Unquote, FsCheck, and modern .NET testing practices.

## When to Activate

- Writing new tests for F# code
- Reviewing test quality and coverage
- Setting up test infrastructure for F# projects
- Debugging flaky or slow tests

## Test Framework Stack

| Tool | Purpose |
|---|---|
| **xUnit** | Test framework (standard .NET ecosystem choice) |
| **FsUnit.xUnit** | F#-friendly assertion syntax for xUnit |
| **Unquote** | Assertion library using F# quotations for clear failure messages |
| **FsCheck.xUnit** | Property-based testing integrated with xUnit |
| **NSubstitute** | Mocking .NET dependencies |
| **Testcontainers** | Real infrastructure in integration tests |
| **WebApplicationFactory** | ASP.NET Core integration tests |

## Unit Tests with xUnit + FsUnit

### Basic Test Structure

```fsharp
module OrderServiceTests

open Xunit
open FsUnit.Xunit

[<Fact>]
let ``create sets status to Pending`` () =
    let order = Order.create "cust-1" [ validItem ]
    order.Status |> should equal Pending

[<Fact>]
let ``confirm changes status to Confirmed`` () =
    let order = Order.create "cust-1" [ validItem ]
    let confirmed = Order.confirm order
    confirmed.Status |> should be (ofCase <@ Confirmed @>)
```

### Assertions with Unquote

Unquote uses F# quotations so failure messages show the full expression that failed, not just "expected X got Y".

```fsharp
module OrderValidationTests

open Xunit
open Swensen.Unquote

[<Fact>]
let ``PlaceOrder returns success when request is valid`` () =
    let request = { CustomerId = "cust-123"; Items = [ validItem ] }
    let result = OrderService.placeOrder request
    test <@ Result.isOk result @>

[<Fact>]
let ``order total sums item prices`` () =
    let items = [ { Sku = "A"; Quantity = 2; Price = 10m }
                  { Sku = "B"; Quantity = 1; Price = 5m } ]
    let total = Order.calculateTotal items
    test <@ total = 25m @>

[<Fact>]
let ``validated email rejects empty input`` () =
    let result = ValidatedEmail.create ""
    test <@ Result.isError result @>
```

### Async Tests

```fsharp
[<Fact>]
let ``PlaceOrder returns success when request is valid`` () = task {
    let deps = createTestDeps ()
    let request = { CustomerId = "cust-123"; Items = [ validItem ] }

    let! result = OrderService.placeOrder deps request

    test <@ Result.isOk result @>
}

[<Fact>]
let ``PlaceOrder returns error when items are empty`` () = task {
    let deps = createTestDeps ()
    let request = { CustomerId = "cust-123"; Items = [] }

    let! result = OrderService.placeOrder deps request

    test <@ Result.isError result @>
}
```

### Parameterized Tests with Theory

```fsharp
[<Theory>]
[<InlineData("")>]
[<InlineData("   ")>]
let ``PlaceOrder rejects empty customer ID`` (customerId: string) =
    let request = { CustomerId = customerId; Items = [ validItem ] }
    let result = OrderService.placeOrder request
    r

---

**ECC Original:** `ECC/skills/fsharp-testing/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:23
