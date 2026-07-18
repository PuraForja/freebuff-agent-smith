/**
 * 🌐 Discover Remote — Destilador de Conhecimento (Lote 2)
 *
 * Descobre e analisa agentes em repositórios GitHub remotos via API.
 * Usa @octokit/rest para comunicação com GitHub REST API.
 *
 * Duas modalidades:
 *   - Produção: Octokit real (requer GITHUB_TOKEN)
 *   - Teste: Mock de arquivos para testes unitários
 *
 * Fase 2 — Destilador de Conhecimento
 * SPEC-SEC-4.1: Dois modos de integração (remoto + local)
 * SPEC-SEC-4.2: Cache para evitar rate limiting
 */

import { Octokit } from '@octokit/rest'
import { extractDnaFromContent, type DnaExtractionResult } from './extract-dna'

// ============================================================
// TIPOS
// ============================================================

/**
 * RepoIdentifier — Identificador de um repositório GitHub
 */
export interface RepoIdentifier {
  owner: string
  repo: string
}

/**
 * RemoteAgentFile — Arquivo de agente encontrado remotamente
 */
export interface RemoteAgentFile {
  name: string
  path: string
  download_url: string
}

/**
 * DiscoverOptions — Opções para descoberta remota
 * Usado principalmente para injeção de mocks em testes.
 */
export interface DiscoverOptions {
  /** Lista de arquivos mock (para testes) */
  mockFiles?: RemoteAgentFile[]
  /** Conteúdo mock de arquivo (para testes) */
  mockContent?: string
  /** Instância de Octokit personalizada (para testes ou config customizada) */
  octokit?: Octokit
}

// ============================================================
// CONSTANTES
// ============================================================

/** Regex para parse de URLs do GitHub */
const GITHUB_URL_PATTERN = /(?:https:\/\/github\.com\/|git@github\.com:)?([^/]+)\/([^/.]+)(?:\.git)?(?:\/.*)?$/

/** Paths onde agentes costumam ser encontrados em repositórios ECC-like */
const DEFAULT_AGENT_PATHS = ['.agents', 'agents', 'src/agents']

/** Cache simples em memória para evitar chamadas repetidas */
const discoveryCache: Map<string, DnaExtractionResult[]> = new Map()

/** TTL do cache em milissegundos (5 minutos) */
const CACHE_TTL = 5 * 60 * 1000
const cacheTimestamps: Map<string, number> = new Map()

// ============================================================
// FUNÇÕES PÚBLICAS
// ============================================================

/**
 * Parseia uma URL do GitHub e extrai owner e repo.
 *
 * @param url - URL do GitHub (ex: "https://github.com/affaan-m/ECC" ou "affaan-m/ECC")
 * @returns RepoIdentifier com owner e repo
 * @throws Se a URL for inválida ou não contiver owner/repo
 *
 * @example
 * parseGitHubUrl('https://github.com/affaan-m/ECC')
 * // => { owner: 'affaan-m', repo: 'ECC' }
 */
export function parseGitHubUrl(url: string): RepoIdentifier {
  if (!url || url.trim().length === 0) {
    throw new Error('URL do GitHub não pode estar vazia')
  }

  const trimmed = url.trim()
  const match = trimmed.match(GITHUB_URL_PATTERN)

  if (!match) {
    throw new Error(`URL do GitHub inválida: "${url}". Use o formato "https://github.com/owner/repo" ou "owner/repo"`)
  }

  return {
    owner: match[1],
    repo: match[2],
  }
}

/**
 * Descobre agentes em um repositório GitHub remoto.
 *
 * Para testes, passe mockFiles e mockContent no options.
 * Para produção, chama a API GitHub real via Octokit.
 * Usa cache em memória para evitar rate limiting.
 *
 * @param repoUrl - URL do repositório (ex: "affaan-m/ECC" ou URL completa)
 * @param options - Opções de descoberta (mock, octokit personalizado)
 * @returns Array de resultados de extração de DNA
 *
 * @example
 * // Com mock (testes):
 * const results = await discoverRemoteAgents('affaan-m/ECC', {
 *   mockFiles: [{ name: 'planner.ts', path: '.agents/planner.ts', download_url: '...' }],
 *   mockContent: '...agent file content...'
 * })
 *
 * // Produção (requer GITHUB_TOKEN):
 * const results = await discoverRemoteAgents('affaan-m/ECC')
 */
