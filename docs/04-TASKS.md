# 📋 TASKS — Fase 1: Fundação (Artefatos + Linhagem)

> **Projeto:** Freebuff Agent Smith v3.1
> **Documentos de referência:** `01-PRD.md`, `02-SPEC.md`, `03-PLAN.md`
> **Workflow:** PRD → SPEC → PLAN → ✅ **TASKS** → IMPLEMENT → REVIEW (GATE 2)
> **Estimativa:** 10 dias corridos (dias 1-10)
> **Metodologia:** 🧪 TDD (Red-Green-Refactor)

---

## 📊 Visão Geral da Fase 1

| Sub-fase | O que faz | Dias | Dependências |
|:--------:|-----------|:----:|:------------:|
| **F1a** | Tipos Base (artifact, lineage, patch, knowledge) | 1-3 | Nenhuma |
| **F1b** | Estrutura de Diretórios (patches, workspace) | 4-5 | F1a |
| **F1c** | Sistema de Linhagem + Config | 6-10 | F1b |

**Milestone M1:** Tipos (discriminated unions) compilando + linhagem funcional + biblioteca populada.

---

## 🗺️ Mapa de Arquivos

```
freebuff-agent-smith/
├── .agents/types/                    ← JÁ EXISTE (4 arquivos)
│   ├── agent-definition.ts           ← JÁ EXISTE
│   ├── tools.ts                      ← JÁ EXISTE
│   ├── util-types.ts                 ← JÁ EXISTE
│   ├── prompt-defense.ts             ← JÁ EXISTE
│   ├── artifact.ts                   ← 🆕 CRIAR (discriminated union)
│   ├── lineage.ts                    ← 🆕 CRIAR (interface + funções)
│   ├── patch.ts                      ← 🆕 CRIAR (interface)
│   └── knowledge.ts                  ← 🆕 CRIAR (interface)
│
├── knowledge/                        ← JÁ EXISTE (populado)
│   ├── anti-hallucination/           ← JÁ EXISTE (5 técnicas)
│   ├── patterns/                     ← JÁ EXISTE (1 padrão)
│   ├── principles/                   ← JÁ EXISTE (1 princípio)
│   ├── index.json                    ← JÁ EXISTE (7 artefatos)
│   └── lineage/                      ← 🆕 CRIAR (linhagem dos artefatos)
│
├── patches/                          ← 🆕 CRIAR (não existe ainda)
│   ├── ecc/                          ← 🆕 CRIAR
│   ├── github/                       ← 🆕 CRIAR
│   └── index.json                    ← 🆕 CRIAR
│
├── workspace/                        ← 🆕 CRIAR (temporário)
│
└── docs/                             ← JÁ EXISTE
    ├── 01-PRD.md
    ├── 02-SPEC.md
    ├── 03-PLAN.md
    ├── 04-TASKS.md                   ← 🆕 ESTE ARQUIVO
    ├── POC-DNA-EXTRACTION.md         ← JÁ EXISTE (POC)
    └── poc-results/                  ← JÁ EXISTE (resultados POC)
```

---

## 🔴🟢🔄 F1a: Tipos Base (Dias 1-3)

> **Gatilho de entrada:** Nenhum (primeira tarefa)
> **Gatilho de saída:** `tsc --noEmit` passa sem erros
> **Metodologia:** TDD — escrever teste → ver falha → implementar → ver passar → refatorar

---

### [F1a-01] Criar `artifact.ts` — Discriminated Union de Artefatos

**Base:** SPEC-ADR-003 (Artefatos, não Arquivos)

```typescript
// Template do que precisa ser criado
type Artifact = 
  | { type: 'agent'; id: string; instructionsPrompt: string; model: string; toolNames: string[]; lineage?: Lineage }
  | { type: 'skill'; id: string; description: string; content: string; lineage?: Lineage }
  | { type: 'prompt'; id: string; template: string; variables: string[] }
  | { type: 'tool'; id: string; description: string; parameters: Record<string, unknown> }
  | { type: 'fluxo'; id: string; steps: string[]; pattern: string }
  | { type: 'config'; id: string; data: Record<string, unknown> }
  | { type: 'test'; id: string; cases: string[] }
```

