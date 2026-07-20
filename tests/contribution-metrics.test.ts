/**
 * Tests for contribution-metrics.ts — Fase 5: Métricas de Contribuição
 */

import {
  recordContribution,
  updateContributionStatus,
  getContributionSummary,
  generateMetricsReport,
  extractLessonLearned,
  InMemoryContributionStore,
} from '../.agents/types/contribution-metrics'
import type { ContributionRecord } from '../.agents/types/contribution-metrics'

// ============================================================
// MOCK DATA
// ============================================================

const mockContributionData = {
  patchId: 'patch-001',
  upstreamRepo: 'affaan-m/ECC',
  status: 'sent' as const,
  metrics: {
    linesChanged: 12,
    tokenReduction: '28%',
    filesModified: 2,
  },
}

const mockContributionData2 = {
  patchId: 'patch-002',
  upstreamRepo: 'affaan-m/ECC',
  status: 'sent' as const,
  metrics: {
    linesChanged: 8,
    filesModified: 1,
  },
}

// ============================================================
// TESTS
// ============================================================

describe('recordContribution', () => {
  it('should record a new contribution with generated ID', () => {
    const store = new InMemoryContributionStore()
    const record = recordContribution(store, mockContributionData)

    expect(record.id).toBeDefined()
    expect(record.id).toContain('contrib-')
    expect(record.patchId).toBe('patch-001')
    expect(record.upstreamRepo).toBe('affaan-m/ECC')
    expect(record.status).toBe('sent')
    expect(record.sentAt).toBeDefined()
    expect(record.updatedAt).toBeDefined()
  })

  it('should persist the record in the store', () => {
    const store = new InMemoryContributionStore()
    const record = recordContribution(store, mockContributionData)

    const loaded = store.load(record.id)
    expect(loaded).not.toBeNull()
    expect(loaded!.id).toBe(record.id)
  })

  it('should generate unique IDs', () => {
    const store = new InMemoryContributionStore()
    const record1 = recordContribution(store, mockContributionData)
    const record2 = recordContribution(store, mockContributionData)

    expect(record1.id).not.toBe(record2.id)
  })
})

describe('updateContributionStatus', () => {
  it('should update status to accepted', () => {
    const store = new InMemoryContributionStore()
    const record = recordContribution(store, mockContributionData)

    updateContributionStatus(store, record.id, 'accepted', {
      reviewerFeedback: 'Great improvement!',
    })

    const loaded = store.load(record.id)
    expect(loaded!.status).toBe('accepted')
    expect(loaded!.reviewerFeedback).toBe('Great improvement!')
  })

  it('should update status to rejected with reason', () => {
    const store = new InMemoryContributionStore()
    const record = recordContribution(store, mockContributionData)

    updateContributionStatus(store, record.id, 'rejected', {
      rejectionReason: 'Duplicate of existing feature',
      lessonLearned: 'Check existing features before contributing',
    })

    const loaded = store.load(record.id)
    expect(loaded!.status).toBe('rejected')
    expect(loaded!.rejectionReason).toBe('Duplicate of existing feature')
    expect(loaded!.lessonLearned).toBe('Check existing features before contributing')
  })

  it('should throw for non-existent contribution', () => {
    const store = new InMemoryContributionStore()

    expect(() => {
      updateContributionStatus(store, 'non-existent', 'accepted')
    }).toThrow('Contribuição não encontrada')
  })
})

