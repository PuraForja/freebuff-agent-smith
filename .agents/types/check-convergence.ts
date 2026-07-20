/**
 * 🔍 Check Convergence — Detecção de Convergência (Fase 5)
 *
 * Detecta quando o upstream já implementou a mesma melhoria
 * que um patch local tenta fazer.
 *
 * PLAN-F5: Contribuição Automática
 * SPEC-SEC-4.3: Gerenciador de Patches (detecção de convergência)
 */

import { Octokit } from '@octokit/rest'
import type { Patch } from './patch'

// ============================================================
// TIPOS
// ============================================================

export interface ConvergenceResult {
  patchId: string
  target: string
  converged: boolean
  convergenceScore: number
  description: string
  suggestedAction: 'remove_patch' | 'keep_patch' | 'update_patch' | 'manual_review'
  details: ConvergenceDetail[]
  detectionSource: 'api' | 'content_analysis' | 'version_comparison'
}

export interface ConvergenceDetail {
  check: string
  passed: boolean
  description: string
}

export interface ConvergenceOptions {
  octokit?: Octokit
  mockUpstreamContent?: string
  threshold?: number
}

export interface ConvergenceStore {
  save(patchId: string, result: ConvergenceResult): void
  load(patchId: string): ConvergenceResult | null
  list(): string[]
}

// ============================================================
// STORE EM MEMÓRIA
// ============================================================

export class InMemoryConvergenceStore implements ConvergenceStore {
  private store: Record<string, ConvergenceResult> = {}

  save(patchId: string, result: ConvergenceResult): void {
    this.store[patchId] = result
  }

  load(patchId: string): ConvergenceResult | null {
    return this.store[patchId] ?? null
  }

  list(): string[] {
    return Object.keys(this.store)
  }
}

// ============================================================
// CONSTANTES
// ============================================================

const DEFAULT_THRESHOLD = 0.7

// ============================================================
// FUNÇÕES PÚBLICAS
// ============================================================

/**
 * Verifica se um patch convergiu com o upstream.
 */
export async function checkConvergence(
  patch: Patch,
  upstreamRepo: string,
  upstreamPath: string,
  options: ConvergenceOptions = {}
): Promise<ConvergenceResult> {
  const threshold = options.threshold ?? DEFAULT_THRESHOLD
  const details: ConvergenceDetail[] = []

  const upstreamExists = await checkUpstreamExists(upstreamRepo, upstreamPath, options)
  details.push({
    check: 'upstream_exists',
    passed: upstreamExists,
    description: upstreamExists
      ? `Arquivo ${upstreamPath} encontrado em ${upstreamRepo}`
      : `Arquivo ${upstreamPath} não encontrado em ${upstreamRepo}`,
  })

  if (!upstreamExists) {
    return buildResult(patch, false, 0, 'keep_patch', details, 'content_analysis')
  }

  const descriptionMatch = await checkDescriptionMatch(patch, upstreamRepo, upstreamPath, options)
  details.push({
    check: 'description_match',
    passed: descriptionMatch.score > threshold,
    description: `Similaridade de descrição: ${(descriptionMatch.score * 100).toFixed(0)}%`,
  })

  const conceptMatch = checkConceptMatch(patch.description, descriptionMatch.content)
  details.push({
    check: 'concept_match',
    passed: conceptMatch.score > threshold,
    description: `Conceitos-chave encontrados: ${(conceptMatch.score * 100).toFixed(0)}%`,
  })

  const convergenceScore = calculateConvergenceScore(descriptionMatch.score, conceptMatch.score)
  const converged = convergenceScore >= threshold
  const suggestedAction = determineAction(converged, convergenceScore)

  return buildResult(patch, converged, convergenceScore, suggestedAction, details, 'content_analysis')
}

/**
 * Verifica convergência de múltiplos patches.
 */
