/**
 * 🩹 Testes TDD — Patch Manager
 *
 * Testa o sistema de gerenciamento de patches:
 * - CRUD de patches (criar, listar, buscar, remover)
 * - Verificação de compatibilidade
 * - Verificação em lote
 * - Integração com Patch type da F1a
 *
 * Fase 3 — Patches + Smith Update
 * SPEC-SEC-4.3: Gerenciador de Patches
 */
import {
  createPatch,
  listPatches,
  getPatch,
  removePatch,
  applyPatch,
  checkCompatibility,
  verifyAllPatches,
  type PatchStore,
  InMemoryPatchStore,
  FileSystemPatchStore,
  type CompatibilityResult,
} from '../.agents/types/patch-manager'
import type { Patch } from '../.agents/types/patch'

// ============================================================
// TESTES
// ============================================================

describe('createPatch — Criação de patches', () => {
  it('cria patch com dados válidos', () => {
    const store = new InMemoryPatchStore()
    const patch = createPatch(store, {
      target: 'ECC/skills/pdf-reader',
      targetVersion: '2.1',
      description: 'Adicionar suporte a UTF-8',
      linesChanged: 12,
      tokenReduction: '28%',
    })

    expect(patch.id).toMatch(/^patch-/)
    expect(patch.target).toBe('ECC/skills/pdf-reader')
    expect(patch.status).toBe('active')
    expect(patch.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}/)
    expect(patch.linesChanged).toBe(12)
    expect(patch.tokenReduction).toBe('28%')
  })

  it('gera IDs únicos sequenciais', () => {
    const store = new InMemoryPatchStore()
    const p1 = createPatch(store, { target: 'a', targetVersion: '1', description: 'd1', linesChanged: 1 })
    const p2 = createPatch(store, { target: 'b', targetVersion: '1', description: 'd2', linesChanged: 2 })
    expect(p1.id).not.toBe(p2.id)
  })

  it('cria patch sem tokenReduction (opcional)', () => {
    const store = new InMemoryPatchStore()
    const patch = createPatch(store, { target: 'a', targetVersion: '1', description: 'd', linesChanged: 5 })
    expect(patch.tokenReduction).toBeUndefined()
  })

  it('lança erro se target for vazio', () => {
    const store = new InMemoryPatchStore()
    expect(() => createPatch(store, { target: '', targetVersion: '1', description: 'd', linesChanged: 1 })).toThrow()
  })

  it('lança erro se description for vazia', () => {
    const store = new InMemoryPatchStore()
    expect(() => createPatch(store, { target: 'a', targetVersion: '1', description: '', linesChanged: 1 })).toThrow()
  })
})

describe('listPatches — Listagem', () => {
  it('retorna array vazio quando não há patches', () => {
    const store = new InMemoryPatchStore()
    expect(listPatches(store)).toHaveLength(0)
  })

  it('lista todos os patches criados', () => {
    const store = new InMemoryPatchStore()
    createPatch(store, { target: 'a', targetVersion: '1', description: 'd1', linesChanged: 1 })
    createPatch(store, { target: 'b', targetVersion: '1', description: 'd2', linesChanged: 2 })
    const patches = listPatches(store)
    expect(patches).toHaveLength(2)
  })

  it('filtra por status ativo', () => {
    const store = new InMemoryPatchStore()
    createPatch(store, { target: 'a', targetVersion: '1', description: 'd1', linesChanged: 1 })
    const p2 = createPatch(store, { target: 'b', targetVersion: '1', description: 'd2', linesChanged: 2 })
    removePatch(store, p2.id) // Remove para ficar como 'removed'
    const active = listPatches(store, { status: 'active' })
    const removed = listPatches(store, { status: 'removed' })
    expect(active).toHaveLength(1)
    expect(removed).toHaveLength(1)
  })

  it('filtra por target', () => {
    const store = new InMemoryPatchStore()
    createPatch(store, { target: 'ECC/skills/a', targetVersion: '1', description: 'd1', linesChanged: 1 })
    createPatch(store, { target: 'ECC/skills/b', targetVersion: '1', description: 'd2', linesChanged: 2 })
    const filtered = listPatches(store, { target: 'ECC/skills/a' })
    expect(filtered).toHaveLength(1)
    expect(filtered[0].target).toBe('ECC/skills/a')
  })
})

describe('getPatch — Busca por ID', () => {
  it('retorna patch pelo ID', () => {
    const store = new InMemoryPatchStore()
    const created = createPatch(store, { target: 'a', targetVersion: '1', description: 'd', linesChanged: 3 })
    const found = getPatch(store, created.id)
    expect(found).not.toBeNull()
    expect(found!.id).toBe(created.id)
  })

  it('retorna null para ID inexistente', () => {
    const store = new InMemoryPatchStore()
    expect(getPatch(store, 'nao-existe')).toBeNull()
  })
})

describe('removePatch — Remoção', () => {
  it('marca patch como removed', () => {
    const store = new InMemoryPatchStore()
    const patch = createPatch(store, { target: 'a', targetVersion: '1', description: 'd', linesChanged: 1 })
    removePatch(store, patch.id)
    const removed = getPatch(store, patch.id)
    expect(removed!.status).toBe('removed')
  })

  it('lança erro se patch não existe', () => {
    const store = new InMemoryPatchStore()
    expect(() => removePatch(store, 'nao-existe')).toThrow()
  })
})

