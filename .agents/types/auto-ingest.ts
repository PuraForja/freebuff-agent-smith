/**
 * Auto Ingest — Fase 6: Leitura Automática de Repos de Referência
 *
 * Lê repositórios de referência periodicamente e extrai padrões
 * para popular a biblioteca automaticamente.
 *
 * Critérios de seleção (SPEC-SEC-4.4):
 * - ≥ 1000 estrelas (relevância comunitária)
 * - Relacionados a agents AI, padrões de engenharia, arquitetura
 * - Diversidade de linguagens e frameworks
 * - Lista inicial curada de 5-10 repos, configurável
 *
 * @module auto-ingest
 */

import type { Pattern, PatternCategory } from './pattern-library';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Repositório de referência configurado */
export interface ReferenceRepo {
  /** Nome amigável (ex: "ECC") */
  name: string;
  /** URL do GitHub (ex: "https://github.com/affaan-m/ECC") */
  url: string;
  /** Dono do repo (ex: "affaan-m") */
  owner: string;
  /** Nome do repo (ex: "ECC") */
  repo: string;
  /** Estrelas no GitHub (atualizado em runtime via API) */
  stars: number;  // TODO: fetch from GitHub API at runtime, defaults to 0
  /** Categorias de padrões esperadas */
  expectedCategories: PatternCategory[];
  /** Tags associadas ao repo */
  tags: string[];
  /** Último scan bem-sucedido */
  lastScanAt?: string;
  /** Número de padrões extraídos no último scan */
  lastScanPatternsCount?: number;
}

/** Resultado de um scan de repo */
export interface IngestResult {
  /** Repo analisado */
  repo: ReferenceRepo;
  /** Padrões extraídos */
  patternsExtracted: Pattern[];
  /** Erros encontrados */
  errors: string[];
  /** Duração do scan em ms */
  durationMs: number;
  /** Timestamp do scan */
  scannedAt: string;
}

/** Resultado de scan em lote */
export interface BatchIngestResult {
  /** Resultados por repo */
  results: IngestResult[];
  /** Total de padrões extraídos */
  totalPatterns: number;
  /** Total de erros */
  totalErrors: number;
  /** Duração total em ms */
  totalDurationMs: number;
  /** Timestamp do batch */
  batchAt: string;
}

/** Configuração do auto-ingest */
export interface AutoIngestConfig {
  /** Repos de referência */
  referenceRepos: ReferenceRepo[];
  /** Intervalo entre scans (em ms, default: 24h) */
  scanIntervalMs: number;
  /** Limite de padrões por repo por scan */
  maxPatternsPerRepo: number;
  /** Qualidade mínima para aceitar padrão */
  minQualityThreshold: number;
  /** Se deve logar erros detalhadamente */
  verboseLogging: boolean;
}

/** Store de configuração do auto-ingest */
export interface AutoIngestStore {
  /** Obter configuração */
  getConfig(): AutoIngestConfig;
  /** Atualizar configuração */
  updateConfig(updates: Partial<AutoIngestConfig>): AutoIngestConfig;
  /** Obter histórico de ingestão */
  getHistory(): IngestResult[];
  /** Adicionar resultado ao histórico */
  addResult(result: IngestResult): void;
  /** Limpar histórico antigo (manter últimas N entradas) */
  trimHistory(keepCount: number): void;
}

// ---------------------------------------------------------------------------
// Default Reference Repos
// ---------------------------------------------------------------------------

export const DEFAULT_REFERENCE_REPOS: ReferenceRepo[] = [
  {
    name: 'ECC',
    url: 'https://github.com/affaan-m/ECC',
    owner: 'affaan-m',
    repo: 'ECC',
    stars: 0,
    expectedCategories: ['workflow', 'quality', 'architecture'],
    tags: ['agents', 'claude-code', 'typescript'],
  },
  {
    name: 'OpenAI Agents SDK',
    url: 'https://github.com/openai/openai-agents-python',
    owner: 'openai',
    repo: 'openai-agents-python',
    stars: 0,
    expectedCategories: ['workflow', 'architecture', 'communication'],
    tags: ['agents', 'python', 'openai'],
  },
  {
    name: 'LangGraph',
    url: 'https://github.com/langchain-ai/langgraph',
    owner: 'langchain-ai',
    repo: 'langgraph',
    stars: 0,
    expectedCategories: ['workflow', 'architecture', 'data'],
    tags: ['agents', 'graph', 'langchain'],
  },
  {
    name: 'CrewAI',
    url: 'https://github.com/crewAIInc/crewAI',
    owner: 'crewAIInc',
    repo: 'crewAI',
    stars: 0,
    expectedCategories: ['workflow', 'communication', 'quality'],
    tags: ['agents', 'multi-agent', 'python'],
  },
  {
    name: 'AutoGen',
    url: 'https://github.com/microsoft/autogen',
    owner: 'microsoft',
    repo: 'autogen',
    stars: 0,
    expectedCategories: ['workflow', 'communication', 'architecture'],
    tags: ['agents', 'multi-agent', 'microsoft'],
  },
];