**Testes TDD:**
| # | Teste | O que valida |
|---|-------|-------------|
| 1 | Criar Agent sem `instructionsPrompt` | Erro de compilação |
| 2 | Criar Agent sem `model` | Erro de compilação |
| 3 | Criar Agent completo | Tipo válido |
| 4 | Criar Skill sem `content` | Erro de compilação |
| 5 | Switch por `type` | Exaustividade (never check) |
| 6 | Atribuir `lineage` opcional | Deve aceitar ou omitir |

**Critério de aceite:** `tsc --noEmit` passa + 6 testes passando.

**Esforço estimado:** 4h

---

### [F1a-02] Criar `lineage.ts` — Interface e Funções de Linhagem

**Base:** SPEC-ADR-004 (Linhagem Obrigatória)

```typescript
interface Lineage {
  origin: { repo: string; version: string; path: string };
  transformation: { date: string; action: 'cloned' | 'adapted' | 'patched' | 'created'; description: string };
  destination: { repo: string; path: string };
}

// Funções:
function registerLineage(artifactId: string, lineage: Lineage): Lineage
function getLineage(artifactId: string): Lineage | null
function listLineages(): Lineage[]
```

**Testes TDD:**
| # | Teste | O que valida |
|---|-------|-------------|
| 1 | `registerLineage()` com dados válidos | Retorna linhagem completa |
| 2 | `registerLineage()` sem `origin` | Erro de compilação |
| 3 | `getLineage()` com ID existente | Retorna linhagem correta |
| 4 | `getLineage()` com ID inexistente | Retorna null |
| 5 | `listLineages()` vazio | Retorna array vazio |
| 6 | `listLineages()` com 3 registros | Retorna array com 3 itens |

**Critério de aceite:** `tsc --noEmit` passa + 6 testes passando.

**Esforço estimado:** 3h

---

### [F1a-03] Criar `patch.ts` — Interface de Patch

**Base:** SPEC-SEC-4.3 (Gerenciador de Patches)

```typescript
interface Patch {
  id: string;
  target: string;           // Ex: "ECC/skills/pdf-reader"
  targetVersion: string;    // Ex: "2.1"
  description: string;
  createdAt: string;        // ISO date
  status: 'active' | 'incompatible' | 'removed' | 'merged';
  linesChanged: number;
  tokenReduction?: string;  // Ex: "28%"
  upstreamImplemented?: boolean;
}
```

**Testes TDD:**
| # | Teste | O que valida |
|---|-------|-------------|
| 1 | Criar Patch sem `target` | Erro de compilação |
| 2 | Criar Patch sem `description` | Erro de compilação |
| 3 | Criar Patch completo | Tipo válido |
| 4 | Status `'invalid'` | Erro de compilação (só valores válidos) |
| 5 | `tokenReduction` opcional | Deve aceitar ou omitir |

**Critério de aceite:** `tsc --noEmit` passa + 5 testes passando.

**Esforço estimado:** 2h

---

### [F1a-04] Criar `knowledge.ts` — Interface de Conhecimento

**Base:** SPEC-SEC-4.4 (Biblioteca de Padrões), SPEC-ADR-005 (Anti-Alucinação)

```typescript
interface Knowledge {
  concept: string;           // Ex: "Planner Before Execute"
  description: string;
  origin: string;            // Ex: "ECC/agents/planner.md"
  quality: number;           // 1-10
  confidence: number;        // 0.0-1.0
  applicableTo: string[];    // Ex: ["any-language", "any-framework"]
  pattern: string;           // Ex: "analyze → design → plan → execute"
  principles?: string[];
  relatedPatterns?: string[];
  sourceRepos?: string[];
}
```

**Testes TDD:**
| # | Teste | O que valida |
|---|-------|-------------|
| 1 | Criar Knowledge sem `origin` | Erro de compilação |
| 2 | Criar Knowledge sem `concept` | Erro de compilação |
| 3 | Criar Knowledge completo | Tipo válido |
| 4 | `quality` fora do range 1-10 | Erro de compilação (se usar branded type) |
| 5 | `principles` opcional | Deve aceitar ou omitir |

**Critério de aceite:** `tsc --noEmit` passa + 5 testes passando.

**Esforço estimado:** 2h

---

### [F1a-05] Verificar integridade dos tipos

**O que fazer:** Rodar `tsc --noEmit` em todo o projeto para garantir que os novos tipos não quebraram nada existente.

**Teste:** `tsc --noEmit` sem erros.

**Esforço estimado:** 30min

---

## 📁 F1b: Estrutura de Diretórios (Dias 4-5)

