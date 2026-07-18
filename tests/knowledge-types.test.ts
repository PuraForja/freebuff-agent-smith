/**
 * 🧪 TDD — Testes para knowledge.ts (Biblioteca de Conhecimento)
 *
 * 🔴 RED:   Testes escritos antes da implementação
 * 🟢 GREEN: Implementação deve fazer estes testes passarem
 * 🔄 REFACTOR: Melhorar sem quebrar os testes
 */

import {
  Knowledge,
  createKnowledge,
  validateQuality,
  validateConfidence,
  knowledgeToJSON,
} from '../.agents/types/knowledge'

describe('Knowledge — Interface', () => {
  // ============================================================
  // TESTE 1: Criar Knowledge completo
  // ============================================================
  test('deve criar um Knowledge completo com campos obrigatórios', () => {
    const knowledge: Knowledge = {
      concept: 'Planner Before Execute',
      description: 'Planejar antes de executar qualquer tarefa',
      origin: 'ECC/agents/planner.md',
      quality: 8.5,
      confidence: 0.84,
      applicableTo: ['any-language', 'any-framework'],
      pattern: 'analyze → design → plan → execute → verify',
    }

    expect(knowledge.concept).toBe('Planner Before Execute')
    expect(knowledge.quality).toBe(8.5)
    expect(knowledge.confidence).toBe(0.84)
    expect(knowledge.applicableTo).toContain('any-language')
  })

  // ============================================================
  // TESTE 2: Knowledge com campos opcionais (type, principles, maxim)
  // ============================================================
  test('deve criar Knowledge com campos opcionais', () => {
    const principle: Knowledge = {
      concept: 'Grounding First',
      description: 'Toda resposta baseada em fontes reais',
      origin: 'solucao-medica',
      quality: 9.5,
      confidence: 0.98,
      applicableTo: ['any-llm', 'any-agent'],
      pattern: 'source → verify → respond',
      type: 'principle',
      principles: ['Nunca invente fontes', 'Sempre cite a origem'],
      maxim: 'Se o dado não está na fonte, não invente.',
      relatedPatterns: ['anti-hallucination-pipeline'],
      sourceRepos: ['github.com/PuraForja/solucao-medica'],
    }

    expect(principle.type).toBe('principle')
    expect(principle.principles).toHaveLength(2)
    expect(principle.maxim).toContain('fonte')
    expect(principle.relatedPatterns).toContain('anti-hallucination-pipeline')
    expect(principle.sourceRepos).toHaveLength(1)
  })

  // ============================================================
  // TESTE 3: Knowledge com type='pattern'
  // ============================================================
  test('deve criar Knowledge com type pattern', () => {
    const pattern: Knowledge = {
      concept: 'Search First',
      description: 'Pesquisar antes de codificar',
      origin: 'ECC/skills/search-first',
      quality: 8.0,
      confidence: 0.90,
      applicableTo: ['typescript', 'python'],
      pattern: 'analyze → search → evaluate → decide → implement',
      type: 'pattern',
    }

    expect(pattern.type).toBe('pattern')
  })

  // ============================================================
  // TESTE 4: Knowledge com type='technique'
  // ============================================================
  test('deve criar Knowledge com type technique', () => {
    const technique: Knowledge = {
      concept: 'Chain-of-Verification',
      description: 'Auto-verificar cada afirmação',
      origin: 'Meta FAIR 2024',
      quality: 9.0,
      confidence: 0.95,
      applicableTo: ['any-llm'],
      pattern: 'generate → verify → correct → confirm',
      type: 'technique',
    }

    expect(technique.type).toBe('technique')
  })

  // ============================================================
  // TESTE 5: validateQuality aceita valores válidos
  // ============================================================
  test('validateQuality() não deve lançar para valores válidos', () => {
    expect(() => validateQuality(1)).not.toThrow()
    expect(() => validateQuality(5)).not.toThrow()
    expect(() => validateQuality(10)).not.toThrow()
    expect(() => validateQuality(8.5)).not.toThrow()
  })

  // ============================================================
  // TESTE 6: validateQuality rejeita valores inválidos
  // ============================================================
  test('validateQuality() deve lançar para valores fora do range', () => {
    expect(() => validateQuality(0)).toThrow('Quality deve estar entre 1 e 10')
    expect(() => validateQuality(11)).toThrow('Quality deve estar entre 1 e 10')
    expect(() => validateQuality(-1)).toThrow('Quality deve estar entre 1 e 10')
  })

  // ============================================================
  // TESTE 7: validateConfidence aceita valores válidos
  // ============================================================
  test('validateConfidence() não deve lançar para valores válidos', () => {
    expect(() => validateConfidence(0)).not.toThrow()
    expect(() => validateConfidence(0.5)).not.toThrow()
    expect(() => validateConfidence(1)).not.toThrow()
  })

  // ============================================================
  // TESTE 8: validateConfidence rejeita valores inválidos
  // ============================================================
  test('validateConfidence() deve lançar para valores fora do range', () => {
    expect(() => validateConfidence(-0.1)).toThrow('Confidence deve estar entre 0.0 e 1.0')
    expect(() => validateConfidence(1.1)).toThrow('Confidence deve estar entre 0.0 e 1.0')
  })

  // ============================================================
  // TESTE 9: createKnowledge com dados válidos
  // ============================================================
  test('createKnowledge() deve criar Knowledge válido', () => {
    const k = createKnowledge({
      concept: 'Test Concept',
      description: 'Test',
      origin: 'test',
      quality: 7.0,
      confidence: 0.75,
      applicableTo: ['test'],
      pattern: 'test → verify',
    })

    expect(k.concept).toBe('Test Concept')
    expect(k.quality).toBe(7.0)
  })

  // ============================================================
  // TESTE 10: createKnowledge com quality inválida
  // ============================================================
  test('createKnowledge() deve lançar se quality inválida', () => {
    expect(() =>
      createKnowledge({
        concept: 'Test',
        description: 'Test',
        origin: 'test',
        quality: 15,
        confidence: 0.5,
        applicableTo: ['test'],
        pattern: 'test',
      })
    ).toThrow('Quality')
  })

  // ============================================================
  // TESTE 11: createKnowledge com confidence inválida
  // ============================================================
  test('createKnowledge() deve lançar se confidence inválida', () => {
    expect(() =>
      createKnowledge({
        concept: 'Test',
        description: 'Test',
        origin: 'test',
        quality: 5,
        confidence: 2.0,
        applicableTo: ['test'],
        pattern: 'test',
      })
    ).toThrow('Confidence')
  })

  // ============================================================
  // TESTE 12: knowledgeToJSON gera JSON formatado
  // ============================================================
  test('knowledgeToJSON() deve gerar JSON formatado', () => {
    const knowledge: Knowledge = {
      concept: 'Test',
      description: 'Desc',
      origin: 'origin',
      quality: 5,
      confidence: 0.5,
      applicableTo: ['x'],
      pattern: 'a → b',
    }

    const json = knowledgeToJSON(knowledge)
    expect(typeof json).toBe('string')

    const parsed = JSON.parse(json)
    expect(parsed.concept).toBe('Test')
    expect(parsed.quality).toBe(5)
  })
})
