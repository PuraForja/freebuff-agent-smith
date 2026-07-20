/**
 * 🧪 TDD — Testes para lineage.ts (Sistema de Linhagem)
 *
 * 🔴 RED:   Testes escritos antes da implementação
 * 🟢 GREEN: Implementação deve fazer estes testes passarem
 * 🔄 REFACTOR: Melhorar sem quebrar os testes
 */

import {
  Lineage,
  LineageStore,
  InMemoryLineageStore,
  registerLineage,
  getLineage,
  listLineages,
} from '../.agents/types/lineage'

const sampleLineage: Lineage = {
  origin: { repo: 'ECC', version: '2.1', path: 'agents/planner.md' },
  transformation: {
    date: '2026-07-17',
    action: 'cloned',
    description: 'Convertido para Freebuff',
  },
  destination: {
    repo: 'freebuff-agent-smith-v2',
    path: '.agents/ecc/planner.ts',
  },
}

describe('Lineage — InMemoryLineageStore', () => {
  let store: InMemoryLineageStore

  beforeEach(() => {
    store = new InMemoryLineageStore()
  })

  // ============================================================
  // TESTE 1: InMemoryLineageStore implementa LineageStore
  // ============================================================
  test('InMemoryLineageStore deve implementar LineageStore', () => {
    expect(store).toBeDefined()
    expect(typeof store.save).toBe('function')
    expect(typeof store.load).toBe('function')
    expect(typeof store.list).toBe('function')
  })

  // ============================================================
  // TESTE 2: save e load funcionam
  // ============================================================
  test('save() deve armazenar lineage e load() deve recuperar', () => {
    store.save('planner', sampleLineage)
    const result = store.load('planner')
    expect(result).not.toBeNull()
    expect(result!.origin.repo).toBe('ECC')
    expect(result!.transformation.action).toBe('cloned')
    expect(result!.destination.repo).toBe('freebuff-agent-smith-v2')
  })

  // ============================================================
  // TESTE 3: load com ID inexistente retorna null
  // ============================================================
  test('load() com ID inexistente deve retornar null', () => {
    const result = store.load('inexistente')
    expect(result).toBeNull()
  })

  // ============================================================
  // TESTE 4: list retorna IDs vazio quando vazio
  // ============================================================
  test('list() vazio deve retornar array vazio', () => {
    expect(store.list()).toEqual([])
  })

  // ============================================================
  // TESTE 5: list retorna IDs corretos com 3 registros
  // ============================================================
  test('list() deve retornar todos os IDs registrados', () => {
    store.save('planner', sampleLineage)
    store.save('tdd-guide', sampleLineage)
    store.save('code-reviewer', sampleLineage)

    const ids = store.list()
    expect(ids).toHaveLength(3)
    expect(ids).toContain('planner')
    expect(ids).toContain('tdd-guide')
    expect(ids).toContain('code-reviewer')
  })

  // ============================================================
  // TESTE 6: Sobrescrever lineage existente
  // ============================================================
  test('save() deve sobrescrever lineage existente', () => {
    const v1: Lineage = {
      origin: { repo: 'ECC', version: '1.0', path: 'old.md' },
      transformation: { date: '2026-01-01', action: 'cloned', description: 'v1' },
      destination: { repo: 'local', path: 'old.ts' },
    }

    const v2: Lineage = {
      origin: { repo: 'ECC', version: '2.0', path: 'new.md' },
      transformation: { date: '2026-07-17', action: 'adapted', description: 'v2' },
      destination: { repo: 'local', path: 'new.ts' },
    }

    store.save('agent-x', v1)
    store.save('agent-x', v2)

    const result = store.load('agent-x')
    expect(result!.origin.version).toBe('2.0')
    expect(result!.transformation.action).toBe('adapted')
  })

  // ============================================================
  // TESTE 7: clear reseta o store
  // ============================================================
  test('clear() deve remover todos os registros', () => {
    store.save('planner', sampleLineage)
    store.save('tdd-guide', sampleLineage)
    expect(store.list()).toHaveLength(2)

    store.clear()
    expect(store.list()).toHaveLength(0)
  })
})

describe('Lineage — Funções registerLineage / getLineage / listLineages', () => {
  let store: InMemoryLineageStore

  beforeEach(() => {
    store = new InMemoryLineageStore()
  })

  // ============================================================
  // TESTE 8: registerLineage retorna lineage
  // ============================================================
  test('registerLineage() deve retornar a linhagem registrada', () => {
    const result = registerLineage(store, 'planner', sampleLineage)
    expect(result).toEqual(sampleLineage)
    expect(result.origin.repo).toBe('ECC')
  })

  // ============================================================
  // TESTE 9: getLineage com ID existente retorna dados corretos
  // ============================================================
  test('getLineage() com ID existente retorna lineage correta', () => {
    registerLineage(store, 'planner', sampleLineage)

    const result = getLineage(store, 'planner')
    expect(result).not.toBeNull()
    expect(result!.destination.path).toBe('.agents/ecc/planner.ts')
    expect(result!.transformation.action).toBe('cloned')
  })

  // ============================================================
  // TESTE 10: getLineage com ID inexistente retorna null
  // ============================================================
  test('getLineage() com ID inexistente retorna null', () => {
    const result = getLineage(store, 'nao-existe')
    expect(result).toBeNull()
  })

  // ============================================================
  // TESTE 11: listLineages retorna nomes corretos
  // ============================================================
  test('listLineages() deve retornar todos os IDs', () => {
    registerLineage(store, 'a', sampleLineage)
    registerLineage(store, 'b', sampleLineage)
    registerLineage(store, 'c', sampleLineage)

    const ids = listLineages(store)
    expect(ids).toHaveLength(3)
    expect(ids).toEqual(['a', 'b', 'c'])
  })

  // ============================================================
  // TESTE 12: Fluxo completo: register → get → list
  // ============================================================
  test('fluxo completo: register → get → list', () => {
    // Register
    const registered = registerLineage(store, 'full-test', sampleLineage)
    expect(registered.origin.repo).toBe('ECC')

    // Get
    const retrieved = getLineage(store, 'full-test')
    expect(retrieved).toEqual(sampleLineage)

    // List
    const all = listLineages(store)
    expect(all).toContain('full-test')
  })
})