export async function discoverRemoteAgents(
  repoUrl: string,
  options: DiscoverOptions = {}
): Promise<DnaExtractionResult[]> {
  const repo = parseGitHubUrl(repoUrl)
  const cacheKey = `${repo.owner}/${repo.repo}`

  // Verificar cache
  const cached = getFromCache(cacheKey)
  if (cached) return cached

  try {
    const results = options.mockFiles
      ? await discoverWithMock(repo, options)
      : await discoverWithOctokit(repo, options.octokit)

    // Salvar no cache
    setCache(cacheKey, results)
    return results
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Falha ao descobrir agentes em ${repo.owner}/${repo.repo}: ${message}`)
  }
}

/**
 * Limpa o cache de descobertas.
 * Útil para testes ou para forçar rediscovery.
 */
export function clearDiscoveryCache(): void {
  discoveryCache.clear()
  cacheTimestamps.clear()
}

// ============================================================
// FUNÇÕES INTERNAS
// ============================================================

/**
 * Descobre agentes usando dados mock (para testes)
 */
async function discoverWithMock(
  repo: RepoIdentifier,
  options: DiscoverOptions
): Promise<DnaExtractionResult[]> {
  const files = options.mockFiles ?? []
  if (files.length === 0) return []

  const results: DnaExtractionResult[] = []

  for (const file of files) {
    try {
      if (!options.mockContent) continue

      const content = options.mockContent
      if (!content || content.length < 50) continue

      const agentId = file.name.replace('.ts', '')
      const dna = extractDnaFromContent(agentId, content)
      // Sobrescrever sourceRepo com o repositório real
      dna.sourceRepo = `${repo.owner}/${repo.repo}`
      results.push(dna)
    } catch {
      // Ignora erros em arquivos individuais
      continue
    }
  }

  return results
}

/**
 * Descobre agentes usando Octokit real (produção)
 */
async function discoverWithOctokit(
  repo: RepoIdentifier,
  octokitInstance?: Octokit
): Promise<DnaExtractionResult[]> {
  const octokit = octokitInstance ?? createOctokit()
  const results: DnaExtractionResult[] = []
  const processedFiles: Set<string> = new Set()

  // Percorrer paths comuns de agentes
  for (const agentPath of DEFAULT_AGENT_PATHS) {
    try {
      const files = await listDirectoryFiles(octokit, repo, agentPath)
      if (files.length === 0) continue

      for (const file of files) {
        // Evitar processar o mesmo arquivo duas vezes
        if (processedFiles.has(file.path)) continue
        processedFiles.add(file.path)

        try {
          const content = await fetchFileContent(octokit, repo, file.path)
          if (!content) continue

          const agentId = file.name.replace('.ts', '')
          const dna = extractDnaFromContent(agentId, content)
          dna.sourceRepo = `${repo.owner}/${repo.repo}`
          results.push(dna)
        } catch {
          // Ignora erros em arquivos individuais
          continue
        }
      }
    } catch {
      // Path não encontrado (não tem agents nesse diretório)
      continue
    }
  }

  return results
}

/**
 * Lista arquivos .ts em um diretório do GitHub
 */
async function listDirectoryFiles(
  octokit: Octokit,
  repo: RepoIdentifier,
  path: string
): Promise<RemoteAgentFile[]> {
  const response = await octokit.repos.getContent({
    owner: repo.owner,
    repo: repo.repo,
    path,
  })

  // Se for um arquivo único, retorna array com ele
  if (!Array.isArray(response.data)) {
    return []
  }

  return response.data
    .filter((item): item is RemoteAgentFile & { type: 'file' } => {
      return item.type === 'file' && item.name.endsWith('.ts') && 'download_url' in item && typeof item.download_url === 'string'
    })
    .map(item => ({
      name: item.name,
      path: item.path,
      download_url: item.download_url as string,
    }))
}

/**
 * Busca o conteúdo de um arquivo do GitHub
 */
async function fetchFileContent(
  octokit: Octokit,
  repo: RepoIdentifier,
  path: string
): Promise<string | null> {
  const response = await octokit.repos.getContent({
    owner: repo.owner,
    repo: repo.repo,
    path,
  })

  if (Array.isArray(response.data)) return null

  const data = response.data as { type?: string; content?: string; encoding?: string }
  if (data.type === 'file' && data.content && data.encoding === 'base64') {
    return Buffer.from(data.content, 'base64').toString('utf-8')
  }

  return null
}

/**
 * Cria uma instância do Octokit com configuração padrão
 */
function createOctokit(): Octokit {
  const token = process.env.GITHUB_TOKEN || process.env.SMITH_GITHUB_TOKEN
  return new Octokit({
    auth: token,
    ...(token ? {} : {
      // Sem token, algumas operações podem ser limitadas
      // mas leitura de repositórios públicos funciona sem auth
    }),
  })
}

// ============================================================
// CACHE
// ============================================================

function getFromCache(key: string): DnaExtractionResult[] | null {
  const cached = discoveryCache.get(key)
  const timestamp = cacheTimestamps.get(key)
  if (!cached || !timestamp) return null

  const age = Date.now() - timestamp
  if (age > CACHE_TTL) {
    discoveryCache.delete(key)
    cacheTimestamps.delete(key)
    return null
  }

  return cached
}

function setCache(key: string, results: DnaExtractionResult[]): void {
  discoveryCache.set(key, results)
  cacheTimestamps.set(key, Date.now())
}
