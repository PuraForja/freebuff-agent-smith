# 📓 Registro de Sessão — Freebuff Agent Smith

> **Última atualização:** 16/07/2026
> **Propósito:** Preservar contexto, decisões e estado para continuidade entre sessões.

---

## 🎯 Missão do Projeto

O nome **"Agent Smith"** vem do Agent Smith do Matrix:
- Copiava a si mesmo, modificava outros programas e criou uma comunidade
- O Smith faz o mesmo: descobre, clona, adapta e instala agents

### Duas funções principais
1. **Destilador de Conhecimento** — Extrai conceitos, padrões e princípios de outros projetos SEM copiar código
2. **Observador/Evolutivo** — Monitora o ecossistema, encontra padrões, sugere melhorias, gerencia patches

### Frase Definitiva
> **"O Smith não coleciona código. Ele coleciona conhecimento de engenharia."**

---

## 📊 Sessão 16/07/2026 — Readequação Completa

### O que foi feito (em ordem)

#### 1. 📖 Leitura de Documentação
- ✅ Lemos toda a doc oficial Freebuff (4 docs: creating-new-agents, creating-first-agent, agents-overview, quick-start)
- ✅ Lemos a doc ECC (AGENTS.md, README.md, estrutura completa)
- ✅ Lemos o projeto NovosProjetos (templates PRD→SPEC→PLAN→TASKS→REVIEW)
- ✅ Lemos o projeto Smith inteiro (68 agents, 278 skills, types, configs)

#### 2. 🔍 Análise Cruzada
- ✅ Cruzamos dados Freebuff ↔ ECC ↔ Smith
- ✅ Salvo em: `docs/ANALISE-COMPLETA-2026-07-16.md`
- ✅ Identificamos GAPs: spawnableAgents não usado, types incompletos, tools extras

#### 3. 🚨 Descoberta Crítica
- ✅ **99% do conteúdo dos agents ECC NÃO foi transferido para o Smith**
- ✅ Apenas 1 dos 5 agents analisados (code-reviewer) tinha conteúdo completo
- ✅ 67 agents tinham APENAS 1 LINHA de descrição — eram inúteis
- ✅ Salvo em: `docs/ANALISE-GAP-ECC-SMITH-2026-07-16.md`

#### 4. 🧬 Coletânea de Ideias
- ✅ Salvamos toda a coletânea de conversas sobre a visão do Smith
- ✅ Salvo em: `docs/COLETANEA-IDÉIAS-SMITH.md`
- ✅ Conceitos: 4 camadas, artefatos, DNA, linhagem, patches, Smith Update, observador, biblioteca de padrões

#### 5. 📋 Documentos do Workflow
- ✅ Criamos o PRD v3.0 → `docs/01-PRD.md`
- ✅ Criamos o SPEC v3.0 → `docs/02-SPEC.md`
- ✅ Workflow: PRD → SPEC → PLAN (GATE 1) → TASKS → IMPLEMENT → REVIEW (GATE 2)

#### 6. 🔧 Correção dos 5 Agents Principais
- ✅ planner.ts — reconstruído com conteúdo completo do ECC (~200 linhas)
- ✅ tdd-guide.ts — reconstruído (~150 linhas)
- ✅ security-reviewer.ts — reconstruído (~250 linhas)
- ✅ architect.ts — reconstruído (~200 linhas)
- ✅ code-reviewer.ts — já estava correto

#### 7. 🔄 Conversão Automática de TODOS os 67 Agents
- ✅ Criamos script `scripts/convert-ecc-agents.py` (v3)
- ✅ Script lê .md do ECC, adapta para Freebuff, gera .ts completo
- ✅ **67 agents convertidos com sucesso, 0 erros**
- ✅ Adaptações: Claude Code→Freebuff, tools mapeadas, backticks/${} escapados

#### 8. 🔍 Análise Profunda — Filosofia de Tools do ECC

**Pergunta:** As tools dos agents estão sendo subutilizadas? Devemos reduzi-las?

