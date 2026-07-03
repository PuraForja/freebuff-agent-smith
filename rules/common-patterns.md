# 📏 Regra: common — patterns

> **Adaptada do ECC:** \`rules/common/patterns.md\`
> **Fonte original:** \`ECC/rules/common/patterns.md\`

## Descrição

Common Patterns

---

## Conteúdo Adaptado

# Common Patterns

## Skeleton Projects

When implementing new functionality:
1. Search for battle-tested skeleton projects
2. Use parallel agents to evaluate options:
   - Security assessment
   - Extensibility analysis
   - Relevance scoring
   - Implementation planning
3. Clone best match as foundation
4. Iterate within proven structure

## Design Patterns

### Repository Pattern

Encapsulate data access behind a consistent interface:
- Define standard operations: findAll, findById, create, update, delete
- Concrete implementations handle storage details (database, API, file, etc.)
- Business logic depends on the abstract interface, not the storage mechanism
- Enables easy swapping of data sources and simplifies testing with mocks

### API Response Format

Use a consistent envelope for all API responses:
- Include a success/status indicator
- Include the data payload (nullable on error)
- Include an error message field (nullable on success)
- Include metadata for paginated responses (total, page, limit)

---

**ECC Original:** \`ECC/rules/common/patterns.md\`
**Atualizado em:** 2026-07-02 23:01:50
