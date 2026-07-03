# 📏 Regra: common — hooks

> **Adaptada do ECC:** \`rules/common/hooks.md\`
> **Fonte original:** \`ECC/rules/common/hooks.md\`

## Descrição

Hooks System

---

## Conteúdo Adaptado

# Hooks System

## Hook Types

- **PreToolUse**: Before tool execution (validation, parameter modification)
- **PostToolUse**: After tool execution (auto-format, checks)
- **Stop**: When session ends (final verification)

## Auto-Accept Permissions

Use with caution:
- Enable for trusted, well-defined plans
- Disable for exploratory work
- Never use dangerously-skip-permissions flag
- Configure `allowedTools` in `~/.claude.json` instead

## TodoWrite Best Practices

Use TodoWrite tool to:
- Track progress on multi-step tasks
- Verify understanding of instructions
- Enable real-time steering
- Show granular implementation steps

Todo list reveals:
- Out of order steps
- Missing items
- Extra unnecessary items
- Wrong granularity
- Misinterpreted requirements

---

**ECC Original:** \`ECC/rules/common/hooks.md\`
**Atualizado em:** 2026-07-02 23:01:50
