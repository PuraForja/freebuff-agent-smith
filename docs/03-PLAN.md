# 📋 PLAN — Freebuff Agent Smith V2 v3.0

> **Plano de Implementação**
> Versão: 3.1 · Data: 16/07/2026 · Autor: Rolim + Buffy (IA)
>
> 📌 **Propósito:** Detalhar COMO implementar o Smith v3.0 — fases, milestones, prioridades e riscos.
> Assume que você leu `01-PRD.md` (O QUÊ) e `02-SPEC.md` (COMO).

---

## 1. Resumo Executivo

**Objetivo:** Evoluir o Freebuff Agent Smith V2 de um orquestrador de agents para um **auto-engenheiro de agentes AI** completo — com destilação de conhecimento, observação proativa, sistema de patches, revalidação de agents, biblioteca de padrões e anti-alucinação.

**Duração estimada:** ~10 semanas (6 fases)
**Escopo do MVP:** Fases 1-2 (Fundação + Destilador) são o **MVP Core**. Fases 3-6 são **Expansão** — podem ser postergadas sem invalidar o MVP.
**Esforço total:** Estimado em 3-5 sprints de desenvolvimento interativo
**Risco principal:** Complexidade da destilação de conhecimento (Fase 2)

---

## 2. Mapa de Dependências

```
Fase 1: Fundação
├── Tipos de artefato (artifact.ts, lineage.ts, patch.ts, knowledge.ts)
├── Estrutura de diretórios (knowledge/, patches/, workspace/)
└── Sistema de linhagem básico
    │
    ├──► Fase 2: Destilador de Conhecimento
    │   ├── Modalidade remota (API GitHub)
    │   ├── Modalidade clone local
    │   └── Extração de DNA + classificação
    │       │
    │       ├──► Fase 4: Observador
    │       │   ├── Proatividade contextual
    │       │   ├── Diagnóstico de agents
    │       │   └── Detecção de duplicação
    │       │
    │       └──► Fase 6: Biblioteca de Padrões
    │           ├── Catálogo pesquisável
    │           ├── Leitura automática de repos
    │           └── Indexação
    │
    ├──► Fase 3: Patches
    │   ├── Sistema de patches
    │   ├── Verificação de compatibilidade
    │   └── Geração de PRs
    │       │
    │       └──► Fase 5: Contribuição Automática
    │           ├── PR automático
    │           └── Detecção de convergência
    │
    └──► Fase Transversal: Anti-Alucinação
        ├── Grounding (Camada 0)
        ├── Chain of Verification (Camada 1)
        ├── Confidence Scoring (Camada 2)
        ├── Output Guardrails (Camada 3)
        └── Human in the Loop (Camada 4)
```

---

## 3. Fases de Implementação

### PLAN-F1: Fundação — Artefatos + Linhagem (Semanas 1-2)

> 💡 **ID estável:** `PLAN-F1`
> 📖 **Especificado em:** `SPEC-SEC-ADR-003` (artefatos), `SPEC-SEC-ADR-004` (linhagem)

**Objetivo:** Estabelecer a base conceitual e estrutural do Smith v3.0.

A Fase 1 foi quebrada em **3 sub-fases** para permitir progresso incremental e validação antecipada:

---

#### PLAN-F1a: Tipos Base (Dias 1-3)

> **Gatilho de entrada:** Documentos aprovados (GATE 1)
> **Gatilho de saída:** Todos os tipos compilam sem erros
> **Metodologia:** 🧪 **TDD (Red-Green-Refactor)** — recomendado por `@tdd-guide`

Criar os tipos base usando **discriminated unions** (conforme `SPEC-SEC-ADR-003`) seguindo TDD:

```
🔴 RED:   Escrever teste que espera que o tipo exista
🔴 VERIFY: Teste falha (tipo ainda não implementado)
🟢 GREEN: Implementar o tipo mínimo para passar
🟢 VERIFY: Teste passa
🔄 REFACTOR: Melhorar sem quebrar testes
```

**Por que TDD aqui?** Os tipos são previsíveis, têm especificação clara e são fáceis de testar.

| Arquivo | Teste TDD |
|---------|-----------|
| `artifact.ts` | Criar Agent sem `instructionsPrompt` deve ser erro de compilação |
| `lineage.ts` | `registerLineage()` deve retornar linhagem completa |
| `patch.ts` | Patch sem `target` deve ser inválido |
| `knowledge.ts` | Knowledge sem `origin` deve ser inválido |

