# 🧠 Skill: laravel-plugin-discovery

> **Adaptada do ECC:** `laravel-plugin-discovery` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/laravel-plugin-discovery/SKILL.md`

## Descrição

Discover and evaluate Laravel packages via LaraPlugins.io MCP. Use when the user wants to find plugins, check package health, or assess Laravel/PHP compatibility.

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

# Laravel Plugin Discovery

Find, evaluate, and choose healthy Laravel packages using the LaraPlugins.io MCP server.

## When to Use

- User wants to find Laravel packages for a specific feature (e.g. "auth", "permissions", "admin panel")
- User asks "what package should I use for..." or "is there a Laravel package for..."
- User wants to check if a package is actively maintained
- User needs to verify Laravel version compatibility
- User wants to assess package health before adding to a project

## MCP Requirement

LaraPlugins MCP server must be configured. Add to your `~/.claude.json` mcpServers:

```json
"laraplugins": {
  "type": "http",
  "url": "https://laraplugins.io/mcp/plugins"
}
```

No API key required — the server is free for the Laravel community.

## MCP Tools

The LaraPlugins MCP provides two primary tools:

### SearchPluginTool

Search packages by keyword, health score, vendor, and version compatibility.

**Parameters:**
- `text_search` (string, optional): Keyword to search (e.g. "permission", "admin", "api")
- `health_score` (string, optional): Filter by health band — `Healthy`, `Medium`, `Unhealthy`, or `Unrated`
- `laravel_compatibility` (string, optional): Filter by Laravel version — `"5"`, `"6"`, `"7"`, `"8"`, `"9"`, `"10"`, `"11"`, `"12"`, `"13"`
- `php_compatibility` (string, optional): Filter by PHP version — `"7.4"`, `"8.0"`, `"8.1"`, `"8.2"`, `"8.3"`, `"8.4"`, `"8.5"`
- `vendor_filter` (string, optional): Filter by vendor name (e.g. "spatie", "laravel")
- `page` (number, optional): Page number for pagination

### GetPluginDetailsTool

Fetch detailed metrics, readme content, and version history for a specific package.

**Parameters:**
- `package` (string, required): Full Composer package name (e.g. "spatie/laravel-permission")
- `include_versions` (boolean, optional): Include version history in response

---

## How It Works

### Finding Packages

When the user wants to discover packages for a feature:

1. Use `SearchPluginTool` with relevant keywords
2. Apply filters for health score, Laravel version, or PHP version
3. Review the results with package names, descriptions, and health indicators

### Evaluating Packages

When the user wants to assess a specific package:

1. Use `GetPluginDetailsTool` with the package name
2. Review health score, last updated date, Laravel version support
3. Check vendor reputation and risk indicators

### Checking Compatibility

When the user needs Laravel or PHP version compatibility:

1. Search with `laravel_compatibility` filter set to their version
2. Or get details on a specific package to see its supported versions

---

## Examples

### Example: Find Authentication Packages

```
SearchPluginTool({
  text_search: "authentication",
  health_score: "Healthy"
})
```

Returns packages matching "authentication" with healthy status:
- spatie/laravel-permission
- laravel/breeze
- laravel/passport
- etc.

### Example: Find Laravel 12 Compatible Packages

```
SearchPluginTool({
  text_search: 

---

**ECC Original:** `ECC/skills/laravel-plugin-discovery/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:26