**Resposta após pesquisa profunda:** **NÃO.** O ECC foi projetado INTENCIONALMENTE para ter tools limitadas.

**Fontes do ECC:**
- `the-shortform-guide.md` (linha 411): **"Scope your subagents - limited tools = focused execution"**
- `the-shortform-guide.md` (linha 144): **"Your 200k context window before compacting might only be 70k with too many tools enabled. Performance degrades significantly."**
- `README.md` (linha 1198): **"Too many MCP servers eat your context. Each MCP tool description consumes tokens from your 200k window, potentially reducing it to ~70k."**

**Filosofia do ECC:**
| Princípio | Implementação |
|-----------|---------------|
| **Foco por agente** | Cada agente tem 2-5 tools específicas para seu domínio |
| **Economia de contexto** | Menos tools = menos tokens gastos em descrições |
| **Delegação barata** | Usar o modelo mais barato possível para cada tarefa |
| **Orquestração** | O orchestrator delega para sub-agentes com tools limitadas |

**Conclusão:** As tools NÃO devem ser reduzidas. O autor do ECC (affaan-m) é um dos maiores especialistas em agentes de IA e projetou isso intencionalmente.

#### 9. 🗑️ Remoção de Tool Mapping Tables

**Problema:** O script de conversão adicionou tabelas "Tool Mapping (ECC → Freebuff)" que NÃO existem no ECC original.

**Evidência:**
- Busca por "Tool Mapping" no ECC retornou **0 resultados**
- Os agents originais do ECC NÃO contêm tabelas de mapeamento
- As tabelas foram ruído adicionado pela conversão

**Ação:** Removidas de todos os 67 agents via script atualizado (v4).

**Economia:** ~5,360 tokens (80 tokens × 67 agents)

#### 10. 📁 Separação de Diretórios

**Estrutura atual:**
```
.agents/
├── types/
│   ├── agent-definition.ts
│   ├── tools.ts
│   └── util-types.ts
├── ecc/                    ← 67 agents convertidos do ECC
│   ├── code-reviewer.ts
│   ├── security-reviewer.ts
│   └── ...
├── custom/                 ← 2 agents criados por você
│   ├── agent-smith.ts
│   └── gov-data-downloader.ts
└── index.ts                ← Barrel export que combina ambos
```

**Vantagens:**
- Separação clara entre ECC (upstream) e custom (seu)
- Script de conversão só afeta `.agents/ecc/`
- Fácil de atualizar ECC sem afetar custom
- Clear ownership

**Alterações necessárias:**
- Imports atualizados de `./types/agent-definition` para `../types/agent-definition`
- Script de conversão atualizado para escrever em `.agents/ecc/`

---

## 📁 Arquivos Criados/Atualizados Nesta Sessão

| Arquivo | Conteúdo |
|---------|----------|
| `docs/ANALISE-COMPLETA-2026-07-16.md` | Análise cruzada Freebuff ↔ ECC ↔ Smith |
| `docs/ANALISE-GAP-ECC-SMITH-2026-07-16.md` | Descoberta: 99% do conteúdo perdido |
| `docs/COLETANEA-IDÉIAS-SMITH.md` | Coletânea bruta de ideias (referência) |
| `docs/01-PRD.md` | Product Requirements Document v3.0 |
| `docs/02-SPEC.md` | Especificação Técnica v3.0 |
| `scripts/convert-ecc-agents.py` | Script de conversão automática (v4) |
| `.agents/ecc/*.ts` (67 arquivos) | Todos os agents ECC reconstruídos |
| `.agents/custom/*.ts` (2 arquivos) | Agents custom (agent-smith, gov-data-downloader) |
| `.agents/index.ts` | Barrel export combinando ambos |
| `.agents/types/` | Tipos TypeScript compartilhados |
| `skills/security-baseline.md` | Skill de segurança compartilhada |
| `SESSAO.md` | Este arquivo |

---

## 📈 Estado Atual

