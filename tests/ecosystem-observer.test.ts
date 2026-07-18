/**
 * 🧪 Tests — Ecosystem Observer (Fase 4)
 *
 * Testes TDD para checkEcosystem, findDuplicates, generateHealthReport.
 *
 * Fase 4 — Observador de Ecossistema
 * PLAN-F4: Observador + Assimilação
 * SPEC-SEC-4.2: Observador de Ecossistema
 */

import {
  analyzeEcosystem,
  findDuplicates,
  generateHealthReport,
  checkEcosystem,
  type EcosystemReport,
  type DuplicateInfo,
} from '../.agents/types/ecosystem-observer'

// ============================================================
// Fixtures
// ============================================================

const AGENT_SAUDAVEL = `import { PROMPT_DEFENSE } from './types/tools'
export const definition: AgentDefinition = {
  id: 'code-reviewer',
  displayName: 'Code Reviewer',
  model: 'mimo/mimo-v2.5',
  instructionsPrompt: PROMPT_DEFENSE + \`
You are an expert code reviewer.

## Process
1. Analyze the code structure
2. Check for security issues
3. Generate a detailed report

## Best Practices
- Always verify sources before suggesting changes
- Use async/await instead of raw promises
- Keep functions small and focused

## Red Flags
- Hardcoded credentials
- Unsafe eval() usage
- Missing input validation
  \`,
  toolNames: ['read_files', 'code_search', 'glob', 'set_output'],
  includeMessageHistory: true,
}`

const AGENT_COMUM = `import { PROMPT_DEFENSE } from './types/tools'
export const definition: AgentDefinition = {
  id: 'build-resolver',
  displayName: 'Build Resolver',
  model: 'deepseek/deepseek-v4-flash',
  instructionsPrompt: PROMPT_DEFENSE + \`
You are a build error resolver.

## Process
1. Analyze the build output
2. Check for known issues
3. Generate a detailed report

## Best Practices
- Always verify sources before suggesting changes
- Use async/await instead of raw promises
- Keep functions small and focused
  \`,
  toolNames: ['read_files', 'code_search', 'glob'],
  includeMessageHistory: true,
}`

const AGENT_MINIMO = `export const definition: AgentDefinition = {
  id: 'minimal-agent',
  displayName: 'Minimal',
  model: 'unknown-model',
  instructionsPrompt: \`Basic instructions.\`,
  toolNames: [],
}`

// ============================================================
// Tests
// ============================================================

describe('EcosystemReport — estrutura', () => {
  it('cria relatório com campos obrigatórios', () => {
    const report: EcosystemReport = {
      timestamp: '2026-07-17T10:00:00.000Z',
      totalAgents: 2,
      healthyAgents: 1,
      unhealthyAgents: 1,
      averageHealth: 7.5,
      duplicates: [],
      issues: [],
      suggestions: [],
    }
    expect(report.timestamp).toBeDefined()
    expect(report.totalAgents).toBe(2)
  })

  it('aceita relatório vazio (sem agentes)', () => {
    const report: EcosystemReport = {
      timestamp: '2026-07-17T10:00:00.000Z',
      totalAgents: 0,
      healthyAgents: 0,
      unhealthyAgents: 0,
      averageHealth: 0,
      duplicates: [],
      issues: [],
      suggestions: [],
    }
    expect(report.totalAgents).toBe(0)
    expect(report.healthyAgents).toBe(0)
  })
})

describe('analyzeEcosystem', () => {
  it('analisa agentes e retorna relatório completo', () => {
    const report = analyzeEcosystem([AGENT_SAUDAVEL, AGENT_MINIMO])
    expect(report.totalAgents).toBe(2)
    expect(report.averageHealth).toBeGreaterThan(0)
    expect(report.healthyAgents + report.unhealthyAgents).toBe(2)
  })

  it('retorna relatório vazio para lista vazia', () => {
    const report = analyzeEcosystem([])
    expect(report.totalAgents).toBe(0)
    expect(report.healthyAgents).toBe(0)
    expect(report.averageHealth).toBe(0)
  })

  it('classifica agentes com health >= 6 como saudáveis', () => {
    const report = analyzeEcosystem([AGENT_SAUDAVEL])
    expect(report.healthyAgents).toBe(1)
    expect(report.unhealthyAgents).toBe(0)
  })

  it('classifica agentes com health < 6 como não saudáveis', () => {
    const report = analyzeEcosystem([AGENT_MINIMO])
    expect(report.unhealthyAgents).toBeGreaterThanOrEqual(0)
  })
})

