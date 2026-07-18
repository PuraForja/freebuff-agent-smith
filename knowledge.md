# 🧠 Freebuff Agent Smith — Knowledge File v2.0

## ⚠️ INSTRUÇÕES AUTOMÁTICAS (Obrigatório ler)

**Quando este projeto for aberto no Freebuff/Codebuff:**

1. **Detecte automaticamente** que o `@agent-smith` está disponível em `.agents/agent-smith.ts`
2. **Ofereça ao usuário** as capacidades completas do Agent Smith:
   - Reavaliar agentes (multi-agente)
   - Descobrir repositórios no GitHub
   - Clonar/criar agentes novos
   - Instalar ECC e outros recursos
3. **Leia o arquivo** `.ecc-config.json` para saber o que já está instalado
4. **Sempre use os PRÓPRIOS AGENTES** para reavaliar e melhorar a solução

---

## 🚀 O que é o Freebuff Agent Smith?

**Agent Smith** é um **auto-engenheiro de agentes AI** para o ecossistema Freebuff.

Ele é um **agente híbrido**:
- **`handleSteps`**: Fluxos determinísticos (setup, instalação, verificação)
- **LLM + spawn_agents**: Decisões inteligentes, avaliação multi-agente

### Filosofia: "Agent Smith do Matrix"

Assim como o Agente Smith do Matrix, este agente:
- **Avalia** agentes disponíveis e encontra padrões
- **Clona** agentes existentes para criar novos (local + GitHub)
- **Descobre** repositórios que o usuário não conhece
- **Instala** e adapta qualquer repo para o formato Freebuff
- **Usa os próprios agentes** para se auto-melhorar

---

## 📋 Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `@agent-smith reavalie` | Reavalia multi-agente de todos os agentes |
| `@agent-smith reavalie programação` | Reavalia agentes de programação especificamente |
| `@agent-smith liste` | Lista todos os agentes instalados |
| `@agent-smith crie <descrição>` | Cria um novo agente (pesquisa local + GitHub) |
| `@agent-smith clone <nome>` | Clona e adapta um agente existente |
| `@agent-smith instale <recurso>` | Instala recursos do ECC |
| `@agent-smith descubra` | Pesquisa GitHub por novos repositórios |
| `@agent-smith sugira` | Sugere repositórios para instalar |
| `@agent-smith atualize` | Atualiza recursos instalados |
| `@agent-smith remova <nome>` | Remove recurso instalado |
| `@agent-smith status` | Mostra saúde do sistema |

### Exemplos de Uso

```
@agent-smith reavalie
@agent-smith reavalie programação
@agent-smith crie um revisor de código Rust
@agent-smith descubra
@agent-smith instale python-patterns
```

---

## 🧬 Como Funciona

```
┌─────────────────────────────────────────────────────────────────────┐
│  USUÁRIO                                                            │
│  @agent-smith [comando]                                             │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│  @agent-smith (Orquestrador Híbrido v2.0)                          │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐        │
│  │ handleSteps  │  │  LLM (mimo) │  │  spawn_agents      │        │
│  │ (setup/inst) │  │ (decisões)  │  │  (avaliação multi)  │        │
│  └──────────────┘  └──────────────┘  └────────────────────┘        │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
│  Local (.agents/) │  │  GitHub API  │  │  ECC Repository  │
│  67 agentes TS    │  │  Descoberta  │  │  277 skills      │
│  278 skills MD    │  │  de repos    │  │  67 agents       │
└──────────────────┘  └──────────────┘  └──────────────────┘
```

---

## 🗂️ Estrutura de Diretórios

```
.seu-projeto/
├── .agents/
│   ├── agent-smith.ts         ← Orquestrador híbrido (v2.0)
│   ├── types/                 ← Tipos TypeScript
│   ├── *.ts                   ← 67 agentes TypeScript
│   └── .ecc-version           ← Versão do ECC instalado
├── .agents/types/
│   ├── agent-definition.ts
│   ├── tools.ts
│   └── util-types.ts
├── skills/                    ← 278 skills Markdown
├── scripts/
│   ├── ecc-install.sh         ← Instalador ECC
│   ├── sync-ecc.sh            ← Sincronizador
│   └── auto-review.sh         ← Revisor automático
├── docs/                      ← Documentação do Freebuff
├── .ecc-config.json           ← Configuração e registro
├── CATALOGO.md                ← Catálogo completo
├── knowledge.md               ← Este arquivo
└── .gitignore
```