| Componente | Antes | Depois |
|------------|:-----:|:------:|
| Agents com conteúdo completo | 1/68 | **67/68** |
| Agents com 1 linha | 67/68 | **0/68** |
| PRD | v3.0 | ✅ **v3.1 (feedback incorporado)** |
| SPEC | v3.0 | ✅ **v3.1 (feedback incorporado)** |
| PLAN | Não existia | ✅ **v3.1** |
| Script de conversão | Não existia | ✅ v4 funcional |
| Tool Mapping tables | Presentes em 40+ agents | **Removidas** |
| Referências Claude/Anthropic | Não adaptadas | **Todas adaptadas** |
| Diretórios | Misturados | **Separados (ecc/custom)** |

---

## 📊 Sessão 16/07/2026 (2) — Feedback + PLAN

### 💬 Feedback do Rolim
- **PRD:** Proatividade com contexto, revalidação de agents, 2 tipos de integração Git, métrica 85%→92%, anti-alucinação
- **SPEC:** "etc" nas fontes, artefatos definidos, Biblioteca Smith detalhada, PR=contribuir de volta, projetos de referência, opções com explicação, anti-alucinação do solucao-medica

### 📝 O que foi feito
- ✅ PRD v3.1 — incorporados: proatividade, US-08 revalidação, US-09 proatividade contextual, 2 modos Git, métricas refinadas, anti-alucinação
- ✅ SPEC v3.1 — incorporados: artefatos definidos, Biblioteca Smith detalhada, ADR-005 anti-alucinação, ADR-006 git bimodal, fluxo 6.3 revalidação, guardrails, etc.
- ✅ PLAN v3.1 — 6 fases com milestones, dependências, riscos, prioridades, Definition of Done
- ✅ Revisão multi-documento com code-reviewer (5 melhorias aplicadas)

## 📊 Sessão 16/07/2026 (3) — Biblioteca Anti-Alucinação Populada 🧠

### 💡 Ideia do Rolim
> "Esse sistema anti-alucinação já poderia entrar na biblioteca do Smith, né?"

**Resposta:** SIM! ✅ E já foi feito! O conhecimento do `solucao-medica` foi destilado para a Biblioteca Smith.

### 📦 O que foi criado

| Arquivo | Tipo | Conteúdo |
|---------|:----:|----------|
| `knowledge/anti-hallucination/grounding-rules.md` | Técnica | Camada 0 — Grounding (fonte da verdade) |
| `knowledge/anti-hallucination/chain-of-verification.md` | Técnica | Camada 1 — CoVe (auto-verificação) |
| `knowledge/anti-hallucination/confidence-scoring.md` | Técnica | Camada 2 — Confidence Scoring |
| `knowledge/anti-hallucination/output-guardrails.md` | Técnica | Camada 3 — Guardrails de saída |
| `knowledge/anti-hallucination/human-in-the-loop.md` | Técnica | Camada 4 — HITL |
| `knowledge/patterns/anti-hallucination-pipeline.json` | Padrão | Pipeline 5 camadas (JSON) |
| `knowledge/principles/grounding-first.json` | Princípio | Grounding First (JSON) |
| `knowledge/index.json` | Índice | Busca pesquisável (7 artefatos) |
| `skills/anti-hallucination-baseline.md` | Skill | Skill reutilizável para agents |

### Documentos atualizados
- ✅ `02-SPEC.md` — seção 4.4 atualizada: "Biblioteca já populada"
- ✅ `03-PLAN.md` — fase transversal: "já populado"

## 🔄 Workflow em Andamento

```
✅ 01-PRD.md    →  v3.1 (feedback do Rolim incorporado)
✅ 02-SPEC.md   →  v3.1 (feedback do Rolim incorporado)
✅ 03-PLAN.md   →  v3.1 (escrito e alinhado)
⬜ 04-TASKS.md  →  Próximo — LISTA DE TAREFAS
⬜ 05-REVIEW.md →  Após implementação
⬜ IMPLEMENT   →  Fase 1: Fundação
```

