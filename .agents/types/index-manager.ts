/**
 * Index Manager — Fase 6: Gerenciamento do knowledge/index.json
 *
 * Reconstrói e valida o índice pesquisável de conhecimento.
 * Garante integridade referencial entre index.json e arquivos no disco.
 *
 * @module index-manager
 */

import type { Pattern, PatternCategory } from './pattern-library';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Entrada de um artefato no índice */
export interface IndexEntry {
  /** ID único do artefato */
  id: string;
  /** Título legível */
  title: string;
  /** Caminho relativo ao knowledge/ */
  path: string;
  /** Tipo do artefato */
  type: 'technique' | 'pattern' | 'principle' | 'skill' | 'config';
  /** Qualidade (0.0 a 1.0) */
  quality: number;
  /** Tags para busca */
  tags: string[];
}

/** Categoria no índice */
export interface IndexCategory {
  /** Label legível */
  label: string;
  /** Número de artefatos */
  count: number;
  /** Lista de artefatos */
  artifacts: IndexEntry[];
}

/** Estrutura completa do knowledge/index.json */
export interface KnowledgeIndex {
  /** Versão do formato */
  version: string;
  /** Data da última atualização */
  updatedAt: string;
  /** Total de artefatos */
  totalArtifacts: number;
  /** Categorias agrupadas */
  categories: Record<string, IndexCategory>;
  /** Mapa de termos de busca para IDs */
  searchTerms: Record<string, string[]>;
}

/** Resultado da validação do índice */
export interface ValidationResult {
  /** Se o índice é válido */
  valid: boolean;
  /** Erros encontrados */
  errors: ValidationError[];
  /** Avisos */
  warnings: string[];
  /** Entradas órfãs (no index mas não no disco) */
  orphanEntries: string[];
  /** Arquivos não indexados (no disco mas não no index) */
  unindexedFiles: string[];
}

/** Erro de validação */
export interface ValidationError {
  /** Tipo do erro */
  type: 'missing_file' | 'orphan_entry' | 'duplicate_id' | 'invalid_path' | 'quality_out_of_range';
  /** Descrição do erro */
  message: string;
  /** Entrada afetada */
  entryId?: string;
  /** Caminho afetado */
  path?: string;
}

/** Configuração do IndexManager */
export interface IndexManagerConfig {
  /** Diretório raiz do knowledge */
  knowledgeDir: string;
  /** Se deve auto-reparar problemas encontrados */
  autoFix: boolean;
  /** Se deve logar operações detalhadamente */
  verbose: boolean;
}

/** Store do IndexManager */
export interface IndexManagerStore {
  /** Obter índice atual */
  getIndex(): KnowledgeIndex;
  /** Salvar índice */
  saveIndex(index: KnowledgeIndex): void;
  /** Listar arquivos existentes no knowledge/ (simulado) */
  listKnowledgeFiles(): string[];
  /** Verificar se arquivo existe */
  fileExists(path: string): boolean;
}

// ---------------------------------------------------------------------------
// InMemory Implementation
// ---------------------------------------------------------------------------

export class InMemoryIndexManagerStore implements IndexManagerStore {
  private index: KnowledgeIndex = createEmptyIndex();
  private files: Set<string> = new Set();

  getIndex(): KnowledgeIndex {
    return structuredClone(this.index);
  }

  saveIndex(index: KnowledgeIndex): void {
    this.index = structuredClone(index);
  }

  listKnowledgeFiles(): string[] {
    return Array.from(this.files);
  }

  fileExists(path: string): boolean {
    return this.files.has(path);
  }

  /** Helper para testes: adicionar arquivo simulado */
  addMockFile(path: string): void {
    this.files.add(path);
  }

  /** Helper para testes: setar índice simulado */
  setMockIndex(index: KnowledgeIndex): void {
    this.index = structuredClone(index);
  }
}

// ---------------------------------------------------------------------------
// Core Functions
// ---------------------------------------------------------------------------

