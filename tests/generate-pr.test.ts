/**
 * Tests for generate-pr.ts — Fase 5: Contribuição Automática
 */


import {
  generatePrBody,
  generatePrTemplate,
  generatePrLocal,
  InMemoryPrStore,
} from '../.agents/types/generate-pr'
import type { Patch } from '../.agents/types/patch'

// ============================================================
// MOCK DATA
// ============================================================

const mockPatch: Patch = {
  id: 'patch-001',
  target: 'ECC/skills/pdf-reader',
  targetVersion: '2.1',
  description: 'Adicionar suporte a UTF-8',
  createdAt: '2026-07-17',
  status: 'active',
  linesChanged: 12,
  tokenReduction: '28%',
}

const mockMetadata = {
  patchId: 'patch-001',
  target: 'ECC/skills/pdf-reader',
  description: 'Adicionar suporte a UTF-8',
  metrics: {
    linesChanged: 12,
    tokenReduction: '28%',
    filesModified: ['skills/pdf-reader.md', 'skills/pdf-reader.test.md'],
  },
  author: 'Agent Smith V2',
  createdAt: '2026-07-19',
  upstreamRepo: 'affaan-m/ECC',
}

// ============================================================
// TESTS
// ============================================================

describe('generatePrBody', () => {
  it('should generate a valid PR body with all fields', () => {
    const body = generatePrBody(mockMetadata)

    expect(body).toContain('Auto-generated contribution by FreeBuff Agent Smith V2')
    expect(body).toContain('Adicionar suporte a UTF-8')
    expect(body).toContain('| Lines changed | 12 |')
    expect(body).toContain('| Token reduction | 28% |')
    expect(body).toContain('| Files modified | 2 |')
    expect(body).toContain('patch-001')
    expect(body).toContain('ECC/skills/pdf-reader')
    expect(body).toContain('Agent Smith V2')
    expect(body).toContain('Checklist')
  })

  it('should handle metadata without tokenReduction', () => {
    const metadataNoReduction = {
      ...mockMetadata,
      metrics: {
        linesChanged: 5,
        filesModified: ['test.md'],
      },
    }
    const body = generatePrBody(metadataNoReduction)

    expect(body).toContain('| Lines changed | 5 |')
    expect(body).not.toContain('Token reduction')
  })

  it('should list all modified files', () => {
    const body = generatePrBody(mockMetadata)

    expect(body).toContain('`skills/pdf-reader.md`')
    expect(body).toContain('`skills/pdf-reader.test.md`')
  })
})

describe('generatePrTemplate', () => {
  it('should generate a valid PR template', () => {
    const template = generatePrTemplate(mockMetadata)

    expect(template.title).toContain('[Smith]')
    expect(template.title).toContain('Adicionar suporte a UTF-8')
    expect(template.body).toBeDefined()
    expect(template.head).toContain('smith/')
    expect(template.base).toBe('master')
    expect(template.labels).toContain('auto-generated')
    expect(template.labels).toContain('smith-contribution')
  })

  it('should generate unique branch names' , () => {
    jest.useFakeTimers()
    try {
      const template1 = generatePrTemplate(mockMetadata)
      jest.advanceTimersByTime(1)
      const template2 = generatePrTemplate(mockMetadata)
      expect(template1.head).not.toBe(template2.head)
    } finally {
      jest.useRealTimers()
    }
  })
})

describe('generatePrLocal', () => {
  it('should generate a local PR result', () => {
    const result = generatePrLocal(mockPatch, {
      description: 'Adicionar suporte a UTF-8',
      metrics: {
        linesChanged: 12,
        tokenReduction: '28%',
        filesModified: ['skills/pdf-reader.md'],
      },
      author: 'Agent Smith V2',
      upstreamRepo: 'affaan-m/ECC',
    })

    expect(result.success).toBe(true)
    expect(result.template).toBeDefined()
    expect(result.metadata.patchId).toBe('patch-001')
    expect(result.metadata.target).toBe('ECC/skills/pdf-reader')
    expect(result.prUrl).toBeUndefined()
    expect(result.prNumber).toBeUndefined()
    expect(result.message).toContain('gerado localmente')
  })

  it('should use patch data for metadata', () => {
    const result = generatePrLocal(mockPatch, {
      description: 'Test description',
      metrics: { linesChanged: 5, filesModified: [] },
      author: 'Test',
      upstreamRepo: 'test/repo',
    })

    expect(result.metadata.patchId).toBe(mockPatch.id)
    expect(result.metadata.target).toBe(mockPatch.target)
  })
})

describe('InMemoryPrStore', () => {
  it('should save and load PR results', () => {
    const store = new InMemoryPrStore()
    const result = generatePrLocal(mockPatch, {
      description: 'Test',
      metrics: { linesChanged: 1, filesModified: [] },
      author: 'Test',
      upstreamRepo: 'test/repo',
    })

    store.save('pr-1', result)
    const loaded = store.load('pr-1')

    expect(loaded).not.toBeNull()
    expect(loaded!.metadata.patchId).toBe('patch-001')
  })

  it('should return null for non-existent PR', () => {
    const store = new InMemoryPrStore()
    expect(store.load('non-existent')).toBeNull()
  })

  it('should list all PR IDs', () => {
    const store = new InMemoryPrStore()
    store.save('pr-1', generatePrLocal(mockPatch, {
      description: 'Test 1',
      metrics: { linesChanged: 1, filesModified: [] },
      author: 'Test',
      upstreamRepo: 'test/repo',
    }))
    store.save('pr-2', generatePrLocal(mockPatch, {
      description: 'Test 2',
      metrics: { linesChanged: 1, filesModified: [] },
      author: 'Test',
      upstreamRepo: 'test/repo',
    }))

    const ids = store.list()
    expect(ids).toContain('pr-1')
    expect(ids).toContain('pr-2')
    expect(ids.length).toBe(2)
  })
})