describe('getContributionSummary', () => {
  it('should calculate summary with mixed statuses', () => {
    const store = new InMemoryContributionStore()

    // Create contributions with different statuses
    const r1 = recordContribution(store, mockContributionData)
    updateContributionStatus(store, r1.id, 'accepted')

    const r2 = recordContribution(store, mockContributionData2)
    updateContributionStatus(store, r2.id, 'rejected', {
      rejectionReason: 'Style issue',
      lessonLearned: 'Follow style guide',
    })

    const r3 = recordContribution(store, { ...mockContributionData, patchId: 'patch-003' })
    // r3 stays as 'sent'

    const summary = getContributionSummary(store)

    expect(summary.totalSent).toBe(3)
    expect(summary.accepted).toBe(1)
    expect(summary.rejected).toBe(1)
    expect(summary.pending).toBe(1)
    expect(summary.acceptanceRate).toBeCloseTo(0.33, 1)
    expect(summary.totalLinesContributed).toBe(32) // 12 + 8 + 12
    expect(summary.lessonsLearned).toContain('Follow style guide')
  })

  it('should filter by status', () => {
    const store = new InMemoryContributionStore()

    const r1 = recordContribution(store, mockContributionData)
    updateContributionStatus(store, r1.id, 'accepted')

    const r2 = recordContribution(store, mockContributionData2)

    const summary = getContributionSummary(store, { status: 'accepted' })

    expect(summary.totalSent).toBe(1)
    expect(summary.accepted).toBe(1)
  })

  it('should filter by upstream repo', () => {
    const store = new InMemoryContributionStore()

    recordContribution(store, mockContributionData) // affaan-m/ECC
    recordContribution(store, {
      ...mockContributionData2,
      upstreamRepo: 'other/repo',
    })

    const summary = getContributionSummary(store, { upstreamRepo: 'affaan-m/ECC' })

    expect(summary.totalSent).toBe(1)
  })

  it('should handle empty store', () => {
    const store = new InMemoryContributionStore()
    const summary = getContributionSummary(store)

    expect(summary.totalSent).toBe(0)
    expect(summary.acceptanceRate).toBe(0)
    expect(summary.lessonsLearned).toEqual([])
  })
})

describe('generateMetricsReport', () => {
  it('should generate a report with all sections', () => {
    const summary = {
      totalSent: 10,
      accepted: 6,
      rejected: 3,
      pending: 1,
      acceptanceRate: 0.6,
      merged: 5,
      totalLinesContributed: 150,
      lessonsLearned: ['Follow style guide', 'Add tests first'],
      period: { from: '2026-07-01', to: '2026-07-19' },
    }

    const report = generateMetricsReport(summary)

    expect(report).toContain('Relatório de Métricas de Contribuição')
    expect(report).toContain('| Total enviados | 10 |')
    expect(report).toContain('| Aceitos | 6 |')
    expect(report).toContain('| Rejeitados | 3 |')
    expect(report).toContain('| Taxa de aceitação | 60% |')
    expect(report).toContain('Meta atingida')
    expect(report).toContain('Lições Aprendidas')
    expect(report).toContain('Follow style guide')
  })

  it('should show warning when meta not reached', () => {
    const summary = {
      totalSent: 10,
      accepted: 4,
      rejected: 6,
      pending: 0,
      acceptanceRate: 0.4,
      merged: 3,
      totalLinesContributed: 80,
      lessonsLearned: [],
      period: { from: '2026-07-01', to: '2026-07-19' },
    }

    const report = generateMetricsReport(summary)

    expect(report).toContain('Meta não atingida')
  })
})

describe('extractLessonLearned', () => {
  it('should extract lesson from rejected contribution', () => {
    const record: ContributionRecord = {
      id: 'test',
      patchId: 'patch-001',
      upstreamRepo: 'affaan-m/ECC',
      status: 'rejected',
      sentAt: '2026-07-19',
      updatedAt: '2026-07-19',
      metrics: { linesChanged: 5, filesModified: 1 },
      rejectionReason: 'Style issue in code formatting',
    }

    const lesson = extractLessonLearned(record)

    expect(lesson).not.toBeNull()
    expect(lesson).toContain('Estilo/formatação')
  })

  it('should return null for accepted contribution', () => {
    const record: ContributionRecord = {
      id: 'test',
      patchId: 'patch-001',
      upstreamRepo: 'affaan-m/ECC',
      status: 'accepted',
      sentAt: '2026-07-19',
      updatedAt: '2026-07-19',
      metrics: { linesChanged: 5, filesModified: 1 },
    }

    const lesson = extractLessonLearned(record)
    expect(lesson).toBeNull()
  })

  it('should return null for contribution without rejection reason', () => {
    const record: ContributionRecord = {
      id: 'test',
      patchId: 'patch-001',
      upstreamRepo: 'affaan-m/ECC',
      status: 'rejected',
      sentAt: '2026-07-19',
      updatedAt: '2026-07-19',
      metrics: { linesChanged: 5, filesModified: 1 },
    }

    const lesson = extractLessonLearned(record)
    expect(lesson).toBeNull()
  })
})
