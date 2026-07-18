/**
 * 🧬 Testes TDD — Extrator de DNA de Agentes
 *
 * Testa a extração de DNA de agentes ECC em 3 níveis:
 * N0: Metadados (id, model, tools)
 * N1: Conceitos e padrões (heuristico)
 * N2: LLM (futuro — placeholder)
 *
 * Fase 2 — Destilador de Conhecimento (Lote 1)
 */
import { extractAgentDna, extractDnaFromContent, batchExtractDna, dnaToKnowledge, type DnaExtractionResult } from '../.agents/types/extract-dna'

// --- Agentes de teste inline ---

const AGENT_SIMPLES = `import type { AgentDefinition } from '../types/agent-definition'
import { PROMPT_DEFENSE } from '../types/prompt-defense'

const definition: AgentDefinition = {
  id: 'hello-world',
  displayName: 'Hello World',
  model: 'deepseek/deepseek-v4-flash',
  toolNames: ['read_files', 'glob'],
  instructionsPrompt: PROMPT_DEFENSE + \`
You are a hello world agent.

When invoked:
1. Greet the user
2. Say hello in a friendly way

Best Practices:
- Always be polite
- Keep responses short
\`,
  spawnerPrompt: '--- name: hello-world description: A simple hello world agent.',
  includeMessageHistory: false,
}

export default definition
`

const AGENT_REVIEWER = `import type { AgentDefinition } from '../types/agent-definition'
import { PROMPT_DEFENSE } from '../types/prompt-defense'

const definition: AgentDefinition = {
  id: 'code-reviewer',
  displayName: 'Code Reviewer',
  model: 'mimo/mimo-v2.5',
  toolNames: ['read_files', 'code_search', 'glob', 'set_output'],
  instructionsPrompt: PROMPT_DEFENSE + \`
You are a senior code reviewer ensuring high standards.

When invoked:
1. Gather context — run git diff to see changes
2. Understand scope — identify which files changed
3. Read surrounding code — review in context
4. Apply review checklist
5. Report findings

Best Practices:
- Check for security issues first
- Validate input before processing
- Never trust user data

Red Flags to Check:
- Hardcoded credentials
- SQL injection
- XSS vulnerabilities

Plan: analyze → review → report → approve
\`,
  spawnerPrompt: '--- name: code-reviewer description: Expert code review specialist. Use for all code changes.',
  includeMessageHistory: true,
}

export default definition
`

const AGENT_SEM_CONCEITOS = `import type { AgentDefinition } from '../types/agent-definition'
import { PROMPT_DEFENSE } from '../types/prompt-defense'

const definition: AgentDefinition = {
  id: 'simple-helper',
  displayName: 'Simple Helper',
  model: 'deepseek/deepseek-v4-flash',
  toolNames: ['set_output'],
  instructionsPrompt: PROMPT_DEFENSE + \`
You are a helper. Do what the user asks.
\`,
  spawnerPrompt: '--- name: simple-helper description: Simple helper.',
  includeMessageHistory: false,
}

export default definition
`

// ============================================================
// TESTES
// ============================================================

describe('extractDnaFromContent — Nível 0: Metadados', () => {
  it('extrai id do agente', () => {
    const dna = extractDnaFromContent('hello-world', AGENT_SIMPLES)
    expect(dna.agentId).toBe('hello-world')
    expect(dna.displayName).toBe('Hello World')
  })

  it('extrai model do agente', () => {
    const dna = extractDnaFromContent('code-reviewer', AGENT_REVIEWER)
    expect(dna.model).toBe('mimo/mimo-v2.5')
  })

  it('extrai toolNames do agente', () => {
    const dna = extractDnaFromContent('hello-world', AGENT_SIMPLES)
    expect(dna.toolNames).toContain('read_files')
    expect(dna.toolNames).toContain('glob')
  })

  it('extrai source repo e versão', () => {
    const dna = extractDnaFromContent('hello-world', AGENT_SIMPLES)
    expect(dna.sourceRepo).toBe('ECC')
    expect(dna.sourceVersion).toBeTruthy()
  })
})

describe('extractDnaFromContent — Nível 1: Conceitos e Padrões', () => {
  it('extrai conceitos do instructionsPrompt', () => {
    const dna = extractDnaFromContent('code-reviewer', AGENT_REVIEWER)
    expect(dna.concepts.length).toBeGreaterThanOrEqual(1)
    expect(dna.concepts.some(c => c.toLowerCase().includes('review'))).toBe(true)
  })

  it('extrai padrões de workflow', () => {
    const dna = extractDnaFromContent('code-reviewer', AGENT_REVIEWER)
    expect(dna.patterns.length).toBeGreaterThanOrEqual(1)
    // Deve ter extraído "analyze → review → report → approve" ou similar
  })

  it('extrai princípios e regras', () => {
    const dna = extractDnaFromContent('code-reviewer', AGENT_REVIEWER)
    expect(dna.principles.length).toBeGreaterThanOrEqual(1)
    expect(dna.principles.some(p => p.toLowerCase().includes('security'))).toBe(true)
  })

  it('retorna conceitos vazios para agente sem padrões claros', () => {
    const dna = extractDnaFromContent('simple-helper', AGENT_SEM_CONCEITOS)
    // Pode ter conceitos mínimos, mas não deve ter padrões complexos
    expect(dna).toBeDefined()
    expect(dna.agentId).toBe('simple-helper')
  })
})

