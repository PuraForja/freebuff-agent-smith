/**
 * 📊 Contribution Metrics — Métricas de Contribuição (Fase 5)
 *
 * Rastreia PRs enviados, aceitos, rejeitados e calcula
 * taxa de aceitação. Aprende com PRs rejeitados para
 * melhorar futuros PRs.
 *
 * PLAN-F5: Contribuição Automática
 * SPEC-SEC-7: Métricas de Sucesso (> 50% aceitação)
 */

// ============================================================
// TIPOS
// ============================================================

export interface ContributionRecord {
  id: string
  patchId: string
  upstreamRepo: string
  prNumber?: number
  prUrl?: string
  status: 'sent' | 'accepted' | 'rejected' | 'pending_review' | 'merged' | 'closed'
  sentAt: string
  updatedAt: string
  metrics: {
    linesChanged: number
    tokenReduction?: string
    filesModified: number
  }
  rejectionReason?: string
  reviewerFeedback?: string
  lessonLearned?: string
}

export interface ContributionSummary {
  totalSent: number
  accepted: number
  rejected: number
  pending: number
  acceptanceRate: number
  merged: number
  totalLinesContributed: number
  lessonsLearned: string[]
  period: { from: string; to: string }
}

export interface ContributionFilter {
  status?: ContributionRecord['status']
  upstreamRepo?: string
  fromDate?: string
  toDate?: string
}

export interface ContributionStore {
  save(id: string, record: ContributionRecord): void
  load(id: string): ContributionRecord | null
  list(): string[]
  update(id: string, updates: Partial<ContributionRecord>): void
}

// ============================================================
// STORE EM MEMÓRIA
// ============================================================

export class InMemoryContributionStore implements ContributionStore {
  private store: Record<string, ContributionRecord> = {}

  save(id: string, record: ContributionRecord): void {
    this.store[id] = record
  }

  load(id: string): ContributionRecord | null {
    return this.store[id] ?? null
  }

  list(): string[] {
    return Object.keys(this.store)
  }

  update(id: string, updates: Partial<ContributionRecord>): void {
    if (this.store[id]) {
      this.store[id] = { ...this.store[id], ...updates, updatedAt: new Date().toISOString() }
    }
  }
}

// ============================================================
// CONSTANTES
// ============================================================

const CONTRIBUTION_ID_PREFIX = 'contrib'

// ============================================================
// FUNÇÕES PÚBLICAS
// ============================================================

/**
 * Registra uma nova contribuição (PR enviado).
 * Valida que patchId e upstreamRepo não estão vazios.
 */