describe('checkCompatibility — Verificação', () => {
  it('patch compatível com mesma versão', () => {
    const store = new InMemoryPatchStore()
    const patch = createPatch(store, { target: 'a', targetVersion: '2.1', description: 'd', linesChanged: 1 })
    const result = checkCompatibility(patch, '2.1')
    expect(result.compatible).toBe(true)
    expect(result.patchId).toBe(patch.id)
    expect(result.currentVersion).toBe('2.1')
  })

  it('patch incompatível com versão muito diferente', () => {
    const store = new InMemoryPatchStore()
    const patch = createPatch(store, { target: 'a', targetVersion: '2.1', description: 'd', linesChanged: 1 })
    const result = checkCompatibility(patch, '5.0')
    expect(result.compatible).toBe(false)
    expect(result.reason).toContain('major')
  })

  it('patch compatível com versão minor superior', () => {
    const store = new InMemoryPatchStore()
    const patch = createPatch(store, { target: 'a', targetVersion: '2.1', description: 'd', linesChanged: 1 })
    const result = checkCompatibility(patch, '2.3')
    expect(result.compatible).toBe(true)
  })

  it('patch potencialmente incompatível com versão minor mas com warning', () => {
    const store = new InMemoryPatchStore()
    const patch = createPatch(store, { target: 'a', targetVersion: '2.1', description: 'd', linesChanged: 1 })
    const result = checkCompatibility(patch, '3.0')
    expect(result.compatible).toBe(false)
  })
})

describe('verifyAllPatches — Verificação em lote', () => {
  it('retorna resultados para todos os patches ativos', () => {
    const store = new InMemoryPatchStore()
    createPatch(store, { target: 'a', targetVersion: '2.1', description: 'd1', linesChanged: 1 })
    createPatch(store, { target: 'b', targetVersion: '2.1', description: 'd2', linesChanged: 2 })
    removePatch(store, listPatches(store)[1].id) // Remove segundo patch

    const results = verifyAllPatches(store, '2.1')
    // Só patches ativos devem ser verificados
    expect(results).toHaveLength(1)
    expect(results[0].compatible).toBe(true)
  })

  it('retorna array vazio se nenhum patch ativo', () => {
    const store = new InMemoryPatchStore()
    expect(verifyAllPatches(store, '1.0')).toHaveLength(0)
  })
})

describe('applyPatch — Aplicação de patch', () => {
  it('aplica patch ativo com sucesso', () => {
    const store = new InMemoryPatchStore()
    const patch = createPatch(store, { target: 'a', targetVersion: '1', description: 'd', linesChanged: 5 })
    const result = applyPatch(store, patch.id)
    expect(result).toContain('patch-')
    expect(result).toContain('5 linhas')
  })

  it('lança erro se patch não existe', () => {
    const store = new InMemoryPatchStore()
    expect(() => applyPatch(store, 'nao-existe')).toThrow('não encontrado')
  })

  it('lança erro se patch não está ativo', () => {
    const store = new InMemoryPatchStore()
    const patch = createPatch(store, { target: 'a', targetVersion: '1', description: 'd', linesChanged: 3 })
    removePatch(store, patch.id)
    expect(() => applyPatch(store, patch.id)).toThrow('não está ativo')
  })
})

describe('FileSystemPatchStore — Store em disco', () => {
  it('salva e carrega patch do disco', () => {
    const store = new FileSystemPatchStore('./patches')
    const patch = createPatch(store, { target: 'a', targetVersion: '1', description: 'd', linesChanged: 5 })

    const loaded = getPatch(store, patch.id)
    expect(loaded).not.toBeNull()
    expect(loaded!.target).toBe('a')
    expect(loaded!.status).toBe('active')

    // Limpeza
    const { existsSync, unlinkSync } = require('fs')
    const { join } = require('path')
    const filePath = join('patches', `${patch.id}.json`)
    if (existsSync(filePath)) unlinkSync(filePath)
  })

  it('lista patches salvos em disco', () => {
    const store = new FileSystemPatchStore('./patches')
    const p1 = createPatch(store, { target: 'a', targetVersion: '1', description: 'd1', linesChanged: 1 })
    createPatch(store, { target: 'b', targetVersion: '1', description: 'd2', linesChanged: 2 })
    removePatch(store, p1.id)

    const ids = store.list()
    expect(ids.length).toBeGreaterThanOrEqual(1)

    // Limpeza
    const { existsSync, unlinkSync, readdirSync } = require('fs')
    const { join } = require('path')
    for (const id of ids) {
      const fp = join('patches', `${id}.json`)
      if (existsSync(fp)) unlinkSync(fp)
    }
  })

  it('retorna null para patch inexistente', () => {
    const store = new InMemoryPatchStore()
    expect(getPatch(store, 'nao-existe')).toBeNull()
  })
})

describe('PatchStore — Store personalizado', () => {
  it('aceita store personalizado com save/load/list/remove', () => {
    const patches: Record<string, Patch> = {}
    const customStore: PatchStore = {
      save: (id: string, patch: Patch) => { patches[id] = patch },
      load: (id: string) => patches[id] ?? null,
      list: () => Object.keys(patches),
      remove: (id: string) => { patches[id]!.status = 'removed' },
    }

    const patch = createPatch(customStore, { target: 'x', targetVersion: '1', description: 'd', linesChanged: 1 })
    expect(patch.id).toMatch(/^patch-/)
    expect(Object.keys(patches)).toHaveLength(1)
  })
})
