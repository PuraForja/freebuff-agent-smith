# 🧠 Skill: dotnet-patterns

> **Adaptada do ECC:** `dotnet-patterns` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/dotnet-patterns/SKILL.md`

## Descrição

Idiomatic C# and .NET patterns, conventions, dependency injection, async/await, and best practices for building robust, maintainable .NET applications.

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

# .NET Development Patterns

Idiomatic C# and .NET patterns for building robust, performant, and maintainable applications.

## When to Activate

- Writing new C# code
- Reviewing C# code
- Refactoring existing .NET applications
- Designing service architectures with ASP.NET Core

## Core Principles

### 1. Prefer Immutability

Use records and init-only properties for data models. Mutability should be an explicit, justified choice.

```csharp
// Good: Immutable value object
public sealed record Money(decimal Amount, string Currency);

// Good: Immutable DTO with init setters
public sealed class CreateOrderRequest
{
    public required string CustomerId { get; init; }
    public required IReadOnlyList<OrderItem> Items { get; init; }
}

// Bad: Mutable model with public setters
public class Order
{
    public string CustomerId { get; set; }
    public List<OrderItem> Items { get; set; }
}
```

### 2. Explicit Over Implicit

Be clear about nullability, access modifiers, and intent.

```csharp
// Good: Explicit access modifiers and nullability
public sealed class UserService
{
    private readonly IUserRepository _repository;
    private readonly ILogger<UserService> _logger;

    public UserService(IUserRepository repository, ILogger<UserService> logger)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<User?> FindByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _repository.FindByIdAsync(id, cancellationToken);
    }
}
```

### 3. Depend on Abstractions

Use interfaces for service boundaries. Register via DI container.

```csharp
// Good: Interface-based dependency
public interface IOrderRepository
{
    Task<Order?> FindByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<IReadOnlyList<Order>> FindByCustomerAsync(string customerId, CancellationToken cancellationToken);
    Task AddAsync(Order order, CancellationToken cancellationToken);
}

// Registration
builder.Services.AddScoped<IOrderRepository, SqlOrderRepository>();
```

## Async/Await Patterns

### Proper Async Usage

```csharp
// Good: Async all the way, with CancellationToken
public async Task<OrderSummary> GetOrderSummaryAsync(
    Guid orderId,
    CancellationToken cancellationToken)
{
    var order = await _repository.FindByIdAsync(orderId, cancellationToken)
        ?? throw new NotFoundException($"Order {orderId} not found");

    var customer = await _customerService.GetAsync(order.CustomerId, cancellationToken);

    return new OrderSummary(order, customer);
}

// Bad: Blocking on async
public OrderSummary GetOrderSummary(Guid orderId)
{
    var order = _repository.FindByIdAsync(orderId, CancellationToken.None).Result; // Deadlock risk
    return new OrderSummary(order);
}
```

### Parallel Async Operations

```csharp
// Good: Concurrent independent operations
public async Task<Dashboard

---

**ECC Original:** `ECC/skills/dotnet-patterns/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:22