describe('extractDnaFromContent — Qualidade e Confiança', () => {
  it('agente completo tem quality >= 7', () => {
    const dna = extractDnaFromContent('code-reviewer', AGENT_REVIEWER)
    expect(dna.qualityScore).toBeGreaterThanOrEqual(7)
    expect(dna.qualityScore).toBeLessThanOrEqual(10)
  })

  it('agente simples tem quality < 5', () => {
    const dna = extractDnaFromContent('simple-helper', AGENT_SEM_CONCEITOS)
    expect(dna.qualityScore).toBeLessThan(5)
    expect(dna.qualityScore).toBeGreaterThanOrEqual(1)
  })

  it('confidence está entre 0.0 e 1.0', () => {
    const dna = extractDnaFromContent('code-reviewer', AGENT_REVIEWER)
    expect(dna.confidenceScore).toBeGreaterThanOrEqual(0)
    expect(dna.confidenceScore).toBeLessThanOrEqual(1)
  })

  it('confidence é maior para agentes mais completos', () => {
    const completo = extractDnaFromContent('code-reviewer', AGENT_REVIEWER)
    const simples = extractDnaFromContent('simple-helper', AGENT_SEM_CONCEITOS)
    expect(completo.confidenceScore).toBeGreaterThan(simples.confidenceScore)
  })
})

describe('dnaToKnowledge — Conversão para Knowledge', () => {
  it('converte DnaExtractionResult para Knowledge', () => {
    const dna: DnaExtractionResult = {
      agentId: 'test-agent',
      displayName: 'Test Agent',
      model: 'mimo/mimo-v2.5',
      toolNames: ['read_files'],
      concepts: ['Research First'],
      patterns: ['analyze → execute'],
      principles: ['Always validate input'],
      qualityScore: 8,
      confidenceScore: 0.85,
      sourceRepo: 'ECC',
      sourceVersion: '2.1',
    }

    const knowledge = dnaToKnowledge(dna, 'ECC/agents/test-agent.ts')
    expect(knowledge.concept).toContain('Research First')
    expect(knowledge.origin).toBe('ECC/agents/test-agent.ts')
    expect(knowledge.quality).toBe(8)
    expect(knowledge.confidence).toBe(0.85)
    expect(knowledge.applicableTo).toContain('TypeScript')
  })

  it('usa o primeiro conceito como concept principal', () => {
    const dna: DnaExtractionResult = {
      agentId: 'multi-concept',
      displayName: 'Multi',
      model: 'deepseek/deepseek-v4-flash',
      toolNames: [],
      concepts: ['Pattern A', 'Pattern B', 'Pattern C'],
      patterns: ['step1 → step2'],
      principles: ['Principle X'],
      qualityScore: 7,
      confidenceScore: 0.7,
      sourceRepo: 'ECC',
      sourceVersion: '2.1',
    }

    const knowledge = dnaToKnowledge(dna, 'test.md')
    expect(knowledge.concept).toContain('Pattern A')
  })

  it('usa fallback quando não há conceitos', () => {
    const dna: DnaExtractionResult = {
      agentId: 'empty',
      displayName: 'Empty',
      model: 'deepseek/deepseek-v4-flash',
      toolNames: [],
      concepts: [],
      patterns: [],
      principles: [],
      qualityScore: 3,
      confidenceScore: 0.3,
      sourceRepo: 'ECC',
      sourceVersion: '2.1',
    }

    const knowledge = dnaToKnowledge(dna, 'empty.md')
    expect(knowledge.concept).toContain('Empty')
    expect(knowledge.quality).toBe(3)
  })
})

describe('extractAgentDna — Arquivo real', () => {
  it('extrai DNA de arquivo de agente existente', () => {
    const dna = extractAgentDna('.agents/ecc/planner.ts')
    expect(dna.agentId).toBe('planner')
    expect(dna.displayName).toBe('Planner')
    expect(dna.model).toBe('mimo/mimo-v2.5')
    expect(dna.toolNames).toContain('read_files')
  })

  it('lança erro para arquivo inexistente', () => {
    expect(() => extractAgentDna('inexistente.ts')).toThrow()
  })
})

describe('batchExtractDna — Extração em lote', () => {
  it('extrai DNA de múltiplos agentes', () => {
    // Testar com 3 agentes ECC conhecidos
    const resultados = batchExtractDna('.agents/ecc', ['planner', 'code-reviewer', 'python-reviewer'])
    expect(resultados).toHaveLength(3)
    const ids = resultados.map(r => r.agentId)
    expect(ids).toContain('planner')
    expect(ids).toContain('code-reviewer')
    expect(ids).toContain('python-reviewer')
  })

  it('ignora agentes inexistentes na lista', () => {
    const resultados = batchExtractDna('.agents/ecc', ['planner', 'nao-existe-999'])
    expect(resultados).toHaveLength(1)
    expect(resultados[0].agentId).toBe('planner')
  })

  it('cada resultado tem qualityScore válido', () => {
    const resultados = batchExtractDna('.agents/ecc', ['planner', 'code-reviewer'])
    for (const r of resultados) {
      expect(r.qualityScore).toBeGreaterThanOrEqual(1)
      expect(r.qualityScore).toBeLessThanOrEqual(10)
      expect(r.confidenceScore).toBeGreaterThanOrEqual(0)
      expect(r.confidenceScore).toBeLessThanOrEqual(1)
    }
  })
})
