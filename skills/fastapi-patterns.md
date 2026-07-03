# 🧠 Skill: fastapi-patterns

> **Adaptada do ECC:** `fastapi-patterns` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/fastapi-patterns/SKILL.md`

## Descrição

FastAPI best practices covering project structure, Pydantic v2 schemas, dependency injection, async handlers, authentication, authorization, transactional service layers, and testing with httpx and pytest.

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

# FastAPI Patterns

Modern, production-grade FastAPI development: project layout, Pydantic v2 schemas, dependency injection, async patterns, auth, transactional service methods, and testing.

## Project Structure

```text
my_app/
|-- app/
|   |-- main.py               # App factory, lifespan, middleware
|   |-- config.py             # Settings via pydantic-settings
|   |-- dependencies.py       # Shared FastAPI dependencies
|   |-- database.py           # SQLAlchemy engine + session
|   |-- routers/
|   |   `-- users.py
|   |-- models/               # SQLAlchemy ORM models
|   |   `-- user.py
|   |-- schemas/              # Pydantic request/response schemas
|   |   `-- user.py
|   `-- services/             # Business logic layer
|       `-- user_service.py
|-- tests/
|   |-- conftest.py
|   `-- test_users.py
|-- pyproject.toml
`-- .env
```

---

## App Factory and Lifespan

```python
# app/main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base
from app.routers import users


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Automatically create tables on startup for ease of use in dev/demo environments.
    # For strict production applications, manage schemas via Alembic migrations instead.
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown: close pooled resources.
    await engine.dispose()


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=settings.allow_credentials,
        allow_methods=settings.allowed_methods,
        allow_headers=settings.allowed_headers,
    )

    app.include_router(users.router, prefix="/users", tags=["users"])

    return app


app = create_app()
```

---

## Configuration with pydantic-settings

```python
# app/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "My App"
    app_version: str = "0.1.0"
    debug: bool = False

    database_url: str
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # Pydantic-settings v2 safely evaluates mutable list literals directly
    allowed_origins: list[str] = ["http://localhost:3000"]
    allowed_methods: list[str] = ["GET", "POST", "PATCH", "DELETE", "OPTIONS"]
    allowed_headers: list[str] = ["Authorization", "Content-Type"]
    allow_credentials: bool = True


settings = Settings()
```

---

## Pydantic Schemas (v2)

```python
# app/schemas/user.py
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, model_va

---

**ECC Original:** `ECC/skills/fastapi-patterns/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:22
