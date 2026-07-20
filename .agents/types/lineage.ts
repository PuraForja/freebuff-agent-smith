import { existsSync, readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs'
import { join } from 'path'

/**
 * 🔗 Lineage — Sistema de Linhagem de Artefatos
 *
 * SPEC-ADR-004: Linhagem Obrigatória
 * Toda transformação de artefato é rastreada: origem → transformação → destino.
 *
 * Uso:
 *   const lineage = registerLineage('planner', {
 *     origin: { repo: 'ECC', version: '2.1', path: 'agents/planner.md' },
 *     transformation: { date: '2026-07-17', action: 'cloned', description: 'Convertido' },
 *     destination: { repo: 'freebuff-agent-smith-v2', path: '.agents/ecc/planner.ts' }
 *   })
 *
 *   const found = getLineage('planner')
 *   const all = listLineages()
 */

/**
 * Lineage — Representa a procedência e transformação de um artefato
 */
export interface Lineage {
  origin: {
    repo: string
    version: string
    path: string
  }
  transformation: {
    date: string
    action: 'cloned' | 'adapted' | 'patched' | 'created'
    description: string
  }
  destination: {
    repo: string
    path: string
  }
}

/**
 * LineageStore — Permite diferentes implementações de storage
 * (em memória para testes, filesystem para produção via F1c-00)
 */
export interface LineageStore {
  save(id: string, lineage: Lineage): void
  load(id: string): Lineage | null
  list(): string[]
}

/**
 * InMemoryLineageStore — Store em memória (para testes)
 */
export class InMemoryLineageStore implements LineageStore {
  private store: Record<string, Lineage> = {}

  save(id: string, lineage: Lineage): void {
    this.store[id] = lineage
  }

  load(id: string): Lineage | null {
    return this.store[id] ?? null
  }

  list(): string[] {
    return Object.keys(this.store)
  }

  clear(): void {
    this.store = {}
  }
}

/**
 * FileSystemLineageStore — Store em disco real (produção)
 * Salva/recupera lineages como arquivos JSON em um diretório.
 *
 * Uso:
 *   const store = new FileSystemLineageStore('./knowledge/lineage')
 *   registerLineage(store, 'planner', { ... })
 */
export class FileSystemLineageStore implements LineageStore {
  constructor(private basePath: string = './knowledge/lineage') {
    // Garante que basePath é uma string válida
    if (!basePath || typeof basePath !== 'string') {
      this.basePath = './knowledge/lineage'
    }
  }

  save(id: string, lineage: Lineage): void {
    const filePath = join(this.basePath, `${id}.json`)
    if (!existsSync(this.basePath)) {
      mkdirSync(this.basePath, { recursive: true })
    }
    writeFileSync(filePath, JSON.stringify(lineage, null, 2), 'utf-8')
  }

  load(id: string): Lineage | null {
    try {
      const filePath = join(this.basePath, `${id}.json`)
      if (!existsSync(filePath)) return null
      const content = readFileSync(filePath, 'utf-8')
      return JSON.parse(content) as Lineage
    } catch {
      return null
    }
  }

  list(): string[] {
    try {
      const files = readdirSync(this.basePath)
      return files
        .filter((f: string) => f.endsWith('.json'))
        .map((f: string) => f.replace('.json', ''))
    } catch {
      return []
    }
  }
}

/**
 * Registra a linhagem de um artefato
 * @param store - Store onde salvar
 * @param artifactId - ID do artefato
 * @param lineage - Dados da linhagem
 * @returns A linhagem registrada
 */
export function registerLineage(
  store: LineageStore,
  artifactId: string,
  lineage: Lineage
): Lineage {
  store.save(artifactId, lineage)
  return lineage
}

/**
 * Recupera a linhagem de um artefato
 * @param store - Store onde buscar
 * @param artifactId - ID do artefato
 * @returns A linhagem ou null se não encontrada
 */
export function getLineage(
  store: LineageStore,
  artifactId: string
): Lineage | null {
  return store.load(artifactId)
}

/**
 * Lista todos os IDs de artefatos com linhagem registrada
 * @param store - Store onde listar
 * @returns Array de IDs
 */
export function listLineages(store: LineageStore): string[] {
  return store.list()
}
