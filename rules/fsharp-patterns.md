# 📏 Regra: fsharp — patterns

> **Adaptada do ECC:** \`rules/fsharp/patterns.md\`
> **Fonte original:** \`ECC/rules/fsharp/patterns.md\`

## Descrição

Regra ECC para fsharp: patterns

---

## Conteúdo Adaptado

---
paths:
  - "**/*.fs"
  - "**/*.fsx"
---
# F# Patterns

> This file extends [common/patterns.md](../common/patterns.md) with F#-specific content.

## Result Type for Error Handling

Use `Result<'T, 'TError>` with railway-oriented programming instead of exceptions for expected failures.

```fsharp
type OrderError =
    | InvalidCustomer of string
    | EmptyItems
    | ItemOutOfStock of sku: string

let validateOrder (request: CreateOrderRequest) : Result<ValidatedOrder, OrderError> =
    if String.IsNullOrWhiteSpace request.CustomerId then
        Error(InvalidCustomer "CustomerId is required")
    elif request.Items |> List.isEmpty then
        Error EmptyItems
    else
        Ok { CustomerId = request.CustomerId; Items = request.Items }
```

## Option for Missing Values

Prefer `Option<'T>` over null. Use `Option.map`, `Option.bind`, and `Option.defaultValue` to transform.

```fsharp
let findUser (id: Guid) : User option =
    users |> Map.tryFind id

let getUserEmail userId =
    findUser userId
    |> Option.map (fun u -> u.Email)
    |> Option.defaultValue "unknown@example.com"
```

## Discriminated Unions for Domain Modeling

Model business states explicitly. The compiler enforces exhaustive handling.

```fsharp
type PaymentState =
    | AwaitingPayment of amount: decimal
    | Paid of paidAt: DateTimeOffset * transactionId: string
    | Refunded of refundedAt: DateTimeOffset * reason: string
    | Failed of error: string

let describePayment = function
    | AwaitingPayment amount -> $"Awaiting payment of {amount:C}"
    | Paid (at, txn) -> $"Paid at {at} (txn: {txn})"
    | Refunded (at, reason) -> $"Refunded at {at}: {reason}"
    | Failed error -> $"Payment failed: {error}"
```

## Computation Expressions

Use computation expressions to simplify sequential operations that may fail.

```fsharp
let placeOrder request =
    result {
        let! validated = validateOrder request
        let! inventory = checkInventory validated.Items
        let! order = createOrder validated inventory
        return order
    }
```

## Module Organization

- Group related functions in modules rather than classes
- Use `[<RequireQualifiedAccess>]` to prevent name collisions
- Keep modules small and focused on a single responsibility

```fsharp
[<RequireQualifiedAccess>]
module Order =
    let create customerId items = { Id = Guid.NewGuid(); CustomerId = customerId; Items = items; Status = Pending }
    let confirm order = { order with Status = Confirmed(DateTimeOffset.UtcNow) }
    let cancel reason order = { order with Status = Cancelled reason }
```

## Dependency Injection

- Define dependencies as function parameters or record-of-functions
- Use interfaces sparingly, primarily at the boundary with .NET libraries
- Prefer partial application for injecting dependencies into pipelines

```fsharp
type OrderDeps =
    { FindOrder: Guid -> Task<Order option>
      SaveOrder: Order -> Task<unit>
      SendNotification: Order -> Task<unit> }

---

**ECC Original:** \`ECC/rules/fsharp/patterns.md\`
**Atualizado em:** 2026-07-02 23:01:51
