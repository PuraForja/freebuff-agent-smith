# 🔄 freebuff-ecc-bridge

<div align="center">

**[ECC](https://github.com/affaan-m/ECC) agents and skills for [Freebuff](https://freebuff.com)**

![GitHub last commit](https://img.shields.io/github/last-commit/PuraForja/freebuff-ecc-bridge?branch=master)
![GitHub repo size](https://img.shields.io/github/repo-size/PuraForja/freebuff-ecc-bridge)
![Static Badge](https://img.shields.io/badge/license-proprietary-blue)

---

| 🧠 Skills | 🎯 Agentes |
|:---------:|:----------:|
| 278 | 67 |

**ECC content → Freebuff-compatible format**

</div>

---

## 📋 O que é

O [ECC](https://github.com/affaan-m/ECC) (224k+ ⭐) é um ecossistema massivo de skills e agentes para **Claude Code**. Este projeto adapta esse conteúdo para o **Freebuff**, convertendo agentes para TypeScript e skills para Markdown.

---

## 🚀 Como usar

### Instalar/Atualizar

```bash
# Instalação inicial
bash scripts/ecc-install.sh

# Atualizar apenas novos recursos
bash scripts/ecc-install.sh --update

# Forçar reinstalação completa
bash scripts/ecc-install.sh --force
```

### Usar agentes

```bash
# Usar um agente (TypeScript)
@code-reviewer revise este código

# Listar agentes disponíveis
ls .agents/*.ts

# Usar uma skill (Markdown)
read_files skills/nome-da-skill.md
```

---

## 📁 Estrutura

```
freebuff-ecc-bridge/
├── .agents/              ← 67 agentes TypeScript
│   ├── types/            ← Tipos TypeScript
│   ├── *.ts              ← Agentes convertidos
│   └── .ecc-version      ← Versão do ECC
│
├── skills/               ← 278 skills Markdown
│   └── *.md
│
├── scripts/
│   └── ecc-install.sh    ← Script de instalação
│
├── CATALOGO.md           ← Catálogo completo
├── knowledge.md          ← Documentação
└── README.md             ← Este arquivo
```

---

## 📊 Estatísticas

| Categoria | ECC | Freebuff | Cobertura |
|-----------|:---:|:--------:|:---------:|
| 🧠 Skills | 278 | 278 | **100%** |
| 🎯 Agentes | 67 | 67 | **100%** |

---

## 🔧 Script ecc-install.sh

O script `ecc-install.sh` faz:

1. **Baixa** o ECC do GitHub (clone shallow)
2. **Converte** agentes `.md` → TypeScript `.ts`
3. **Converte** skills `SKILL.md` → Markdown `.md`
4. **Remove** recursos órfãos que não existem mais no ECC
5. **Gera** `CATALOGO.md` atualizado
6. **Valida** TypeScript gerado

### Flags

| Flag | Descrição |
|------|-----------|
| `--update` | Atualiza apenas recursos novos/modificados |
| `--force` | Forçar reinstalação completa |
| `--help` | Mostra ajuda |

---

## ⚠️ Limitações

| Limitação | Detalhe |
|-----------|---------|
| Skills são `.md` | Não são skills registradas no Freebuff — usar `read_files` |
| Modelos limitados | Freebuff suporta apenas mimo/mimo-v2.5 e deepseek/deepseek-v4-flash |

---

## 🔗 Links

- **ECC Original:** [github.com/affaan-m/ECC](https://github.com/affaan-m/ECC) — 224k⭐
- **Freebuff:** [freebuff.com](https://freebuff.com)
- **Repositório:** [github.com/PuraForja/freebuff-ecc-bridge](https://github.com/PuraForja/freebuff-ecc-bridge)

---

<div align="center">

*Gerado a partir do ECC via `ecc-install.sh`*

</div>
