/**
 * 🧪 TDD — Testes para artifact.ts (Discriminated Union)
 *
 * 🔴 RED:   Este teste espera que artifact.ts exista e funcione
 * 🟢 GREEN: Implementação deve fazer estes testes passarem
 * 🔄 REFACTOR: Melhorar sem quebrar os testes
 */

import { Artifact, getArtifactId, hasLineage } from '../.agents/types/artifact'

describe('Artifact — Discriminated Union', () => {

  // ============================================================
  // TESTE 1: Criar um Agent artifact válido
  // ============================================================
  test('deve criar um Agent artifact com campos obrigatórios', () => {
    const agent: Artifact = {
      type: 'agent',
      id: 'test-planner',
      instructionsPrompt: 'You are a planner agent',
      model: 'mimo/mimo-v2.5',
      toolNames: ['read_files', 'code_search']
    }

    expect(agent.type).toBe('agent')
    expect(getArtifactId(agent)).toBe('test-planner')
    expect(agent.model).toBe('mimo/mimo-v2.5')
    expect(agent.toolNames).toHaveLength(2)
  })

  // ============================================================
  // TESTE 2: Criar um Agent com lineage opcional
  // ============================================================
  test('deve criar um Agent artifact com lineage opcional', () => {
    const agent: Artifact = {
      type: 'agent',
      id: 'planner-with-lineage',
      instructionsPrompt: 'You are a planner',
      model: 'deepseek/deepseek-v4-flash',
      toolNames: ['glob'],
      lineage: {
        origin: { repo: 'ECC', version: '2.1', path: 'agents/planner.md' },
        transformation: { date: '2026-07-17', action: 'cloned', description: 'Convertido para Freebuff' },
        destination: { repo: 'freebuff-agent-smith-v2', path: '.agents/ecc/planner.ts' }
      }
    }

    expect(hasLineage(agent)).toBe(true)
    expect(agent.lineage?.origin.repo).toBe('ECC')
    expect(agent.lineage?.transformation.action).toBe('cloned')
  })

  // ============================================================
  // TESTE 3: Criar um Agent SEM lineage (opcional omitido)
  // ============================================================
  test('deve criar um Agent artifact sem lineage', () => {
    const agent: Artifact = {
      type: 'agent',
      id: 'simple-agent',
      instructionsPrompt: 'Do stuff',
      model: 'deepseek/deepseek-v4-flash',
      toolNames: []
    }

    expect(hasLineage(agent)).toBe(false)
    expect(agent.lineage).toBeUndefined()
  })

  // ============================================================
  // TESTE 4: Criar um Skill artifact
  // ============================================================
  test('deve criar um Skill artifact', () => {
    const skill: Artifact = {
      type: 'skill',
      id: 'research-first',
      description: 'Research before coding workflow',
      content: '# Search First\nAlways search before implementing.'
    }

    expect(skill.type).toBe('skill')
    expect(skill.description).toContain('Research')
    expect(skill.content).toContain('# Search First')
  })

  // ============================================================
  // TESTE 5: Criar um Prompt artifact
  // ============================================================
  test('deve criar um Prompt artifact', () => {
    const prompt: Artifact = {
      type: 'prompt',
      id: 'code-review-template',
      template: 'Review the following code: {{code}}',
      variables: ['code']
    }

    expect(prompt.type).toBe('prompt')
    expect(prompt.variables).toContain('code')
  })

  // ============================================================
  // TESTE 6: Criar um Tool artifact
  // ============================================================
  test('deve criar um Tool artifact', () => {
    const tool: Artifact = {
      type: 'tool',
      id: 'web-search',
      description: 'Search the web for information',
      parameters: { query: 'string', maxResults: 10 }
    }

    expect(tool.type).toBe('tool')
    expect(tool.parameters.query).toBe('string')
  })

  // ============================================================
  // TESTE 7: Criar um Fluxo artifact
  // ============================================================
  test('deve criar um Fluxo artifact', () => {
    const fluxo: Artifact = {
      type: 'fluxo',
      id: 'plan-execute-review',
      steps: ['plan', 'execute', 'review'],
      pattern: 'sequential'
    }

    expect(fluxo.type).toBe('fluxo')
    expect(fluxo.steps).toHaveLength(3)
  })

  // ============================================================
  // TESTE 8: Criar um Config artifact
  // ============================================================
  test('deve criar um Config artifact', () => {
    const config: Artifact = {
      type: 'config',
      id: 'smith-settings',
      data: { confidenceThreshold: 0.7, proactiveInterval: 3600 }
    }

    expect(config.type).toBe('config')
    expect(config.data.confidenceThreshold).toBe(0.7)
  })

  // ============================================================
  // TESTE 9: Criar um Test artifact
  // ============================================================
  test('deve criar um Test artifact', () => {
    const testCase: Artifact = {
      type: 'test',
      id: 'test-register-lineage',
      cases: [
        'registerLineage deve salvar arquivo em knowledge/lineage/',
        'registerLineage com ID duplicado deve sobrescrever'
      ]
    }

    expect(testCase.type).toBe('test')
    expect(testCase.cases).toHaveLength(2)
  })

  // ============================================================
  // TESTE 10: Exaustividade — switch deve cobrir TODOS os 10 tipos
  // ============================================================
  test('deve fazer switch exaustivo sobre todos os 10 tipos de artifact', () => {
    const artifacts: Artifact[] = [
      { type: 'agent', id: 'a1', instructionsPrompt: 'p1', model: 'mimo/mimo-v2.5', toolNames: [] },
      { type: 'skill', id: 's1', description: 'd1', content: 'c1' },
      { type: 'prompt', id: 'p1', template: 't1', variables: [] },
      { type: 'tool', id: 't1', description: 'd1', parameters: {} },
      { type: 'fluxo', id: 'f1', steps: [], pattern: 'seq' },
      { type: 'memory', id: 'm1', scope: 'session', content: 'ctx', tags: ['test'] },
      { type: 'config', id: 'c1', data: {} },
      { type: 'mcp', id: 'mc1', serverCommand: 'node', serverArgs: ['srv.js'], env: {} },
      { type: 'template', id: 't1', name: 'node-app', description: 'Node app', files: ['index.ts'], variables: ['name'] },
      { type: 'test', id: 'tc1', cases: ['test 1'] }
    ]

    // Switch exaustivo cobre todos os 10 tipos
    const summaries = artifacts.map(a => {
      switch (a.type) {
        case 'agent':    return `agent:${a.id}`
        case 'skill':    return `skill:${a.id}`
        case 'prompt':   return `prompt:${a.id}`
        case 'tool':     return `tool:${a.id}`
        case 'fluxo':    return `fluxo:${a.id}`
        case 'memory':   return `memory:${a.id}`
        case 'config':   return `config:${a.id}`
        case 'mcp':      return `mcp:${a.id}`
        case 'template': return `template:${a.id}`
        case 'test':     return `test:${a.id}`
      }
    })

    expect(summaries).toHaveLength(10)
    expect(summaries[0]).toBe('agent:a1')
    expect(summaries[9]).toBe('test:tc1')
  })

  // ============================================================
  // TESTE 11: getArtifactId funciona para todos os tipos
  // ============================================================
  test('getArtifactId funciona para qualquer tipo de artifact', () => {
    const agent: Artifact = { type: 'agent', id: 'agente-x', instructionsPrompt: 'x', model: 'mimo/mimo-v2.5', toolNames: [] }
    const skill: Artifact = { type: 'skill', id: 'skill-y', description: 'y', content: 'y' }
    const config: Artifact = { type: 'config', id: 'cfg-z', data: {} }

    expect(getArtifactId(agent)).toBe('agente-x')
    expect(getArtifactId(skill)).toBe('skill-y')
    expect(getArtifactId(config)).toBe('cfg-z')
  })

  // ============================================================
  // TESTE 12: hasLineage detecta corretamente
  // ============================================================
  test('hasLineage detecta presença/ausência de lineage', () => {
    const semLineage: Artifact = { type: 'agent', id: 'sem', instructionsPrompt: 'x', model: 'mimo/mimo-v2.5', toolNames: [] }
    const comLineage: Artifact = {
      type: 'agent', id: 'com', instructionsPrompt: 'x', model: 'mimo/mimo-v2.5', toolNames: [],
      lineage: { origin: { repo: 'r', version: '1', path: 'p' }, transformation: { date: '2026-07-17', action: 'created', description: 'd' }, destination: { repo: 'r', path: 'p' } }
    }

    expect(hasLineage(semLineage)).toBe(false)
    expect(hasLineage(comLineage)).toBe(true)
  })
})
