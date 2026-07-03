# 🧠 Skill: agent-payment-x402

> **Adaptada do ECC:** `agent-payment-x402` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/agent-payment-x402/SKILL.md`

## Descrição

Add x402 payment execution to AI agents with per-task budgets, spending controls, and non-custodial wallets. Supports Base through agentwallet-sdk and X Layer through OKX Payments / OKX Agent Payments Protocol.

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

# Agent Payment Execution (x402)

Enable AI agents to make policy-gated payments with built-in spending controls. Uses the x402 HTTP payment protocol and MCP tools so agents can pay for external services, APIs, or other agents without custodial risk.

## When to Use

Use when: your agent needs to pay for an API call, purchase a service, settle with another agent, enforce per-task spending limits, or manage a non-custodial wallet. Pairs naturally with cost-aware-llm-pipeline and security-review skills.

## Decision Tree

Choose the integration path based on whether your agent is buying access to a paid API or charging others for one:

| Need | Recommended path |
|------|------------------|
| Agent pays a 402-gated API on Base or another agentwallet-supported chain | Use `agentwallet-sdk` as an MCP payment server with strict spending policy |
| Agent pays a 402-gated API on X Layer | Use OKX Agent Payments Protocol from `okx/onchainos-skills`; `okx-x402-payment` is a deprecated legacy alias |
| TypeScript API charges agents | Use OKX Payments TypeScript seller SDK docs for Express, Hono, Fastify, or Next.js |
| Go API charges agents | Use OKX Payments Go seller SDK docs for Gin, Echo, or `net/http` |
| Rust API charges agents | Use OKX Payments Rust seller SDK docs for Axum |
| Java API charges agents | Use OKX Payments Java seller SDK docs for Spring Boot 2/3, Java EE, or Jakarta |
| Python API charges agents | Check the current OKX Payments repository before implementation; a Python seller guide may not be available |

## Supported Networks

- `agentwallet-sdk`: use the package docs to confirm current network coverage before production. Base Sepolia is the safest development default; Base mainnet is the production path called out by the original skill.
- OKX Payments / X Layer: current seller docs target X Layer (`eip155:196`) and USDT0 settlement. Fetch current SDK docs before generating production code because payment packages and facilitator behavior can change quickly.

## How It Works

### x402 Protocol
x402 extends HTTP 402 (Payment Required) into a machine-negotiable flow. When a server returns `402`, the agent's payment tool negotiates price, checks budget, signs a transaction, and retries only inside the policy and confirmation boundary set by the orchestrator.

### Spending Controls
Every payment tool call enforces a `SpendingPolicy`:
- **Per-task budget** — max spend for a single agent action
- **Per-session budget** — cumulative limit across an entire session
- **Allowlisted recipients** — restrict which addresses/services the agent can pay
- **Rate limits** — max transactions per minute/hour

### Non-Custodial Wallets
Agents hold their own keys via ERC-4337 smart accounts. The orchestrator sets policy before delegation; the agent can only spend within bounds. No pooled funds, no custodial risk.

## MCP Integration

The payment layer exposes standard MCP tools that slot into any Claude Code or agent harness setup.

> **Security note**

---

**ECC Original:** `ECC/skills/agent-payment-x402/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:19