/** Criar índice vazio */
export function createEmptyIndex(): KnowledgeIndex {
  return {
    version: '1.0.0',
    updatedAt: new Date().toISOString(),
    totalArtifacts: 0,
    categories: {},
    searchTerms: {},
  };
}

/**
 * Reconstruir o índice a partir de uma lista de padrões.
 * Gera categories e searchTerms automaticamente.
 */
export function rebuildIndex(patterns: Pattern[]): KnowledgeIndex {
  const index = createEmptyIndex();
  index.updatedAt = new Date().toISOString();

  const categoriesMap = new Map<string, IndexEntry[]>();
  const searchTermsMap = new Map<string, Set<string>>();

  for (const pattern of patterns) {
    const entry: IndexEntry = {
      id: pattern.id,
      title: pattern.title,
      path: `patterns/${pattern.id}.json`,
      type: 'pattern',
      quality: pattern.quality,
      tags: pattern.tags,
    };

    // Adicionar às categorias
    for (const cat of pattern.categories) {
      if (!categoriesMap.has(cat)) {
        categoriesMap.set(cat, []);
      }
      categoriesMap.get(cat)!.push(entry);
    }

    // Adicionar termos de busca
    const searchTerms = [
      ...pattern.tags,
      pattern.title.toLowerCase(),
      pattern.concept.toLowerCase(),
      ...pattern.title.toLowerCase().split(/\s+/).filter(w => w.length > 2),
    ];

    for (const term of searchTerms) {
      if (!searchTermsMap.has(term)) {
        searchTermsMap.set(term, new Set());
      }
      searchTermsMap.get(term)!.add(pattern.id);
    }
  }

  // Construir categorias
  const categoryLabels: Record<string, string> = {
    workflow: '🔄 Workflow',
    architecture: '🏗️ Arquitetura',
    testing: '🧪 Testes',
    security: '🔒 Segurança',
    'anti-hallucination': '🧠 Anti-Alucinação',
    performance: '⚡ Performance',
    quality: '✅ Qualidade',
    communication: '💬 Comunicação',
    data: '📊 Dados',
    infrastructure: '🏗️ Infraestrutura',
  };

  for (const [cat, entries] of categoriesMap) {
    index.categories[cat] = {
      label: categoryLabels[cat] || cat,
      count: entries.length,
      artifacts: entries,
    };
  }

  // Construir searchTerms
  for (const [term, ids] of searchTermsMap) {
    index.searchTerms[term] = Array.from(ids);
  }

  index.totalArtifacts = patterns.length;

  return index;
}

/**
 * Validar integridade do índice.
 * Verifica: duplicatas, entradas órfãs, qualidade, consistência.
 */
export function validateIndex(
  index: KnowledgeIndex,
  existingFiles: string[]
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];
  const orphanEntries: string[] = [];
  const unindexedFiles: string[] = [];

  const seenIds = new Set<string>();
  const indexedPaths = new Set<string>();

  // Verificar cada entrada no índice
  for (const [catKey, cat] of Object.entries(index.categories)) {
    for (const entry of cat.artifacts) {
      // Duplicatas
      if (seenIds.has(entry.id)) {
        errors.push({
          type: 'duplicate_id',
          message: `Duplicate ID "${entry.id}" in category "${catKey}"`,
          entryId: entry.id,
        });
      }
      seenIds.add(entry.id);

      // Qualidade fora do range
      if (entry.quality < 0 || entry.quality > 1) {
        errors.push({
          type: 'quality_out_of_range',
          message: `Quality ${entry.quality} for "${entry.id}" is out of range [0, 1]`,
          entryId: entry.id,
        });
      }

      indexedPaths.add(entry.path);
    }
  }

  // Verificar se arquivos indexados existem
  for (const path of indexedPaths) {
    if (!existingFiles.includes(path)) {
      errors.push({
        type: 'missing_file',
        message: `Indexed file "${path}" does not exist on disk`,
        path,
      });
      orphanEntries.push(path);
    }
  }

  // Verificar arquivos não indexados (padrão patterns/*.json)
  for (const file of existingFiles) {
    if (file.startsWith('patterns/') && file.endsWith('.json') && !indexedPaths.has(file)) {
      unindexedFiles.push(file);
    }
  }

  if (unindexedFiles.length > 0) {
    warnings.push(`${unindexedFiles.length} pattern files on disk are not in the index`);
  }

  // Verificar searchTerms consistência
  for (const [term, ids] of Object.entries(index.searchTerms)) {
    for (const id of ids) {
      if (!seenIds.has(id)) {
        warnings.push(`Search term "${term}" references unknown ID "${id}"`);
      }
    }
  }

  // Verificar totalArtifacts
  const actualTotal = Object.values(index.categories).reduce(
    (sum, cat) => sum + cat.count, 0
  );
  if (index.totalArtifacts !== actualTotal) {
    warnings.push(
      `totalArtifacts (${index.totalArtifacts}) does not match actual count (${actualTotal})`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    orphanEntries,
    unindexedFiles,
  };
}