export const DEFAULT_AUTO_INGEST_CONFIG: AutoIngestConfig = {
  referenceRepos: DEFAULT_REFERENCE_REPOS,
  scanIntervalMs: 24 * 60 * 60 * 1000, // 24 hours
  maxPatternsPerRepo: 10,
  minQualityThreshold: 0.7,
  verboseLogging: false,
};

// ---------------------------------------------------------------------------
// InMemory Implementation
// ---------------------------------------------------------------------------

export class InMemoryAutoIngestStore implements AutoIngestStore {
  private config: AutoIngestConfig = { ...DEFAULT_AUTO_INGEST_CONFIG };
  private history: IngestResult[] = [];

  getConfig(): AutoIngestConfig {
    return { ...this.config, referenceRepos: [...this.config.referenceRepos] };
  }

  updateConfig(updates: Partial<AutoIngestConfig>): AutoIngestConfig {
    if (updates.referenceRepos) {
      this.config.referenceRepos = [...updates.referenceRepos];
    }
    if (updates.scanIntervalMs !== undefined) {
      this.config.scanIntervalMs = updates.scanIntervalMs;
    }
    if (updates.maxPatternsPerRepo !== undefined) {
      this.config.maxPatternsPerRepo = updates.maxPatternsPerRepo;
    }
    if (updates.minQualityThreshold !== undefined) {
      this.config.minQualityThreshold = updates.minQualityThreshold;
    }
    if (updates.verboseLogging !== undefined) {
      this.config.verboseLogging = updates.verboseLogging;
    }
    return this.getConfig();
  }

  getHistory(): IngestResult[] {
    return [...this.history];
  }

  addResult(result: IngestResult): void {
    this.history.push(result);
  }

  trimHistory(keepCount: number): void {
    if (this.history.length > keepCount) {
      this.history = this.history.slice(-keepCount);
    }
  }
}

// ---------------------------------------------------------------------------
// Ingest Logic (Pure Functions)
// ---------------------------------------------------------------------------

/**
 * Extrai patterns de conteúdo de README de um repo.
 * Usa heurísticas baseadas em headers, listas e código.
 */
