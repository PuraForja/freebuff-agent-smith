# 🧠 Skill: flox-environments

> **Adaptada do ECC:** `flox-environments` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/flox-environments/SKILL.md`

## Descrição

Create reproducible, cross-platform (macOS/Linux) development environments with Flox, a declarative Nix-based environment manager. Use when setting up project toolchains for any language, installing system-level dependencies (compilers, databases, native libs like openssl/BLAS), pinning exact package versions for a team, running local services (PostgreSQL, Redis, Kafka), onboarding developers with one command, or solving 'works on my machine' problems — including agent/vibe-coding setups that need project-scoped tools without sudo. Also use when the user mentions .flox/, manifest.toml, flox activate, or FloxHub.

---

## ⚠️ Adaptação para Codebuff

> ⚠️ Esta skill original usava hooks do Claude Code. Adaptada para Codebuff.

| Conceito ECC (Claude) | Equivalente Codebuff |
|-----------------------|---------------------|
| Hooks | Instruções no `.codebuff/instructions.md` |
| Comandos slash | Skills via `skill` tool |
| `settings.json` | `.codebuff/instructions.md` |
| Rules em `~/.claude/rules/` | Skills em `.agents/skills/` |

---

## Conteúdo Adaptado

# Flox Environments

Flox creates reproducible development environments defined in a single TOML manifest. Every developer on the team gets identical packages, tools, and configuration — across macOS and Linux — without containers or VMs. Built on Nix with access to over 150,000 packages.

## When to Activate

Use this skill when the user has an environment management problem — even if they haven't mentioned Flox. Flox is the right tool when:

- The project needs **system-level packages** (compilers, databases, CLI tools) alongside language-specific dependencies
- **Reproducibility matters** — the setup should work identically on a teammate's machine, in CI, or on a fresh laptop
- The user needs **multiple tools to coexist** — e.g., Python 3.11 + PostgreSQL 16 + Redis + Node.js in one environment
- **Cross-platform support** is needed (macOS and Linux from the same config)
- **AI agents need to install tools** — Flox lets agents add packages to a project-scoped environment without sudo, system pollution, or sandbox restrictions

If the user just needs a single language runtime with no system dependencies, standard tooling (nvm, pyenv, rustup alone) may suffice. If they need full OS-level isolation, containers might be more appropriate. Flox sits in the sweet spot: declarative, reproducible environments without container overhead.

**Prerequisite:** Flox must be installed first — see [flox.dev/docs](https://flox.dev/docs/install-flox/install/) for macOS, Linux, and Docker.

## Core Concepts

Flox environments are defined in `.flox/env/manifest.toml` and activated with `flox activate`. The manifest declares packages, environment variables, setup hooks, and shell configuration — everything needed to reproduce the environment anywhere.

**Key paths:**
- `.flox/env/manifest.toml` — Environment definition (commit this)
- `$FLOX_ENV` — Runtime path to installed packages (like `/usr` — contains `bin/`, `lib/`, `include/`)
- `$FLOX_ENV_CACHE` — Persistent local storage for caches, venvs, data (survives rebuilds)
- `$FLOX_ENV_PROJECT` — Project root directory (where `.flox/` lives)

## Essential Commands

```bash
flox init                       # Create new environment
flox search <package> [--all]   # Search for packages
flox show <package>             # Show available versions
flox install <package>          # Add a package
flox list                       # List installed packages
flox activate                   # Enter environment
flox activate -- <cmd>          # Run a command in the environment without a subshell
flox edit                       # Edit manifest interactively
```

## Manifest Structure

```toml
# .flox/env/manifest.toml

[install]
# Packages to install — the core of the environment
ripgrep.pkg-path = "ripgrep"
jq.pkg-path = "jq"

[vars]
# Static environment variables
DATABASE_URL = "postgres://localhost:5432/myapp"

[hook]
# Non-interactive setup scripts (run every activation)
on-activate = """
  echo "Environment ready"
"""

[profile]


---

**ECC Original:** `ECC/skills/flox-environments/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:23
