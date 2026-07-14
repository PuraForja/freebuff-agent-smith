# 🤖 Freebuff Agente Smit

<div align="center">

**Agente de instalação e gerenciamento de skills do ECC para Freebuff/Codebuff**

![GitHub last commit](https://img.shields.io/github/last-commit/PuraForja/freebuff-agent-smith?branch=master)
![GitHub repo size](https://img.shields.io/github/repo-size/PuraForja/freebuff-agent-smith)
![Static Badge](https://img.shields.io/badge/license-proprietary-blue)

---

**563 recursos do ECC adaptados → 100% de cobertura**

</div>

---

## 📋 O que é

O **Freebuff Agente Smit** é um agente que instala e gerencia skills, agents e rules do [ECC](https://github.com/affaan-m/ECC) (224k+ ⭐) para o [Freebuff](https://freebuff.com) e [Codebuff](https://codebuff.com).

**Como funciona:**
1. Execute o script de instalação (`install.sh` ou `install.ps1`)
2. O agente `@agent-smith` é instalado automaticamente
3. Use `@agent-smith` no Freebuff/Codebuff para instalar recursos do ECC

---

## 🚀 Instalação Rápida

### Windows (PowerShell)
```powershell
iex (Invoke-WebRequest -Uri "https://raw.githubusercontent.com/PuraForja/freebuff-agent-smith/master/install.ps1").Content
```

### Linux/Mac (Bash)
```bash
curl -fsSL https://raw.githubusercontent.com/PuraForja/freebuff-agent-smith/master/install.sh | bash
```

---

## 🤖 Usando o @agent-smith

Após a instalação, abra o Freebuff/Codebuff no diretório do seu projeto e use:

```
@agent-smith instale python-patterns
@agent-smith instale error-handling
@agent-smith instale api-design
@agent-smith liste
```

### Exemplos de uso

| Você pede... | O @agent-smith instala... |
|--------------|---------------------------|
| "Revise este código Python" | `python-patterns` + `python-reviewer` |
| "Crie uma API" | `api-design` + `backend-patterns` |
| "Teste isso" | `e2e-testing` + `tdd-workflow` |
| "Investigue um bug" | `error-handling` + `silent-failure-hunter` |
| "Melhore performance" | `performance-optimizer` |
| "Pesquise sobre X" | `deep-research` + `research-ops` |
| "Faça deploy" | `deployment-patterns` + `docker-patterns` |

---

## 📁 O que é instalado

```
.seu-projeto/
├── .agents/
│   ├── agent-smith.ts        ← O agente instalador
│   ├── types/                ← Tipos TypeScript
│   └── installed/
│       ├── ecc-skills/       ← Skills do ECC
│       ├── ecc-agents/       ← Agents do ECC
│       ├── ecc-rules/        ← Rules do ECC
│       └── custom/           ← Seus resources personalizados
├── .ecc-config.json          ← Configuração e registro
├── knowledge.md              ← Documentação do projeto
└── .gitignore                ← Ignora .agents/installed/
```

---

## 📊 Recursos Disponíveis

| Categoria | Quantidade |
|-----------|:----------:|
| 🧠 Skills | 277 |
| 🎯 Agents | 67 |
| 📏 Rules | 121 |
| ⚡ Commands | 92 |
| 🔌 Hooks | 3 |
| 📝 Contexts | 3 |
| **Total** | **563** |

### Principais linguagens cobertas

| Linguagem | Recursos |
|-----------|:--------:|
| Python | coding-style, patterns, security, testing |
| TypeScript | coding-style, patterns, security, testing |
| Golang | coding-style, patterns, security, testing |
| React | patterns, performance, testing |
| Rust | patterns, testing, security |
| Kotlin | patterns, coroutines, testing |
| +15 outras | cada uma com 3-4 recursos |

---

## 🔧 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `install.sh` | Instalador para Linux/Mac |
| `install.ps1` | Instalador para Windows |
| `scripts/sync-ecc.sh` | Sincroniza com o ECC oficial |
| `scripts/gerar-catalogo.sh` | Gera o catálogo de recursos |
| `scripts/auto-review.sh` | Verificação de qualidade |

---

## 📚 Documentação

- **[knowledge.md](knowledge.md)** - Instruções para o Freebuff/Codebuff
- **[CATALOGO.md](CATALOGO.md)** - Lista completa de recursos
- **[SESSAO.md](SESSAO.md)** - Registro de sessão e continuidade

---

## 🔗 Links

- **GitHub:** [github.com/PuraForja/freebuff-agent-smith](https://github.com/PuraForja/freebuff-agent-smith)
- **ECC Original:** [github.com/affaan-m/ECC](https://github.com/affaan-m/ECC) — 224k⭐
- **Freebuff:** [freebuff.com](https://freebuff.com)
- **Codebuff:** [codebuff.com](https://codebuff.com)

---

<div align="center">

**Feito com ☕ e loops de melhoria contínua**

</div>