> **Gatilho de entrada:** Tipos compilando (F1a concluída)
> **Gatilho de saída:** `knowledge/index.json` íntegro + diretórios criados

---

### [F1b-01] Criar diretório `patches/`

```bash
mkdir -p patches/{ecc,github}
echo "[]" > patches/index.json
```

**Estrutura esperada:**
```
patches/
├── ecc/              ← Patches aplicados ao ECC
├── github/           ← Patches em repos GitHub
└── index.json        ← Registro de patches (array vazio inicial)
```

**Critério de aceite:** `ls patches/` mostra os 3 itens.

**Esforço estimado:** 15min

---

### [F1b-02] Criar diretório `workspace/`

```bash
mkdir -p workspace
touch workspace/.gitkeep
```

**Estrutura esperada:**
```
workspace/
└── .gitkeep
```

> ⚠️ `workspace/` é para artefatos temporários. Adicionar ao `.gitignore` se necessário.

**Critério de aceite:** `ls workspace/` mostra `.gitkeep`.

**Esforço estimado:** 10min

---

### [F1b-03] Validar integridade do `knowledge/index.json`

**O que verificar:**
1. `knowledge/index.json` existe ✅ (já populado)
2. JSON é válido (sem erros de parse)
3. Todos os 7 artefatos referenciados existem nos paths indicados
4. `searchTerms` estão consistentes com os artefatos

**Comando:**
```bash
python3 -c "import json; d=json.load(open('knowledge/index.json')); print(f'OK: {d[\"totalArtifacts\"]} artifacts, {len(d[\"categories\"])} categories')"
```

**Critério de aceite:** Script retorna sem erros.

**Esforço estimado:** 30min

---

### [F1b-04] Criar diretório `knowledge/lineage/`

```bash
mkdir -p knowledge/lineage
```

**Estrutura esperada:**
```
knowledge/lineage/    ← (inicialmente vazio, populado pelo registerLineage())
```

> ⚠️ Este diretório será populado dinamicamente pela função `registerLineage()` na F1c.

**Critério de aceite:** `ls knowledge/lineage` existe.

**Esforço estimado:** 5min

---

## 🔗 F1c: Sistema de Linhagem + Config (Dias 6-10)

> **Gatilho de entrada:** Diretórios prontos (F1b concluída)
> **Gatilho de saída:** `registerLineage()` funcional + testes passando + `.ecc-config.json` atualizado

---

### [F1c-00] Criar `FileSystemAdapter` — abstração de storage

**Problema:** `registerLineage()` precisa escrever no disco (`knowledge/lineage/*.json`), mas o Smith roda no ambiente Freebuff onde as ferramentas disponíveis são `read_files`, `write_file`, `str_replace`, etc.

**Solução:** Criar um adaptador que abstrai o acesso ao filesystem:

```typescript
interface FileSystemAdapter {
  read(path: string): Promise<string | null>
  write(path: string, content: string): Promise<void>
  list(directory: string): Promise<string[]>
  exists(path: string): Promise<boolean>
}
```

**Implementação concreta:** `LocalFileSystemAdapter` que usa as tools do Freebuff (`read_files`, `write_file`, etc.)

**Teste:** Mock do adapter para testar as funções de linhagem sem disco real.

**Esforço estimado:** 2h

---

### [F1c-01] Implementar `registerLineage(artifact)`

**O que faz:** Registra a linhagem de um artefato em `knowledge/lineage/<id>.json`.

**Nota técnica:** Esta função NÃO escreve no disco diretamente. Ela recebe um `FileSystemAdapter` (F1c-00) como dependência, permitindo testar em memória.

**Comportamento esperado:**
```typescript
const storage = new LocalFileSystemAdapter()

await registerLineage(storage, {
  artifactId: 'planner',
  lineage: {
    origin: { repo: 'ECC', version: '2.1', path: 'agents/planner.md' },
    transformation: { date: '2026-07-17', action: 'cloned' as const, description: 'Convertido para Freebuff' },
    destination: { repo: 'freebuff-agent-smith', path: '.agents/ecc/planner.ts' }
  }
})
// → Salva em knowledge/lineage/planner.json
// → Retorna o lineage registrado
```