| Arquivo | Conteúdo |
|---------|----------|
| `artifact.ts` | Discriminated union `Artifact` com tipos: agent, skill, prompt, tool, fluxo, config, test |
| `lineage.ts` | Interface `Lineage` (origin, transformation, destination), funções de rastreamento |
| `patch.ts` | Interface `Patch` (id, target, description, status, linesChanged, tokenReduction) |
| `knowledge.ts` | Interface `Knowledge` (concept, description, origin, quality, applicableTo, pattern) |

---

#### PLAN-F1b: Estrutura de Diretórios (Dias 4-5)

> **Gatilho de entrada:** Tipos compilando
> **Gatilho de saída:** `knowledge/index.json` populado com biblioteca anti-alucinação existente

```bash
# Diretórios já existentes (criados na sessão de 16/07):
#   knowledge/anti-hallucination/  ← populado
#   knowledge/patterns/            ← populado (anti-hallucination-pipeline.json)
#   knowledge/principles/          ← populado (grounding-first.json)
#   knowledge/index.json           ← populado (7 artifacts)

# Ainda precisa criar:
mkdir -p patches/{ecc,github}
echo "[]" > patches/index.json
mkdir -p workspace

# Verificar integridade do índice existente
test -f knowledge/index.json && echo "✅ Index já existe"
```

---

#### PLAN-F1c: Sistema de Linhagem + Config (Dias 6-10)

> **Gatilho de entrada:** Estrutura de diretórios pronta
> **Gatilho de saída:** `registerLineage()` funcional + testes passando

- Função `registerLineage(artifact)` — registra linhagem em `knowledge/lineage/`
- Função `getLineage(artifactId)` — recupera linhagem completa
- Função `listLineages()` — lista todas as linhagens registradas
- Atualizar `.ecc-config.json` com novos paths
- Documentar variáveis de ambiente no `knowledge.md`
- Testes unitários para os tipos e linhagem

**Milestone M1:** Base estrutural pronta — discriminated unions compilando, linhagem funcional, biblioteca populada.

---

### PLAN-F2: Destilador de Conhecimento (Semanas 3-5)

> 💡 **ID estável:** `PLAN-F2`
> **Gatilho de entrada:** M1 completo
> **Gatilho de saída:** `discoverRemote()` funcional + testes passando

**Objetivo:** Implementar a capacidade de extrair conhecimento de repositórios.

> ⏰ **Regra de decisão:** Se esta fase levar mais de 3 semanas, priorizar modo remoto e postergar modo local para Fase 3.
> 🔄 **Se M2 atrasar > 1 semana:** Reduzir escopo — implementar apenas descoberta remota, semântica básica.

#### 3.2.1 Modalidade Remota (API GitHub)

- Integração com `@octokit/rest`
- Função `discoverRemote(repoUrl)`: lê README, estrutura, agents via API REST
- Função `extractKnowledge(agentContent)`: extrai conceitos e padrões
- Cache de resultados para evitar rate limiting

#### 3.2.2 Modalidade Clone Local

- Função `cloneLocal(repoUrl)`: `git clone` para `workspace/`
- Função `analyzeLocal(repoPath)`: análise completa de todos os arquivos
- Função `cleanupWorkspace()`: limpeza automática após uso

#### 3.2.3 Extração de DNA + Classificação

- Identificar padrões recorrentes: "antes de X, sempre faz Y"
- Generalizar conceitos para formato independente de linguagem
- Classificar qualidade (1-10) com base em completude, clareza, reusabilidade
- Salvar em `knowledge/patterns/` como JSON

#### 3.2.4 Comparação e Recomendação

- Função `compareOptions(options[])`: apresenta opções com scores
- Cada opção inclui: nome, origem, qualidade, descrição, estimatedLines, compatibleWith
- Usuário escolhe — Smith executa

**Milestone M2:** Smith consegue descobrir, analisar e recomendar agents de repositórios remotos e locais.

---

### PLAN-F3: Patches + Smith Update (Semanas 5-7)

> 💡 **ID estável:** `PLAN-F3`
> **Gatilho de entrada:** M2 completo
> **Gatilho de saída:** `createPatch()` e `verifyAllPatches()` funcionais

**Objetivo:** Sistema de personalização sem modificar originais.

> ⏰ **Regra de decisão:** Se diagnóstico de agents (3.3.3) estiver complexo demais, implementar apenas patch + verificação primeiro. Diagnóstico vem depois.

#### 3.3.1 Sistema de Patches

- `createPatch(artifact, changes)`: registra patch em `patches/`
- `listPatches(filter?)`: lista patches com status
- `applyPatch(patchId)`: aplica patch ao artefato
- `removePatch(patchId)`: remove patch

