# ⚡ Comando: python-review

> **Adaptado do ECC:** \`ECC/commands/python-review.md\`

## Descrição

Comprehensive Python code review for PEP 8 compliance, type hints, security, and Pythonic idioms. Invokes the python-reviewer agent.

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

---
description: Comprehensive Python code review for PEP 8 compliance, type hints, security, and Pythonic idioms. Invokes the python-reviewer agent.
---

# Python Code Review

This command invokes the **python-reviewer** agent for comprehensive Python-specific code review.

## What This Command Does

1. **Identify Python Changes**: Find modified `.py` files via `git diff`
2. **Run Static Analysis**: Execute `ruff`, `mypy`, `pylint`, `black --check`
3. **Security Scan**: Check for SQL injection, command injection, unsafe deserialization
4. **Type Safety Review**: Analyze type hints and mypy errors
5. **Pythonic Code Check**: Verify code follows PEP 8 and Python best practices
6. **Generate Report**: Categorize issues by severity

## When to Use

Use `/python-review` when:
- After writing or modifying Python code
- Before committing Python changes
- Reviewing pull requests with Python code
- Onboarding to a new Python codebase
- Learning Pythonic patterns and idioms

## Review Categories

### CRITICAL (Must Fix)
- SQL/Command injection vulnerabilities
- Unsafe eval/exec usage
- Pickle unsafe deserialization
- Hardcoded credentials
- YAML unsafe load
- Bare except clauses hiding errors

### HIGH (Should Fix)
- Missing type hints on public functions
- Mutable default arguments
- Swallowing exceptions silently
- Not using context managers for resources
- C-style looping instead of comprehensions
- Using type() instead of isinstance()
- Race conditions without locks

### MEDIUM (Consider)
- PEP 8 formatting violations
- Missing docstrings on public functions
- Print statements instead of logging
- Inefficient string operations
- Magic numbers without named constants
- Not using f-strings for formatting
- Unnecessary list creation

## Automated Checks Run

```bash
# Type checking
mypy .

# Linting and formatting
ruff check .
black --check .
isort --check-only .

# Security scanning
bandit -r .

# Dependency audit
pip-audit
safety check

# Testing
pytest --cov=app --cov-report=term-missing
```

## Example Usage

```text
User: /python-review

---

**ECC Original:** \`ECC/commands/python-review.md\`
**Atualizado em:** 2026-07-02 23:01:59