**Testes (com mock do adapter):**
| # | Teste | O que valida |
|---|-------|-------------|
| 1 | Registrar linhagem de agent existente | Adapter.write() chamado com path correto |
| 2 | Registrar linhagem duplicada | Sobrescreve ou lança erro? (decidir) |
| 3 | Ler linhagem registrada | Dados conferem com o que foi salvo |

**Critério de aceite:** Adapter.write chamado com JSON correto.

**Esforço estimado:** 3h

---

### [F1c-02] Implementar `getLineage(artifactId)`

**O que faz:** Lê `knowledge/lineage/<id>.json` e retorna o lineage.

**Comportamento esperado:**
```typescript
getLineage('planner')  
// → { origin: {...}, transformation: {...}, destination: {...} }

getLineage('inexistente')
// → null
```

**Critério de aceite:** Retorna dados corretos para ID existente, null para inexistente.

**Esforço estimado:** 1h

---

### [F1c-03] Implementar `listLineages()`

**O que faz:** Lista todos os arquivos em `knowledge/lineage/`.

**Comportamento esperado:**
```typescript
listLineages()
// → ['planner', 'tdd-guide', 'code-reviewer']
```

**Critério de aceite:** Lista todos os IDs registrados.

**Esforço estimado:** 1h

---

### [F1c-04] Atualizar `.ecc-config.json`

**O que fazer:** Adicionar os novos paths ao arquivo de configuração.

**Antes:**
```json
{
  "smith": {
    // ...config existente
  }
}
```

**Depois (adicionar):**
```json
{
  "smith": {
    "knowledgeDir": "./knowledge/",
    "patchesDir": "./patches/",
    "workspaceDir": "./workspace/",
    "lineageDir": "./knowledge/lineage/",
    "confidenceThreshold": 0.70,
    "proactiveInterval": 3600
  }
}
```

**Critério de aceite:** `cat .ecc-config.json` mostra as novas chaves.

**Esforço estimado:** 30min

---

### [F1c-05] Atualizar barrel export em `.agents/index.ts`

**O que fazer:** Adicionar exports dos 4 novos tipos no barrel export existente.

```typescript
// Adicionar ao .agents/index.ts:
export * from './types/artifact'
export * from './types/lineage'
export * from './types/patch'
export * from './types/knowledge'
export * from './types/fs-adapter'  // se aplicável
```

**Verificar:** `tsc --noEmit` continua passando.

**Esforço estimado:** 15min

---

### [F1c-06] Documentar variáveis de ambiente no `knowledge.md`

**O que fazer:** Adicionar no `knowledge.md` as novas variáveis de ambiente.

| Variável | Descrição | Default |
|----------|-----------|---------|
| `SMITH_KNOWLEDGE_DIR` | Diretório da biblioteca | `./knowledge/` |
| `SMITH_PATCHES_DIR` | Diretório de patches | `./patches/` |
| `SMITH_WORKSPACE_DIR` | Diretório temporário | `./workspace/` |
| `SMITH_CONFIDENCE_THRESHOLD` | Threshold mínimo de confiança | `0.70` |
| `SMITH_PROACTIVE_INTERVAL` | Intervalo entre verificações (segundos) | `3600` |

**Critério de aceite:** `grep SMITH_ knowledge.md` mostra as 5 variáveis.

**Esforço estimado:** 30min

---

### [F1c-06] Definir framework de testes

**Decisão:** Usar **vitest** (padrão em projetos TypeScript modernos, compatível com tsconfig do Smith).

**Setup:**
```bash
npm install -D vitest
# Criar vitest.config.ts ou usar configuração inline no package.json
```

**Critério de aceite:** `npx vitest run` roda sem erros (mesmo sem testes ainda).

**Esforço estimado:** 30min

---

### [F1c-07] Testes de integração dos tipos + linhagem

**O que testar:**
1. Criar um artifact → registrar linhagem → listar → ler de volta
2. Fluxo completo: `artifact.ts` → `lineage.ts` (com adapter mock) → `knowledge/lineage/`
3. Tipos compilam juntos sem conflitos

