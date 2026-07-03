# 🧠 Skill: codebase-onboarding

> **Adaptada do ECC:** `codebase-onboarding` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/codebase-onboarding/SKILL.md`

## Descrição

Analyze an unfamiliar codebase and generate a structured onboarding guide with architecture map, key entry points, conventions, and a starter CLAUDE.md. Use when joining a new project or setting up Claude Code for the first time in a repo.

---

## ⚠️ Adaptação para Codebuff

Esta skill foi convertida automaticamente do ECC (formato Claude Code) para o
formato Codebuff. Ela mantém o conteúdo essencial do ECC, adaptando
referências específicas do Claude Code:

| Conceito ECC (Claude) | Equivalente Codebuff |
|-----------------------|---------------------|
| Hooks (PreToolUse/PostToolUse) | Instruções no `.codebuff/instructions.md` |
| Comandos slash (/multi-plan, etc.) | Skills carregadas via `skill` tool |
| `settings.json` | `.codebuff/instructions.md` |
| Rules em `~/.claude/rules/` | Skills em `.agents/skills/` |



---

## Conteúdo Adaptado

# Codebase Onboarding

Systematically analyze an unfamiliar codebase and produce a structured onboarding guide. Designed for developers joining a new project or setting up Claude Code in an existing repo for the first time.

## When to Use

- First time opening a project with Claude Code
- Joining a new team or repository
- User asks "help me understand this codebase"
- User asks to generate a CLAUDE.md for a project
- User says "onboard me" or "walk me through this repo"

## How It Works

### Phase 1: Reconnaissance

Gather raw signals about the project without reading every file. Run these checks in parallel:

```
1. Package manifest detection
   → package.json, go.mod, Cargo.toml, pyproject.toml, pom.xml, build.gradle,
     Gemfile, composer.json, mix.exs, pubspec.yaml

2. Framework fingerprinting
   → next.config.*, nuxt.config.*, angular.json, vite.config.*,
     django settings, flask app factory, fastapi main, rails config

3. Entry point identification
   → main.*, index.*, app.*, server.*, cmd/, src/main/

4. Directory structure snapshot
   → Top 2 levels of the directory tree, ignoring node_modules, vendor,
     .git, dist, build, __pycache__, .next

5. Config and tooling detection
   → .eslintrc*, .prettierrc*, tsconfig.json, Makefile, Dockerfile,
     docker-compose*, .github/workflows/, .env.example, CI configs

6. Test structure detection
   → tests/, test/, __tests__/, *_test.go, *.spec.ts, *.test.js,
     pytest.ini, jest.config.*, vitest.config.*
```

### Phase 2: Architecture Mapping

From the reconnaissance data, identify:

**Tech Stack**
- Language(s) and version constraints
- Framework(s) and major libraries
- Database(s) and ORMs
- Build tools and bundlers
- CI/CD platform

**Architecture Pattern**
- Monolith, monorepo, microservices, or serverless
- Frontend/backend split or full-stack
- API style: REST, GraphQL, gRPC, tRPC

**Key Directories**
Map the top-level directories to their purpose:

<!-- Example for a React project — replace with detected directories -->
```
src/components/  → React UI components
src/api/         → API route handlers
src/lib/         → Shared utilities
src/db/          → Database models and migrations
tests/           → Test suites
scripts/         → Build and deployment scripts
```

**Data Flow**
Trace one request from entry to response:
- Where does a request enter? (router, handler, controller)
- How is it validated? (middleware, schemas, guards)
- Where is business logic? (services, models, use cases)
- How does it reach the database? (ORM, raw queries, repositories)

### Phase 3: Convention Detection

Identify patterns the codebase already follows:

**Naming Conventions**
- File naming: kebab-case, camelCase, PascalCase, snake_case
- Component/class naming patterns
- Test file naming: `*.test.ts`, `*.spec.ts`, `*_test.go`

**Code Patterns**
- Error handling style: try/catch, Result types, error codes
- Dependency injection or direct imports
- State management approach
- Async patterns: callbacks, promises, async/await, channels

**Git Conventions**
- Branch naming from recent branches
- Commit message style from recent commits
- PR workflow (squash, merge, rebase)
- If the repo has no commits yet or only a shallow history (e.g. `git clone --depth 1`), skip this section and note "Git history unavailable or too shallow to detect conventions"

---

## Referência

- **ECC Original:** `ECC/skills/codebase-onboarding/SKILL.md`
- **Atualizado em:** 2026-07-01 11:58:49