export async function checkConvergenceBatch(
  patches: Patch[],
  upstreamRepo: string,
  upstreamBasePath: string,
  options: ConvergenceOptions = {}
): Promise<ConvergenceResult[]> {
  const results: ConvergenceResult[] = []
  for (const patch of patches) {
    const upstreamPath = mapTargetToPath(patch.target, upstreamBasePath)
    const result = await checkConvergence(patch, upstreamRepo, upstreamPath, options)
    results.push(result)
  }
  return results
}

/**
 * Gera um relatório de convergência em texto.
 */
export function generateConvergenceReport(results: ConvergenceResult[]): string {
  const lines: string[] = []

  lines.push('## 📊 Relatório de Convergência')
  lines.push('')
  lines.push(`Data: ${new Date().toLocaleDateString('pt-BR')}`)
  lines.push(`Total verificado: ${results.length}`)
  lines.push(`Convergidos: ${results.filter(r => r.converged).length}`)
  lines.push(`Não convergidos: ${results.filter(r => !r.converged).length}`)
  lines.push('')

  const converged = results.filter(r => r.converged)
  if (converged.length > 0) {
    lines.push('### ⚠️ Patches Convergentes (remoção sugerida)')
    lines.push('')
    for (const r of converged) {
      lines.push(`- **${r.patchId}** → ${r.target}`)
      lines.push(`  Score: ${(r.convergenceScore * 100).toFixed(0)}%`)
      lines.push(`  Ação: ${r.suggestedAction}`)
      lines.push(`  ${r.description}`)
      lines.push('')
    }
  }

  const notConverged = results.filter(r => !r.converged)
  if (notConverged.length > 0) {
    lines.push('### ✅ Patches Não Convergentes (manter)')
    lines.push('')
    for (const r of notConverged) {
      lines.push(`- **${r.patchId}** → ${r.target}`)
      lines.push(`  Score: ${(r.convergenceScore * 100).toFixed(0)}%`)
      lines.push('')
    }
  }

  return lines.join('\n')
}

// ============================================================
// FUNÇÕES INTERNAS
// ============================================================

async function checkUpstreamExists(
  upstreamRepo: string,
  upstreamPath: string,
  options: ConvergenceOptions
): Promise<boolean> {
  if (options.mockUpstreamContent !== undefined) {
    return options.mockUpstreamContent.length > 0
  }

  try {
    const ok = options.octokit ?? createOctokit()
    const [owner, repo] = upstreamRepo.split('/')
    if (!owner || !repo) return false
    await ok.repos.getContent({ owner, repo, path: upstreamPath })
    return true
  } catch {
    return false
  }
}

async function checkDescriptionMatch(
  patch: Patch,
  upstreamRepo: string,
  upstreamPath: string,
  options: ConvergenceOptions
): Promise<{ score: number; content: string }> {
  let upstreamContent = ''

  if (options.mockUpstreamContent !== undefined) {
    upstreamContent = options.mockUpstreamContent
  } else {
    try {
      const ok = options.octokit ?? createOctokit()
      const [owner, repo] = upstreamRepo.split('/')
      if (!owner || !repo) return { score: 0, content: '' }

      const response = await ok.repos.getContent({ owner, repo, path: upstreamPath })
      const data = response.data as { content?: string; encoding?: string }
      if (data.content && data.encoding === 'base64') {
        upstreamContent = Buffer.from(data.content, 'base64').toString('utf-8')
      }
    } catch {
      return { score: 0, content: '' }
    }
  }

  const patchWords = extractKeywords(patch.description)
  const upstreamWords = extractKeywords(upstreamContent)
  const intersection = patchWords.filter(w => upstreamWords.includes(w))
  const score = patchWords.length > 0 ? intersection.length / patchWords.length : 0

  return { score: Math.min(1, score), content: upstreamContent }
}