#### 3.3.2 Verificação de Compatibilidade

- `checkCompatibility(patch, upstreamVersion)`: detecta se patch quebra com nova versão
- `verifyAllPatches()`: verificação em lote (semanal)
- Notificação ao usuário apenas quando há incompatibilidade

#### 3.3.3 Diagnóstico de Agentes Problemáticos

- `diagnoseAgent(agentId)`: analisa agente e compara com fontes
- Fluxo completo: diagnóstico → sugestão → correção ou evolução
- Integração com observador para detecção proativa

**Milestone M3:** Sistema de patches funcional com verificação de compatibilidade e diagnóstico.

---

### PLAN-F4: Observador + Assimilação (Semanas 7-9)

> 💡 **ID estável:** `PLAN-F4`
> **Gatilho de entrada:** M2 completo (ou M3, se houver dependência de patches)
> **Gatilho de saída:** `checkEcosystem()` funcional + sugestões aparecendo

**Objetivo:** Monitoramento proativo do ecossistema.

> ⏰ **Regra de decisão:** Se o contexto-aware (nível 2) for complexo, implementar apenas nível 1 (agendar sugestões). Nível 2 (monitorar tempo entre mensagens) pode vir depois.

#### 3.4.1 Observador Proativo

- `checkEcosystem()`: verificação periódica (intervalo configurável)
- Detecção de duplicação: `findDuplicates()` 
- Detecção de inconsistências: `findInconsistencies()`
- **Contexto-aware:** Smith verifica se usuário está ativo antes de sugerir

#### 3.4.2 Assimilação de Conhecimento

- `assimilateNewRepo(repoUrl)`: quando novo repo é descoberto
- `assimilatePatterns()`: extrair padrões automaticamente
- `assimilatePrinciples()`: extrair princípios de engenharia

#### 3.4.3 Saúde do Ecossistema

- `healthReport()`: relatório de saúde (tamanho, complexidade, dependências)
- `suggestConsolidation()`: sugestões de consolidação
- `suggestRemoval()`: sugestões de remoção de artefatos obsoletos

**Milestone M4:** Observador funcional com proatividade contextual e assimilação automática.

---

### PLAN-F5: Contribuição Automática (Semanas 9-10)

> 💡 **ID estável:** `PLAN-F5`
> **Gatilho de entrada:** M3 completo
> **Gatilho de saída:** PR gerado e enviado com sucesso para repo de teste

**Objetivo:** Contribuir melhorias de volta para projetos originais.

> ⏰ **Regra de decisão:** Começar com repos forkados próprios para teste. Só depois avançar para repos de terceiros.

#### 3.5.1 Geração de PR

- `generatePr(patchId)`: prepara Pull Request
- Estrutura: fork → branch → commit → PR
- Template de PR com descrição da melhoria + métricas (token reduction, etc.)

#### 3.5.2 Detecção de Convergência

- `checkConvergence(patchId)`: detecta se upstream implementou a mesma melhoria
- Notificação: "Seu patch não é mais necessário, upstream implementou!"
- Sugestão: remover patch

#### 3.5.3 Métricas de Contribuição

- Rastrear PRs enviados, aceitos, rejeitados
- Calcular taxa de aceitação (> 50% é a meta)
- Aprender com PRs rejeitados para melhorar futuros PRs

**Milestone M5:** Smith contribui automaticamente de volta para projetos originais.

---

### PLAN-F6: Biblioteca de Padrões (Semanas 7-10, paralela às Fases 4-5)

> 💡 **ID estável:** `PLAN-F6`
> **Gatilho de entrada:** M2 completo
> **Gatilho de saída:** `searchPatterns()` pesquisável + índice válido

> ⏰ **Nota:** A biblioteca já está **parcialmente populada** (anti-alucinação). Esta fase foca em expandir para outros padrões.

**Objetivo:** Catálogo pesquisável de padrões de engenharia.

> ⚠️ **Nota de dependência:** Esta fase depende apenas da **Fase 2 (Destilador)** estar completa. Pode iniciar **assim que a Fase 2 estiver estável** (semana 7), independentemente das Fases 4 e 5.
> Recomenda-se execução paralela para otimizar cronograma.

#### 3.6.1 Catálogo Pesquisável

- `searchPatterns(query)`: busca por conceito, origem, qualidade
- `getPattern(patternId)`: detalhe completo do padrão
- `listPatterns(filter?)`: listar por categoria

#### 3.6.2 Leitura Automática de Repositórios de Referência

