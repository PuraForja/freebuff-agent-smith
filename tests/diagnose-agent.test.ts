/**
 * 🩺 Testes TDD — Diagnóstico de Agentes
 *
 * Testa o diagnóstico de agentes problemáticos:
 * - Análise de saúde do agente
 * - Detecção de problemas (instruções, tools, modelos)
 * - Comparação com fonte original
 * - Sugestões de melhoria
 * - Relatório formatado
 *
 * Fase 3 — Patches + Smith Update
 * PLAN-F3-3.3.3: Diagnóstico de Agentes Problemáticos
 * SPEC-SEC-6.3: Fluxo de Diagnóstico
 */
import { diagnoseAgent, type DiagnosisResult } from '../.agents/types/diagnose-agent'

// ============================================================
// DADOS DE TESTE
// ============================================================

/** Agente saudável e completo */
const AGENT_SAUDAVEL = `import type { AgentDefinition } from '../types/agent-definition'
import { PROMPT_DEFENSE } from '../types/prompt-defense'

const definition: AgentDefinition = {
  id: 'code-reviewer',
  displayName: 'Code Reviewer',
  model: 'mimo/mimo-v2.5',
  toolNames: ['read_files', 'code_search', 'glob', 'set_output', 'run_terminal_command'],
  instructionsPrompt: PROMPT_DEFENSE + \`
You are an expert code reviewer ensuring high standards.

## Process
1. Gather context
2. Review code
3. Report findings

## Best Practices
- Check security first
- Validate all input
- Never trust user data

\`,
  spawnerPrompt: '--- name: code-reviewer description: Expert code reviewer.',
  includeMessageHistory: true,
}

export default definition
`

/** Agente problemático — faltam campos essenciais */
const AGENT_PROBLEMATICO = `import type { AgentDefinition } from '../types/agent-definition'

const definition: AgentDefinition = {
  id: 'broken-agent',
  displayName: 'Broken',
  model: 'unknown-model-v3',
  toolNames: [],
  instructionsPrompt: \`You are a broken agent.\`,
}

export default definition
`

/** Agente mínimo — funcional mas simples */
const AGENT_MINIMO = `import type { AgentDefinition } from '../types/agent-definition'
import { PROMPT_DEFENSE } from '../types/prompt-defense'

const definition: AgentDefinition = {
  id: 'simple-helper',
  displayName: 'Simple Helper',
  model: 'deepseek/deepseek-v4-flash',
  toolNames: ['read_files'],
  instructionsPrompt: PROMPT_DEFENSE + \`You are a helper.\`,
  includeMessageHistory: false,
}

export default definition
`

// ============================================================
// TESTES
// ============================================================

describe('diagnoseAgent — Diagnóstico geral', () => {
  it('retorna diagnostico com estrutura valida', () => {
    const result = diagnoseAgent(AGENT_SAUDAVEL, 'code-reviewer')
    expect(result).toHaveProperty('agentId')
    expect(result).toHaveProperty('healthScore')
    expect(result).toHaveProperty('issues')
    expect(result).toHaveProperty('suggestions')
    expect(result).toHaveProperty('report')
  })

  it('extrai agentId e displayName corretamente', () => {
    const result = diagnoseAgent(AGENT_SAUDAVEL, 'code-reviewer')
    expect(result.agentId).toBe('code-reviewer')
    expect(result.displayName).toBe('Code Reviewer')
  })
})

describe('diagnoseAgent — Health Score', () => {
  it('agente saudavel tem healthScore >= 7', () => {
    const result = diagnoseAgent(AGENT_SAUDAVEL, 'code-reviewer')
    expect(result.healthScore).toBeGreaterThanOrEqual(7)
    expect(result.healthScore).toBeLessThanOrEqual(10)
  })

  it('agente problematico tem healthScore < 5', () => {
    const result = diagnoseAgent(AGENT_PROBLEMATICO, 'broken-agent')
    expect(result.healthScore).toBeLessThan(5)
    expect(result.healthScore).toBeGreaterThanOrEqual(0)
  })

  it('agente minimo tem healthScore intermediario', () => {
    const result = diagnoseAgent(AGENT_MINIMO, 'simple-helper')
    // Tem o básico, mas faltam patterns e principios
    expect(result.healthScore).toBeGreaterThanOrEqual(1)
    expect(result.healthScore).toBeLessThanOrEqual(7)
  })
})

describe('diagnoseAgent — Issues', () => {
  it('agente saudavel tem poucos ou nenhum issue', () => {
    const result = diagnoseAgent(AGENT_SAUDAVEL, 'code-reviewer')
    expect(result.issues.length).toBeLessThanOrEqual(2)
  })

  it('agente problematico tem multiplos issues', () => {
    const result = diagnoseAgent(AGENT_PROBLEMATICO, 'broken-agent')
    expect(result.issues.length).toBeGreaterThanOrEqual(1)
  })

  it('agente sem spawnerPrompt tem issue sobre spawner', () => {
    const result = diagnoseAgent(AGENT_PROBLEMATICO, 'broken-agent')
    const spawnerIssue = result.issues.find(i => i.category === 'spawner')
    expect(spawnerIssue).toBeDefined()
  })

  it('agente com modelo invalido tem issue sobre modelo', () => {
    const result = diagnoseAgent(AGENT_PROBLEMATICO, 'broken-agent')
    const modelIssue = result.issues.find(i => i.category === 'model')
    expect(modelIssue).toBeDefined()
  })

  it('agente sem PROMPT_DEFENSE tem issue de seguranca', () => {
    const result = diagnoseAgent(AGENT_PROBLEMATICO, 'broken-agent')
    const securityIssue = result.issues.find(i => i.category === 'security')
    expect(securityIssue).toBeDefined()
  })
})

describe('diagnoseAgent — Sugestoes', () => {
  it('agente saudavel nao tem sugestoes (esta completo)', () => {
    const result = diagnoseAgent(AGENT_SAUDAVEL, 'code-reviewer')
    expect(result.suggestions.length).toBe(0)
  })

  it('agente problematico tem sugestoes de melhoria', () => {
    const result = diagnoseAgent(AGENT_PROBLEMATICO, 'broken-agent')
    expect(result.suggestions.length).toBeGreaterThanOrEqual(1)
    // Deve sugerir adicionar spawnerPrompt
    const hasSpawnerSuggestion = result.suggestions.some(s => s.toLowerCase().includes('spawner'))
    expect(hasSpawnerSuggestion).toBe(true)
  })
})

describe('diagnoseAgent — Relatorio formatado', () => {
  it('relatorio contem informacoes uteis', () => {
    const result = diagnoseAgent(AGENT_PROBLEMATICO, 'broken-agent')
    expect(result.report).toContain('broken-agent')
    expect(result.report).toContain('Saúde')
    expect(result.report).toContain('problema')
    expect(result.report).toContain('Sugestões')
  })

  it('relatorio formata healthScore', () => {
    const result = diagnoseAgent(AGENT_SAUDAVEL, 'code-reviewer')
    expect(result.report).toContain(String(result.healthScore))
    expect(result.report).toContain('/10')
  })

  it('relatorio lista issues por severidade', () => {
    const result = diagnoseAgent(AGENT_PROBLEMATICO, 'broken-agent')
    if (result.issues.length > 0) {
      expect(result.report).toContain(result.issues[0].description)
    }
  })
})