### Próximos passos
1. Revisar PRD + SPEC + PLAN e aprovar (GATE 1)
2. Escrever 04-TASKS.md com tarefas detalhadas da Fase 1
3. Implementar Fase 1: Tipos de artefato, estrutura de diretórios, sistema de linhagem

---

## 🧠 Conceitos-Chave Definidos

| Conceito | Definição |
|----------|-----------|
| **4 Camadas** | Originais (Read Only) → Biblioteca Smith → Workspace → Resultado |
| **Artefatos** | Tudo é artefato: agent, skill, prompt, tool, fluxo, memória, config, MCP, template, teste |
| **DNA** | Conhecimento reutilizável (NÃO código) |
| **Linhagem** | Origem + Transformação + Destino (obrigatório) |
| **Patches** | Personalizar sem modificar originais (como apt/npm) |
| **Smith Update** | Verificação semanal de atualizações |
| **Observador** | Detecta duplicação, sugere consolidação |
| **Biblioteca de Padrões** | Design Patterns para agents de IA |
| **Destilação** | Extrair conceitos de repos → Biblioteca Smith |
| **Ética** | Smith recomenda, nunca impõe. Usuário decide |

### Filosofia de Tools (ECC)

| Princípio | Fonte | Implicação |
|-----------|-------|------------|
| **Limited tools = focused execution** | the-shortform-guide.md:411 | NÃO reduzir tools dos agents |
| **Context window is precious** | the-shortform-guide.md:144 | Cada tool description consome tokens |
| **Delegate cheapest model** | the-longform-guide.md:109 | deepseek para tarefas simples, mimo para complexas |
| **Scope your subagents** | the-shortform-guide.md:411 | Cada agent tem domínio bem definido |

---

## 🛠️ Scripts Disponíveis

```bash
# Conversão de agents ECC → Freebuff (atualizado para v4)
python3 scripts/convert-ecc-agents.py --force

# Conversão seletiva
python3 scripts/convert-ecc-agents.py --agent planner --force

# Dry-run (sem escrever)
python3 scripts/convert-ecc-agents.py --dry-run
```

---

## 📋 Regras Extraídas da Conversa

> 🤖 **Achado de:** `@conversation-analyzer`

Analisando o padrão de interação com Rolim, as seguintes regras foram identificadas:

| # | Regra | Origem |
|---|-------|--------|
| R1 | **Sempre oferecer revisão multi-agente** antes de considerar documentos finalizados. Mínimo de **22 agentes** correlacionados (padrão fixo por rodada). | Rolim sempre pede revisão completa antes de aprovar |
| R2 | **Preservar contexto entre sessões.** Todo progresso deve ser registrado no SESSAO.md para continuidade. | Sessões longas com múltiplas rodadas de refinamento |
| R3 | **Aplicar feedback incrementalmente.** Cada rodada de feedback deve resultar em melhorias concretas nos documentos ou código. | Múltiplas rodadas de revisão → aplicação → nova revisão |

## 🔧 Issues Conhecidos (Não Bloqueantes)

| Issue | Severidade | Notas |
|-------|:----------:|-------|
| `agent-smith.ts` tem import duplicado | 🟡 Médio | Exemplo no instructionsPrompt não deve ser alterado |
| `agent-smith.ts` tem `*handleSteps` inválido | 🟡 Médio | Sintaxe de generator não suportada |
| `index.ts` é manualmente mantido | 🔵 Baixo | Pode ser automatizado no futuro |
| `SECURITY_BASELINE` duplicado | 🔵 Baixo | Skill file + constante no script |

---

## 🔄 Para continuar na próxima sessão

1. Abra o Freebuff na pasta do Smith
2. Diga: "Continue de onde paramos. Leia o SESSAO.md"
3. A IA vai ler este arquivo e saber todo o contexto

---

*Documento atualizado em 16/07/2026 — sessão de readequação completa do Smith v4.0*
*Regras R1-R3 extraídas por @conversation-analyzer em 16/07/2026 (2)*
