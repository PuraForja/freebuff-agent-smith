/**
 * 🧬 Artifact — Discriminated Union de Artefatos do Smith
 *
 * Tudo no ecossistema do Smith é um artefato tipado.
 * Usamos discriminated unions do TypeScript para garantir
 * que cada tipo tenha EXATAMENTE os campos que precisa.
 *
 * SPEC-ADR-003: Artefatos, não Arquivos
 *
 * 10 tipos de artefato:
 *   agent, skill, prompt, tool, fluxo, memory, config, mcp, template, test
 *
 * Uso:
 *   const agent: Artifact = { type: 'agent', id: 'x', instructionsPrompt: '...', model: '...', toolNames: [] }
 *   const skill: Artifact = { type: 'skill', id: 'y', description: '...', content: '...' }
 *
 *   switch (artifact.type) {
 *     case 'agent': // type-safe: só tem campos de agent
 *     case 'skill': // type-safe: só tem campos de skill
 *     ...
 *   }
 */

import type { Lineage } from './lineage'

/**
 * Artifact — Discriminated Union
 *
 * 10 variantes, cada uma com seus campos obrigatórios.
 * O campo `type` é o discriminador: permite switch exaustivo.
 * `lineage` (quando presente) rastreia a procedência do artefato.
 */
export type Artifact =
  | {
      type: 'agent'
      id: string
      displayName?: string
      instructionsPrompt: string
      model: string
      toolNames: string[]
      lineage?: Lineage
    }
  | {
      type: 'skill'
      id: string
      description: string
      content: string
      lineage?: Lineage
    }
  | {
      type: 'prompt'
      id: string
      template: string
      variables: string[]
      lineage?: Lineage
    }
  | {
      type: 'tool'
      id: string
      description: string
      parameters: Record<string, unknown>
      lineage?: Lineage
    }
  | {
      type: 'fluxo'
      id: string
      steps: string[]
      pattern: string
      lineage?: Lineage
    }
  | {
      type: 'memory'
      id: string
      scope: 'session' | 'project' | 'global'
      content: string
      tags: string[]
      lineage?: Lineage
    }
  | {
      type: 'config'
      id: string
      data: Record<string, unknown>
      lineage?: Lineage
    }
  | {
      type: 'mcp'
      id: string
      serverCommand: string
      serverArgs: string[]
      env: Record<string, string>
      lineage?: Lineage
    }
  | {
      type: 'template'
      id: string
      name: string
      description: string
      files: string[]
      variables: string[]
      lineage?: Lineage
    }
  | {
      type: 'test'
      id: string
      cases: string[]
      lineage?: Lineage
    }

/**
 * Helper: Extrai o ID de qualquer artefato
 */
export function getArtifactId(artifact: Artifact): string {
  return artifact.id
}

/**
 * Helper: Verifica se um artefato tem lineage registrada
 */
export function hasLineage(artifact: Artifact): boolean {
  return 'lineage' in artifact && artifact.lineage !== undefined
}
