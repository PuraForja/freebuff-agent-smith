/**
 * 🩺 Diagnose Agent — Diagnóstico de Agentes Problemáticos
 *
 * Analisa agentes e detecta problemas como:
 * - Instruções incompletas ou ausentes
 * - Modelo inválido ou desatualizado
 * - Falta de ferramentas essenciais
 * - Ausência de spawnerPrompt
 * - Falta de proteção PROMPT_DEFENSE
 *
 * Gera relatório com healthScore, issues e sugestões.
 *
 * Fase 3 — Patches + Smith Update
 * PLAN-F3-3.3.3: Diagnóstico de Agentes Problemáticos
 * SPEC-SEC-6.3: Fluxo de Diagnóstico
 */

// ============================================================
// TIPOS
// ============================================================

/**
 * DiagnosisIssue — Problema encontrado no agente
 */
export interface DiagnosisIssue {
  /** Severidade do problema */
  severity: 'critical' | 'high' | 'medium' | 'low'
  /** Categoria do problema */
  category: 'instructions' | 'spawner' | 'model' | 'tools' | 'history' | 'security' | 'structure'
  /** Descrição curta */
  description: string
  /** Detalhes do problema */
  details: string
}

/**
 * DiagnosisResult — Resultado completo do diagnóstico
 */
export interface DiagnosisResult {
  /** ID do agente diagnosticado */
  agentId: string
  /** Nome de exibição */
  displayName: string
  /** Score de saúde (0-10, 10 = perfeito) */
  healthScore: number
  /** Problemas encontrados */
  issues: DiagnosisIssue[]
  /** Sugestões de melhoria */
  suggestions: string[]
  /** Relatório formatado em texto */
  report: string
}

// ============================================================
// CONSTANTES
// ============================================================

const VALID_MODELS = ['mimo/mimo-v2.5', 'deepseek/deepseek-v4-flash']

const HEALTH_WEIGHTS = {
  hasInstructions: 1.5,
  instructionsLength: 1.5,
  hasSpawnerPrompt: 1.5,
  hasHistory: 1.0,
  hasConcepts: 1.0,
  hasPatterns: 0.5,
  hasPrinciples: 0.5,
  hasTools: 0.5,
  hasValidModel: 1.0,
  hasPromptDefense: 1.0,
} as const

const MAX_HEALTH = Object.values(HEALTH_WEIGHTS).reduce((a, b) => a + b, 0)

// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

function extractField(content: string, field: string): string | null {
  const regex = new RegExp(`${field}:\\s*['"]([^'"]+)['"]`)
  const match = content.match(regex)
  return match?.[1] ?? null
}

function hasField(content: string, field: string): boolean {
  return new RegExp(`${field}:`).test(content)
}

function extractInstructionsSize(content: string): number {
  const match = content.match(/instructionsPrompt:\s*(?:PROMPT_DEFENSE\s*\+\s*)?`([^`]*)`/)
  return match?.[1]?.trim().length ?? 0
}

/** Extrai o conteudo do instructionsPrompt (com suporte a crases) */
function extractInstructionsContent(content: string): string {
  const match = content.match(/instructionsPrompt:\s*(?:PROMPT_DEFENSE\s*\+\s*)?`([^`]*)`/)
  return match?.[1]?.trim() ?? ''
}

function hasConcepts(instructionsPrompt: string): boolean {
  const conceptPatterns = [
    /(?:is an?|specialized?|expert?)\s+([^.,]+)/i,
    /##\s+([^#\n]+)/,
  ]
  return conceptPatterns.some(p => p.test(instructionsPrompt))
}

function hasPatterns(instructionsPrompt: string): boolean {
  const patternPatterns = [
    /(?:\d+\.\s*[^\n]+(?:\n\d+\.\s*[^\n]+)+)/,
    /(?:[A-Z][a-z]+(?:\s*→\s*[A-Z][a-z]+)+)/,
  ]
  return patternPatterns.some(p => p.test(instructionsPrompt))
}

function hasPrinciples(instructionsPrompt: string): boolean {
  const principlePatterns = [
    /(?:Best Practices?|Guidelines?|Rules?)/i,
    /(?:Red Flags?|Watch [Oo]ut|Caution)/i,
  ]
  return principlePatterns.some(p => p.test(instructionsPrompt))
}