- Configurar lista de repos de referência (ex: projetos open-source renomados)
- Smith lê periodicamente e extrai padrões
- Popula a biblioteca automaticamente

#### 3.6.3 Indexação

- `rebuildIndex()`: reconstruir `knowledge/index.json`
- `validateIndex()`: verificar integridade do índice

**Milestone M6:** Biblioteca de Padrões populada e pesquisável.

---

### Fase Transversal: Avaliação e Testes (Durante todas as fases)

> 🧪 **Achado de:** `@e2e-runner`, `@harness-optimizer`, `@tdd-guide`

**Objetivo:** Garantir que o Smith está funcionando corretamente através de avaliação contínua.

#### Estrutura de Testes

| Tipo | O que testa | Cobertura alvo |
|:----:|:------------|:--------------:|
| **Unitário** | Tipos (artifact, lineage, patch, knowledge) com TDD | 90%+ |
| **Integração** | Operações do Destilador, Patches, Observador | 80%+ |
| **E2E** | User Stories completas (PRD-US-001 a US-009) | Críticas apenas |

#### Cenários E2E (por User Story)

| Cenário | User Story | Descrição |
|:-------:|:----------:|-----------|
| **E2E-01** | PRD-US-001 | Pedir "crie um agente de pesquisa" → Smith cria agent funcional com linhagem |
| **E2E-02** | PRD-US-002 | "Descubra agents de pesquisa no GitHub" → Smith retorna opções |
| **E2E-03** | PRD-US-003 | Aplicar patch, atualizar ECC → Smith detecta incompatibilidade |
| **E2E-04** | PRD-US-008 | "Agente X está esquisito" → Smith diagnostica e sugere correção |

#### Harness de Avaliação

Para medir a **qualidade do Smith** (não dos agents que ele gera):

1. **Ground truth:** Conjunto de 10 agents "corretos" conhecidos
2. **Teste cego:** Smith recebe o mesmo pedido sem ver o ground truth
3. **Comparação:** O resultado do Smith corresponde ao ground truth?
4. **Métrica:** Precisão ≥ 92% (conforme PRD seção 7)
5. **Feedback do usuário:** Botão 👍/👮 nas recomendações do Smith (para métrica de "úteis > 70%")

---

### Fase Transversal: Anti-Alucinação (Durante todas as fases)

**Objetivo:** Garantir qualidade dos agents gerados em todas as fases.

> ✅ **Biblioteca já populada!** O conhecimento anti-alucinação do projeto
> `solucao-medica` já foi destilado para a Biblioteca Smith:
> - 5 camadas completas em `knowledge/anti-hallucination/`
> - 1 padrão em `knowledge/patterns/anti-hallucination-pipeline.json`
> - 1 princípio em `knowledge/principles/grounding-first.json`
> - 1 skill em `skills/anti-hallucination-baseline.md`
> - Índice em `knowledge/index.json`

| Fase | Aplicação |
|:----:|-----------|
| **Fase 1** | Definir tipos de confidence score no `knowledge.ts` |
| **Fase 2** | Adicionar validação anti-alucinação na extração de conhecimento |
| **Fase 3** | Verificar patches contra alucinação |
| **Fase 4** | Observador valida suas próprias sugestões |
| **Fase 5** | PRs são verificados antes de enviar |
| **Fase 6** | Padrões extraídos passam por validação |

**Skills anti-alucinação (já criadas):**
1. ✅ `knowledge/anti-hallucination/grounding-rules.md` — regras de grounding
2. ✅ `knowledge/anti-hallucination/chain-of-verification.md` — template CoVe
3. ✅ `knowledge/anti-hallucination/confidence-scoring.md` — scoring rules
4. ✅ `knowledge/anti-hallucination/output-guardrails.md` — guardrails de saída
5. ✅ `knowledge/anti-hallucination/human-in-the-loop.md` — HITL
6. ✅ `skills/anti-hallucination-baseline.md` — skill reutilizável

---

## 4. Prioridades e Riscos

### 🟢 Alta Prioridade — Fazer Primeiro

| Item | Fase | Justificativa |
|------|:----:|---------------|
| Tipos de artefato e linhagem | Fase 1 | Base de todo o sistema |
| Destilador remoto (API GitHub) | Fase 2 | Core do Smith — descobrir agents |
| Diagnóstico de agents problemáticos | Fase 3 | US-08 — necessidade imediata |
| Anti-alucinação básica (grounding) | Transversal | Prevenção de agents quebrados |

### 🟡 Média Prioridade — Fazer em Seguida

