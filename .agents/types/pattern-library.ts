/**
 * Pattern Library — Fase 6: Biblioteca de Padrões
 *
 * Catálogo pesquisável de padrões de engenharia extraídos de múltiplos projetos.
 * Permite buscar por conceito, origem, qualidade e categoria.
 *
 * @module pattern-library
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Um padrão de engenharia armazenado na biblioteca */
export interface Pattern {
  /** ID único do padrão (ex: "smith-pattern-001") */
  id: string;
  /** Título legível (ex: "Planner Before Execute") */
  title: string;
  /** Descrição detalhada do padrão */
  description: string;
  /** Conceito abstrato (independente de linguagem) */
  concept: string;
  /** Origem do padrão (ex: "ECC/planner + CrewAI/planner") */
  origin: string;
  /** Qualidade percebida (0.0 a 1.0) */
  quality: number;
  /** Tags para busca (ex: ["planning", "execution", "workflow"]) */
  tags: string[];
  /** Categorias a que pertence */
  categories: PatternCategory[];
  /** Padrão textual (ex: "planejar → aprovar → executar → revisar") */
  pattern: string;
  /** Onde se aplica (ex: ["any-language", "any-framework"]) */
  applicableTo: string[];
  /** Data de criação */
  createdAt: string;
  /** Última atualização */
  updatedAt: string;
}

/** Categorias conhecidas de padrões */
export type PatternCategory =
  | 'workflow'
  | 'architecture'
  | 'testing'
  | 'security'
  | 'anti-hallucination'
  | 'performance'
  | 'quality'
  | 'communication'
  | 'data'
  | 'infrastructure';

/** Filtro para busca de padrões */
export interface PatternFilter {
  /** Busca por texto livre (título, descrição, conceito, tags) */
  query?: string;
  /** Filtrar por categoria */
  category?: PatternCategory;
  /** Qualidade mínima (0.0 a 1.0) */
  minQuality?: number;
  /** Filtrar por tag específica */
  tag?: string;
  /** Filtrar por origem (substring match) */
  origin?: string;
  /** Filtrar por applicabilidade */
  applicableTo?: string;
  /** Ordenação */
  sortBy?: 'quality' | 'createdAt' | 'title';
  /** Direção da ordenação */
  sortOrder?: 'asc' | 'desc';
  /** Limite de resultados */
  limit?: number;
}

/** Resultado de uma busca */
export interface SearchResult {
  /** Padrões encontrados */
  patterns: Pattern[];
  /** Total de resultados antes do limit */
  total: number;
  /** Tempo de busca em ms */
  searchTimeMs: number;
  /** Termo de busca usado */
  query: string;
}

// ---------------------------------------------------------------------------
// Store Interface
// ---------------------------------------------------------------------------

/** Interface para armazenamento de padrões */
export interface PatternStore {
  /** Listar todos os padrões */
  listPatterns(filter?: PatternFilter): Pattern[];
  /** Buscar padrão por ID */
  getPattern(patternId: string): Pattern | undefined;
  /** Adicionar novo padrão */
  addPattern(pattern: Omit<Pattern, 'id' | 'createdAt' | 'updatedAt'>): Pattern;
  /** Atualizar padrão existente */
  updatePattern(patternId: string, updates: Partial<Pattern>): Pattern | undefined;
  /** Remover padrão */
  removePattern(patternId: string): boolean;
  /** Buscar padrões por texto */
  searchPatterns(query: string, options?: { limit?: number; minQuality?: number }): SearchResult;
  /** Contar padrões */
  count(): number;
}

// ---------------------------------------------------------------------------
// InMemory Implementation
// ---------------------------------------------------------------------------

function createIdGenerator(startAt = 1): () => string {
  let nextId = startAt;
  return () => `smith-pattern-${String(nextId++).padStart(3, '0')}`;
}

function textMatchesQuery(text: string, query: string): boolean {
  const lower = text.toLowerCase();
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  return terms.every(term => lower.includes(term));
}

function scoreRelevance(pattern: Pattern, query: string): number {
  const q = query.toLowerCase();
  let score = 0;

  if (pattern.title.toLowerCase().includes(q)) score += 10;
  if (pattern.concept.toLowerCase().includes(q)) score += 8;
  if (pattern.description.toLowerCase().includes(q)) score += 4;
  if (pattern.tags.some(t => t.toLowerCase().includes(q))) score += 6;
  if (pattern.origin.toLowerCase().includes(q)) score += 3;
  if (pattern.pattern.toLowerCase().includes(q)) score += 2;

  return score;
}