export function extractPatternsFromReadme(
  readmeContent: string,
  repo: ReferenceRepo,
  maxPatterns: number
): Pattern[] {
  const patterns: Pattern[] = [];
  const lines = readmeContent.split('\n');
  let currentSection = '';
  let currentContent: string[] = [];

  function processSection() {
    if (!currentSection || currentContent.length === 0) return;

    const title = currentSection.trim();
    const description = currentContent.join('\n').trim();

    if (description.length < 20) return;

    const tags = extractTags(title, description, repo.tags);
    const categories = inferCategories(title, description, repo.expectedCategories);
    const quality = estimateQuality(description, tags);

    if (quality >= 0.5 && patterns.length < maxPatterns) {
      patterns.push({
        id: '',
        title: title.substring(0, 100),
        description: description.substring(0, 500),
        concept: extractConcept(title, description),
        origin: repo.name,
        quality,
        tags,
        categories,
        pattern: extractPatternLine(description),
        applicableTo: inferApplicability(description),
        createdAt: '',
        updatedAt: '',
      });
    }

    currentContent = [];
  }

  for (const line of lines) {
    if (line.startsWith('## ') || line.startsWith('### ')) {
      processSection();
      currentSection = line.replace(/^#+\s*/, '');
    } else if (line.startsWith('# ')) {
      // Skip top-level title
      continue;
    } else {
      currentContent.push(line);
    }
  }
  processSection();

  return patterns;
}

function extractConcept(title: string, description: string): string {
  const words = title.toLowerCase().split(/\s+/);
  const stopWords = new Set(['the', 'a', 'an', 'is', 'are', 'of', 'for', 'in', 'to', 'and', 'or', 'with']);
  const meaningful = words.filter(w => !stopWords.has(w) && w.length > 2);
  return meaningful.slice(0, 5).join(' ') || title.toLowerCase();
}

function extractPatternLine(description: string): string {
  const arrowPatterns = description.match(/[\w\s]+→[\w\s]+/g);
  if (arrowPatterns && arrowPatterns.length > 0) {
    return arrowPatterns[0].trim().substring(0, 200);
  }
  const steps = description.match(/\d+\.\s+.+/g);
  if (steps && steps.length >= 2) {
    return steps.map(s => s.replace(/^\d+\.\s*/, '')).slice(0, 5).join(' → ');
  }
  return description.substring(0, 200);
}

function extractTags(title: string, description: string, baseTags: string[]): string[] {
  const combined = `${title} ${description}`.toLowerCase();
  const tagKeywords = [
    'testing', 'security', 'performance', 'workflow', 'pipeline',
    'review', 'planning', 'architecture', 'communication', 'data',
    'error', 'build', 'deploy', 'monitor', 'cache', 'search',
  ];
  const found = tagKeywords.filter(k => combined.includes(k));
  return [...new Set([...baseTags, ...found])];
}

function inferCategories(
  title: string,
  description: string,
  defaultCategories: PatternCategory[]
): PatternCategory[] {
  const combined = `${title} ${description}`.toLowerCase();
  const categories: PatternCategory[] = [...defaultCategories];

  if (combined.includes('test') || combined.includes('tdd')) {
    if (!categories.includes('testing')) categories.push('testing');
  }
  if (combined.includes('security') || combined.includes('auth')) {
    if (!categories.includes('security')) categories.push('security');
  }
  if (combined.includes('performance') || combined.includes('optim')) {
    if (!categories.includes('performance')) categories.push('performance');
  }

  return categories.slice(0, 5);
}

function estimateQuality(description: string, tags: string[]): number {
  let quality = 0.4;

  // Structural completeness signals
  const hasSteps = description.match(/\d+\.\s+/);
  const hasArrows = description.includes('→') || description.includes('->');
  const hasCodeBlocks = description.includes('```');
  const hasHeaders = description.match(/^#{1,3}\s+/m);
  const hasConcept = description.length > 50;
  const hasRichContent = description.length > 200;

  if (hasSteps) quality += 0.15;      // Numbered steps indicate clear process
  if (hasArrows) quality += 0.10;     // Arrows indicate flow/sequence
  if (hasCodeBlocks) quality += 0.10; // Code examples add concrete value
  if (hasHeaders) quality += 0.05;    // Sub-headers show organization
  if (hasConcept) quality += 0.10;    // Minimum description length
  if (hasRichContent) quality += 0.10; // Detailed explanation
  if (tags.length > 2) quality += 0.05; // Multiple tags = better categorization
  if (tags.length > 4) quality += 0.05;

  return Math.min(quality, 1.0);
}

function inferApplicability(description: string): string[] {
  const applicability: string[] = ['any-framework'];
  const lower = description.toLowerCase();

  if (lower.includes('python') || lower.includes('pip')) applicability.push('python');
  if (lower.includes('typescript') || lower.includes('javascript') || lower.includes('npm')) {
    applicability.push('typescript');
  }
  if (lower.includes('rust') || lower.includes('cargo')) applicability.push('rust');
  if (lower.includes('go ')) applicability.push('go');
  if (lower.includes('java') || lower.includes('maven')) applicability.push('java');

  if (applicability.length === 1) {
    applicability.push('any-language');
  }

  return applicability;
}

/**
 * Valida se um repo de referência atende aos critérios de seleção.
 */
export function validateReferenceRepo(repo: ReferenceRepo): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (!repo.name || repo.name.trim().length === 0) {
    issues.push('Name is required');
  }
  if (!repo.url || !repo.url.startsWith('https://github.com/')) {
    issues.push('URL must be a valid GitHub URL');
  }
  if (!repo.owner || repo.owner.trim().length === 0) {
    issues.push('Owner is required');
  }
  if (!repo.repo || repo.repo.trim().length === 0) {
    issues.push('Repo name is required');
  }
  if (repo.expectedCategories.length === 0) {
    issues.push('At least one expected category is required');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Gera relatório de status do auto-ingest.
 */
export function generateIngestReport(results: IngestResult[]): string {
  const lines: string[] = ['## 📊 Auto-Ingest Report\n'];

  const totalPatterns = results.reduce((sum, r) => sum + r.patternsExtracted.length, 0);
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
  const totalDuration = results.reduce((sum, r) => sum + r.durationMs, 0);

  lines.push(`- **Total de padrões extraídos:** ${totalPatterns}`);
  lines.push(`- **Total de erros:** ${totalErrors}`);
  lines.push(`- **Duração total:** ${(totalDuration / 1000).toFixed(1)}s`);
  lines.push('');

  lines.push('| Repo | Padrões | Erros | Duração |');
  lines.push('|------|:-------:|:-----:|:-------:|');

  for (const result of results) {
    lines.push(
      `| ${result.repo.name} | ${result.patternsExtracted.length} | ${result.errors.length} | ${(result.durationMs / 1000).toFixed(1)}s |`
    );
  }

  if (totalErrors > 0) {
    lines.push('\n### ⚠️ Errors\n');
    for (const result of results) {
      for (const error of result.errors) {
        lines.push(`- **${result.repo.name}:** ${error}`);
      }
    }
  }

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Convenience Functions
// ---------------------------------------------------------------------------

const defaultStore = new InMemoryAutoIngestStore();

/** Obter configuração atual do auto-ingest */
export function getAutoIngestConfig(): AutoIngestConfig {
  return defaultStore.getConfig();
}

/** Atualizar configuração do auto-ingest */
export function updateAutoIngestConfig(
  updates: Partial<AutoIngestConfig>
): AutoIngestConfig {
  return defaultStore.updateConfig(updates);
}

/** Obter histórico de ingestão */
export function getIngestHistory(): IngestResult[] {
  return defaultStore.getHistory();
}

/** Adicionar resultado ao histórico */
export function addIngestResult(result: IngestResult): void {
  defaultStore.addResult(result);
}

/** Validar repo de referência */
export function validateRepo(repo: ReferenceRepo): { valid: boolean; issues: string[] } {
  return validateReferenceRepo(repo);
}

/** Gerar relatório de ingestão */
export function reportIngest(results: IngestResult[]): string {
  return generateIngestReport(results);
}