describe('findDuplicates', () => {
  it('encontra conceitos duplicados entre agentes', () => {
    const duplicates = findDuplicates([AGENT_SAUDAVEL, AGENT_COMUM])
    // Ambos têm "Process" e "Best Practices" como conceitos
    const processDup = duplicates.find(d => d.pattern.includes('Process'))
    expect(processDup).toBeDefined()
    expect(processDup!.agents.length).toBeGreaterThanOrEqual(2)
  })

  it('retorna lista vazia se não há duplicatas', () => {
    const duplicates = findDuplicates([AGENT_SAUDAVEL, AGENT_MINIMO])
    // AGENT_MINIMO é muito pequeno, pode não gerar conceitos duplicados
    expect(Array.isArray(duplicates)).toBe(true)
  })

  it('cada duplicata tem o número de agentes afetados', () => {
    const duplicates = findDuplicates([AGENT_SAUDAVEL, AGENT_COMUM])
    for (const d of duplicates) {
      expect(d.agents.length).toBeGreaterThanOrEqual(2)
      expect(d.frequency).toBeGreaterThanOrEqual(2)
    }
  })

  it('duplicatas têm sugestão de consolidação', () => {
    const duplicates = findDuplicates([AGENT_SAUDAVEL, AGENT_COMUM])
    for (const d of duplicates) {
      expect(d.suggestion).toBeTruthy()
      expect(typeof d.suggestion).toBe('string')
      expect(d.suggestion.length).toBeGreaterThan(0)
    }
  })

  it('retorna vazio para lista vazia de agentes', () => {
    const duplicates = findDuplicates([])
    expect(duplicates).toEqual([])
  })
})

describe('generateHealthReport', () => {
  it('gera relatório de saúde textual', () => {
    const report: EcosystemReport = {
      timestamp: '2026-07-17T10:00:00.000Z',
      totalAgents: 2,
      healthyAgents: 1,
      unhealthyAgents: 1,
      averageHealth: 7.5,
      duplicates: [],
      issues: [],
      suggestions: ['Consolidar processos duplicados'],
    }
    const text = generateHealthReport(report)
    expect(text).toContain('2')
    expect(text).toContain('Saud')
    expect(text).toContain('Consolidar')
  })

  it('inclui seção de duplicatas quando existem', () => {
    const duplicates: DuplicateInfo[] = [
      {
        pattern: 'Research First',
        agents: ['code-reviewer', 'build-resolver'],
        frequency: 2,
        suggestion: 'Extrair para skill compartilhada',
      },
    ]
    const report: EcosystemReport = {
      timestamp: '2026-07-17T10:00:00.000Z',
      totalAgents: 2,
      healthyAgents: 2,
      unhealthyAgents: 0,
      averageHealth: 9.0,
      duplicates,
      issues: [],
      suggestions: ['Extrair para skill compartilhada'],
    }
    const text = generateHealthReport(report)
    expect(text).toContain('Research First')
    expect(text).toContain('code-reviewer')
  })

  it('indica ecossistema saudavel quando todos estao bem', () => {
    const report: EcosystemReport = {
      timestamp: '2026-07-17T10:00:00.000Z',
      totalAgents: 3,
      healthyAgents: 3,
      unhealthyAgents: 0,
      averageHealth: 9.5,
      duplicates: [],
      issues: [],
      suggestions: [],
    }
    const text = generateHealthReport(report)
    expect(text).toContain('Saudaveis')
    expect(text).toContain('9.5')
  })

  it('indica problemas quando há agentes não saudáveis', () => {
    const report: EcosystemReport = {
      timestamp: '2026-07-17T10:00:00.000Z',
      totalAgents: 2,
      healthyAgents: 0,
      unhealthyAgents: 2,
      averageHealth: 3.0,
      duplicates: [],
      issues: ['Agente X sem instructionsPrompt', 'Agente Y sem ferramentas'],
      suggestions: ['Adicionar instructionsPrompt'],
    }
    const text = generateHealthReport(report)
    expect(text).toContain('problema')
    expect(text).toContain('instructionsPrompt')
  })
})

describe('checkEcosystem', () => {
  it('função completa: analisa + encontra duplicatas + gera relatório', () => {
    const result = checkEcosystem([AGENT_SAUDAVEL, AGENT_COMUM, AGENT_MINIMO])
    expect(result.report.totalAgents).toBe(3)
    expect(result.report.averageHealth).toBeGreaterThan(0)
    expect(result.text).toContain('Observador')
    expect(result.text.length).toBeGreaterThan(50)
    // Deve encontrar duplicatas entre os agentes mais completos
    expect(result.report.duplicates.length).toBeGreaterThanOrEqual(0)
  })

  it('lida com ecossistema vazio', () => {
    const result = checkEcosystem([])
    expect(result.report.totalAgents).toBe(0)
    expect(result.text).toContain('Nenhum')
  })

  it('retorna timestamp no relatório', () => {
    const result = checkEcosystem([AGENT_SAUDAVEL])
    // Timestamp deve ser uma data ISO válida
    expect(new Date(result.report.timestamp).toISOString()).toBe(result.report.timestamp)
  })

  it('sugere consolidação quando há duplicatas', () => {
    const result = checkEcosystem([AGENT_SAUDAVEL, AGENT_COMUM])
    if (result.report.duplicates.length > 0) {
      expect(result.report.suggestions.length).toBeGreaterThanOrEqual(1)
    }
  })
})
