# 🧠 Skill: quarkus-patterns

> **Adaptada do ECC:** `quarkus-patterns` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/quarkus-patterns/SKILL.md`

## Descrição

Quarkus 3.x LTS architecture patterns with Camel for messaging, RESTful API design, CDI services, data access with Panache, and async processing. Use for Java Quarkus backend work with event-driven architectures.

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

# Quarkus Development Patterns

Quarkus 3.x architecture and API patterns for cloud-native, event-driven services with Apache Camel.

## When to Activate

- Building REST APIs with JAX-RS or RESTEasy Reactive
- Structuring resource → service → repository layers
- Implementing event-driven patterns with Apache Camel and RabbitMQ
- Configuring Hibernate Panache, caching, or reactive streams
- Adding validation, exception mapping, or pagination
- Setting up profiles for dev/staging/production environments (YAML config)
- Custom logging with LogContext and Logback/Logstash encoder
- Working with CompletableFuture for async operations
- Implementing conditional flow processing
- Working with GraalVM native compilation

## Service Layer with Multiple Dependencies

```java
@Slf4j
@ApplicationScoped
@RequiredArgsConstructor
public class OrderProcessingService {

    private final OrderValidator orderValidator;
    private final EventService eventService;
    private final OrderRepository orderRepository;
    private final FulfillmentPublisher fulfillmentPublisher;
    private final AuditPublisher auditPublisher;

    @Transactional
    public OrderReceipt process(CreateOrderCommand command) {
        ValidationResult validation = orderValidator.validate(command);
        if (!validation.valid()) {
            eventService.createErrorEvent(command, "ORDER_REJECTED", validation.message());
            throw new WebApplicationException(validation.message(), Response.Status.BAD_REQUEST);
        }

        Order order = Order.from(command);
        orderRepository.persist(order);

        OrderReceipt receipt = OrderReceipt.from(order);
        fulfillmentPublisher.publishAsync(receipt);
        auditPublisher.publish("ORDER_ACCEPTED", receipt);
        eventService.createSuccessEvent(receipt, "ORDER_ACCEPTED");

        log.info("Processed order {}", order.id);
        return receipt;
    }
}
```

**Key Patterns:**
- `@RequiredArgsConstructor` for constructor injection via Lombok
- `@Slf4j` for Logback logging
- `@Transactional` on service methods that write through Panache or repositories
- Validate input before persistence or message publication
- Event tracking for success/error scenarios
- Async Camel message publishing

## Custom Logging Context Pattern (Logback)

```java
@ApplicationScoped
public class ProcessingService {

    public void processDocument(Document doc) {
        LogContext logContext = CustomLog.getCurrentContext();
        try (SafeAutoCloseable ignored = CustomLog.startScope(logContext)) {
            // Add context to all log statements
            logContext.put("documentId", doc.getId().toString());
            logContext.put("documentType", doc.getType());
            logContext.put("userId", SecurityContext.getUserId());

            log.info("Starting document processing");

            // All logs within this scope inherit the context
            processInternal(doc);

            log.info("Document processing completed");
   

---

**ECC Original:** `ECC/skills/quarkus-patterns/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:30
