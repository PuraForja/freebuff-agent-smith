/**
 * 🩹 Patch — Sistema de Personalização sem Modificar Originais
 *
 * SPEC-SEC-4.3: Gerenciador de Patches
 * SPEC-ADR-002: Nunca Modificar Originais
 *
 * Patch representa uma modificação feita em um artefato de terceiros.
 * O original permanece intocado — o patch é uma camada separada.
 *
 * Uso:
 *   const patch: Patch = {
 *     id: 'patch-001',
 *     target: 'ECC/skills/pdf-reader',
 *     targetVersion: '2.1',
 *     description: 'Adicionar suporte a UTF-8',
 *     createdAt: '2026-07-17',
 *     status: 'active',
 *     linesChanged: 12,
 *     tokenReduction: '28%'
 *   }
 */

/**
 * Patch — Representa uma personalização aplicada a um artefato de terceiros
 */
export interface Patch {
  /** ID único do patch */
  id: string

  /** Artefato alvo (ex: "ECC/skills/pdf-reader") */
  target: string

  /** Versão do alvo quando o patch foi criado */
  targetVersion: string

  /** Descrição da modificação */
  description: string

  /** Data de criação (formato ISO) */
  createdAt: string

  /** Status atual do patch */
  status: 'active' | 'incompatible' | 'removed' | 'merged'

  /** Quantidade de linhas modificadas */
  linesChanged: number

  /** Redução de tokens (percentual, opcional) */
  tokenReduction?: string

  /** O upstream já implementou esta funcionalidade? (opcional) */
  upstreamImplemented?: boolean
}

/**
 * PatchSummary — Versão resumida do patch para listagens
 */
export interface PatchSummary {
  id: string
  target: string
  description: string
  status: Patch['status']
  createdAt: string
}

/**
 * Converte um Patch completo para um resumo
 */
export function toPatchSummary(patch: Patch): PatchSummary {
  return {
    id: patch.id,
    target: patch.target,
    description: patch.description,
    status: patch.status,
    createdAt: patch.createdAt,
  }
}

/**
 * Verifica se um patch é candidato a remoção
 * (upstream implementou ou status é incompatível)
 */
export function isPatchRemovable(patch: Patch): boolean {
  return patch.upstreamImplemented === true || patch.status === 'incompatible'
}
