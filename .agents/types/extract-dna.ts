/**
 * 🧬 Extract DNA — Destilador de Conhecimento (Lote 1)
 *
 * Extrai o "DNA" de agentes ECC: conceitos, padrões, princípios,
 * metadados e scores de qualidade.
 *
 * 3 níveis de extração:
 *   N0: Metadados (id, model, tools) — regex
 *   N1: Conceitos e padrões — heurística
 *   N2: LLM (futuro) — extração semântica profunda
 *
 * Fase 2 — Destilador de Conhecimento
 * SPEC-SEC-4.1: Dois modos de integração (local + remoto)
 */

import { readFileSync, existsSync, readdirSync } from 'fs'
import { join } from 'path'
import type { Knowledge } from './knowledge'

// ============================================================
// TIPOS
// ============================================================

/**
 * DnaExtractionResult — Resultado da extração de DNA de um agente
 */
export interface DnaExtractionResult {
  /** ID do agente fonte */
  agentId: string
  /** Nome de exibição */
  displayName: string
  /** Modelo LLM usado */
  model: string
  /** Ferramentas que o agente usa */
  toolNames: string[]
  /** Conceitos extraídos (ex: "Research First") */
  concepts: string[]
  /** Padrões de workflow (ex: "analyze → design → plan") */
  patterns: string[]
  /** Princípios e regras extraídos */
  principles: string[]
  /** Score de qualidade (1-10) */
  qualityScore: number
  /** Score de confiança (0.0-1.0) */
  confidenceScore: number
  /** Repositório de origem */
  sourceRepo: string
  /** Versão do repositório de origem */
  sourceVersion: string
}

// ============================================================
// CONSTANTES
// ============================================================

const DEFAULT_SOURCE_REPO = 'ECC'
const DEFAULT_SOURCE_VERSION = '2.1'

/** Padrões regex para extração de metadados de agentes TypeScript */
const METADATA_PATTERNS = {
  id: /id:\s*['"](\w[\w-]*)['"]/,
  displayName: /displayName:\s*['"]([^'"]+)['"]/,
  model: /model:\s*['"]([^'"]+)['"]/,
  toolNames: /toolNames:\s*\[([^\]]*)\]/,
  spawnerPrompt: /spawnerPrompt:\s*['"]([^'"]+)['"]/,
  includeMessageHistory: /includeMessageHistory:\s*(true|false)/,
} as const

/** Palavras-chave que indicam um conceito extraível */
const CONCEPT_KEYWORDS = [
  /(?:is an?|specialized?|expert?)\s+([^.,]+)/gi,
  /(?:focused? on|specializes? in)\s+([^.,]+)/gi,
  /(?:primary|main|core)\s+(?:purpose|goal|focus|role)[:\s]+([^.,\n]+)/gi,
]