function checkConceptMatch(
  patchDescription: string,
  upstreamContent: string
): { score: number; matchedConcepts: string[] } {
  const patchConcepts = extractKeywords(patchDescription)
  const upstreamLower = upstreamContent.toLowerCase()

  const matchedConcepts: string[] = []
  for (const concept of patchConcepts) {
    if (upstreamLower.includes(concept.toLowerCase())) {
      matchedConcepts.push(concept)
    }
  }

  const score = patchConcepts.length > 0 ? matchedConcepts.length / patchConcepts.length : 0
  return { score: Math.min(1, score), matchedConcepts }
}

/**
 * Extrai palavras-chave significativas de um texto.
 * Usa Set para deduplicação O(n) em vez de indexOf O(n²).
 */
function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had',
    'her', 'was', 'one', 'our', 'out', 'has', 'his', 'how', 'its', 'may',
    'new', 'now', 'old', 'see', 'way', 'who', 'did', 'get', 'let', 'say',
    'she', 'too', 'use', 'a', 'an', 'be', 'do', 'if', 'in', 'is', 'it',
    'of', 'on', 'or', 'so', 'to', 'up', 'as', 'at', 'by', 'he', 'no',
    'o', 'a', 'os', 'as', 'um', 'uma', 'de', 'do', 'da', 'dos', 'das',
    'em', 'no', 'na', 'nos', 'nas', 'por', 'para', 'com', 'sem', 'que',
    'se', 'não', 'mais', 'muito', 'bem', 'já', 'também', 'ainda', 'só',
    'mesmo', 'assim', 'pois', 'porém', 'mas', 'e', 'ou', 'como', 'quando',
    'onde', 'porque', 'então', 'tal', 'este', 'esta', 'esse', 'essa',
  ])

  const words = text
    .toLowerCase()
    .replace(/[^a-záàâãéèêíïóôõúüç\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w))

  // Deduplicar usando Set (O(n) em vez de O(n²))
  return Array.from(new Set(words))
}

function calculateConvergenceScore(descriptionScore: number, conceptScore: number): number {
  return Math.round((descriptionScore * 0.6 + conceptScore * 0.4) * 100) / 100
}

function determineAction(
  converged: boolean,
  score: number
): ConvergenceResult['suggestedAction'] {
  if (!converged) return 'keep_patch'
  if (score >= 0.9) return 'remove_patch'
  if (score >= 0.7) return 'update_patch'
  return 'manual_review'
}

/**
 * Mapeia target do patch para path no upstream.
 * Suporta múltiplos formatos:
 *   - "ECC/skills/pdf-reader" → "skills/pdf-reader.md"
 *   - "skills/pdf-reader" → "skills/pdf-reader.md"
 *   - "pdf-reader" → "pdf-reader.md"
 */
function mapTargetToPath(target: string, basePath: string): string {
  if (!target || target.trim().length === 0) {
    return `${basePath}/unknown.md`
  }

  const parts = target.split('/')
  if (parts.length >= 2) {
    // Remove a primeira parte (geralmente o nome do repo)
    const path = parts.slice(1).join('/')
    return `${basePath}/${path}.md`
  }
  return `${basePath}/${target}.md`
}

function buildResult(
  patch: Patch,
  converged: boolean,
  score: number,
  suggestedAction: ConvergenceResult['suggestedAction'],
  details: ConvergenceDetail[],
  source: ConvergenceResult['detectionSource']
): ConvergenceResult {
  const description = converged
    ? `Patch ${patch.id} convergiu com upstream (${(score * 100).toFixed(0)}% similar)`
    : `Patch ${patch.id} não convergiu com upstream`

  return {
    patchId: patch.id,
    target: patch.target,
    converged,
    convergenceScore: score,
    description,
    suggestedAction,
    details,
    detectionSource: source,
  }
}

function createOctokit(): Octokit {
  const token = process.env.GITHUB_TOKEN || process.env.SMITH_GITHUB_TOKEN
  if (!token) {
    throw new Error('GITHUB_TOKEN ou SMITH_GITHUB_TOKEN não configurado')
  }
  return new Octokit({ auth: token })
}