export function recordContribution(
  store: ContributionStore,
  record: Omit<ContributionRecord, 'id' | 'sentAt' | 'updatedAt'>
): ContributionRecord {
  if (!record.patchId || record.patchId.trim().length === 0) {
    throw new Error('patchId não pode estar vazio')
  }
  if (!record.upstreamRepo || record.upstreamRepo.trim().length === 0) {
    throw new Error('upstreamRepo não pode estar vazio')
  }

  const id = `${CONTRIBUTION_ID_PREFIX}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  const now = new Date().toISOString()

  const fullRecord: ContributionRecord = {
    ...record,
    id,
    sentAt: now,
    updatedAt: now,
  }

  store.save(id, fullRecord)
  return fullRecord
}

/**
 * Atualiza o status de uma contribuição.
 */
export function updateContributionStatus(
  store: ContributionStore,
  contributionId: string,
  status: ContributionRecord['status'],
  details?: {
    rejectionReason?: string
    reviewerFeedback?: string
    lessonLearned?: string
    prNumber?: number
    prUrl?: string
  }
): void {
  const record = store.load(contributionId)
  if (!record) {
    throw new Error(`Contribuição não encontrada: ${contributionId}`)
  }

  store.update(contributionId, { status, ...details })
}

/**
 * Calcula o resumo das contribuições.
 */
export function getContributionSummary(
  store: ContributionStore,
  filter?: ContributionFilter
): ContributionSummary {
  const allIds = store.list()
  let records = allIds
    .map(id => store.load(id))
    .filter((r): r is ContributionRecord => r !== null)

  if (filter) {
    if (filter.status) records = records.filter(r => r.status === filter.status)
    if (filter.upstreamRepo) records = records.filter(r => r.upstreamRepo === filter.upstreamRepo)
    if (filter.fromDate) records = records.filter(r => r.sentAt >= filter.fromDate!)
    if (filter.toDate) records = records.filter(r => r.sentAt <= filter.toDate!)
  }

  const totalSent = records.length
  const accepted = records.filter(r => r.status === 'accepted' || r.status === 'merged').length
  const rejected = records.filter(r => r.status === 'rejected').length
  const pending = records.filter(r => r.status === 'sent' || r.status === 'pending_review').length
  const merged = records.filter(r => r.status === 'merged').length
  const totalLinesContributed = records.reduce((sum, r) => sum + r.metrics.linesChanged, 0)
  const acceptanceRate = totalSent > 0 ? accepted / totalSent : 0

  const lessonsLearned = records
    .filter(r => r.lessonLearned)
    .map(r => r.lessonLearned!)

  const dates = records.map(r => r.sentAt).sort()
  const period = {
    from: dates[0] ?? new Date().toISOString(),
    to: dates[dates.length - 1] ?? new Date().toISOString(),
  }

  return {
    totalSent,
    accepted,
    rejected,
    pending,
    acceptanceRate: Math.round(acceptanceRate * 100) / 100,
    merged,
    totalLinesContributed,
    lessonsLearned: [...new Set(lessonsLearned)],
    period,
  }
}

/**
 * Gera um relatório de métricas em texto.
 */
export function generateMetricsReport(summary: ContributionSummary): string {
  const lines: string[] = []

  lines.push('## 📊 Relatório de Métricas de Contribuição')
  lines.push('')
  lines.push(`Período: ${formatDate(summary.period.from)} — ${formatDate(summary.period.to)}`)
  lines.push('')

  lines.push('### Resumo Geral')
  lines.push('')
  lines.push(`| Métrica | Valor |`)
  lines.push(`|---------|-------|`)
  lines.push(`| Total enviados | ${summary.totalSent} |`)
  lines.push(`| Aceitos | ${summary.accepted} |`)
  lines.push(`| Rejeitados | ${summary.rejected} |`)
  lines.push(`| Pendentes | ${summary.pending} |`)
  lines.push(`| Merged | ${summary.merged} |`)
  lines.push(`| Taxa de aceitação | ${(summary.acceptanceRate * 100).toFixed(0)}% |`)
  lines.push(`| Linhas contribuídas | ${summary.totalLinesContributed} |`)
  lines.push('')

  const targetRate = 0.5
  if (summary.acceptanceRate >= targetRate) {
    lines.push(`✅ **Meta atingida!** Taxa de aceitação ${(summary.acceptanceRate * 100).toFixed(0)}% ≥ ${(targetRate * 100).toFixed(0)}%`)
  } else if (summary.totalSent > 0) {
    lines.push(`⚠️ **Meta não atingida.** Taxa de aceitação ${(summary.acceptanceRate * 100).toFixed(0)}% < ${(targetRate * 100).toFixed(0)}%`)
    lines.push(`   Precisamos de ${Math.ceil(targetRate * summary.totalSent - summary.accepted)} PRs adicionais aceitos para atingir a meta.`)
  }
  lines.push('')

  if (summary.lessonsLearned.length > 0) {
    lines.push('### 📚 Lições Aprendidas')
    lines.push('')
    for (const lesson of summary.lessonsLearned) {
      lines.push(`- ${lesson}`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

/**
 * Extrai lições aprendidas de um PR rejeitado.
 */
export function extractLessonLearned(record: ContributionRecord): string | null {
  if (record.status !== 'rejected' || !record.rejectionReason) {
    return null
  }

  const reason = record.rejectionReason.toLowerCase()

  if (reason.includes('style') || reason.includes('format')) {
    return `Estilo/formatação: Verificar guia de estilo do repo antes de contribuir (${record.upstreamRepo})`
  }
  if (reason.includes('test') || reason.includes('coverage')) {
    return `Testes: Adicionar testes antes de submeter PR para ${record.upstreamRepo}`
  }
  if (reason.includes('duplicate') || reason.includes('already')) {
    return `Duplicata: Verificar PRs abertos e issues antes de contribuir`
  }
  if (reason.includes('scope') || reason.includes('large')) {
    return `Escopo: Manter PRs pequenos e focados em uma única mudança`
  }
  if (reason.includes('doc') || reason.includes('documentation')) {
    return `Documentação: Atualizar documentação junto com mudanças de código`
  }

  return `Rejeitado em ${record.upstreamRepo}: ${record.rejectionReason}`
}

// ============================================================
// FUNÇÕES INTERNAS
// ============================================================

function formatDate(isoDate: string): string {
  try {
    return new Date(isoDate).toLocaleDateString('pt-BR')
  } catch {
    return isoDate
  }
}
