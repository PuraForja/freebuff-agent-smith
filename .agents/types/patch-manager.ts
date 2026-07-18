/**
 * 🩹 Patch Manager — Sistema de Patches + Verificação
 *
 * Gerencia patches aplicados a artefatos de terceiros.
 * SPEC-ADR-002: Nunca Modificar Originais — patches são camadas separadas.
 *
 * Operações:
 *   - createPatch: registrar patch em patches/
 *   - listPatches: listar com filtros opcionais (status, target)
 *   - getPatch: buscar por ID
 *   - removePatch: marcar como removido
 *   - checkCompatibility: verificar se patch quebra com nova versão
 *   - applyPatch: aplicar patch ao artefato
 *   - verifyAllPatches: verificação em lote
 *
 * Fase 3 — Patches + Smith Update
 * PLAN-F3: Sistema de patches + verificação de compatibilidade
 * SPEC-SEC-4.3: Gerenciador de Patches
 */

import { existsSync, readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs'
import { join } from 'path'
import type { Patch } from './patch'

// ============================================================
// TIPOS
// ============================================================

/**
 * CreatePatchData — Dados para criar um novo patch
 */
export interface CreatePatchData {
  /** Artefato alvo (ex: "ECC/skills/pdf-reader") */
  target: string
  /** Versão do alvo quando o patch foi criado */
  targetVersion: string
  /** Descrição da modificação */
  description: string
  /** Quantidade de linhas modificadas */
  linesChanged: number
  /** Redução de tokens (percentual, opcional) */
  tokenReduction?: string
}

/**
 * PatchFilter — Filtros para listagem de patches
 */
export interface PatchFilter {
  status?: Patch['status']
  target?: string
}

/**
 * CompatibilityResult — Resultado da verificação de compatibilidade
 */
export interface CompatibilityResult {
  patchId: string
  target: string
  currentVersion: string
  patchVersion: string
  compatible: boolean
  reason?: string
}

/**
 * PatchStore — Interface de storage para patches
 * Permite diferentes implementações (em memória para testes,
 * filesystem para produção)
 */
export interface PatchStore {
  save(id: string, patch: Patch): void
  load(id: string): Patch | null
  list(): string[]
  remove(id: string): void
}

// ============================================================
// CONSTANTES
// ============================================================

let patchCounter = 0

// ============================================================
// STORE EM MEMÓRIA (para testes)
// ============================================================

/**
 * InMemoryPatchStore — Store em memória para testes
 */
export class InMemoryPatchStore implements PatchStore {
  private store: Record<string, Patch> = {}

  save(id: string, patch: Patch): void {
    this.store[id] = patch
  }

  load(id: string): Patch | null {
    return this.store[id] ?? null
  }

  list(): string[] {
    return Object.keys(this.store)
  }

  remove(id: string): void {
    // Apenas marca como 'removed' — não deleta
    if (this.store[id]) {
      this.store[id] = { ...this.store[id], status: 'removed' }
    }
  }
}

/**
 * FileSystemPatchStore — Store em disco real (produção)
 * Salva/recupera patches como arquivos JSON em patches/.
 *
 * Uso:
 *   const store = new FileSystemPatchStore('./patches')
 *   const patch = createPatch(store, { ... })
 */
export class FileSystemPatchStore implements PatchStore {
  constructor(private basePath: string = './patches') {
    if (!basePath || typeof basePath !== 'string') {
      this.basePath = './patches'
    }
  }

  save(id: string, patch: Patch): void {
    const filePath = join(this.basePath, `${id}.json`)
    if (!existsSync(this.basePath)) {
      mkdirSync(this.basePath, { recursive: true })
    }
    writeFileSync(filePath, JSON.stringify(patch, null, 2), 'utf-8')
  }

  load(id: string): Patch | null {
    try {
      const filePath = join(this.basePath, `${id}.json`)
      if (!existsSync(filePath)) return null
      const content = readFileSync(filePath, 'utf-8')
      return JSON.parse(content) as Patch
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

  remove(id: string): void {
    try {
      const filePath = join(this.basePath, `${id}.json`)
      if (!existsSync(filePath)) return
      const content = readFileSync(filePath, 'utf-8')
      const patch = JSON.parse(content) as Patch
      patch.status = 'removed'
      writeFileSync(filePath, JSON.stringify(patch, null, 2), 'utf-8')
    } catch {
      // Arquivo não encontrado ou inválido — apenas ignora
    }
  }
}

// ============================================================
// FUNÇÕES PÚBLICAS
// ============================================================

/**
 * Cria um novo patch e registra no store.
 *
 * @param store - Store onde salvar
 * @param data - Dados do patch
 * @returns Patch criado
 * @throws Se target ou description forem vazios
 *
 * @example
 * const store = new InMemoryPatchStore()
 * const patch = createPatch(store, {
 *   target: 'ECC/skills/pdf-reader',
 *   targetVersion: '2.1',
 *   description: 'Adicionar suporte a UTF-8',
 *   linesChanged: 12,
 * })
 */
export function createPatch(store: PatchStore, data: CreatePatchData): Patch {
  if (!data.target || data.target.trim().length === 0) {
    throw new Error('target não pode estar vazio')
  }
  if (!data.description || data.description.trim().length === 0) {
    throw new Error('description não pode estar vazia')
  }

  patchCounter++
  const id = `patch-${String(patchCounter).padStart(3, '0')}`

  const patch: Patch = {
    id,
    target: data.target,
    targetVersion: data.targetVersion,
    description: data.description,
    createdAt: new Date().toISOString().split('T')[0], // Apenas data YYYY-MM-DD
    status: 'active',
    linesChanged: data.linesChanged,
    tokenReduction: data.tokenReduction,
  }

  store.save(id, patch)
  return patch
}

/**
 * Lista patches com filtros opcionais.
 *
 * @param store - Store onde buscar
 * @param filter - Filtros opcionais (status, target)
 * @returns Array de patches (formato completo)
 */
export function listPatches(store: PatchStore, filter?: PatchFilter): Patch[] {
  const ids = store.list()
  let patches = ids
    .map(id => store.load(id))
    .filter((p): p is Patch => p !== null)

  // Aplicar filtros
  if (filter?.status) {
    patches = patches.filter(p => p.status === filter.status)
  }
  if (filter?.target) {
    patches = patches.filter(p => p.target === filter.target)
  }

  // Ordenar por data de criação (mais recente primeiro)
  return patches.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

/**
 * Busca um patch pelo ID.
 *
 * @param store - Store onde buscar
 * @param patchId - ID do patch
 * @returns Patch ou null se não encontrado
 */
export function getPatch(store: PatchStore, patchId: string): Patch | null {
  return store.load(patchId)
}

/**
 * Remove (marca como 'removed') um patch.
 *
 * @param store - Store onde remover
 * @param patchId - ID do patch
 * @throws Se o patch não existir
 */
export function removePatch(store: PatchStore, patchId: string): void {
  const patch = store.load(patchId)
  if (!patch) {
    throw new Error(`Patch não encontrado: ${patchId}`)
  }
  store.remove(patchId)
}

/**
 * Verifica compatibilidade de um patch com uma versão upstream.
 *
 * Regras:
 * - Mesma versão → compatível
 * - Mesma major, minor superior (ex: 2.1 → 2.3) → compatível
 * - Major diferente (ex: 2.1 → 3.0) → incompatível
 * - Minor inferior (ex: 2.3 → 2.1) → potencialmente incompatível
 *
 * @param patch - Patch a verificar
 * @param upstreamVersion - Versão do upstream
 * @returns Resultado da verificação
 */
export function checkCompatibility(patch: Patch, upstreamVersion: string): CompatibilityResult {
  const result: CompatibilityResult = {
    patchId: patch.id,
    target: patch.target,
    currentVersion: upstreamVersion,
    patchVersion: patch.targetVersion,
    compatible: false,
  }

  const [patchMajor, patchMinor] = parseVersion(patch.targetVersion)
  const [upMajor, upMinor] = parseVersion(upstreamVersion)

  // Mesma versão exata
  if (patch.targetVersion === upstreamVersion) {
    result.compatible = true
    return result
  }

  // Mesma major, minor diferente
  if (patchMajor === upMajor) {
    if (upMinor >= patchMinor) {
      // Versão superior na mesma major → compatível
      result.compatible = true
    } else {
      // Versão inferior na mesma major → incompatível (regressão)
      result.compatible = false
      result.reason = `Versão do patch (${patch.targetVersion}) é superior à versão upstream (${upstreamVersion}) na mesma major`
    }
    return result
  }

  // Major diferente → incompatível
  result.compatible = false
  if (upMajor > patchMajor) {
    result.reason = `Mudança de major (${patch.targetVersion} → ${upstreamVersion}). O patch pode precisar de adaptação.`
  } else {
    result.reason = `Versão upstream (${upstreamVersion}) é anterior à versão do patch (${patch.targetVersion})`
  }

  return result
}

/**
 * Aplica um patch a um conteúdo de artefato.
 *
 * No MVP, retorna uma representação simbólica da aplicação.
 * Em produção, modificaria o arquivo alvo com base nas linhas do patch.
 *
 * @param store - Store com o patch
 * @param patchId - ID do patch a aplicar
 * @returns Mensagem de confirmação
 * @throws Se o patch não existir ou não estiver ativo
 */
export function applyPatch(store: PatchStore, patchId: string): string {
  const patch = store.load(patchId)
  if (!patch) {
    throw new Error(`Patch não encontrado: ${patchId}`)
  }
  if (patch.status !== 'active') {
    throw new Error(`Patch ${patchId} não está ativo (status: ${patch.status})`)
  }
  return `Patch ${patchId} aplicado em ${patch.target} (${patch.linesChanged} linhas modificadas)`
}

/**
 * Verifica compatibilidade de todos os patches ativos com uma versão upstream.
 *
 * @param store - Store com os patches
 * @param upstreamVersion - Versão do upstream para verificar
 * @returns Array de resultados de compatibilidade
 */
export function verifyAllPatches(store: PatchStore, upstreamVersion?: string): CompatibilityResult[] {
  const patches = listPatches(store, { status: 'active' })

  if (patches.length === 0) return []

  // Usar a versão do primeiro patch como referência se não fornecida
  const version = upstreamVersion ?? patches[0].targetVersion

  return patches.map(patch => checkCompatibility(patch, version))
}

// ============================================================
// FUNÇÕES INTERNAS
// ============================================================

/**
 * Parseia uma versão "x.y" para [major, minor]
 */
function parseVersion(version: string): [number, number] {
  const parts = version.split('.').map(Number)
  return [parts[0] ?? 0, parts[1] ?? 0]
}
