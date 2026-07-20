# SPEC — Freebuff Agent Smith V2 v3.0

> **Especificação Técnica**
> Versão: 3.1 · Data: 16/07/2026 · Autor: Rolim + Buffy (IA)
>
> 📌 **Propósito:** Especificar COMO o Smith será implementado — arquitetura, decisões técnicas, componentes.
> Assume que você leu o `01-PRD.md` (O QUÊ e POR QUÊ).

---

## 1. Visão Geral da Arquitetura

### 1.1 Diagrama de Fluxo

```
┌──────────────────────────────────────────────────────────────────┐
│                      FONTES (Read Only)                           │
│  ┌─────┐  ┌───────┐  ┌────────┐  ┌──────────┐  ┌───────┐       │
│  │ ECC │  │ GitHub│  │ CrewAI │  │LangGraph │  │Hermes │  + etc │
│  └──┬──┘  └───┬───┘  └───┬────┘  └────┬─────┘  └───┬───┘       │
│     └─────────┴──────────┴────────────┴─────────────┘           │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │  DESTILADOR │  ← Extrai CONHECIMENTO
                    │  de         │    (conceitos, padrões,
                    │  Conhecimento│    princípios)
                    │  + Anti-    │
                    │  Alucinação │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ BIBLIOTECA  │  ← Armazena DNA
                    │ SMITH       │    (conhecimento reutilizável)
                    │             │    + Linhagem completa
                    │             │    + Índice pesquisável
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼──────┐ ┌──▼────────┐ ┌─▼───────────┐
       │  CRIADOR    │ │OBSERVADOR │ │ GERENCIADOR │
       │  de Agents  │ │ de        │ │ de Patches  │
       │  + Revalida-│ │Ecossistema│ │ + Diagnos-  │
       │  ção        │ │+ Contexto │ │ tico        │
       │             │ │ Aware     │ │             │
       └──────┬──────┘ └──┬────────┘ └─┬───────────┘
              │            │            │
              └────────────┼────────────┘
                           │
                    ┌──────▼──────┐
                    │  WORKSPACE  │  ← Artefatos temporários
                    │  (temp)     │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  RESULTADO  │  ← Agents, Skills, Patches, PRs
                    │  Final      │
                    └─────────────┘
```

