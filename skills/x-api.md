# 🧠 Skill: x-api

> **Adaptada do ECC:** `x-api` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/x-api/SKILL.md`

## Descrição

X/Twitter API integration for posting tweets, threads, reading timelines, search, and analytics. Covers OAuth auth patterns, rate limits, and platform-native content posting. Use when the user wants to interact with X programmatically.

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

# X API

> **Drift-prone skill.** X API endpoints, access tiers, quotas, and write
> permissions change frequently. Verify current developer docs and account
> access before quoting rate limits or implementing a posting/search flow.

Programmatic interaction with X (Twitter) for posting, reading, searching, and analytics.

## When to Activate

- User wants to post tweets or threads programmatically
- Reading timeline, mentions, or user data from X
- Searching X for content, trends, or conversations
- Building X integrations or bots
- Analytics and engagement tracking
- User says "post to X", "tweet", "X API", or "Twitter API"

## Authentication

### OAuth 2.0 Bearer Token (App-Only)

Best for: read-heavy operations, search, public data.

```bash
# Environment setup
export X_BEARER_TOKEN="your-bearer-token"
```

```python
import os
import requests

bearer = os.environ["X_BEARER_TOKEN"]
headers = {"Authorization": f"Bearer {bearer}"}

# Search recent tweets
resp = requests.get(
    "https://api.x.com/2/tweets/search/recent",
    headers=headers,
    params={"query": "claude code", "max_results": 10}
)
tweets = resp.json()
```

### OAuth 1.0a (User Context)

Required for: posting tweets, managing account, DMs, and any write flow.

```bash
# Environment setup — source before use
export X_CONSUMER_KEY="your-consumer-key"
export X_CONSUMER_SECRET="your-consumer-secret"
export X_ACCESS_TOKEN="your-access-token"
export X_ACCESS_TOKEN_SECRET="your-access-token-secret"
```

Legacy aliases such as `X_API_KEY`, `X_API_SECRET`, and `X_ACCESS_SECRET` may exist in older setups. Prefer the `X_CONSUMER_*` and `X_ACCESS_TOKEN_SECRET` names when documenting or wiring new flows.

```python
import os
from requests_oauthlib import OAuth1Session

oauth = OAuth1Session(
    os.environ["X_CONSUMER_KEY"],
    client_secret=os.environ["X_CONSUMER_SECRET"],
    resource_owner_key=os.environ["X_ACCESS_TOKEN"],
    resource_owner_secret=os.environ["X_ACCESS_TOKEN_SECRET"],
)
```

## Core Operations

### Post a Tweet

```python
resp = oauth.post(
    "https://api.x.com/2/tweets",
    json={"text": "Hello from Claude Code"}
)
resp.raise_for_status()
tweet_id = resp.json()["data"]["id"]
```

### Post a Thread

```python
def post_thread(oauth, tweets: list[str]) -> list[str]:
    ids = []
    reply_to = None
    for text in tweets:
        payload = {"text": text}
        if reply_to:
            payload["reply"] = {"in_reply_to_tweet_id": reply_to}
        resp = oauth.post("https://api.x.com/2/tweets", json=payload)
        tweet_id = resp.json()["data"]["id"]
        ids.append(tweet_id)
        reply_to = tweet_id
    return ids
```

### Read User Timeline

```python
resp = requests.get(
    f"https://api.x.com/2/users/{user_id}/tweets",
    headers=headers,
    params={
        "max_results": 10,
        "tweet.fields": "created_at,public_metrics",
    }
)
```

### Search Tweets

```python
resp = requests.get(
    "https://api.x.com/2/tweets/search/recent",
    headers=heade

---

**ECC Original:** `ECC/skills/x-api/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:34
