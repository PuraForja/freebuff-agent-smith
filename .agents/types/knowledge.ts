/**
 * 🧠 Knowledge — Biblioteca de Conhecimento do Smith
 *
 * SPEC-SEC-4.4: Biblioteca de Padrões
 * Armazena padrões de engenharia, princípios e técnicas extraídos
 * de múltiplos projetos. Compatível com os JSONs existentes em
 * knowledge/patterns/ e knowledge/principles/.
 *
 * Uso:
 *   const pattern: Knowledge = {
 *     concept: 'Planner Before Execute',
 *     description: 'Planejar antes de executar',
 *     origin: 'ECC/agents/planner.md',
 *     quality: 8.5,
 *     confidence: 0.84,
 *     applicableTo: ['any-language', 'any-framework'],
 *     pattern: 'analyze → design → plan → execute → verify'
 *   }
 */

/**
 * Knowledge — Representa um artefato de conhecimento na Biblioteca Smith
 *
 * Pode ser um padrão (pattern), princípio (principle), técnica (technique),
 * ou qualquer outro tipo de conhecimento reutilizável.
 */
export interface Knowledge {
  /** Nome do conceito (ex: "Planner Before Execute") */
  concept: string

  /** Descrição detalhada do conhecimento */
  description: string

  /** Origem do conhecimento (ex: "ECC/agents/planner.md") */
  origin: string

  /** Qualidade percebida (1-10) */
  quality: number

  /** Confiança na precisão (0.0-1.0) */
  confidence: number

  /** Frameworks/linguagens onde é aplicável */
  applicableTo: string[]

  /** Padrão de workflow (ex: "analyze → design → plan → execute") */
  pattern: string

  /** Tipo de conhecimento (padrão, princípio, técnica) */
  type?: 'pattern' | 'principle' | 'technique'

  /** Princípios relacionados (opcional) */
  principles?: string[]

  /** Máxima ou frase de efeito (opcional) */
  maxim?: string

  /** Padrões relacionados (opcional) */
  relatedPatterns?: string[]

  /** Repositórios de origem (opcional) */
  sourceRepos?: string[]
}

/**
 * Valida o range de quality (1-10)
 * @throws Se quality estiver fora do range
 */
export function validateQuality(quality: number): void {
  if (quality < 1 || quality > 10) {
    throw new Error(`Quality deve estar entre 1 e 10, recebeu ${quality}`)
  }
}

/**
 * Valida o range de confidence (0.0-1.0)
 * @throws Se confidence estiver fora do range
 */
export function validateConfidence(confidence: number): void {
  if (confidence < 0 || confidence > 1) {
    throw new Error(`Confidence deve estar entre 0.0 e 1.0, recebeu ${confidence}`)
  }
}

/**
 * Cria um Knowledge com validação embutida
 * @param data - Dados parciais do conhecimento
 * @returns Knowledge validado
 * @throws Se quality, confidence ou pattern forem inválidos
 */
export function createKnowledge(data: {
  concept: string
  description: string
  origin: string
  quality: number
  confidence: number
  applicableTo: string[]
  pattern: string
  type?: 'pattern' | 'principle' | 'technique'
  principles?: string[]
  maxim?: string
  relatedPatterns?: string[]
  sourceRepos?: string[]
}): Knowledge {
  validateQuality(data.quality)
  validateConfidence(data.confidence)
  if (!data.pattern || data.pattern.trim().length === 0) {
    throw new Error('Pattern não pode estar vazio')
  }
  return { ...data }
}

/**
 * Converte um Knowledge para JSON formatado (para salvar em disco)
 */
export function knowledgeToJSON(knowledge: Knowledge): string {
  return JSON.stringify(knowledge, null, 2)
}
