# 🧠 Skill: quarkus-tdd

> **Adaptada do ECC:** `quarkus-tdd` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/quarkus-tdd/SKILL.md`

## Descrição

Test-driven development for Quarkus 3.x LTS using JUnit 5, Mockito, REST Assured, Camel testing, and JaCoCo. Use when adding features, fixing bugs, or refactoring event-driven services.

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

# Quarkus TDD Workflow

TDD guidance for Quarkus 3.x services with 80%+ coverage (unit + integration). Optimized for event-driven architectures with Apache Camel.

## When to Use

- New features or REST endpoints
- Bug fixes or refactors
- Adding data access logic, security rules, or reactive streams
- Testing Apache Camel routes and event handlers
- Testing event-driven services with RabbitMQ
- Testing conditional flow logic
- Validating CompletableFuture async operations
- Testing LogContext propagation

## Workflow

1. Write tests first (they should fail)
2. Implement minimal code to pass
3. Refactor with tests green
4. Enforce coverage with JaCoCo (80%+ target)

## Unit Tests with @Nested Organization

Follow this structured approach for comprehensive, readable tests:

```java
@ExtendWith(MockitoExtension.class)
@DisplayName("OrderService Unit Tests")
class OrderServiceTest {

  @Mock
  private OrderRepository orderRepository;

  @Mock
  private EventService eventService;

  @Mock
  private FulfillmentPublisher fulfillmentPublisher;

  @InjectMocks
  private OrderService orderService;

  private CreateOrderCommand validCommand;

  @BeforeEach
  void setUp() {
    validCommand = new CreateOrderCommand(
        "customer-123",
        List.of(new OrderLine("sku-123", 2))
    );
  }

  @Nested
  @DisplayName("Tests for createOrder")
  class CreateOrder {

    @Test
    @DisplayName("Should persist order and publish fulfillment event")
    void givenValidCommand_whenCreateOrder_thenPersistsAndPublishes() {
      // ARRANGE
      doNothing().when(orderRepository).persist(any(Order.class));

      // ACT
      OrderReceipt receipt = orderService.createOrder(validCommand);

      // ASSERT
      assertThat(receipt).isNotNull();
      assertThat(receipt.customerId()).isEqualTo("customer-123");
      verify(orderRepository).persist(any(Order.class));
      verify(fulfillmentPublisher).publishAsync(receipt);
      verify(eventService).createSuccessEvent(receipt, "ORDER_CREATED");
    }

    @Test
    @DisplayName("Should reject missing customer id")
    void givenMissingCustomerId_whenCreateOrder_thenThrowsBadRequest() {
      // ARRANGE
      CreateOrderCommand invalid = new CreateOrderCommand("", validCommand.lines());

      // ACT & ASSERT
      WebApplicationException exception = assertThrows(
          WebApplicationException.class,
          () -> orderService.createOrder(invalid)
      );

      assertThat(exception.getResponse().getStatus()).isEqualTo(400);
      verify(orderRepository, never()).persist(any(Order.class));
      verify(fulfillmentPublisher, never()).publishAsync(any());
    }

    @Test
    @DisplayName("Should record error event when persistence fails")
    void givenPersistenceFailure_whenCreateOrder_thenRecordsErrorEvent() {
      // ARRANGE
      doThrow(new PersistenceException("database unavailable"))
          .when(orderRepository).persist(any(Order.class));

      // ACT & ASSERT
      PersistenceException exception = 

---

**ECC Original:** `ECC/skills/quarkus-tdd/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:30