// ============================================================
// FUNÇÃO PRINCIPAL
// ============================================================

/**
 * Realiza diagnóstico completo de um agente.
 *
 * Analisa o conteúdo do agente e retorna:
 * - healthScore (0-10)
 * - Lista de problemas encontrados
 * - Sugestões de melhoria
 * - Relatório formatado
 *
 * @param content - Conteúdo completo do arquivo do agente (.ts)
 * @param agentId - ID do agente (para fallback se não encontrado no conteúdo)
 * @returns DiagnosisResult completo
 *
 * @example
 * const result = diagnoseAgent(agentFileContent, 'my-agent')
 * console.log(result.report)
 */
export function diagnoseAgent(content: string, agentId: string): DiagnosisResult {
  const id = extractField(content, 'id') ?? agentId
  const displayName = extractField(content, 'displayName') ?? id
  const model = extractField(content, 'model')
  const toolNamesMatch = content.match(/toolNames:\s*\[([^\]]*)\]/)
  const toolsCount = toolNamesMatch
    ? toolNamesMatch[1].split(',').filter(t => t.trim().length > 0).length
    : 0

  const instructionsSize = extractInstructionsSize(content)
  const instructionsContent = extractInstructionsContent(content)
  const hasSpawner = hasField(content, 'spawnerPrompt')
  const hasHistory = content.includes('includeMessageHistory')
  const hasPromptDefense = content.includes('PROMPT_DEFENSE')
  const hasExport = content.includes('export default definition')

  const issues: DiagnosisIssue[] = []
  const suggestions: string[] = []

  // --- Verificações ---

  // 1. Instruções
  if (instructionsSize === 0) {
    issues.push({
      severity: 'critical',
      category: 'instructions',
      description: 'Agente sem instructionsPrompt',
      details: 'O instructionsPrompt é obrigatório para o funcionamento do agente.',
    })
    suggestions.push('Adicionar instructionsPrompt com as instruções do agente.')
  } else if (instructionsSize < 100) {
    issues.push({
      severity: 'high',
      category: 'instructions',
      description: 'InstructionsPrompt muito curto',
      details: `Apenas ${instructionsSize} caracteres. Agentes complexos precisam de instruções detalhadas.`,
    })
    suggestions.push('Expandir instructionsPrompt com mais detalhes, seções e exemplos.')
  }

  // 2. SpawnerPrompt
  if (!hasSpawner) {
    issues.push({
      severity: 'high',
      category: 'spawner',
      description: 'SpawnerPrompt ausente',
      details: 'SpawnerPrompt melhora a descoberta e o contexto do agente.',
    })
    suggestions.push('Adicionar spawnerPrompt com nome e descrição do agente.')
  }

  // 3. Modelo
  if (!model) {
    issues.push({
      severity: 'critical',
      category: 'model',
      description: 'Modelo não definido',
      details: 'O agente precisa de um modelo LLM configurado.',
    })
    suggestions.push('Definir model como mimo/mimo-v2.5 ou deepseek/deepseek-v4-flash.')
  } else if (!VALID_MODELS.includes(model)) {
    issues.push({
      severity: 'medium',
      category: 'model',
      description: `Modelo desconhecido: ${model}`,
      details: `Modelo "${model}" não está na lista de modelos válidos.`,
    })
    suggestions.push(`Verificar se "${model}" é um modelo válido. Modelos conhecidos: ${VALID_MODELS.join(', ')}.`)
  }

  // 4. Ferramentas
  if (toolsCount === 0) {
    issues.push({
      severity: 'high',
      category: 'tools',
      description: 'Nenhuma ferramenta configurada',
      details: 'Agente sem ferramentas não consegue executar ações.',
    })
    suggestions.push('Adicionar toolNames com pelo menos read_files, glob e set_output.')
  } else if (toolsCount < 3) {
    issues.push({
      severity: 'low',
      category: 'tools',
      description: 'Poucas ferramentas configuradas',
      details: `Apenas ${toolsCount} ferramenta(s). Agentes mais completos usam 3+.`,
    })
    suggestions.push('Considerar adicionar mais ferramentas (code_search, glob, set_output).')
  }

  // 5. includeMessageHistory
  if (!hasHistory) {
    issues.push({
      severity: 'low',
      category: 'history',
      description: 'includeMessageHistory não configurado',
      details: 'Sem includeMessageHistory, o agente não recebe histórico da conversa.',
    })
    suggestions.push('Adicionar includeMessageHistory: true para que o agente tenha contexto da conversa.')
  }

  // 6. Segurança (PROMPT_DEFENSE)
  if (!hasPromptDefense) {
    issues.push({
      severity: 'high',
      category: 'security',
      description: 'PROMPT_DEFENSE ausente',
      details: 'Sem PROMPT_DEFENSE, o agente pode ser vulnerável a prompt injection.',
    })
    suggestions.push('Adicionar import { PROMPT_DEFENSE } e prefixar o instructionsPrompt com PROMPT_DEFENSE +.')
  }

  // 7. Estrutura
  if (!hasExport) {
    issues.push({
      severity: 'critical',
      category: 'structure',
      description: 'Export default ausente',
      details: 'O agente precisa exportar default definition para ser carregado.',
    })
    suggestions.push('Adicionar "export default definition" ao final do arquivo.')
  }

  // --- Health Score ---
  let healthScore = 0
  if (instructionsSize > 0) healthScore += HEALTH_WEIGHTS.hasInstructions
  if (instructionsSize > 500) healthScore += HEALTH_WEIGHTS.instructionsLength
  if (hasSpawner) healthScore += HEALTH_WEIGHTS.hasSpawnerPrompt
  if (hasHistory) healthScore += HEALTH_WEIGHTS.hasHistory
  if (hasConcepts(instructionsContent)) healthScore += HEALTH_WEIGHTS.hasConcepts
  if (hasPatterns(instructionsContent)) healthScore += HEALTH_WEIGHTS.hasPatterns
  if (hasPrinciples(instructionsContent)) healthScore += HEALTH_WEIGHTS.hasPrinciples
  if (toolsCount > 0) healthScore += HEALTH_WEIGHTS.hasTools
  if (model && VALID_MODELS.includes(model)) healthScore += HEALTH_WEIGHTS.hasValidModel
  if (hasPromptDefense) healthScore += HEALTH_WEIGHTS.hasPromptDefense

  // Normalizar para 0-10
  healthScore = Math.round((healthScore / MAX_HEALTH) * 10)

  // --- Relatório ---
  const report = buildReport(id, displayName, healthScore, issues, suggestions)

  return {
    agentId: id,
    displayName,
    healthScore,
    issues,
    suggestions,
    report,
  }
}

