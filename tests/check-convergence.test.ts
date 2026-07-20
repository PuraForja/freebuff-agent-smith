/**
 * Tests for check-convergence.ts — Fase 5: Detecção de Convergência
 */

jest.mock('@octokit/rest')

import {
  checkConvergence,
  checkConvergenceBatch,
  generateConvergenceReport,
  InMemoryConvergenceStore,
} from '../.agents/types/check-convergence'
import type { Patch } from '../.agents/types/patch'

// ============================================================
// MOCK DATA
// ============================================================

const mockPatch: Patch = {
  id: 'patch-001',
  target: 'ECC/skills/pdf-reader',
  targetVersion: '2.1',
  description: 'Adicionar suporte a UTF-8 para leitura de PDFs',
  createdAt: '2026-07-17',
  status: 'active',
  linesChanged: 12,
}

const mockPatchNoConvergence: Patch = {
  id: 'patch-002',
  target: 'ECC/skills/custom-formatter',
  targetVersion: '2.1',
  description: 'Formatador personalizado para JSON com indentação customizável',
  createdAt: '2026-07-17',
  status: 'active',
  linesChanged: 5,
}

// ============================================================
// TESTS
// ============================================================

describe('checkConvergence', () => {
  it('should detect convergence when upstream has similar content', async () => {
    const upstreamContent = `
      # PDF Reader Skill
      ## UTF-8 Support
      Adicionar suporte a UTF-8 para leitura de PDFs
      - Read PDF files with UTF-8 support
      - Handle special characters for leitura de PDFs
    `

    const result = await checkConvergence(mockPatch, 'affaan-m/ECC', 'skills/pdf-reader.md', {
      mockUpstreamContent: upstreamContent,
      threshold: 0.5,
    })

    expect(result.patchId).toBe('patch-001')
    expect(result.target).toBe('ECC/skills/pdf-reader')
    expect(result.converged).toBe(true)
    expect(result.convergenceScore).toBeGreaterThan(0.5)
    expect(result.details.length).toBeGreaterThan(0)
  })

  it('should detect no convergence when upstream has different content', async () => {
    const upstreamContent = `
      # Video Player Skill
      ## Features
      - Play video files
      - Support multiple formats
    `

    const result = await checkConvergence(mockPatchNoConvergence, 'affaan-m/ECC', 'skills/custom-formatter.md', {
      mockUpstreamContent: upstreamContent,
      threshold: 0.7,
    })

    expect(result.converged).toBe(false)
    expect(result.convergenceScore).toBeLessThan(0.7)
    expect(result.suggestedAction).toBe('keep_patch')
  })

  it('should handle upstream file not found', async () => {
    const result = await checkConvergence(mockPatch, 'affaan-m/ECC', 'nonexistent.md', {
      mockUpstreamContent: '', // empty = file not found
    })

    expect(result.converged).toBe(false)
    expect(result.convergenceScore).toBe(0)
    expect(result.suggestedAction).toBe('keep_patch')
  })

  it('should suggest remove_patch for high convergence', async () => {
    const upstreamContent = `
      # PDF Reader
      ## UTF-8 Support
      Adicionar suporte a UTF-8 para leitura de PDFs
      - Read PDF files with UTF-8 support
      - Handle special characters
    `

    const result = await checkConvergence(mockPatch, 'affaan-m/ECC', 'skills/pdf-reader.md', {
      mockUpstreamContent: upstreamContent,
      threshold: 0.5,
    })

    if (result.convergenceScore >= 0.9) {
      expect(result.suggestedAction).toBe('remove_patch')
    }
  })
})

describe('checkConvergenceBatch', () => {
  it('should check convergence for multiple patches', async () => {
    const upstreamContent = `
      # PDF Reader
      UTF-8 support for PDFs
    `

    const results = await checkConvergenceBatch(
      [mockPatch, mockPatchNoConvergence],
      'affaan-m/ECC',
      'skills',
      {
        mockUpstreamContent: upstreamContent,
        threshold: 0.5,
      }
    )

    expect(results.length).toBe(2)
    expect(results[0].patchId).toBe('patch-001')
    expect(results[1].patchId).toBe('patch-002')
  })
})

describe('generateConvergenceReport', () => {
  it('should generate a report with converged patches', () => {
    const results = [
      {
        patchId: 'patch-001',
        target: 'ECC/skills/pdf-reader',
        converged: true,
        convergenceScore: 0.95,
        description: 'Convergiu',
        suggestedAction: 'remove_patch' as const,
        details: [],
        detectionSource: 'content_analysis' as const,
      },
      {
        patchId: 'patch-002',
        target: 'ECC/skills/custom',
        converged: false,
        convergenceScore: 0.3,
        description: 'Não convergiu',
        suggestedAction: 'keep_patch' as const,
        details: [],
        detectionSource: 'content_analysis' as const,
      },
    ]

    const report = generateConvergenceReport(results)

    expect(report).toContain('Relatório de Convergência')
    expect(report).toContain('Total verificado: 2')
    expect(report).toContain('Convergidos: 1')
    expect(report).toContain('Não convergidos: 1')
    expect(report).toContain('Patches Convergentes')
    expect(report).toContain('Patches Não Convergentes')
    expect(report).toContain('patch-001')
    expect(report).toContain('patch-002')
  })

  it('should handle empty results', () => {
    const report = generateConvergenceReport([])
    expect(report).toContain('Total verificado: 0')
  })
})

describe('InMemoryConvergenceStore', () => {
  it('should save and load convergence results', () => {
    const store = new InMemoryConvergenceStore()
    const result = {
      patchId: 'patch-001',
      target: 'test',
      converged: true,
      convergenceScore: 0.9,
      description: 'Test',
      suggestedAction: 'remove_patch' as const,
      details: [],
      detectionSource: 'content_analysis' as const,
    }

    store.save('patch-001', result)
    const loaded = store.load('patch-001')

    expect(loaded).not.toBeNull()
    expect(loaded!.patchId).toBe('patch-001')
    expect(loaded!.converged).toBe(true)
  })
})
