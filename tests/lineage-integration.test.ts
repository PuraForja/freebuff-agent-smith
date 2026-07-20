/**
 * 🧪 Integração — FileSystemLineageStore (disco real)
 *
 * Testa o FileSystemLineageStore COM disco real, usando
 * um diretório temporário que é limpo após os testes.
 *
 * F1c-07: Testes de integração (artifact → lineage → disco)
 */

import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

import {
  Lineage,
  FileSystemLineageStore,
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

describe('FileSystemLineageStore — Integração com Disco', () => {
  let tempDir: string
  let store: FileSystemLineageStore

  beforeEach(() => {
    // Cria diretório temporário para cada teste
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'smith-lineage-'))
    store = new FileSystemLineageStore(tempDir)
  })

  afterEach(() => {
    // Limpa diretório temporário
    fs.rmSync(tempDir, { recursive: true, force: true })
  })

  // ============================================================
  // TESTE 1: save cria arquivo JSON no disco
  // ============================================================
  test('save() deve criar arquivo JSON no diretório', () => {
    registerLineage(store, 'planner', sampleLineage)

    const filePath = path.join(tempDir, 'planner.json')
    expect(fs.existsSync(filePath)).toBe(true)

    const content = fs.readFileSync(filePath, 'utf-8')
    const parsed = JSON.parse(content)
    expect(parsed.origin.repo).toBe('ECC')
  })

  // ============================================================
  // TESTE 2: load recupera lineage do disco
  // ============================================================
  test('load() deve recuperar lineage salva no disco', () => {
    registerLineage(store, 'planner', sampleLineage)

    const result = getLineage(store, 'planner')
    expect(result).not.toBeNull()
    expect(result!.destination.path).toBe('.agents/ecc/planner.ts')
  })

  // ============================================================
  // TESTE 3: load com ID inexistente retorna null
  // ============================================================
  test('load() com ID inexistente retorna null', () => {
    const result = getLineage(store, 'nao-existe')
    expect(result).toBeNull()
  })

  // ============================================================
  // TESTE 4: list lista arquivos no diretório
  // ============================================================
  test('list() deve listar IDs de arquivos no diretório', () => {
    registerLineage(store, 'a', sampleLineage)
    registerLineage(store, 'b', sampleLineage)
    registerLineage(store, 'c', sampleLineage)

    const ids = listLineages(store)
    expect(ids).toHaveLength(3)
    expect(ids).toContain('a')
    expect(ids).toContain('b')
    expect(ids).toContain('c')
  })

  // ============================================================
  // TESTE 5: list vazio retorna array vazio
  // ============================================================
  test('list() em diretório vazio retorna []', () => {
    const ids = listLineages(store)
    expect(ids).toEqual([])
  })

  // ============================================================
  // TESTE 6: Sobrescrita de lineage
  // ============================================================
  test('save() deve sobrescrever arquivo existente', () => {
    const v1: Lineage = {
      origin: { repo: 'R1', version: '1', path: 'p1' },
      transformation: { date: '2026-01-01', action: 'cloned', description: 'v1' },
      destination: { repo: 'local', path: 'v1.ts' },
    }

    const v2: Lineage = {
      origin: { repo: 'R2', version: '2', path: 'p2' },
      transformation: { date: '2026-07-17', action: 'adapted', description: 'v2' },
      destination: { repo: 'local', path: 'v2.ts' },
    }

    registerLineage(store, 'agent-x', v1)
    registerLineage(store, 'agent-x', v2)

    const result = getLineage(store, 'agent-x')
    expect(result!.origin.version).toBe('2')
    expect(result!.transformation.action).toBe('adapted')
  })

  // ============================================================
  // TESTE 7: Fluxo completo: register → get → list → sobrescrever
  // ============================================================
  test('fluxo completo: register → get → list → overwrite', () => {
    // 1. Register
    registerLineage(store, 'fluxo-test', sampleLineage)

    // 2. Get
    const retrieved = getLineage(store, 'fluxo-test')
    expect(retrieved).not.toBeNull()

    // 3. List
    const all = listLineages(store)
    expect(all).toContain('fluxo-test')

    // 4. Sobrescrever
    const updated: Lineage = {
      origin: { repo: 'ECC', version: '3.0', path: 'agents/planner.md' },
      transformation: { date: '2026-07-20', action: 'adapted', description: 'Atualizado' },
      destination: { repo: 'freebuff-agent-smith-v2', path: '.agents/ecc/planner-v2.ts' },
    }
    registerLineage(store, 'fluxo-test', updated)

    const final = getLineage(store, 'fluxo-test')
    expect(final!.origin.version).toBe('3.0')
    expect(final!.transformation.action).toBe('adapted')
  })
})
