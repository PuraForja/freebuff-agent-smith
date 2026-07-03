# 🧠 Skill: django-celery

> **Adaptada do ECC:** `django-celery` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/django-celery/SKILL.md`

## Descrição

Django + Celery async task patterns — configuration, task design, beat scheduling, retries, canvas workflows, monitoring, and testing. Use when adding background jobs, scheduled tasks, or async processing to a Django app.

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

# Django + Celery Async Task Patterns

Production-grade patterns for background task processing in Django using Celery with Redis or RabbitMQ.

## When to Activate

- Adding background jobs or async processing to a Django app
- Implementing periodic/scheduled tasks
- Offloading slow operations (email, PDF generation, API calls) from request cycle
- Setting up Celery Beat for cron-like scheduling
- Debugging task failures, retries, or queue backlogs
- Writing tests for Celery tasks

## Project Setup

### Installation

```bash
pip install 'celery[redis]' django-celery-results django-celery-beat
```

### `celery.py` — App Entrypoint

```python
# config/celery.py
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')

app = Celery('myproject')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()  # Discovers tasks.py in each INSTALLED_APP

@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
```

```python
# config/__init__.py
from .celery import app as celery_app

__all__ = ('celery_app',)
```

### Django Settings

```python
# config/settings/base.py

# Broker (Redis recommended for production)
CELERY_BROKER_URL = env('CELERY_BROKER_URL', default='redis://localhost:6379/0')
CELERY_RESULT_BACKEND = env('CELERY_RESULT_BACKEND', default='django-db')

# Serialization
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'

# Task behavior
CELERY_TASK_TRACK_STARTED = True
CELERY_TASK_TIME_LIMIT = 30 * 60        # Hard limit: 30 min
CELERY_TASK_SOFT_TIME_LIMIT = 25 * 60   # Soft limit: sends SoftTimeLimitExceeded
CELERY_WORKER_PREFETCH_MULTIPLIER = 1   # Prevent worker hoarding long tasks
CELERY_TASK_ACKS_LATE = True            # Re-queue on worker crash

# Result persistence
CELERY_RESULT_EXPIRES = 60 * 60 * 24   # Keep results 24 hours

# Beat scheduler (for periodic tasks)
CELERY_BEAT_SCHEDULER = 'django_celery_beat.schedulers:DatabaseScheduler'

# Installed apps
INSTALLED_APPS += [
    'django_celery_results',
    'django_celery_beat',
]
```

### Running Workers

```bash
# Start worker (development)
celery -A config worker --loglevel=info

# Start beat scheduler (periodic tasks)
celery -A config beat --loglevel=info --scheduler django_celery_beat.schedulers:DatabaseScheduler

# Combined worker + beat (dev only, never production)
celery -A config worker --beat --loglevel=info

# Production: multiple workers with concurrency
celery -A config worker --loglevel=warning --concurrency=4 -Q default,high_priority
```

## Task Design Patterns

### Basic Task

```python
# apps/notifications/tasks.py
from celery import shared_task
import logging

logger = logging.getLogger(__name__)

@shared_task(name='notifications.send_welcome_email')
def send_welcome_email(user_id: int) -> None:
    """Send welcome email to newly registered user."""
    from apps.users.models import Use

---

**ECC Original:** `ECC/skills/django-celery/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:21