/**
 * Criar padrões iniciais conforme SPEC-SEC-4.4.
 *
 * ⚠️ IDs são strings vazias ('') — estes padrões devem ser passados
 * por `rebuildIndex()` que gera paths baseados no ID, ou por
 * `InMemoryPatternStore.addPattern()` que gera IDs automaticamente.
 */
export function createInitialPatterns(): Pattern[] {
  const now = new Date().toISOString();
  return [
    {
      id: '',
      title: 'Planner Before Execute',
      description: 'Antes de qualquer execução, criar um plano estruturado. O plano deve ser aprovado antes de prosseguir.',
      concept: 'planning before execution',
      origin: 'ECC/planner + CrewAI/planner',
      quality: 0.92,
      tags: ['planning', 'execution', 'workflow', 'approval'],
      categories: ['workflow', 'quality'],
      pattern: 'planejar → aprovar → executar → revisar',
      applicableTo: ['any-language', 'any-framework'],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: '',
      title: 'Research First',
      description: 'Pesquisar antes de criar. Verificar se solução similar já existe no ecossistema.',
      concept: 'research before creation',
      origin: 'ECC/code-explorer',
      quality: 0.88,
      tags: ['research', 'discovery', 'reuse'],
      categories: ['workflow', 'quality'],
      pattern: 'pesquisar → analisar → decidir → criar',
      applicableTo: ['any-language', 'any-framework'],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: '',
      title: 'Self Review',
      description: 'Autoavaliação obrigatória antes de entregar. Verificar qualidade, completude e correção.',
      concept: 'self review before delivery',
      origin: 'ECC/code-reviewer',
      quality: 0.90,
      tags: ['review', 'quality', 'self-check'],
      categories: ['quality', 'testing'],
      pattern: 'criar → auto-revisar → corrigir → entregar',
      applicableTo: ['any-language', 'any-framework'],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: '',
      title: 'Least Artifact',
      description: 'Produzir o menor artefato capaz de resolver o problema. Evitar over-engineering.',
      concept: 'minimal viable artifact',
      origin: 'Conceitual',
      quality: 0.85,
      tags: ['simplicity', 'minimalism', 'yagni'],
      categories: ['quality', 'architecture'],
      pattern: 'identificar necessidade → implementar mínimo → validar → expandir se necessário',
      applicableTo: ['any-language', 'any-framework'],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: '',
      title: 'Read Only Source',
      description: 'Nunca modificar repositórios originais. Usar camada de patches para personalizações.',
      concept: 'immutability of sources',
      origin: 'Git / Conceitual',
      quality: 0.95,
      tags: ['immutability', 'patches', 'safety'],
      categories: ['architecture', 'quality'],
      pattern: 'ler → avaliar → decidir → aplicar via patch',
      applicableTo: ['any-language', 'any-framework'],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: '',
      title: 'Lineage Tracking',
      description: 'Rastrear origem e transformações de todo artefato. Cada modificação tem procedência registrada.',
      concept: 'provenance tracking',
      origin: 'Git / Conceitual',
      quality: 0.93,
      tags: ['lineage', 'provenance', 'audit'],
      categories: ['architecture', 'quality'],
      pattern: 'criar → registrar origem → registrar transformação → manter histórico',
      applicableTo: ['any-language', 'any-framework'],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: '',
      title: 'Knowledge over Code',
      description: 'Extrair conceitos e princípios reutilizáveis, não código específico. Código fica obsoleto, princípios duram.',
      concept: 'abstraction over implementation',
      origin: 'Conceitual',
      quality: 0.90,
      tags: ['abstraction', 'knowledge', 'reusability'],
      categories: ['architecture', 'quality'],
      pattern: 'analisar código → extrair conceito → generalizar → documentar',
      applicableTo: ['any-language', 'any-framework'],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: '',
      title: 'Grounding First',
      description: 'Toda resposta deve ter fonte verificável. Se o dado não está na fonte, não inventar.',
      concept: 'grounding in sources',
      origin: 'solucao-medica (Anti-Hallucination)',
      quality: 0.98,
      tags: ['grounding', 'anti-hallucination', 'source-of-truth'],
      categories: ['anti-hallucination', 'quality'],
      pattern: 'verificar fonte → citar fonte → se sem fonte → sinalizar incerteza',
      applicableTo: ['any-language', 'any-framework'],
      createdAt: now,
      updatedAt: now,
    },
  ];
}

