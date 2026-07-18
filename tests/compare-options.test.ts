/**
 * 📊 Testes TDD — Compare Options
 *
 * Testa o sistema de comparação e recomendação de agentes:
 * - Criação e estrutura de AgentOption
 * - Ordenação por qualidade
 * - Recomendação da melhor opção
 * - Comparação entre múltiplas opções
 * - Formatação de tabela de comparação
 * - Pontuação composta (qualidade + confiança)
 *
 * Fase 2 — Destilador de Conhecimento (Lote 3)
 * SPEC-F2-3.2.4: Comparação e Recomendação
 */
import {
  compareOptions,
  sortByQuality,
  suggestBestOption,
  formatComparisonTable,
  calculateCompositeScore,
  type AgentOption,
  type ComparisonResult,
} from '../.agents/types/compare-options'

// ============================================================
// DADOS DE TESTE
// ============================================================

const OPTION_ALTA: AgentOption = {
  name: 'Code Reviewer',
  origin: 'ECC',
  quality: 9,
  confidence: 0.92,
  description: 'Expert code reviewer with security focus',
  estimatedLines: 250,
  compatibleWith: ['TypeScript', 'JavaScript', 'Python'],
  source: 'local',
  concepts: ['Security Review', 'Code Quality'],
  model: 'mimo/mimo-v2.5',
  toolCount: 5,
}

const OPTION_MEDIA: AgentOption = {
  name: 'Python Reviewer',
  origin: 'CrewAI',
  quality: 7,
  confidence: 0.78,
  description: 'Python code reviewer with PEP 8 focus',
  estimatedLines: 150,
  compatibleWith: ['Python'],
  source: 'remote',
  concepts: ['PEP 8 Compliance', 'Pythonic Patterns'],
  model: 'deepseek/deepseek-v4-flash',
  toolCount: 3,
}

const OPTION_BAIXA: AgentOption = {
  name: 'Simple Helper',
  origin: 'GitHub/user',
  quality: 4,
  confidence: 0.45,
  description: 'Simple helper agent',
  estimatedLines: 50,
  compatibleWith: ['TypeScript'],
  source: 'local',
  concepts: [],
  model: 'deepseek/deepseek-v4-flash',
  toolCount: 1,
}

const OPTION_NOVA: AgentOption = {
  name: 'Custom Agent',
  origin: 'Nova Criação',
  quality: 0,
  confidence: 0,
  description: 'Criar do zero baseado em padrões da Biblioteca Smith',
  estimatedLines: 300,
  compatibleWith: ['any-language', 'any-framework'],
  source: 'new',
  concepts: ['Flexível', 'Personalizado'],
  model: 'personalizável',
  toolCount: 0,
}

// ============================================================
// TESTES
// ============================================================

describe('AgentOption — Estrutura dos dados', () => {
  it('cria AgentOption com dados válidos', () => {
    expect(OPTION_ALTA.name).toBe('Code Reviewer')
    expect(OPTION_ALTA.origin).toBe('ECC')
    expect(OPTION_ALTA.quality).toBeGreaterThanOrEqual(0)
    expect(OPTION_ALTA.quality).toBeLessThanOrEqual(10)
    expect(OPTION_ALTA.confidence).toBeGreaterThanOrEqual(0)
    expect(OPTION_ALTA.confidence).toBeLessThanOrEqual(1)
  })

  it('cria AgentOption com qualidade 0 (nova criacao)', () => {
    expect(OPTION_NOVA.quality).toBe(0)
    expect(OPTION_NOVA.source).toBe('new')
    expect(OPTION_NOVA.concepts).toContain('Flexível')
  })
})

describe('sortByQuality — Ordenação', () => {
  it('ordena do maior quality para o menor', () => {
    const sorted = sortByQuality([OPTION_BAIXA, OPTION_ALTA, OPTION_MEDIA])
    expect(sorted).toHaveLength(3)
    expect(sorted[0].name).toBe('Code Reviewer')
    expect(sorted[1].name).toBe('Python Reviewer')
    expect(sorted[2].name).toBe('Simple Helper')
  })

  it('retorna array vazio para lista vazia', () => {
    expect(sortByQuality([])).toHaveLength(0)
  })

  it('retorna array com 1 item para lista de 1', () => {
    expect(sortByQuality([OPTION_ALTA])).toHaveLength(1)
  })
})

