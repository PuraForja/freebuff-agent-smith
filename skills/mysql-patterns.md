# 🧠 Skill: mysql-patterns

> **Adaptada do ECC:** `mysql-patterns` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/mysql-patterns/SKILL.md`

## Descrição

MySQL and MariaDB schema, query, indexing, transaction, replication, and connection-pool patterns for production backends.

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

# MySQL Patterns

Use this skill when working on MySQL or MariaDB schema design, migrations,
slow-query investigation, queue-style transactions, connection pools, or
production database configuration. Prefer exact version checks before applying a
feature-specific pattern because MySQL and MariaDB have diverged in several SQL
details.

## Activation

- Designing MySQL or MariaDB tables, indexes, and constraints
- Reviewing migrations before they run on large production tables
- Debugging slow queries, lock waits, deadlocks, or connection exhaustion
- Adding keyset pagination, upserts, full-text search, JSON columns, or queues
- Configuring application connection pools, read replicas, TLS, or slow logs

## Version Check

Start by identifying the engine and version:

```sql
SELECT VERSION();
SHOW VARIABLES LIKE 'version_comment';
```

Keep MySQL and MariaDB guidance separate when syntax differs:

- MySQL documents row aliases as the replacement for `VALUES(col)` in
  `ON DUPLICATE KEY UPDATE`; `VALUES(col)` is deprecated there.
- MariaDB documents `VALUES(col)` as the supported way to reference inserted
  values in `ON DUPLICATE KEY UPDATE`; use it for cross-engine compatibility.
- `SKIP LOCKED` is appropriate for queue-like work only. It skips locked rows
  and can return an inconsistent view, so do not use it for general accounting
  or integrity-sensitive reads.

## Schema Defaults

```sql
CREATE TABLE orders (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    account_id BIGINT UNSIGNED NOT NULL,
    status VARCHAR(32) NOT NULL,
    total DECIMAL(15, 2) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    PRIMARY KEY (id),
    KEY idx_orders_account_status_created (account_id, status, created_at),
    KEY idx_orders_active (account_id, deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

Default choices:

| Use Case | Prefer | Avoid |
| --- | --- | --- |
| Surrogate primary keys | `BIGINT UNSIGNED AUTO_INCREMENT` | `INT` for tables that can grow beyond 2B rows |
| UUID lookup keys | `BINARY(16)` with conversion helpers | `VARCHAR(36)` primary keys on hot tables |
| Money and exact quantities | `DECIMAL(p, s)` | `FLOAT` or `DOUBLE` |
| User-facing text | `utf8mb4` tables and indexes | MySQL `utf8` / `utf8mb3` defaults |
| Application timestamps | `DATETIME` with UTC managed by the app | Assuming `DATETIME` stores time zone metadata |
| Soft deletes | `deleted_at DATETIME NULL` plus scoped indexes | Filtering soft-deleted rows without an index |
| Extensible status values | lookup table or constrained `VARCHAR` | `ENUM` when values change often |

## Indexing

Composite index order usually follows equality predicates first, then range or
sort columns:

```sql
CREATE INDEX idx_orders_account_status_created
    ON orders (account_id, status, created_at);

SELECT id, total
FROM ord

---

**ECC Original:** `ECC/skills/mysql-patterns/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:28
