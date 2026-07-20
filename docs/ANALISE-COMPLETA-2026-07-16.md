# 📊 Análise Completa — Freebuff Agent Smith V2
> **Data:** 16/07/2026
> **Objetivo:** Cruzar documentação oficial Freebuff, ECC e projeto Smith para mapear gaps e melhorias

---

## 1. Documentação Oficial Freebuff — O que diz

### Estrutura de um Agent (oficial)
```typescript
export default {
  id: 'agent-id',              // Identificador único
  displayName: 'Agent Name',  // Nome no UI
  model: 'openai/gpt-4o',     // Modelo LLM
  systemPrompt: '...',         // Opcional: override do system prompt
  instructionsPrompt: '...',   // Instruções do agente
  toolNames: [...],            // Ferramentas disponíveis
  spawnerPrompt: '...',        // Quando spawnar automaticamente
  spawnableAgents: [...],      // Outros agents que pode spawnar
  handleSteps: function*() { ... }  // Workflow programático (generator)
}
```

### Dois tipos de agents
1. **LLM-based (Prompt-driven)** — liberdade criativa, melhor para review/análise
2. **Programmatic (Generator-based)** — workflow determinístico, melhor para testes/CI

### Tools disponíveis (oficial)
| Tool | Descrição |
|------|-----------|
| `read_files` | Ler arquivos |
| `run_terminal_command` | Executar comandos |
| `end_turn` | Finalizar turno |
| `spawn_agent` | Spawnar outro agent |

### Built-in agents
| Agent | Propósito |
|-------|-----------|
| `codebuff/base` | Assistente principal |
| `codebuff/editor` | Modificações de arquivo |
| `codebuff/reviewer` | Code reviews |
| `codebuff/thinker` | Análise de problemas |
| `codebuff/researcher` | Buscas web |
| `codebuff/file-picker` | Navegação no codebase |
| `codebuff/basher` | Comandos de terminal |

---

## 2. ECC — O que oferece

### Estrutura ECC
```
ECC/
├── agents/          67 agentes (.md) — format Markdown
├── skills/          278 skills — format Markdown
├── rules/           121 regras por linguagem
├── commands/        92 comandos slash
├── hooks/           3 hooks de automação
├── contexts/        3 contextos (dev/research/review)
├── scripts/         49 scripts Node.js
└── tests/           Suite de testes
```

### Agentes ECC organizados por categoria

| Categoria | Agents | Exemplos |
|-----------|:------:|----------|
| **Language Reviewers** | 20 | code-reviewer, typescript-reviewer, python-reviewer, rust-reviewer, go-reviewer, cpp-reviewer, csharp-reviewer, java-reviewer, kotlin-reviewer, php-reviewer, swift-reviewer, flutter-reviewer, vue-reviewer, react-reviewer, django-reviewer, fastapi-reviewer, database-reviewer, mle-reviewer, healthcare-reviewer, security-reviewer |
| **Build Resolvers** | 11 | build-error-resolver, rust-build-resolver, dart-build-resolver, go-build-resolver, java-build-resolver, kotlin-build-resolver, cpp-build-resolver, django-build-resolver, pytorch-build-resolver, react-build-resolver, swift-build-resolver |
| **Architects & Planners** | 5 | architect, code-architect, planner, spec-miner, type-design-analyzer |
| **Specialists** | 14 | chief-of-staff, docs-lookup, e2e-runner, marketing-agent, seo-specialist, tdd-guide, code-explorer, code-simplifier, refactor-cleaner, performance-optimizer, comment-analyzer, conversation-analyzer, silent-failure-hunter, pr-test-analyzer |
| **DevOps** | 7 | harness-optimizer, loop-operator, network-architect, network-troubleshooter, network-config-reviewer, homelab-architect, opensource-forker |
| **Open Source** | 3 | opensource-forker, opensource-sanitizer, opensource-packager |
| **GAN Harness** | 3 | gan-planner, gan-generator, gan-evaluator |
| **Outros** | 2 | a11y-architect, gov-data-downloader |
| **TOTAL** | **68** | incluindo agent-smith-v2 |

---

## 3. Projeto Smith — Estado Atual

