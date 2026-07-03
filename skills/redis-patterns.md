# 🧠 Skill: redis-patterns

> **Adaptada do ECC:** `redis-patterns` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/redis-patterns/SKILL.md`

## Descrição

Redis data structure patterns, caching strategies, distributed locks, rate limiting, pub/sub, and connection management for production applications.

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

# Redis Patterns

Quick reference for Redis best practices across common backend use cases.

## How It Works

Redis is an in-memory data structure store that supports strings, hashes, lists, sets, sorted sets, streams, and more. Individual Redis commands are atomic on a single instance; multi-step workflows require Lua scripts, MULTI/EXEC transactions, or explicit synchronization to stay atomic. Data is optionally persisted via RDB snapshots or AOF logs. Clients communicate over TCP using the RESP protocol; connection pools are essential to avoid per-request handshake overhead.

## When to Activate

- Adding caching to an application
- Implementing rate limiting or throttling
- Building distributed locks or coordination
- Setting up session or token storage
- Using Pub/Sub or Redis Streams for messaging
- Configuring Redis in production (pooling, eviction, clustering)

## Data Structure Cheat Sheet

| Use Case | Structure | Example Key |
|----------|-----------|-------------|
| Simple cache | String | `product:123` |
| User session | Hash | `session:abc` |
| Leaderboard | Sorted Set | `scores:weekly` |
| Unique visitors | Set | `visitors:2024-01-01` |
| Activity feed | List | `feed:user:456` |
| Event stream | Stream | `events:orders` |
| Counters / rate limits | String (INCR) | `ratelimit:user:123` |
| Bloom filter / HLL | HyperLogLog | `hll:pageviews` |

## Core Patterns

### Cache-Aside (Lazy Loading)

```python
import redis
import json

r = redis.Redis(host='localhost', port=6379, decode_responses=True)

def get_product(product_id: int):
    cache_key = f"product:{product_id}"
    cached = r.get(cache_key)

    if cached:
        return json.loads(cached)

    product = db.query("SELECT * FROM products WHERE id = %s", product_id)
    r.setex(cache_key, 3600, json.dumps(product))  # TTL: 1 hour
    return product
```

### Write-Through Cache

```python
def update_product(product_id: int, data: dict):
    # Write to DB first
    db.execute("UPDATE products SET ... WHERE id = %s", product_id)

    # Immediately update cache
    cache_key = f"product:{product_id}"
    r.setex(cache_key, 3600, json.dumps(data))
```

### Cache Invalidation

```python
# Tag-based invalidation — group related keys under a set
def cache_product(product_id: int, category_id: int, data: dict):
    key = f"product:{product_id}"
    tag = f"tag:category:{category_id}"
    pipe = r.pipeline(transaction=True)
    pipe.setex(key, 3600, json.dumps(data))
    pipe.sadd(tag, key)
    pipe.expire(tag, 3600)
    pipe.execute()

def invalidate_category(category_id: int):
    tag = f"tag:category:{category_id}"
    keys = r.smembers(tag)
    if keys:
        r.delete(*keys)
    r.delete(tag)
```

### Session Storage

```python
import time
import uuid

def create_session(user_id: int, ttl: int = 86400) -> str:
    session_id = str(uuid.uuid4())
    key = f"session:{session_id}"
    pipe = r.pipeline(transaction=True)
    pipe.hset(key, mapping={
        "user_id": user_id,
        "

---

**ECC Original:** `ECC/skills/redis-patterns/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:31
