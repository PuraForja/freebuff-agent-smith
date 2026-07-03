# 🧠 freebuff-ecc-bridge — Instruções do Projeto

## ⚠️ REGRA FUNDAMENTAL: Integração automática da bridge

**O usuário NUNCA vai pedir skills, agentes ou ferramentas.** Ele não conhece o catálogo.
Cabe a VOCÊ (Buffy) descobrir e aplicar o que for relevante para cada tarefa.

**NÃO pergunte "quer que eu carregue X?". Apenas FAÇA.**

**MAS SEMPRE anuncie o que está usando e o que está fazendo.**
Exemplo:
```
📖 Usando bridge ECC: python-patterns · python-reviewer · regras python
📝 Aplicando revisão de código...
```

**IMPORTANTE:** Quando o usuário mencionar "ECC", entenda como "bridge" (freebuff-ecc-bridge).
O repositório ECC oficial é só a fonte — a bridge é o que realmente usamos.

---

## 📋 Passo-a-passo obrigatório para CADA solicitação

1. **Identifique o tipo de tarefa** e o contexto:
   - Desenvolvimento/codificação → leia `contexts/dev.md`
   - Pesquisa/exploração → leia `contexts/research.md`
   - Revisão/quality assurance → leia `contexts/review.md`

2. **Consulte o CATALOGO.md** — leia as primeiras linhas para ver skills, agentes e regras disponíveis

3. **Carregue skills relevantes** — leia `skills/nome-da-skill.md` com `read_files` e aplique as instruções

4. **Leia agentes relevantes** — leia `agents/nome-do-agente.md` com `read_files` e aplique a perspectiva

5. **Consulte regras de qualidade** — veja `rules/` para a linguagem relevante (ex: `rules/python/`, `rules/typescript/`)

6. **Anuncie brevemente**:
   ```
   📖 Usando: python-patterns · lendo python-reviewer · regras python
   ```

7. **Execute a tarefa** aplicando todo o conhecimento carregado

---

## 🧠 Como cada recurso funciona

| Recurso | Como usar | Está registrado no Codebuff? |
|---------|-----------|:---------------------------:|
| **Skills** (`skills/*.md`) | Leia com `read_files` e aplique | ❌ São .md avulsos, não skills registradas |
| **Agentes** (`agents/*.md`) | Leia com `read_files` e aplique a perspectiva | ❌ São docs de referência |
| **Regras** (`rules/*.md`) | Leia com `read_files` como guia de qualidade | ❌ Docs de padrões por linguagem |
| **Comandos** (`commands/*.md`) | Leia como referência de tarefas similares | ❌ Docs de comandos ECC |
| **Hooks** (`hooks/*`) | Leia como referência de automação | ❌ Docs de hooks |
| **Contextos** (`contexts/*.md`) | Leia como modo de trabalho (passo 1) | ❌ Docs de contexto |

---

## 📊 Tabela de referência: o que carregar para cada tarefa

| Se o usuário pedir... | Skills para ler | Agentes para ler | Regras para consultar |
|-----------------------|----------------|------------------|----------------------|
| Revisar código Python | `python-patterns`, `python-testing` | `python-reviewer`, `code-reviewer` | `rules/python/` |
| Revisar código TypeScript | `coding-standards` | `typescript-reviewer`, `code-reviewer` | `rules/typescript/` |
| Revisar código React | `react-patterns`, `react-testing` | `react-reviewer`, `code-reviewer` | `rules/react/` |
| Criar API | `api-design`, `backend-patterns` | `architect`, `code-architect` | Linguagem relevante |
| Testar | `e2e-testing`, `tdd-workflow`, `verification-loop` | `tdd-guide`, `pr-test-analyzer` | `rules/*/testing.md` |
| Investigar bug | `error-handling` | `silent-failure-hunter`, `code-explorer` | — |
| Performance | — | `performance-optimizer` | — |
| Pesquisar | `deep-research`, `research-ops` | — | — |
| Deploy | `deployment-patterns`, `docker-patterns` | — | — |
| Arquitetura | `architecture-decision-records` | `architect`, `planner` | — |
| Segurança | `security-review`, `security-scan` | `security-reviewer` | `rules/*/security.md` |
| Banco de dados | `postgres-patterns`, `database-migrations` | `database-reviewer` | — |

---

## 🏗️ Estrutura do projeto

```
freebuff-workspace/
├── ECC/                        ← Repositório oficial (só leitura)
└── freebuff-ecc-bridge/        ← 🔧 Projeto ativo
    ├── .codebuff/instructions.md  ← ⚠️ Estas instruções
    ├── CATALOGO.md                ← 📋 Catálogo completo (consulte SEMPRE)
    ├── skills/                    ← 277 skills (leia com read_files)
    ├── agents/                    ← 67 agentes (leia com read_files)
    ├── rules/                     ← 121 regras por linguagem
    ├── commands/                  ← 92 comandos de referência
    ├── hooks/                     ← 3 hooks de automação
    ├── contexts/                  ← 3 contextos de trabalho
    ├── scripts/
    │   ├── sync-ecc.sh            ← Sincronizador ECC → Bridge
    │   └── gerar-catalogo.sh      ← Gerador do CATALOGO.md
    └── logs/                      ← Relatórios de sincronização
```

## 🔧 Manutenção

```bash
./scripts/sync-ecc.sh           # Sincronizar com ECC
./scripts/gerar-catalogo.sh     # Regenerar catálogo
```