---

## 🚀 Instalação Rápida

**Linux/Mac:**
```bash
curl -fsSL https://raw.githubusercontent.com/PuraForja/freebuff-agent-smith/master/install.sh | bash
```

**Windows (PowerShell):**
```powershell
iex (Invoke-WebRequest -Uri "https://raw.githubusercontent.com/PuraForja/freebuff-agent-smith/master/install.ps1").Content
```

---

## 📊 Recursos Instalados

| Categoria | Quantidade |
|-----------|:----------:|
| 🎯 Agentes TypeScript | 68 (incluindo agent-smith) |
| 🧠 Skills Markdown | 278 |

### 🏗️ Arquitetura dos Agentes

**Dois modelos:**
| Modelo | Uso |
|--------|-----|
| `mimo/mimo-v2.5` | Análise profunda (reviewers, architects, security) |
| `deepseek/deepseek-v4-flash` | Tarefas rápidas (build-resolvers, refactoring) |

**Padrão consistente:**
- Todos importam `AgentDefinition` de `./types/agent-definition`
- Todos têm `includeMessageHistory: true`
- Todos têm `spawnerPrompt` com descrição

---

## 🔧 Variáveis de Ambiente do Smith

| Variável | Descrição | Default |
|----------|-----------|---------|
| `SMITH_KNOWLEDGE_DIR` | Diretório da biblioteca de conhecimento | `./knowledge/` |
| `SMITH_PATCHES_DIR` | Diretório de patches | `./patches/` |
| `SMITH_WORKSPACE_DIR` | Diretório temporário | `./workspace/` |
| `SMITH_LINEAGE_DIR` | Diretório de linhagens | `./knowledge/lineage/` |
| `SMITH_CONFIDENCE_THRESHOLD` | Threshold mínimo de confiança (0.0-1.0) | `0.70` |
| `SMITH_PROACTIVE_INTERVAL` | Intervalo entre verificações (segundos) | `3600` |

## 📖 Regras Globais do Workspace

O arquivo `knowledge.md` na **raiz do workspace** contém regras OBRIGATÓRIAS que se aplicam a todos os projetos:

### 🎯 Formato Padrão de Apresentação de Agentes
Define como apresentar agentes consultados nas respostas:
- Tabela padronizada com #, Agente, Categoria, Foco, Status
- Formato obrigatório em TODAS as respostas com agentes

### 🧠 Regra Global: Consulta Multi-Agente Obrigatória
- **Sempre usar TODOS os agentes correlacionados** (não apenas 2-3)
- Catálogo completo de agentes por categoria
- Proteção anti-loop (máx 2 rodadas, máx 22 agentes)
- Erros fatais a evitar

**⚠️ Leia sempre o `knowledge.md` da raiz para garantir conformidade com as regras globais.**

---

## 📖 Documentação Disponível

| Arquivo | Descrição |
|---------|----------|
| docs/creating-first-agent.md | Guia para criar seu primeiro agente |
| docs/creating-new-agents.md | Padrões avançados de criação |
| docs/agents-overview.md | Visão geral da arquitetura |
| docs/quick-start.md | Guia de início rápido |

---

## 🧠 Notas Importantes

1. **Auto-melhoria obrigatória**: Sempre que possível, use os PRÓPRIOS AGENTES para avaliar e melhorar o sistema
2. **Conhecimento local primeiro**: Antes de pesquisar no GitHub, leia os agentes já instalados localmente
3. **Instalação interativa**: Sempre avise o usuário antes de instalar algo, mostre alternativas, deixe escolher
4. **Adaptação automática**: Ao instalar de um repo GitHub, os agentes são adaptados automaticamente para o formato Freebuff
5. **Clonagem inteligente**: Pesquisa local + GitHub, compara, e decide se clona, adapta ou cria do zero