/** Marcadores de seções que indicam princípios e regras */
const PRINCIPLE_SECTIONS = [
  /(?:Best Practices?|Guidelines?|Rules?|Principl(?:e|es))[:\s]*\n([^]*?)(?=\n##|\n---|$)/gi,
  /(?:Red Flags?\s*(?:to Check)?|Watch [Oo]ut|Caution)[:\s]*\n([^]*?)(?=\n##|\n---|$)/gi,
]

/** Padrões de workflow (sequências de passos) */
const WORKFLOW_PATTERNS = [
  /(?:\d+\.\s*[^\n]+(?:\n\d+\.\s*[^\n]+)+)/g,       // Listas numeradas
  /(?:[A-Z][a-z]+(?:\s*→\s*[A-Z][a-z]+)+)/g,          // Setas: "Analyze → Review → Report"
  /(?:[a-z]+(?:\s*→\s*[a-z]+)+)/g,                     // Setas minúsculas: "analyze → review"
]

// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

/**
 * Extrai o conteúdo do instructionsPrompt de um agente TypeScript
 */
function extractInstructionsPrompt(content: string): string {
  // Pega tudo entre instructionsPrompt: PROMPT_DEFENSE + ` ... `,
  const match = content.match(/instructionsPrompt:\s*(?:PROMPT_DEFENSE\s*\+\s*)?`([^`]*)`/)
  return match?.[1]?.trim() ?? ''
}

/**
 * Extrai o spawnerPrompt de um agente TypeScript
 */
function extractSpawnerPrompt(content: string): string {
  const match = content.match(METADATA_PATTERNS.spawnerPrompt)
  return match?.[1]?.trim() ?? ''
}

/**
 * Extrai conceitos do instructionsPrompt
 */
function extractConcepts(instructionsPrompt: string): string[] {
  const concepts: Set<string> = new Set()

  // 1. Procurar por padrões "is an expert", "specializes in", etc.
  for (const pattern of CONCEPT_KEYWORDS) {
    let match
    while ((match = pattern.exec(instructionsPrompt)) !== null) {
      const concept = match[1].trim()
      if (concept.length > 3 && concept.length < 100) {
        concepts.add(concept.charAt(0).toUpperCase() + concept.slice(1))
      }
    }
  }

  // 2. Procurar por títulos de seção (## Section Name)
  const sectionTitles = instructionsPrompt.match(/##\s+([^#\n]+)/g)
  if (sectionTitles) {
    for (const title of sectionTitles) {
      const clean = title.replace(/^##\s*/, '').trim()
      if (clean.length < 50 && !clean.toLowerCase().includes('exemplo') && !clean.toLowerCase().includes('example')) {
        concepts.add(clean)
      }
    }
  }

  return Array.from(concepts).slice(0, 10) // Máx 10 conceitos
}

/**
 * Extrai padrões de workflow do instructionsPrompt
 */
function extractPatterns(instructionsPrompt: string): string[] {
  const patterns: Set<string> = new Set()

  for (const pattern of WORKFLOW_PATTERNS) {
    let match
    while ((match = pattern.exec(instructionsPrompt)) !== null) {
      const normalized = match[0]
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
      if (normalized.length < 200) {
        patterns.add(normalized)
      }
    }
  }

  return Array.from(patterns).slice(0, 5)
}

/**
 * Extrai princípios e regras do instructionsPrompt
 */
function extractPrinciples(instructionsPrompt: string): string[] {
  const principles: Set<string> = new Set()

  // 1. Procurar por seções de Best Practices, Rules, etc.
  for (const sectionPattern of PRINCIPLE_SECTIONS) {
    let match
    while ((match = sectionPattern.exec(instructionsPrompt)) !== null) {
      const sectionContent = match[1]
      // Extrair linhas com bullets ou numbered items
      const lines = sectionContent.split('\n')
      for (const line of lines) {
        const trimmed = line.replace(/^[\s*\-–•]+/, '').trim()
        if (trimmed.length > 10 && trimmed.length < 200) {
          // Pega a primeira parte da regra (até o primeiro ponto final ou quebra)
          const principle = trimmed.split(/[.\n]/)[0].trim()
          if (principle.length > 10) {
            principles.add(principle)
          }
        }
      }
    }
  }

  // 2. Procurar por itens em checklist: "- [ ] ..."
  const checklistItems = instructionsPrompt.match(/- \[.\]\s+([^\n]+)/g)
  if (checklistItems) {
    for (const item of checklistItems) {
      const clean = item.replace(/- \[.\]\s*/, '').trim()
      if (clean.length > 10 && clean.length < 150) {
        principles.add(clean)
      }
    }
  }

  return Array.from(principles).slice(0, 15)
}

/**
 * Calcula o score de qualidade (1-10) baseado em heurísticas
 */
function calculateQualityScore(params: {
  instructionsLength: number
  hasSpawnerPrompt: boolean
  hasIncludeMessageHistory: boolean
  conceptsCount: number
  patternsCount: number
  principlesCount: number
  toolsCount: number
  hasExamples: boolean
}): number {
  let score = 3 // Base

  // Instruções longas = mais completo
  if (params.instructionsLength > 2000) score += 2
  else if (params.instructionsLength > 1000) score += 1
  else if (params.instructionsLength > 500) score += 0.5

  // Tem spawnerPrompt dedicado
  if (params.hasSpawnerPrompt) score += 1

  // Tem includeMessageHistory
  if (params.hasIncludeMessageHistory) score += 1

  // Riqueza de conceitos
  if (params.conceptsCount >= 3) score += 1
  else if (params.conceptsCount >= 1) score += 0.5

  // Tem padrões de workflow
  if (params.patternsCount >= 1) score += 0.5

  // Tem princípios
  if (params.principlesCount >= 5) score += 1
  else if (params.principlesCount >= 2) score += 0.5

  // Usa múltiplas ferramentas
  if (params.toolsCount >= 5) score += 0.5

  // Tem exemplos no código
  if (params.hasExamples) score += 0.5

  return Math.max(1, Math.min(10, Math.round(score)))
}

/**
 * Calcula o score de confiança (0.0-1.0)
 */
function calculateConfidenceScore(qualityScore: number): number {
  // Base: qualityScore / 10
  const base = qualityScore / 10

  // Ajuste: quanto maior a qualidade, mais confiança
  const adjustment = qualityScore >= 8 ? 0.05 : qualityScore <= 4 ? -0.1 : 0

  return Math.max(0, Math.min(1, base + adjustment))
}

/**
 * Verifica se o texto contém exemplos de código
 */
function hasCodeExamples(text: string): boolean {
  return /```(?:typescript|javascript|python|bash|jsx|tsx)\n/.test(text)
}

/**
 * Extrai ferramentas de uma string toolNames
 */
function extractToolNames(toolNamesMatch: string): string[] {
  return toolNamesMatch
    .replace(/[\[\]'"`\s]/g, '')
    .split(',')
    .filter(t => t.length > 0)
}

// ============================================================
// FUNÇÕES PRINCIPAIS
// ============================================================

/**
 * Extrai DNA de um arquivo de agente.
 * @param filePath - Caminho do arquivo .ts relativo ao projeto
 */
export function extractAgentDna(filePath: string, basePath?: string): DnaExtractionResult {
  const root = basePath ?? process.cwd()
  const fullPath = join(root, filePath)

  if (!existsSync(fullPath)) {
    throw new Error(`Arquivo de agente não encontrado: ${filePath}`)
  }

  const content = readFileSync(fullPath, 'utf-8')
  const agentId = filePath.split('/').pop()?.replace('.ts', '') ?? 'unknown'

  return extractDnaFromContent(agentId, content)
}

/**
 * Extrai DNA do conteúdo textual de um agente.
 * @param agentId - ID do agente
 * @param content - Conteúdo completo do arquivo .ts
 */
export function extractDnaFromContent(agentId: string, content: string): DnaExtractionResult {
  // N0: Metadados
  const idMatch = content.match(METADATA_PATTERNS.id)
  const displayNameMatch = content.match(METADATA_PATTERNS.displayName)
  const modelMatch = content.match(METADATA_PATTERNS.model)
  const toolNamesMatch = content.match(METADATA_PATTERNS.toolNames)
  const historyMatch = content.match(METADATA_PATTERNS.includeMessageHistory)

  const instructionsPrompt = extractInstructionsPrompt(content)
  const spawnerPrompt = extractSpawnerPrompt(content)

  // N1: Conceitos e padrões
  const concepts = extractConcepts(instructionsPrompt + '\n' + spawnerPrompt)
  const patterns = extractPatterns(instructionsPrompt)
  const principles = extractPrinciples(instructionsPrompt)
  const tools = toolNamesMatch ? extractToolNames(toolNamesMatch[1]) : []

  // Scores
  const qualityScore = calculateQualityScore({
    instructionsLength: instructionsPrompt.length,
    hasSpawnerPrompt: spawnerPrompt.length > 0,
    hasIncludeMessageHistory: historyMatch?.[1] === 'true',
    conceptsCount: concepts.length,
    patternsCount: patterns.length,
    principlesCount: principles.length,
    toolsCount: tools.length,
    hasExamples: hasCodeExamples(instructionsPrompt),
  })

  const confidenceScore = calculateConfidenceScore(qualityScore)

  return {
    agentId: idMatch?.[1] ?? agentId,
    displayName: displayNameMatch?.[1] ?? idMatch?.[1] ?? agentId,
    model: modelMatch?.[1] ?? 'unknown',
    toolNames: tools,
    concepts,
    patterns,
    principles,
    qualityScore,
    confidenceScore,
    sourceRepo: DEFAULT_SOURCE_REPO,
    sourceVersion: DEFAULT_SOURCE_VERSION,
  }
}

/**
 * Extrai DNA de múltiplos agentes em lote.
 * @param directory - Diretório relativo ao projeto (ex: .agents/ecc)
 * @param agentIds - Lista de IDs de agentes para extrair
 * @returns Array de resultados (agentes não encontrados são ignorados)
 */
export function batchExtractDna(directory: string, agentIds: string[], basePath?: string): DnaExtractionResult[] {
  const results: DnaExtractionResult[] = []

  for (const id of agentIds) {
    try {
      const result = extractAgentDna(join(directory, `${id}.ts`), basePath)
      results.push(result)
    } catch {
      // Ignora agentes que não existem
      continue
    }
  }

  return results
}

/**
 * Extrai DNA de TODOS os agentes em um diretório.
 * @param directory - Diretório relativo ao projeto (ex: .agents/ecc)
 * @returns Array de resultados
 */
export function extractAllDna(directory: string, basePath?: string): DnaExtractionResult[] {
  const root = basePath ?? process.cwd()
  const fullPath = join(root, directory)

  if (!existsSync(fullPath)) {
    return []
  }

  const files = readdirSync(fullPath)
    .filter(f => f.endsWith('.ts'))
    .map(f => f.replace('.ts', ''))

  return batchExtractDna(directory, files, basePath)
}

/**
 * Converte um DnaExtractionResult para o tipo Knowledge (F1a).
 * @param dna - Resultado da extração de DNA
 * @param origin - Caminho de origem (ex: "ECC/agents/planner.ts")
 * @returns Knowledge pronto para salvar na Biblioteca Smith
 */
export function dnaToKnowledge(dna: DnaExtractionResult, origin: string): Knowledge {
  const concept = dna.concepts.length > 0
    ? dna.concepts[0]
    : `${dna.displayName} — ${dna.agentId}`

  const description = dna.principles.length > 0
    ? dna.principles.slice(0, 3).join('. ') + '.'
    : `Agente ${dna.displayName} do repositório ${dna.sourceRepo}.`

  const pattern = dna.patterns.length > 0
    ? dna.patterns[0]
    : 'use → execute'

  return {
    concept,
    description,
    origin,
    quality: dna.qualityScore,
    confidence: dna.confidenceScore,
    applicableTo: ['TypeScript', ...(dna.model.includes('python') ? ['Python'] : []), ...(dna.model.includes('rust') ? ['Rust'] : [])],
    pattern,
    type: 'pattern',
    principles: dna.principles.length > 0 ? dna.principles.slice(0, 5) : undefined,
    relatedPatterns: dna.concepts.slice(1, 4).length > 0 ? dna.concepts.slice(1, 4) : undefined,
    sourceRepos: [`${dna.sourceRepo}/${dna.agentId}`],
  }
}