**Teste de integração (vitest):**
```typescript
import { describe, it, expect } from 'vitest'
import { Artifact } from './types/artifact'
import { registerLineage, getLineage } from './types/lineage'
import { InMemoryAdapter } from './types/fs-adapter'

describe('Lineage Integration', () => {
  it('should register and retrieve lineage', async () => {
    const storage = new InMemoryAdapter()
    
    const agent: Artifact = {
      type: 'agent',
      id: 'test-agent',
      instructionsPrompt: 'You are a test agent',
      model: 'deepseek/deepseek-v4-flash',
      toolNames: ['read_files']
    }

    const lineage = await registerLineage(storage, agent.id, {
      origin: { repo: 'test', version: '1.0', path: 'test.md' },
      transformation: { date: '2026-07-17', action: 'created', description: 'Test' },
      destination: { repo: 'freebuff-agent-smith', path: '.agents/ecc/test.ts' }
    })
    
    expect(lineage.origin.repo).toBe('test')
    
    const retrieved = await getLineage(storage, agent.id)
    expect(retrieved).not.toBeNull()
    expect(retrieved!.origin.repo).toBe('test')
  })
})
```

**Critério de aceite:** `npx vitest run` passa.

**Esforço estimado:** 3h

---

## 📈 Resumo da Fase 1

| ID | Tarefa | Esforço | Status | Depende de |
|:--:|--------|:-------:|:------:|:----------:|
| F1a-01 | `artifact.ts` | 4h | ⬜ | — |
| F1a-02 | `lineage.ts` | 3h | ⬜ | — |
| F1a-03 | `patch.ts` | 2h | ⬜ | — |
| F1a-04 | `knowledge.ts` | 2h | ⬜ | — |
| F1a-05 | Verificar tipos | 30min | ⬜ | F1a-01..04 |
| F1b-01 | `patches/` dir | 15min | ⬜ | F1a-05 |
| F1b-02 | `workspace/` dir | 10min | ⬜ | F1a-05 |
| F1b-03 | Validar `index.json` | 30min | ⬜ | F1a-05 |
| F1b-04 | `lineage/` dir | 5min | ⬜ | F1a-05 |
| F1c-01 | `registerLineage()` | 4h | ⬜ | F1b-01..04 |
| F1c-02 | `getLineage()` | 1h | ⬜ | F1c-01 |
| F1c-03 | `listLineages()` | 1h | ⬜ | F1c-01 |
| F1c-04 | Atualizar `.ecc-config.json` | 30min | ⬜ | F1c-01 |
| F1c-05 | Documentar env vars | 30min | ⬜ | F1c-04 |
| F1c-06 | Framework de testes (vitest) | 30min | ⬜ | F1c-03 |
| F1c-07 | Testes de integração | 3h | ⬜ | F1c-06 |

**Total estimado:** ~23 horas (~3 dias úteis)

---

## ✅ Critérios de Aceitação (Definition of Done)

- [ ] `tsc --noEmit` passa sem erros (todos os tipos)
- [ ] Discriminated unions em `artifact.ts` compilam com exaustividade
- [ ] `registerLineage()` salva arquivo em `knowledge/lineage/`
- [ ] `getLineage()` retorna dados ou null
- [ ] `listLineages()` retorna array de IDs
- [ ] `patches/` e `workspace/` diretórios existem
- [ ] `.ecc-config.json` tem as novas chaves de config
- [ ] `knowledge.md` documenta as 5 variáveis de ambiente
- [ ] Testes unitários passam (TDD)
- [ ] Testes de integração (artifact → lineage → disco) passam
- [ ] GATE 2 aprovado (revisão multi-agente)

---

## 🔄 Próximos Passos (Após Fase 1)

1. GATE 2 — Revisão multi-agente da Fase 1
2. **Fase 2: Destilador de Conhecimento** (API GitHub + extração de DNA)
   - POC já validado em `docs/POC-DNA-EXTRACTION.md`
   - Substituir heurística do POC por chamadas LLM
3. **Fase 3: Patches + Smith Update**

---

> 📖 **Documentos relacionados:** `01-PRD.md` (requisitos), `02-SPEC.md` (especificação),
> `03-PLAN.md` (plano de implementação), `POC-DNA-EXTRACTION.md` (prova de conceito)
>
> 🔗 **Referência:** `SPEC-SEC-ADR-003` (artefatos), `SPEC-SEC-ADR-004` (linhagem),
> `SPEC-SEC-4.3` (patches), `SPEC-SEC-4.4` (biblioteca), `SPEC-SEC-4.5` (anti-alucinação)

---

*Documento gerado em 17/07/2026 — Tarefas detalhadas da Fase 1 do Smith v3.0*
*Workflow: PRD → SPEC → PLAN → ✅ TASKS → ⬜ IMPLEMENT → ⬜ REVIEW*