// ============================================================
// RELATÓRIO
// ============================================================

function buildReport(
  agentId: string,
  displayName: string,
  healthScore: number,
  issues: DiagnosisIssue[],
  suggestions: string[],
): string {
  const lines: string[] = []

  lines.push(`🔍 Diagnóstico: ${displayName} (${agentId})`)
  lines.push(`📊 Saúde: ${healthScore}/10`)
  lines.push('')

  if (issues.length === 0) {
    lines.push('✅ Nenhum problema encontrado. Agente saudável!')
  } else {
    lines.push(`⚠️  ${issues.length} problema(s) encontrado(s):`)
    lines.push('')

    // Agrupar por severidade
    for (const severity of ['critical', 'high', 'medium', 'low'] as const) {
      const sevIssues = issues.filter(i => i.severity === severity)
      if (sevIssues.length === 0) continue

      const label = severity === 'critical' ? '🔴 CRÍTICO' :
        severity === 'high' ? '🟡 ALTO' :
        severity === 'medium' ? '🟢 MÉDIO' : '🔵 BAIXO'

      for (const issue of sevIssues) {
        lines.push(`  [${label}] ${issue.description}`)
        lines.push(`         ${issue.details}`)
      }
    }
  }

  lines.push('')

  if (suggestions.length > 0) {
    lines.push('💡 Sugestões:')
    for (const s of suggestions) {
      lines.push(`  • ${s}`)
    }
  }

  lines.push('')
  lines.push(`--- Fim do diagnóstico ---`)

  return lines.join('\n')
}