/**
 * Gerar relatório de validação formatado.
 */
export function generateValidationReport(result: ValidationResult): string {
  const lines: string[] = ['## 🔍 Index Validation Report\n'];

  lines.push(`**Status:** ${result.valid ? '✅ Valid' : '❌ Invalid'}`);
  lines.push(`**Errors:** ${result.errors.length}`);
  lines.push(`**Warnings:** ${result.warnings.length}`);
  lines.push('');

  if (result.errors.length > 0) {
    lines.push('### Errors\n');
    for (const error of result.errors) {
      const target = error.entryId ? ` (${error.entryId})` : error.path ? ` [${error.path}]` : '';
      lines.push(`- **${error.type}**${target}: ${error.message}`);
    }
    lines.push('');
  }

  if (result.warnings.length > 0) {
    lines.push('### Warnings\n');
    for (const warning of result.warnings) {
      lines.push(`- ${warning}`);
    }
    lines.push('');
  }

  if (result.orphanEntries.length > 0) {
    lines.push(`### Orphan Entries (${result.orphanEntries.length})\n`);
    for (const entry of result.orphanEntries) {
      lines.push(`- ${entry}`);
    }
    lines.push('');
  }

  if (result.unindexedFiles.length > 0) {
    lines.push(`### Unindexed Files (${result.unindexedFiles.length})\n`);
    for (const file of result.unindexedFiles) {
      lines.push(`- ${file}`);
    }
  }

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Convenience Functions
// ---------------------------------------------------------------------------

const defaultStore = new InMemoryIndexManagerStore();

/** Reconstruir índice a partir de padrões */
export function rebuildKnowledgeIndex(patterns: Pattern[]): KnowledgeIndex {
  const index = rebuildIndex(patterns);
  defaultStore.saveIndex(index);
  return index;
}

/** Validar índice existente */
export function validateKnowledgeIndex(
  index: KnowledgeIndex,
  existingFiles?: string[]
): ValidationResult {
  const files = existingFiles ?? defaultStore.listKnowledgeFiles();
  return validateIndex(index, files);
}

/** Obter índice atual */
export function getCurrentIndex(): KnowledgeIndex {
  return defaultStore.getIndex();
}

/** Gerar relatório de validação */
export function validationReport(result: ValidationResult): string {
  return generateValidationReport(result);
}
