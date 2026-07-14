# 🔄 freebuff-agent-smith

<div align="center">

**Ponte de adaptação entre o [ECC](https://github.com/affaan-m/ECC) e o [Codebuff](https://codebuff.com)**

![GitHub last commit](https://img.shields.io/github/last-commit/PuraForja/freebuff-agent-smith?branch=master)
![GitHub repo size](https://img.shields.io/github/repo-size/PuraForja/freebuff-agent-smith)
![Static Badge](https://img.shields.io/badge/license-proprietary-blue)

---

| 🧠 Skills | 🎯 Agentes | 📏 Regras | ⚡ Comandos | 🔌 Hooks | 📝 Contextos |
|:---------:|:----------:|:---------:|:-----------:|:--------:|:------------:|
| 277 | 67 | 121 | 92 | 3 | 3 |

**563 recursos do ECC adaptados → 100% de cobertura**

> \* Bridge tem 278 skills (1 extra: `infinite-improvement-loop.md` — skill própria)

</div>

---

## 📋 O que é

O [ECC](https://github.com/affaan-m/ECC) (224k+ ⭐) é um ecossistema massivo de skills, agentes e regras para **Claude Code**. Este projeto cria uma **ponte** entre o ECC e o **Codebuff**, adaptando automaticamente todo o conteúdo para o formato nativo do Codebuff.

**Você não precisa conhecer o catálogo.** A IA (Buffy) carrega automaticamente as skills e agentes relevantes para cada tarefa.

---

## 🚀 Como usar

### Na prática (usuário)

Apenas **peça tarefas normalmente**. A IA descobre e aplica as ferramentas relevantes automaticamente:

| Você pede... | A IA carrega automaticamente... |
|--------------|---------------------------------|
| "Revise este código Python" | `python-patterns` + `python-reviewer` + regras Python |
| "Crie uma API" | `api-design` + `backend-patterns` + `architect` |
| "Teste isso" | `e2e-testing` + `tdd-workflow` + `tdd-guide` |
| "Investigue um bug" | `error-handling` + `silent-failure-hunter` |
| "Melhore performance" | `performance-optimizer` |
| "Pesquise sobre X" | `deep-research` + `research-ops` |
| "Faça deploy" | `deployment-patterns` + `docker-patterns` |

### Sincronizar com o ECC oficial

```bash
./scripts/sync-ecc.sh
```

Isso atualiza o clone do ECC e adapta automaticamente skills, agentes, regras, comandos, hooks e contextos novos.

---

## 📦 Repositório

```bash
git clone https://github.com/PuraForja/freebuff-agent-smith.git
cd freebuff-agent-smith
```

---

## 📁 Estrutura

```
freebuff-agent-smith/
├── .codebuff/
│   └── instructions.md     ← ⚠️ Instruções permanentes (NÃO ignore)
├── .gitignore
├── CATALOGO.md             ← 📋 Catálogo completo de recursos
├── README.md               ← Este arquivo
├── SESSAO.md               ← 📓 Registro de sessão (continuidade)
│
├── skills/                 ← 🧠 277 skills adaptadas
│   ├── coding-standards.md
│   ├── api-design.md
│   ├── error-handling.md
│   ├── deep-research.md
│   └── ...
│
├── agents/                 ← 🎯 67 agentes como docs de referência
│   ├── code-reviewer.md
│   ├── architect.md
│   ├── security-reviewer.md
│   ├── python-reviewer.md
│   ├── typescript-reviewer.md
│   └── ...
│
├── rules/                  ← 📏 121 regras de qualidade por linguagem
│   ├── python/
│   ├── typescript/
│   ├── golang/
│   ├── react/
│   └── ...
│
├── commands/               ← ⚡ 92 comandos de referência ECC
├── hooks/                  ← 🔌 3 hooks adaptados
├── contexts/               ← 📝 3 contextos de trabalho
│
├── scripts/
│   ├── sync-ecc.sh         ← 🔄 Sincronizador principal (9 passos, 6 categorias)
│   ├── gerar-catalogo.sh   ← 📊 Gerador do CATALOGO.md (otimizado: ~15s)
│   ├── auto-review.sh      ← 🔍 Auto-revisão de qualidade (372 checks)
│   ├── auto-sync-check.sh  ← ⏰ Verificador automático (.bashrc)
│   └── infinite-improvement-loop.sh  ← 🔁 Loop de melhoria contínua
│
└── logs/                   ← 📄 Relatórios de sincronização (gitignored)
```

---

## 📊 Estatísticas

| Categoria | ECC | Bridge | Cobertura |
|-----------|:---:|:------:|:---------:|
| 🧠 Skills | 277 | 278* | **100%** |
| 🎯 Agentes | 67 | 67 | **100%** |
| 📏 Regras | 121 | 121 | **100%** |
| ⚡ Comandos | 92 | 92 | **100%** |
| 🔌 Hooks | 3 | 3 | **100%** |
| 📝 Contextos | 3 | 3 | **100%** |
| **Total** | **563** | **564** | **100%** |

### Principais linguagens cobertas (rules)

| Linguagem | Regras |
|-----------|:------:|
| Python | coding-style, patterns, security, testing |
| TypeScript | coding-style, patterns, security, testing |
| Golang | coding-style, patterns, security, testing |
| React | patterns, performance, testing |
| Rust | patterns, testing, security |
| Kotlin | patterns, coroutines, testing |
| +15 outras | cada uma com 3-4 regras |

---

## 🔄 Auto-Review

O projeto inclui um sistema de auto-revisão que verifica **372 pontos de qualidade**:

```bash
bash scripts/auto-review.sh
```

✅ Sintaxe bash de todos os scripts
✅ Permissões de execução
✅ Encoding UTF-8
✅ Validação cruzada diretório × catálogo
✅ Proveniência e documentação

---

## ⚠️ Limitações conhecidas

| Limitação | Detalhe |
|-----------|---------|
| Skills NÃO registradas | As skills são arquivos `.md` — NÃO skills registradas no Codebuff. Ler com `read_files` |
| Agentes NÃO spawnáveis | Agentes são docs de referência, não `@AgentName` executáveis |
| ECC tools não usadas | Scripts nativos do ECC (`ecc.js`, `catalog.js`) NÃO são usados — só o conteúdo |

---

## 🔗 Links

- **ECC Original:** [github.com/affaan-m/ECC](https://github.com/affaan-m/ECC) — 224k⭐
- **Codebuff:** [codebuff.com](https://codebuff.com)
- **Bridge (aqui):** [github.com/PuraForja/freebuff-agent-smith](https://github.com/PuraForja/freebuff-agent-smith)

---

<div align="center">

**Feito com ☕ e loops de melhoria contínua**

*Primeiro commit: `b88f886` · 03/07/2026*

</div>