| Item | Fase | Justificativa |
|------|:----:|---------------|
| Observador proativo | Fase 4 | US-09 — valor agregado |
| Sistema de patches completo | Fase 3 | Necessário para personalizações |
| Destilador local (clone) | Fase 2 | Complementar ao remoto |

### 🔵 Baixa Prioridade — Fazer Depois

| Item | Fase | Justificativa |
|------|:----:|---------------|
| Contribuição automática (PRs) | Fase 5 | Depende de patches maduros |
| Leitura automática de repos de referência | Fase 6 | Pode ser feito incrementalmente |
| Biblioteca de Padrões completa | Fase 6 | Valor a longo prazo |

### ⚠️ Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|:------------:|:-------:|-----------|
| Complexidade da destilação de conhecimento | Alta | Alto | MVP com padrões simples, depois expandir |
| API GitHub rate limiting | Média | Médio | Cache agressivo, fila de destilação |
| Alucinação na geração de agents | Média | Alto | Anti-alucinação em todas as fases |
| Patches quebram com atualizações | Média | Médio | Verificação semanal, notificação preventiva |
| Smith sugere demais (incomoda) | Baixa | Médio | Contexto-aware + intervalo configurável |

---

## 5. Marcos (Milestones)

> 💡 **IDs estáveis:** Cada milestone tem ID único para rastreamento entre versões do plano.

| Marco | ID | Fase | Entregáveis | Data estimada | Gatilho de saída |
|:-----:|:--:|:----:|-------------|:-------------:|------------------|
| **M1** | `PLAN-M1` | F1 | Tipos (discriminated unions) + linhagem + diretórios + anti-alucinação populada | Semana 2 | `tsc --noEmit` passa sem erros |
| **M2** | `PLAN-M2` | F2 | Destilador remoto funcional (mínimo: descoberta via API) | Semana 5 | `discoverRemote()` retorna resultados válidos |
| **M3** | `PLAN-M3` | F3 | Sistema de patches + verificação de compatibilidade | Semana 7 | `verifyAllPatches()` detecta incompatibilidades |
| **M4** | `PLAN-M4` | F4 | Observador proativo (nível 1: sugestões agendadas) | Semana 9 | `checkEcosystem()` gera relatório |
| **M5** | `PLAN-M5` | F5 | Contribuição automática (PRs para repos teste) | Semana 10 | PR criado em repo de teste |
| **M6** | `PLAN-M6` | F6 | Biblioteca de Padrões pesquisável + 10+ padrões | Semana 10 | `searchPatterns()` retorna resultados |

**Regra de desvio:** Se qualquer fase exceder 150% do tempo estimado, reduzir escopo para o MVP mínimo da fase e avançar.

---

## 6. Critérios de Aceitação (Definition of Done)

Cada fase é considerada completa quando:

- ✅ Código implementado e testado
- ✅ Documentação atualizada (`docs/` e `knowledge.md`)
- ✅ Tipos TypeScript definidos e consistentes
- ✅ Anti-alucinação aplicada (quando aplicável)
- ✅ Linhagem registrada para artefatos criados
- ✅ Testes básicos escritos e passando
- ✅ Revisão multi-agente concluída (GATE 2)

---

## 7. Próximos Passos Imediatos (Após Aprovação)

1. **Aprovar PRD e SPEC** (GATE 1) — você está aqui ✅
2. **Criar 04-TASKS.md** com tarefas detalhadas da Fase 1
3. **Implementar Fase 1: Fundação**
   - Tipos de artefato (`artifact.ts`, `lineage.ts`, `patch.ts`, `knowledge.ts`)
   - Estrutura de diretórios (`knowledge/`, `patches/`, `workspace/`)
   - Sistema de linhagem básico
4. **Revisar** (GATE 2)
5. **Avançar para Fase 2**

---

> 🔗 **Documentos relacionados:** `01-PRD.md` (requisitos), `02-SPEC.md` (especificação técnica)
> 📖 **Especifica a implementação de:** `PRD-US-001` a `PRD-US-009`, `SPEC-SEC-4.1` a `SPEC-SEC-4.5`

---

## 8. Referências

> 📚 **Achado de:** `@docs-lookup`

- [Freebuff Docs](https://freebuff.com/docs)
- [ECC Repository](https://github.com/affaan-m/ECC)
- [Freebuff Agent Smith V2](https://github.com/PuraForja/freebuff-agent-smith-v2)

---

*Documento mantido por: Rolim + Buffy*
*ID do documento: PLAN-v3.1*
*Próxima revisão: Após aprovação do GATE 1*