### O que já temos
- ✅ 68 agents TypeScript em `.agents/*.ts`
- ✅ 278 skills Markdown em `skills/`
- ✅ Types TypeScript definidos (`types/agent-definition.ts`, `types/tools.ts`, `types/util-types.ts`)
- ✅ `agent-smith-v2.ts` — agente principal (v2.0, modelo híbrido)
- ✅ `knowledge.md` — documentação do projeto (v2.0)
- ✅ `CATALOGO.md` — catálogo completo
- ✅ `HARNESS_EVALUATION_ALL.md` — avaliação de todos os 68 agents
- ✅ Scripts de instalação (`ecc-install.sh`, `sync-ecc.sh`)
- ✅ `.ecc-config.json` — configuração de instalação
- ✅ `.codebuff/instructions.md` — protocolo de integração automática
- ✅ `docs/` — 4 documentos oficiais Freebuff copiados

### Padrão dos agents TypeScript (consistente em todos)
```typescript
import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'agent-id',
  displayName: 'Agent Name',
  model: 'mimo/mimo-v2.5' ou 'deepseek/deepseek-v4-flash',
  toolNames: ["read_files", "code_search", "set_output", ...],
  instructionsPrompt: `--- name: agent-id description: ...`,
  spawnerPrompt: '--- name: agent-id description: ...',
  includeMessageHistory: true,
}

export default definition
```

### Divisão de modelos
| Modelo | Uso | Agents |
|--------|-----|:------:|
| `mimo/mimo-v2.5` | Análise profunda (reviewers, architects, security) | ~45 |
| `deepseek/deepseek-v4-flash` | Tarefas rápidas (build-resolvers, refactoring) | ~23 |

---

## 4. GAPs Identificados (Freebuff Docs vs Smith)

### 4.1 Tipo de Agent — Smith usa 100% LLM-based
A documentação oficial Freebuff descreve **dois tipos**: LLM-based e Programmatic (generator). O Smith usa **apenas LLM-based** com `spawnerPrompt`. 

**Única exceção:** `agent-smith-v2.ts` tem `*handleSteps()` que faz:
```typescript
*handleSteps(_context?: any) {
  yield { tool: 'read_files', paths: ['.ecc-config.json', 'CATALOGO.md'] }
  yield { tool: 'list_directory', path: '.agents' }
  yield 'STEP_ALL'  // Deixa o LLM decidir
}
```

**Oportunidade:** Criar agents programáticos para workflows determinísticos:
- `auto-review.sh` → poderia ser um agent programático
- `ecc-install.sh` → poderia ter handleSteps para setup automático
- Scripts de verificação → poderiam ser agents com handleSteps

### 4.2 Tools — Smith usa tools extras não documentadas
O Smith usa tools que **não estão na documentação oficial**:
| Tool Extra | Uso no Smith | Na doc oficial? |
|------------|:------------:|:---------------:|
| `code_search` | Busca em código | ❌ |
| `set_output` | Reportar resultados | ❌ |
| `write_file` | Criar/escrever arquivos | ❌ |
| `str_replace` | Editar arquivos | ❌ |
| `list_directory` | Listar diretórios | ❌ |
| `glob` | Buscar por padrão | ❌ |
| `spawn_agents` | Spawnar múltiplos agents | ❌ (doc tem `spawn_agent` singular) |
| `web_search` | Busca web | ❌ (doc tem `codebuff/researcher`) |
| `read_url` | Ler URLs | ❌ |

**Conclusão:** O Freebuff/Codebuff real tem **mais tools** do que a documentação oficial mostra. O Smith já usa todas as disponíveis.

### 4.3 `spawnableAgents` — Não implementado
A doc oficial mostra `spawnableAgents: ['codebuff/reviewer', 'codebuff/basher']` para coordenação entre agents. **Nenhum agent do Smith usa esse campo.**

**Oportunidade:** Definir cadeias de agents:
- `agent-smith-v2` → pode spawnar `code-reviewer`, `architect`, `planner`
- `planner` → pode spawnar `tdd-guide`, `code-architect`
- `security-reviewer` → pode spawnar `build-error-resolver`

### 4.4 `systemPrompt` — Não usado
A doc oficial mostra `systemPrompt` como override opcional. O Smith não usa esse campo em nenhum agent — todos usam apenas `instructionsPrompt`.

### 4.5 `publisher` — Não implementado
A doc oficial menciona `publisher: 'your-publisher-id'` para publicar agents. O Smith não usa esse campo.

### 4.6 Nomes — `spawn_agent` vs `spawn_agents`
- **Doc oficial:** `spawn_agent` (singular)
- **Smith:** usa `spawn_agents` (plural)
- **Tipo TypeScript:** não lista `spawn_agents`

**Questão:** Qual é a tool real? Precisa verificar.

