/**
 * 📊 Compare Options — Destilador de Conhecimento (Lote 3)
 *
 * Sistema de comparação e recomendação de agentes.
 * Apresenta múltiplas opções com scores, origem e qualidade
 * para o usuário escolher.
 *
 * Fluxo:
 *   Smith descobre agentes (local ou remoto)
 *   → Opções são comparadas
 *   → Melhor opção é recomendada
 *   → Usuário escolhe
 *
 * Fase 2 — Destilador de Conhecimento
 * SPEC-F2-3.2.4: Comparação e Recomendação
 */

// ============================================================
// TIPOS
// ============================================================

/**
 * AgentOption — Opção de agente disponível para o usuário
 *
 * Representa uma alternativa que o Smith encontrou e pode recomendar.
 */
export interface AgentOption {
  /** Nome do agente (ex: "Code Reviewer") */
  name: string
  /** Origem (ex: "ECC", "CrewAI", "GitHub/user/repo") */
  origin: string
  /** Score de qualidade (1-10, 0 para nova criação) */
  quality: number
  /** Score de confiança (0.0-1.0) */
  confidence: number
  /** Descrição curta do que o agente faz */
  description: string
  /** Linhas de código estimadas */
  estimatedLines: number
  /** Frameworks/linguagens compatíveis */
  compatibleWith: string[]
  /** Fonte do agente */
  source: 'local' | 'remote' | 'new'
  /** Conceitos extraídos do DNA */
  concepts: string[]
  /** Modelo LLM usado pelo agente */
  model: string
  /** Quantidade de ferramentas que o agente usa */
  toolCount: number
}

/**
 * ComparisonResult — Resultado completo da comparação
 */
export interface ComparisonResult {
  /** Todas as opções ordenadas por qualidade (melhor primeiro) */
  options: AgentOption[]
  /** Melhor opção (null se lista vazia) */
  recommended: AgentOption | null
  /** Resumo em texto da comparação */
  summary: string
}

// ============================================================
// FUNÇÕES PÚBLICAS
// ============================================================

/**
 * Calcula o score composto de uma opção.
 * Combina quality + confidence em um único número (0-10).
 *
 * Fórmula: quality * 0.7 + (confidence * 10) * 0.3
 * Dá mais peso para quality (70%) do que confidence (30%).
 *
 * @param option - Opção a ser avaliada
 * @returns Score composto (0-10)
 */
export function calculateCompositeScore(option: AgentOption): number {
  const qualityWeight = 0.7
  const confidenceWeight = 0.3
  const confidenceScore = option.confidence * 10 // Normaliza 0-1 para 0-10

  return Math.round(
    (option.quality * qualityWeight + confidenceScore * confidenceWeight) * 10
  ) / 10
}

/**
 * Ordena opções por qualidade composta (melhor primeiro).
 *
 * @param options - Lista de opções
 * @returns Lista ordenada (não modifica a original)
 */
export function sortByQuality(options: AgentOption[]): AgentOption[] {
  return [...options].sort((a, b) => {
    const scoreA = calculateCompositeScore(a)
    const scoreB = calculateCompositeScore(b)
    return scoreB - scoreA // Maior score primeiro
  })
}

/**
 * Sugere a melhor opção da lista.
 *
 * @param options - Lista de opções
 * @returns A melhor opção ou null se lista vazia
 */
export function suggestBestOption(options: AgentOption[]): AgentOption | null {
  if (options.length === 0) return null
  return sortByQuality(options)[0]
}

/**
 * Compara múltiplas opções e retorna resultado completo.
 *
 * @param options - Lista de opções para comparar
 * @returns ComparisonResult com todas as opções ordenadas + recomendação + resumo
 *
 * @example
 * const result = compareOptions([
 *   { name: 'ECC/reviewer', quality: 9, ... },
 *   { name: 'CrewAI/reviewer', quality: 7, ... },
 * ])
 * // result.recommended.name === 'ECC/reviewer'
 * // result.summary contém texto explicativo
 */
export function compareOptions(options: AgentOption[]): ComparisonResult {
  if (options.length === 0) {
    return {
      options: [],
      recommended: null,
      summary: 'Nenhuma opção disponível para comparação.',
    }
  }

  const sorted = sortByQuality(options)
  const best = sorted[0]

  // Construir resumo
  const parts: string[] = [
    `Encontrei ${sorted.length} opção(ões) para você.`,
    '',
  ]

  for (let i = 0; i < sorted.length; i++) {
    const opt = sorted[i]
    const score = calculateCompositeScore(opt)
    const isBest = i === 0 ? ' ⭐ RECOMENDADA' : ''

    parts.push(
      `${i + 1}. ${opt.name}${isBest}`,
      `   Origem: ${opt.origin}`,
      `   Qualidade: ${opt.quality}/10 · Confiança: ${(opt.confidence * 100).toFixed(0)}%`,
      `   Score composto: ${score.toFixed(1)}`,
      `   Descrição: ${opt.description}`,
      `   Linhas estimadas: ${opt.estimatedLines}`,
      `   Compatível com: ${opt.compatibleWith.join(', ')}`,
      opt.concepts.length > 0 ? `   Conceitos: ${opt.concepts.slice(0, 3).join(', ')}` : '',
      '',
    )
  }

  parts.push(
    `---`,
    `✅ Recomendação: ${best.name} (score: ${calculateCompositeScore(best).toFixed(1)})`,
    `${best.description}`,
  )

  if (best.source === 'local') {
    parts.push(`💡 Já disponível localmente. Instalação imediata.`)
  } else if (best.source === 'remote') {
    parts.push(`🌐 Origem remota. Precisa baixar ou clonar.`)
  } else {
    parts.push(`🆕 Nova criação. Será gerado com base nos padrões da Biblioteca Smith.`)
  }

  return {
    options: sorted,
    recommended: best,
    summary: parts.join('\n'),
  }
}

/**
 * Formata o resultado da comparação em uma tabela legível.
 *
 * @param result - Resultado da comparação
 * @returns String formatada como tabela Markdown
 */
export function formatComparisonTable(result: ComparisonResult): string {
  if (result.options.length === 0) {
    return 'Nenhuma opção disponível para comparação.'
  }

  const lines: string[] = []

  // Cabeçalho
  lines.push('| # | Opção | Origem | Qualidade | Confiança | Score | Linhas | Fonte |')
  lines.push('|---|-------|--------|:---------:|:---------:|:-----:|:-----:|:-----:|')

  // Dados
  for (let i = 0; i < result.options.length; i++) {
    const opt = result.options[i]
    const score = calculateCompositeScore(opt)
    const isBest = result.recommended?.name === opt.name

    const name = isBest ? `${opt.name} ⭐` : opt.name
    const confidencePct = `${(opt.confidence * 100).toFixed(0)}%`

    lines.push(
      `| ${i + 1} | ${name} | ${opt.origin} | ${opt.quality}/10 | ${confidencePct} | ${score.toFixed(1)} | ${opt.estimatedLines} | ${opt.source} |`,
    )
  }

  // Rodapé com recomendação
  lines.push('')
  if (result.recommended) {
    const best = result.recommended
    lines.push(`> **✅ Recomendada:** ${best.name} (score ${calculateCompositeScore(best).toFixed(1)})`)
    lines.push(`> ${best.description}`)
  }

  return lines.join('\n')
}