### 1.2 Stack Técnica

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| **Agent Principal** | TypeScript (.agents/*.ts) | Padrão Freebuff |
| **Modelo LLM** | mimo/mimo-v2.5 | Análise profunda |
| **Modelo Rápido** | deepseek/deepseek-v4-flash | Tarefas leves |
| **Banco de Conhecimento** | JSON + Markdown | Simples, versionável |
| **GitHub API** | REST + GraphQL | Descoberta de repos (análise remota) |
| **Git CLI** | git clone/pull | Análise local + patches + PRs |
| **Workspace** | Diretório temporário | Isolamento de experimentos |
| **Ferramentas** | spawn_agents, read_files, code_search, web_search | Tools existentes |

---

## 2. Decisões Técnicas (ADRs)

> 💡 **IDs estáveis:** Cada ADR tem ID único (`SPEC-ADR-NNN`) para rastreamento de mudanças entre versões.

### SPEC-ADR-001: Conhecimento, não Código

| Campo | Detalhe |
|-------|---------|
| **Contexto** | Precisamos reaproveitar conhecimento entre frameworks sem copiar código |
| **Opção A** | Copiar código e adaptar (como fazemos hoje) |
| **Opção B** | Extrair conceitos e princípios abstratos |
| **Decisão** | **Opção B** — Extrair CONHECIMENTO reutilizável |
| **Motivo** | Código fica obsoleto em meses. Princípios duram décadas |
| **Consequência** | Mais complexo de implementar, mas muito mais poderoso |

### SPEC-ADR-002: Nunca Modificar Originais

| Campo | Detalhe |
|-------|---------|
| **Contexto** | Precisamos manter rastreabilidade e compatibilidade |
| **Opção A** | Modificar repositórios originais diretamente |
| **Opção B** | Camada Read Only + Patches separados |
| **Decisão** | **Opção B** — Originais são intocáveis |
| **Motivo** | Preserva compatibilidade, facilita atualizações, permite contribuição de volta |
| **Consequência** | Necessidade de sistema de patches |

### SPEC-ADR-003: Artefatos, não Arquivos

| Campo | Detalhe |
|-------|---------|
| **Contexto** | Agentes são compostos de múltiplos elementos (prompts, tools, configs) |
| **Opção A** | Tratar como arquivos (.ts, .md) |
| **Opção B** | Abstrair como "artefatos" tipados com discriminated unions |
| **Decisão** | **Opção B** — Tudo é um artefato tipado |
| **Motivo** | Permite operações uniformes + type safety em compile-time |
| **Consequência** | Camada de abstração adicional, mas agents inválidos são impedidos em tempo de compilação |

**O que são artefatos?** Artefato é o nome genérico para qualquer elemento que o Smith manipula:

```
Artefatos
├── Agent        → Arquivo .ts que define um agente AI
├── Skill        → Arquivo .md com instruções reutilizáveis
├── Prompt       → Template de prompt para LLM
├── Tool         → Ferramenta (ex: code_search, read_files)
├── Fluxo        → Padrão de workflow (handleSteps)
├── Memória      → Conhecimento acumulado
├── Configuração → Config (ex: .ecc-config.json)
├── MCP          → Configuração MCP
├── Template     → Template de projeto
└── Teste        → Caso de teste
```

**Implementação com Discriminated Unions:** Em vez de uma interface genérica que permite estados ilegais, usaremos **discriminated unions** do TypeScript. Cada tipo de artefato tem EXATAMENTE os campos que precisa:

```typescript
// 🎯 Discriminated Union — cada tipo tem seus campos obrigatórios
type Artifact = 
  | { 
      type: 'agent'; 
      id: string; 
      instructionsPrompt: string; 
      model: string; 
      toolNames: string[];
      lineage?: Lineage;
    }
  | { 
      type: 'skill'; 
      id: string; 
      description: string; 
      content: string;
      lineage?: Lineage;
    }
  | { 
      type: 'prompt'; 
      id: string; 
      template: string; 
      variables: string[];
    }
  | { 
      type: 'tool'; 
      id: string; 
      description: string; 
      parameters: Record<string, unknown>;
    }
  | { 
      type: 'fluxo'; 
      id: string; 
      steps: string[]; 
      pattern: string;
    }
  | { 
      type: 'config'; 
      id: string; 
      data: Record<string, unknown>;
    }
  | { 
      type: 'test'; 
      id: string; 
      cases: string[];
    }
```

Vantagens:
- ✅ TypeScript valida em **compile-time** que todos os campos obrigatórios existem
- ✅ Cada tipo tem sua própria estrutura — sem campos opcionais espalhados
- ✅ `type` é a chave discriminadora — `switch(type)` dá autocomplete
- ❌ Impossível criar um `Agent` sem `instructionsPrompt` ou `model`

Todos os artefatos compartilham operações comuns: **criar, clonar, adaptar, instalar, rastrear linhagem**.

### SPEC-ADR-004: Linhagem Obrigatória

| Campo | Detalhe |
|-------|---------|
| **Contexto** | Precisamos saber de onde veio cada componente |
| **Opção A** | Metadados opcionais |
| **Opção B** | Linhagem obrigatória em todo artefato |
| **Decisão** | **Opção B** — Toda transformação é rastreada |
| **Motivo** | Permite atualizações seguras, contribuição de volta, auditoria |
| **Consequência** | Overhead mínimo na criação |

### SPEC-ADR-005: Anti-Alucinação em Agents Gerados

| Campo | Detalhe |
|-------|---------|
| **Contexto** | LLMs podem alucinar ao gerar código para agents, produzindo agents quebrados |
| **Opção A** | Confiar que o LLM gera código correto |
| **Opção B** | Aplicar pipeline anti-alucinação (grounding + CoVe + confidence scoring) |
| **Decisão** | **Opção B** — Inspirado no projeto `solucao-medica`, que implementou 5 camadas anti-alucinação |
| **Motivo** | Agents quebrados geram retrabalho e podem danificar o ecossistema local |
| **Consequência** | Camada adicional de validação, mas agents mais confiáveis |

### SPEC-ADR-006: Dois Modos de Integração Git

| Campo | Detalhe |
|-------|---------|
| **Contexto** | Precisamos interagir com repositórios Git de duas formas diferentes |
| **Opção A** | Sempre clonar localmente |
| **Opção B** | Dois modos: análise remota (descoberta) + clone local (instalação/patches) |
| **Decisão** | **Opção B** — Análise remota via API GitHub para descoberta; clone local para instalação |
| **Motivo** | Análise remota é mais rápida e não ocupa espaço; clone é necessário para operações profundas |
| **Consequência** | Implementação dupla (API REST + git CLI), mas cobertura completa de cenários |

---

## 3. Estrutura do Projeto

```
freebuff-agent-smith-v2/
├── .agents/
│   ├── agent-smith-v2.ts              ← Agente principal (v3.0)
│   ├── types/
│   │   ├── agent-definition.ts     ← Tipos de agent
│   │   ├── artifact.ts             ← NOVO: Tipos de artefato
│   │   ├── lineage.ts              ← NOVO: Tipos de linhagem
│   │   ├── patch.ts                ← NOVO: Tipos de patch
│   │   └── knowledge.ts            ← NOVO: Tipos de conhecimento
│   └── *.ts                        ← Agents existentes
├── skills/                         ← 278 skills existentes
├── knowledge/                      ← NOVO: Banco de conhecimento
│   ├── patterns/                   ← Padrões extraídos
│   ├── principles/                 ← Princípios de engenharia
│   ├── lineage/                    ← Linhagem dos artefatos
│   ├── anti-hallucination/         ← NOVO: Regras anti-alucinação
│   └── index.json                  ← Índice de tudo
├── patches/                        ← NOVO: Patches aplicados
│   ├── ecc/                        ← Patches no ECC
│   ├── github/                     ← Patches em repos GitHub
│   └── index.json                  ← Registro de patches
├── workspace/                      ← NOVO: Workspace temporário
│   └── (criado dinamicamente)
├── docs/
│   ├── 01-PRD.md                   ← Requisitos
│   ├── 02-SPEC.md                  ← Este arquivo
│   ├── 03-PLAN.md                  ← Plano de implementação
│   ├── 04-TASKS.md                 ← Tarefas
│   ├── 05-REVIEW.md                ← Revisão
│   └── COLETANEA-IDÉIAS-SMITH.md   ← Referência bruta
├── scripts/
│   ├── ecc-install.sh
│   └── sync-ecc.sh
├── .ecc-config.json
├── knowledge.md
├── CATALOGO.md
└── SESSAO.md
```

---

## 4. Componentes

### SPEC-SEC-4.1 Destilador de Conhecimento

**Responsabilidade:** Extrair CONHECIMENTO (conceitos, padrões, princípios) de repositórios, NÃO código.

**Interface de conexão com outros componentes:**
- **Entrada:** Recebe URL/nome do repositório (do usuário ou do Observador)
- **Saída:** Envia conhecimento extraído para `biblioteca.storeKnowledge()`
- **Chamadas externas:** API GitHub (`@octokit/rest`), git CLI
- **Eventos:** `knowledge.extracted` (disparado quando DNA é extraído)

**Duas modalidades de integração Git:**
1. **Análise Remota (descoberta):** Lê arquivos via API GitHub REST/GraphQL — sem baixar nada localmente. Ideal para catalogar e avaliar rapidamente.
2. **Clone Local (instalação):** Baixa o repositório completo com `git clone`. Necessário para patches profundos, análise completa e contribuição de volta (PRs).

**Fluxo:**
```
1. Receber URL/nome do repositório
2. Escolher modalidade (remota para descoberta, clone para instalação)
3. Listar agents e skills do repo
4. Para cada agente:
   a. Ler instructionsPrompt
   b. Identificar padrões (antes de fazer X, sempre faz Y)
   c. Generalizar o conceito (sem depender de linguagem)
   d. Classificar qualidade (1-10)
   e. Extrair "DNA" reutilizável
5. Aplicar validação anti-alucinação no conhecimento extraído
6. Salvar na Biblioteca Smith
7. Atualizar linhagem
```

**Fluxo expandido com descoberta de entry points (baseado em `@code-explorer`):**

```
1. RECEBER URL/NOME DO REPOSITÓRIO

2. ENTRY POINT DISCOVERY (nova etapa)
   a. Detectar entry points: package.json → main, next.config.* → pages
   b. Identificar estrutura: app/, src/, routes/, controllers/
   c. Mapear dependências: libs externas e módulos internos

3. ESCOLHER MODALIDADE
   a. Remota (API GitHub) → para descoberta rápida
   b. Clone Local (git clone) → para análise profunda

4. ANALISAR AGENTS E SKILLS
   a. Listar agents e skills disponíveis
   b. Para cada entry point, traçar caminho de execução
   c. Identificar padrões arquiteturais

5. EXTRAIR CONHECIMENTO
   a. Ler instructionsPrompt
   b. Identificar padrões (antes de fazer X, sempre faz Y)
   c. Generalizar o conceito (sem depender de linguagem)
   d. Classificar qualidade (1-10)
   e. Extrair "DNA" reutilizável

6. APLICAR VALIDAÇÃO ANTI-ALUCINAÇÃO
7. SALVAR NA BIBLIOTECA SMITH
8. ATUALIZAR LINHAGEM
```

**Exemplo de DNA extraído:**
```json
{
  "concept": "Planner before Execute",
  "description": "Antes de qualquer execução, criar um plano estruturado",
  "origin": "ECC/planner + CrewAI/planner",
  "quality": 9.2,
  "confidence": 0.94,
  "applicableTo": ["any-language", "any-framework"],
  "pattern": "planejar → aprovar → executar → revisar"
}
```

### SPEC-SEC-4.2 Observador de Ecossistema

**Responsabilidade:** Monitorar o ecossistema local ativamente e sugerir melhorias com inteligência contextual.

**Interface de conexão com outros componentes:**
- **Entrada:** Recebe eventos de `patches.verifyAll()`, `biblioteca.searchPatterns()`
- **Saída:** Envia sugestões para o usuário; agenda descobertas para o Destilador
- **Eventos:** `ecosystem.duplicateFound`, `ecosystem.inconsistencyFound`, `ecosystem.agentUnhealthy`

**Capacidades:**
1. **Proatividade Contextual:** Monitora continuamente, mas só interrompe o usuário em momentos adequados (quando detecta pausa ou diminuição de atividade). Anota descobertas para apresentar depois.
2. **Detecção de duplicação:** Encontra padrões repetidos em múltiplos agents
3. **Consolidação:** Sugere extrair código comum para Skill compartilhada
4. **Padronização:** Detecta implementações inconsistentes do mesmo conceito
5. **Qualidade:** Avalia agents e sugere melhorias
6. **Saúde:** Monitora tamanho, complexidade, dependências
7. **Diagnóstico de agentes problemáticos:** Detecta agents que pararam de funcionar ou estão com comportamento anômalo

**Implementação técnica do Contexto-Aware:**
O Smith usa uma estratégia em 2 níveis para não interromper o usuário:

- **Nível 1 (Mínimo Viável):** Sugestões são **agendadas** para o próximo início de conversa. Quando o usuário der um comando novo, o Smith apresenta as sugestões acumuladas.
- **Nível 2 (Avançado):** Monitora o intervalo entre mensagens do usuário. Se > 5 minutos sem resposta, considera que o usuário está inativo e pode sugerir. Se < 30 segundos entre mensagens, está em fluxo ativo — não interrompe.

**Exemplo de mensagem proativa (contexto adequado):**
```
👁️ Observador detectou (anotado enquanto você trabalhava):
- 12 agents usam a mesma lógica de "Research First"
- Possível consolidar em uma Skill compartilhada
- Economia estimada: 430 linhas

[Quando você estiver livre:] Deseja analisar?
```

### SPEC-SEC-4.3 Gerenciador de Patches

**Responsabilidade:** Gerenciar personalizações aplicadas a repositórios de terceiros.

**Interface de conexão com outros componentes:**
- **Entrada:** Recebe diagnóstico do Observador; recebe comandos do usuário
- **Saída:** Envia patches para `biblioteca.registerLineage()`; gera PRs para GitHub
- **Eventos:** `patch.created`, `patch.incompatible`, `patch.removed`

**Operações:**
1. **Criar patch:** Registrar modificação feita em artefato de terceiros
2. **Listar patches:** Mostrar todos os patches aplicados
3. **Verificar compatibilidade:** Detectar quando atualização quebra patches
4. **Remover patch:** Quando upstream implementou oficialmente
5. **Gerar PR:** Preparar Pull Request para contribuir a melhoria de volta ao repositório original do projeto (ex: enviar de volta para o ECC oficial no GitHub)
6. **Diagnosticar agentes:** Analisar agent com comportamento anômalo e sugerir correção ou evolução *(veja fluxo completo em 6.3)*

**Estrutura de Patch:**
```json
{
  "id": "patch-001",
  "target": "ECC/skills/pdf-reader",
  "targetVersion": "2.1",
  "description": "Adicionar suporte a UTF-8",
  "createdAt": "2026-07-16",
  "status": "active",
  "linesChanged": 12,
  "tokenReduction": "28%"
}
```

**Fluxo de Diagnóstico de Agente Problemático:**
```
Usuário: "Smith, o agente X está esquisito, revalide o código dele"
    ↓
Smith analisa o agent X (instruções, tools, comportamento)
    ↓
Smith compara com:
  - Fonte original (ECC, GitHub)
  - Outros agents similares na Biblioteca Smith
  - Skills e padrões disponíveis
    ↓
Smith identifica: "Encontrei 2 problemas:
  1. [Problema específico]
  2. [Oportunidade de melhoria com base em conceito de outro projeto]"
    ↓
Smith pergunta:
  "Deseja:
   1. 🔧 Apenas corrigir (patch) — volta a funcionar como antes
   2. 🚀 Corrigir + evoluir para v2.0 — com melhorias de outros agents
   3. 🔍 Revisar relatório completo"
```

### SPEC-SEC-4.4 Biblioteca de Padrões

**Responsabilidade:** Armazenar padrões de engenharia extraídos de múltiplos projetos.

**Interface de conexão com outros componentes:**
- **Entrada:** Recebe conhecimento do Destilador (`storeKnowledge()`), registra linhagem do Gerenciador de Patches
- **Saída:** Fornece padrões para o CRIADOR (`searchPatterns()`), fornece linhagem para auditoria
- **Eventos:** `knowledge.added`, `knowledge.indexUpdated`

> 📖 **Plano detalhado:** `03-PLAN.md#fase-6-biblioteca-de-padrões`

**Como funciona:**
- Cada padrão é armazenado como um **artefato de conhecimento** em formato JSON + Markdown
- O índice (`knowledge/index.json`) permite busca rápida por conceito, origem, qualidade
- A biblioteca é **versionada** (git-friendly) e pode evoluir com o tempo
- Smith pode **ler projetos Git de renome** automaticamente para popular a biblioteca com padrões consolidados do mercado

**Funcionamento interno:**
```
knowledge/
├── patterns/
│   ├── planner-before-execute.json    ← Padrão extraído
│   ├── research-first.json
│   ├── anti-hallucination-pipeline.json ← Populado via solucao-medica
│   └── ...
├── principles/
│   ├── single-responsibility.json     ← Princípios de engenharia
│   ├── separation-of-concerns.json
│   ├── grounding-first.json           ← Populado via solucao-medica
│   └── ...
├── lineage/
│   ├── agent-smith-v2.json               ← Linhagem do agent-smith-v2
│   ├── code-reviewer.json
│   └── ...
├── anti-hallucination/                ← Populado com 5 camadas!
│   ├── grounding-rules.md             ← Regras de grounding (Camada 0)
│   ├── chain-of-verification.md       ← Técnica CoVe (Camada 1)
│   ├── confidence-scoring.md          ← Score de confiança (Camada 2)
│   ├── output-guardrails.md           ← Guardrails de saída (Camada 3)
│   └── human-in-the-loop.md           ← HITL (Camada 4)
└── index.json                         ← Índice pesquisável (populado)

> ✅ **Status atual:** A Biblioteca Smith já está populada com 7 artefatos
> de conhecimento anti-alucinação, destilados do projeto `solucao-medica`.
> Isso inclui as 5 camadas completas + 1 padrão + 1 princípio.
```

**Expansão automática:** Smith pode ser configurado para ler periodicamente repositórios Git de referência e extrair novos padrões automaticamente, mantendo a biblioteca sempre atualizada.

**Critérios para seleção de repositórios de referência:**
- **Estrelas no GitHub:** ≥ 1000 estrelas (relevância comunitária)
- **Relevância:** Relacionados a agents AI, padrões de engenharia, ou arquitetura de software
- **Diversidade:** Múltiplas linguagens e frameworks (Python, TypeScript, Rust, Go, etc.)
- **Lista inicial curada:** 5-10 repositórios definidos manualmente, configuráveis via `SMITH_REFERENCE_REPOS`
- **Atualização:** Revisão trimestral da lista de referência

**Padrões iniciais:**
| Padrão | Descrição | Origem |
|--------|-----------|--------|
| Planner before Execute | Planejar antes de executar | ECC, CrewAI |
| Research First | Pesquisar antes de criar | ECC |
| Self Review | Autoavaliação obrigatória | ECC |
| Least Artifact | Menor artefato capaz | Conceitual |
| Read Only Source | Nunca modificar originais | Git, Conceitual |
| Lineage Tracking | Rastrear origem sempre | Git |
| Patch System | Personalizar sem modificar | apt, npm |
| Knowledge over Code | Extrair conceitos | Conceitual |
| Grounding First | Toda resposta deve ter fonte | solucao-medica |

---

### SPEC-SEC-4.5 Sistema Anti-Alucinação

**Responsabilidade:** Garantir que agents gerados pelo Smith sejam confiáveis e funcionais.

> ✅ **Biblioteca já populada:** O conhecimento das 5 camadas já foi destilado em `knowledge/anti-hallucination/`. Consulte também a skill `anti-hallucination-baseline`.

Inspirado no sistema de 5 camadas do projeto `solucao-medica`:

| Camada | Técnica | Aplicação no Smith |
|:------:|---------|--------------------|
| 0 | **Grounding** | Toda recomendação e código gerado devem ter fonte verificável |
| 1 | **Chain of Verification** | Smith verifica a própria saída antes de apresentar ao usuário |
| 2 | **Confidence Scoring** | Cada recomendação tem score de confiança (0-10) |
| 3 | **Output Guardrails** | Validação de que o agent gerado é sintaticamente e semanticamente correto |
| 4 | **Human in the Loop** | Decisão final sempre humana — Smith sugere, usuário decide |

**Implementação:**
- Skills anti-alucinação em `knowledge/anti-hallucination/`
- Validação aplicada a TODO artefato gerado pelo Smith
- Log de confiança para auditoria e melhoria contínua

---

## 5. Configuração

### 5.1 Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `SMITH_KNOWLEDGE_DIR` | Diretório da biblioteca | `./knowledge/` |
| `SMITH_PATCHES_DIR` | Diretório de patches | `./patches/` |
| `SMITH_WORKSPACE_DIR` | Diretório temporário | `./workspace/` |
| `GITHUB_TOKEN` | Token para API GitHub | `ghp_xxx` |
| `SMITH_CONFIDENCE_THRESHOLD` | Threshold mínimo de confiança | `0.70` |
| `SMITH_PROACTIVE_INTERVAL` | Intervalo entre verificações proativas | `3600` (1 hora) |

### 5.2 Dependências

| Pacote | Versão | Finalidade |
|--------|--------|------------|
| @octokit/rest | latest | API GitHub (análise remota) |
| @octokit/types | latest | Tipos TypeScript para API GitHub |
| typescript | ^5.0 (strict mode) | Tipagem com strict mode habilitado |
| (ferramentas existentes) | — | spawn_agents, read_files, etc. |

---

## 6. Fluxos Principais

### 6.1 Criar Agent

```
Usuário: "Quero um agente de pesquisa"
    ↓
Smith: "Pesquisando local + GitHub..."
    ↓
Smith: "Encontrei 3 opções:
  1. ECC/search (qualidade 9.2)
     → Agente especializado em pesquisa web com verificação de fontes.
        Usa Research First + Source Validation. ~200 linhas de instruções.

  2. CrewAI/researcher (qualidade 8.5)
     → Agente de pesquisa em equipe, com delegação de subtarefas.
        Bom para fluxos colaborativos. ~150 linhas de instruções.

  3. Criar do zero
     → Smith cria um agente novo baseado nos padrões da Biblioteca Smith.
        Mais flexível, mas requer mais validação."
    ↓
Usuário: "Opção 1"
    ↓
Smith: "Extraindo conhecimento do ECC/search..."
    ↓
Smith: "DNA extraído: Research First + Source Validation"
    ↓
Smith: "Criando workspace temporário..."
    ↓
Smith: "Adaptando para formato Freebuff..."
    ↓
Smith: (Aplica validação anti-alucinação no agente gerado)
    ↓
Smith: "Agent criado! Linhagem registrada."
    ↓
Usuário: "Salvar como novo agent"
    ↓
Smith: "Salvo em .agents/research-agent.ts"
    ↓
Smith: "Linhagem: ECC/search v2.1 → Smith v3.0 → MeuProjeto"
```

### 6.2 Detectar Incompatibilidade

```
Smith (verificação semanal):
    ↓
"ECC recebeu atualização v2.2"
    ↓
"Verificando 5 patches aplicados..."
    ↓
"4 patches compatíveis ✅"
    ↓
"1 patch incompatível ⚠️"
    ↓
"Patch: pdf-reader-utf8
 Target: ECC/skills/pdf-reader
 Motivo: ECC v2.2 adicionou suporte UTF-8 oficialmente"
    ↓
"Deseja:
  1. Remover patch (já implementado upstream)
  2. Manter patch (customizações adicionais)
  3. Revisar diff"
```

### 6.3 Revalidar Agente Problemático

```
Usuário: "Smith, o agente tradutor está esquisito, revalide o código dele"
    ↓
Smith: "Analisando agent tradutor..."
    ↓
Smith lê o agent, verifica instruções e tools
    ↓
Smith consulta a Biblioteca Smith por padrões similares
    ↓
Smith consulta fontes originais (ECC, GitHub) para ver se há atualizações
    ↓
Smith: "Diagnóstico completo:
   
   🔍 Problemas encontrados:
   - Instrução desatualizada: refere-se a uma tool que não existe mais
   - Padrão desalinhado: poderia usar 'Research First' como base
   
   💡 Oportunidade detectada:
   - Projeto X no GitHub implementou uma abordagem melhor para tradução
   - Podemos adaptar o conceito para criar uma v2.0
   
   Deseja:
   1. 🔧 Corrigir (patch 1.1) — só atualizar a tool desatualizada
   2. 🚀 Corrigir + Evoluir (v2.0) — incorporar melhoria do Projeto X
   3. 🔍 Ver relatório completo"
```

---

## 7. Considerações de Performance

| Gargalo | Impacto | Mitigação |
|---------|---------|-----------|
| Destilação de repo grande | Alto | Cache de conhecimento, processamento incremental |
| Muitos patches | Médio | Índices JSON, verificação lazy |
| Workspace temporário | Baixo | Limpeza automática após uso |
| Verificação anti-alucinação | Médio | Executar apenas em agents gerados, não em toda operação |
| Observador proativo | Baixo | Intervalo configurável, execução em background |

---

## 8. Anti-Alucinação — Detalhamento Técnico

O sistema anti-alucinação do Smith é inspirado diretamente no projeto `solucao-medica`, que implementou 5 camadas de mitigação para agentes clínicos de IA. No contexto do Smith, a alucinação pode gerar **agents quebrados, instruções incorretas ou código inseguro**.

### Camada 0: Grounding
- Toda sugestão, recomendação ou código gerado deve ter **fonte verificável**
- Se o dado não está na fonte (ECC, GitHub, Biblioteca Smith), o Smith não deve inventá-lo
- Implementado como regra no `instructionsPrompt` do Smith

### Camada 1: Chain of Verification (CoVe)
- Após gerar um artefato, o Smith cria perguntas de verificação
- Responde a essas perguntas com base nas fontes
- Se detectar inconsistência, corrige antes de apresentar

### Camada 2: Confidence Scoring
- Cada recomendação recebe um score de 0.0 a 1.0
- Scores abaixo de `SMITH_CONFIDENCE_THRESHOLD` (default: 0.70) são sinalizados
- O score é baseado em: completude, consistência com fontes, ausência de contradições
- Métricas objetivas associadas:
  - **Tempo médio de diagnóstico** < 2 minutos
  - **Taxa de agents que voltam a funcionar após correção** > 95%

### Camada 3: Output Guardrails
- Agents gerados são validados:
  - Sintaxe TypeScript válida
  - Tools referenciadas existem
  - Estrutura AgentDefinition completa
  - Nenhum campo obrigatório ausente
  - **Qualidade de comentários:**
    - [ ] Comentários não são redundantes (não repetir o código)
    - [ ] Funções exportadas têm JSDoc/TSDoc
    - [ ] TODO/FIXME têm referência a issue
    - [ ] Nenhum comentário desatualizado ou enganoso

### Camada 4: Human in the Loop
- **Toda ação com impacto é aprovada pelo usuário**
- Smith recomenda, nunca impõe
- O usuário pode aceitar, rejeitar ou modificar qualquer sugestão

---

## 9. Segurança da Plataforma Smith

> 🛡️ **Achado de:** `@security-reviewer`

O PRD e SPEC focam em segurança dos agents que o Smith manipula, mas é preciso garantir também a **segurança da própria ferramenta Smith**:

### 9.1 Validação de Entrada
- **Comandos do usuário:** Sanitizar nomes de agents, URLs de repositórios e parâmetros antes de usar
- **Proteção contra prompt injection:** O Smith não deve executar instruções embedding em conteúdo de terceiros
- **Validação de URLs:** Antes de clonar ou acessar um repo, verificar se a URL é válida e segura

### 9.2 Proteção de Credenciais
- **Tokens de API:** O Smith nunca deve expor tokens em logs, outputs ou agents gerados
- **GitHub Token:** Armazenado apenas em `GITHUB_TOKEN` (env var), nunca no código
- **Menor privilégio:** O Smith só acessa o que precisa para a tarefa atual

### 9.3 Integridade dos Artefatos
- **Verificação de origem:** Antes de instalar um agent de terceiros, verificar integridade
- **Auditoria:** Toda modificação é registrada na linhagem (já implementado em SPEC-ADR-004)

---

## 10. Performance e Escalabilidade

> ⚡ **Achado de:** `@performance-optimizer`, `@database-reviewer`

### 10.1 Estratégia de Indexação da Biblioteca Smith

| Volume | Backend | Adequado até |
|:------:|---------|:------------:|
| **< 100 artifacts** | JSON + Markdown (atual) | ✅ Ideal |
| **100 - 500 artifacts** | JSON + índices em memória | ✅ OK |
| **500 - 2000 artifacts** | SQLite com FTS5 | 🔄 Migrar |
| **> 2000 artifacts** | SQLite ou banco dedicado | ⚠️ Planejar |

**Regra de migração:** Quando `knowledge/index.json` exceder 500KB ou `searchPatterns()` demorar > 500ms, migrar para SQLite.

**Integridade referencial:** A linhagem (`knowledge/lineage/`) deve ser mantida consistente. Se um artifact for removido, sua linhagem deve ser arquivada, não deletada.

### 10.2 Métricas de Performance

| Operação | Meta | Como medir |
|----------|:----:|:-----------|
| `searchPatterns(query)` | < 500ms | Log de tempo por busca |
| `registerLineage(artifact)` | < 100ms | Log de tempo por registro |
| `discoverRemote(repoUrl)` | < 3min | Timeout configurável |
| `cloneLocal(repoPath)` | < 5min | Timeout configurável |

---

## 11. Tratamento de Falhas e Fallbacks

> 🕵️ **Achado de:** `@silent-failure-hunter`

O Smith depende de APIs externas que podem falhar. Cada operação deve ter fallback explícito:

| Operação | Dependência | E se falhar? | Fallback |
|:---------|:------------|:-------------|:---------|
| `discoverRemote()` | GitHub REST API | Rate limit, token expirado | Tentar cache local; informar usuário |
| `extractKnowledge()` | LLM (mimo/deepseek) | Modelo indisponível, timeout | Usar template pré-definido; logar erro |
| `cloneLocal()` | Git CLI + GitHub | Repo não encontrado | Tentar download ZIP via API GitHub |
| `generatePr()` | GitHub API + Git | Fork conflict | Preparar diff local para submissão manual |

**Princípio:** NUNCA falhar silenciosamente. Toda falha deve ser comunicada ao usuário.

---

## 12. Referências e Links Oficiais

> 📚 **Achado de:** `@docs-lookup`

- [Freebuff Docs - Criando Agents](https://freebuff.com/docs/creating-new-agents)
- [Freebuff Docs - Agents Overview](https://freebuff.com/docs/agents-overview)
- [ECC Repository](https://github.com/affaan-m/ECC)
- [Freebuff Agent Smith V2](https://github.com/PuraForja/freebuff-agent-smith-v2)
- [solucao-medica (Anti-Hallucination Reference)](https://github.com/PuraForja/solucao-medica)
- [Chain-of-Verification Paper (Meta FAIR, 2024)](https://arxiv.org/abs/2309.11495)

---

## 13. Limitações Conhecidas

| Limitação | Detalhe | Impacto |
|-----------|---------|---------|
| API GitHub rate limit | 5000 req/hora | Limitar destilações simultâneas |
| LLM pode alucinar | Conceitos abstratos podem ser mal extraídos | Mitigado pelo anti-alucinação, mas validação humana recomendada |
| Patches complexos | Múltiplas modificações no mesmo arquivo | Limitar a 1 patch por arquivo |
| Frameworks novos | Nem todos têm estrutura analisável | Fallback para análise manual |
| Análise remota depende de API | Sem internet, descoberta limitada | Clone local como fallback |

---

> 🔗 **Documentos relacionados:** `01-PRD.md` (requisitos), `03-PLAN.md` (plano de implementação)
> 📖 **Especificado no PRD:** Seções `PRD-US-001` a `PRD-US-009` (User Stories)

---

*Documento mantido por: Rolim + Buffy*
*ID do documento: SPEC-v3.1*
*Próxima revisão: Após aprovação do GATE 1*