function matchesFilter(pattern: Pattern, filter: PatternFilter): boolean {
  if (filter.query && !textMatchesQuery(
    `${pattern.title} ${pattern.description} ${pattern.concept} ${pattern.tags.join(' ')} ${pattern.origin}`,
    filter.query
  )) {
    return false;
  }
  if (filter.category && !pattern.categories.includes(filter.category)) {
    return false;
  }
  if (filter.minQuality !== undefined && pattern.quality < filter.minQuality) {
    return false;
  }
  if (filter.tag && !pattern.tags.includes(filter.tag)) {
    return false;
  }
  if (filter.origin && !pattern.origin.toLowerCase().includes(filter.origin.toLowerCase())) {
    return false;
  }
  if (filter.applicableTo && !pattern.applicableTo.includes(filter.applicableTo)) {
    return false;
  }
  return true;
}

export class InMemoryPatternStore implements PatternStore {
  private patterns: Map<string, Pattern> = new Map();
  private generateId = createIdGenerator();

  listPatterns(filter?: PatternFilter): Pattern[] {
    let results = Array.from(this.patterns.values());

    if (filter) {
      results = results.filter(p => matchesFilter(p, filter));

      if (filter.sortBy) {
        const key = filter.sortBy;
        const order = filter.sortOrder === 'desc' ? -1 : 1;
        results.sort((a, b) => {
          if (key === 'quality') return (a.quality - b.quality) * order;
          if (key === 'createdAt') return (a.createdAt.localeCompare(b.createdAt)) * order;
          return a.title.localeCompare(b.title) * order;
        });
      }

      if (filter.limit && filter.limit > 0) {
        results = results.slice(0, filter.limit);
      }
    }

    return results;
  }

  getPattern(patternId: string): Pattern | undefined {
    return this.patterns.get(patternId);
  }

  addPattern(data: Omit<Pattern, 'id' | 'createdAt' | 'updatedAt'>): Pattern {
    const now = new Date().toISOString();
    const pattern: Pattern = {
      ...data,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
    };
    this.patterns.set(pattern.id, pattern);
    return pattern;
  }

  updatePattern(patternId: string, updates: Partial<Pattern>): Pattern | undefined {
    const existing = this.patterns.get(patternId);
    if (!existing) return undefined;

    const updated: Pattern = {
      ...existing,
      ...updates,
      id: patternId,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    this.patterns.set(patternId, updated);
    return updated;
  }

  removePattern(patternId: string): boolean {
    return this.patterns.delete(patternId);
  }

  searchPatterns(
    query: string,
    options?: { limit?: number; minQuality?: number }
  ): SearchResult {
    const startTime = Date.now();
    let results = Array.from(this.patterns.values());

    if (options?.minQuality !== undefined) {
      results = results.filter(p => p.quality >= options.minQuality!);
    }

    const scored = results
      .map(p => ({ pattern: p, score: scoreRelevance(p, query) }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    const total = scored.length;
    let patterns = scored.map(item => item.pattern);

    if (options?.limit && options.limit > 0) {
      patterns = patterns.slice(0, options.limit);
    }

    return {
      patterns,
      total,
      searchTimeMs: Date.now() - startTime,
      query,
    };
  }

  count(): number {
    return this.patterns.size;
  }
}

// ---------------------------------------------------------------------------
// Convenience Functions (stateless, using a default store)
// ---------------------------------------------------------------------------

const defaultStore = new InMemoryPatternStore();

/** Buscar padrões por query */
export function searchPatterns(
  query: string,
  options?: { limit?: number; minQuality?: number }
): SearchResult {
  return defaultStore.searchPatterns(query, options);
}

/** Obter padrão por ID */
export function getPattern(patternId: string): Pattern | undefined {
  return defaultStore.getPattern(patternId);
}

/** Listar padrões com filtro */
export function listPatterns(filter?: PatternFilter): Pattern[] {
  return defaultStore.listPatterns(filter);
}

/** Adicionar padrão à biblioteca */
export function addPattern(
  data: Omit<Pattern, 'id' | 'createdAt' | 'updatedAt'>
): Pattern {
  return defaultStore.addPattern(data);
}

/** Atualizar padrão */
export function updatePattern(
  patternId: string,
  updates: Partial<Pattern>
): Pattern | undefined {
  return defaultStore.updatePattern(patternId, updates);
}

/** Remover padrão */
export function removePattern(patternId: string): boolean {
  return defaultStore.removePattern(patternId);
}

/** Contar padrões na biblioteca */
export function countPatterns(): number {
  return defaultStore.count();
}