### 4.7 `includeMessageHistory` — Não na doc oficial
Todos os agents do Smith têm `includeMessageHistory: true`, mas esse campo **não aparece na documentação oficial**. Pode ser uma feature do Freebuff/Codebuff real que a doc não documenta.

---

## 5. Oportunidades de Melhoria

### 5.1 Agents Programáticos (alto impacto)
Criar agents com `handleSteps` para workflows determinísticos:
- **`ecc-installer`** — instalação automática com steps
- **`auto-review`** — revisão automática com pipeline fixo
- **`status-checker`** — verificação de saúde do sistema

### 5.2 Cadeias de Spawn (médio impacto)
Adicionar `spawnableAgents` para orquestração:
```typescript
// agent-smith-v2.ts
spawnableAgents: ['code-reviewer', 'architect', 'planner', 'security-reviewer']
```

### 5.3 Types Completos (médio impacto)
Atualizar `types/agent-definition.ts` para incluir campos da doc oficial:
```typescript
export interface AgentDefinition {
  id: string;
  displayName: string;
  model: string;
  toolNames: string[];
  instructionsPrompt: string;
  systemPrompt?: string;           // ← adicionar
  spawnerPrompt?: string;          // ← adicionar (atualmente não tipado)
  spawnableAgents?: string[];      // ← adicionar
  includeMessageHistory?: boolean; // ← adicionar
  handleSteps?: () => Generator<any>;
  publisher?: string;              // ← adicionar
}
```

### 5.4 Documentação Atualizada (médio impacto)
- Atualizar `docs/creating-new-agents.md` com campos extras do Smith
- Adicionar exemplos de agents programáticos
- Documentar `includeMessageHistory` e `spawn_agents` (plural)

### 5.5 Skills como Agentes (baixo impacto)
Algumas skills do ECC poderiam ser convertidas em agents TypeScript:
- `continuous-learning-v2` → agent com handleSteps
- `verification-loop` → agent programático
- `eval-harness` → agent com pipeline determinístico

---

## 6. Inventário Completo de Agents por Modelo

### mimo/mimo-v2.5 (45 agents)
a11y-architect, agent-smith-v2, architect, code-architect, code-explorer, code-reviewer, conversation-analyzer, cpp-reviewer, csharp-reviewer, database-reviewer, django-reviewer, docs-lookup, fastapi-reviewer, flutter-reviewer, fsharp-reviewer, gan-evaluator, gan-generator, gan-planner, go-reviewer, healthcare-reviewer, homelab-architect, java-reviewer, kotlin-reviewer, marketing-agent, mle-reviewer, network-architect, network-config-reviewer, performance-optimizer, php-reviewer, planner, pr-test-analyzer, python-reviewer, react-reviewer, rust-reviewer, security-reviewer, silent-failure-hunter, spec-miner, swift-reviewer, typescript-reviewer, vue-reviewer, chief-of-staff, comment-analyzer

### deepseek/deepseek-v4-flash (23 agents)
build-error-resolver, code-simplifier, comment-analyzer, cpp-build-resolver, dart-build-resolver, django-build-resolver, doc-updater, e2e-runner, go-build-resolver, harness-optimizer, java-build-resolver, kotlin-build-resolver, loop-operator, marketing-agent, network-troubleshooter, opensource-forker, opensource-sanitizer, opensource-packager, pytorch-build-resolver, react-build-resolver, rust-build-resolver, seo-specialist, swift-build-resolver, tdd-guide

### Nota
Alguns agents aparecem nas duas listas — verificar se há duplicação ou se é intencional.

---

## 7. Próximos Passos Recomendados

| # | Ação | Prioridade | Esforço |
|---|------|:----------:|:-------:|
| 1 | Atualizar `types/agent-definition.ts` com campos da doc oficial | 🔴 Alto | Baixo |
| 2 | Adicionar `spawnableAgents` ao agent-smith-v2 e key agents | 🔴 Alto | Baixo |
| 3 | Criar 1-2 agents programáticos com handleSteps | 🟡 Médio | Médio |
| 4 | Atualizar docs com campos extras descobertos | 🟡 Médio | Baixo |
| 5 | Verificar spawn_agent vs spawn_agents (singular vs plural) | 🔴 Alto | Baixo |
| 6 | Adicionar `publisher` field aos agents | 🔵 Baixo | Baixo |
| 7 | Criar agent de instalação automática com handleSteps | 🟡 Médio | Médio |
| 8 | Atualizar SESSAO.md com data de hoje | 🔴 Alto | Baixo |

---

*Análise gerada em 16/07/2026 — salva para persistência entre sessões.*