describe('suggestBestOption — Melhor recomendação', () => {
  it('seleciona opcao de maior qualidade composta', () => {
    const best = suggestBestOption([OPTION_BAIXA, OPTION_MEDIA, OPTION_ALTA])
    expect(best).not.toBeNull()
    expect(best!.name).toBe('Code Reviewer')
  })

  it('retorna null para lista vazia', () => {
    expect(suggestBestOption([])).toBeNull()
  })

  it('retorna o unico item para lista de 1', () => {
    const best = suggestBestOption([OPTION_ALTA])
    expect(best!.name).toBe('Code Reviewer')
  })
})

describe('calculateCompositeScore — Pontuação composta', () => {
  it('combina quality e confidence', () => {
    const score1 = calculateCompositeScore(OPTION_ALTA)
    const score2 = calculateCompositeScore(OPTION_BAIXA)
    // Alta qualidade + alta confiança > baixa qualidade + baixa confiança
    expect(score1).toBeGreaterThan(score2)
  })

  it('retorna score maior que 0 para dados válidos', () => {
    expect(calculateCompositeScore(OPTION_ALTA)).toBeGreaterThan(0)
  })
})

describe('compareOptions — Comparação completa', () => {
  it('retorna todas as opcoes no resultado', () => {
    const result: ComparisonResult = compareOptions([OPTION_ALTA, OPTION_MEDIA, OPTION_BAIXA])
    expect(result.options).toHaveLength(3)
    expect(result.options.map(o => o.name)).toContain('Code Reviewer')
    expect(result.options.map(o => o.name)).toContain('Python Reviewer')
    expect(result.options.map(o => o.name)).toContain('Simple Helper')
  })

  it('recomenda a melhor opcao', () => {
    const result = compareOptions([OPTION_BAIXA, OPTION_MEDIA, OPTION_ALTA])
    expect(result.recommended).not.toBeNull()
    expect(result.recommended!.name).toBe('Code Reviewer')
  })

  it('retorna recommended null quando lista vazia', () => {
    const result = compareOptions([])
    expect(result.recommended).toBeNull()
    expect(result.options).toHaveLength(0)
    expect(result.summary).toContain('Nenhuma')
  })

  it('ordena opcoes por qualidade na resposta', () => {
    const result = compareOptions([OPTION_BAIXA, OPTION_ALTA, OPTION_MEDIA])
    expect(result.options[0].name).toBe('Code Reviewer')
    expect(result.options[1].name).toBe('Python Reviewer')
    expect(result.options[2].name).toBe('Simple Helper')
  })
})

describe('formatComparisonTable — Tabela formatada', () => {
  it('gera tabela com cabecalhos e dados', () => {
    const result = compareOptions([OPTION_ALTA, OPTION_MEDIA])
    const table = formatComparisonTable(result)
    expect(table).toContain('Opção')
    expect(table).toContain('Code Reviewer')
    expect(table).toContain('Python Reviewer')
    expect(table).toContain('ECC')
    expect(table).toContain('CrewAI')
  })

  it('inclui mensagem de recomendacao', () => {
    const result = compareOptions([OPTION_ALTA, OPTION_MEDIA, OPTION_BAIXA])
    const table = formatComparisonTable(result)
    expect(table).toContain('Recomendada')
    expect(table).toContain('Code Reviewer')
  })

  it('inclui summary informativo', () => {
    const result = compareOptions([OPTION_ALTA, OPTION_MEDIA, OPTION_BAIXA])
    expect(result.summary).toContain('Code Reviewer')
    expect(result.summary).toContain('Recomendação')
  })

  it('trata lista vazia', () => {
    const result = compareOptions([])
    const table = formatComparisonTable(result)
    expect(table).toContain('Nenhuma')
    expect(table).toContain('opção')
  })
})
