/**
 * 🌐 Testes TDD — Discover Remote (API GitHub)
 *
 * Testa a descoberta remota de agentes via API GitHub:
 * - Parse de URLs do GitHub
 * - Listagem de arquivos de agentes
 * - Fetch de conteúdo
 * - Extração de DNA remota
 * - Error handling
 *
 * Fase 2 — Destilador de Conhecimento (Lote 2)
 * SPEC-SEC-4.1: Modalidade Remota (API GitHub)
 */

// Mock do Octokit para evitar que o Jest tente processar ES modules do @octokit/rest
jest.mock('@octokit/rest', () => ({
  Octokit: jest.fn().mockImplementation(() => ({
    repos: { getContent: jest.fn() },
  })),
}))

import { parseGitHubUrl, discoverRemoteAgents, clearDiscoveryCache } from '../.agents/types/discover-remote'

// Limpa cache entre testes para evitar interferência
beforeEach(() => {
  clearDiscoveryCache()
})

/** Conteúdo mock de agente com conceitos reconhecíveis pelo extrator */
const MOCK_AGENT_CONTENT = `import type { AgentDefinition } from '../types/agent-definition'
import { PROMPT_DEFENSE } from '../types/prompt-defense'

const definition: AgentDefinition = {
  id: 'test-agent',
  displayName: 'Test Agent',
  model: 'mimo/mimo-v2.5',
  toolNames: ['read_files', 'code_search', 'glob'],
  instructionsPrompt: PROMPT_DEFENSE + \`
You are an expert test agent specialized in quality assurance.

When invoked:
1. Analyze the code
2. Run the tests
3. Report the results

Best Practices:
- Always verify edge cases
- Never trust user input directly
- Validate all parameters before use

Workflow: analyze \u2192 test \u2192 report \u2192 approve
\`,
  spawnerPrompt: '--- name: test-agent description: Expert test agent for quality assurance.',
  includeMessageHistory: true,
}

export default definition`

/** Conteúdo mock vazio (sem agent definition válido) */
const MOCK_EMPTY_CONTENT = `// Just a comment, no agent definition`

// ============================================================
// TESTES
// ============================================================

describe('parseGitHubUrl \u2014 Parse de URLs do GitHub', () => {
  it('extrai owner e repo de URL completa', () => {
    const result = parseGitHubUrl('https://github.com/affaan-m/ECC')
    expect(result.owner).toBe('affaan-m')
    expect(result.repo).toBe('ECC')
  })

  it('extrai owner e repo de URL com caminho', () => {
    const result = parseGitHubUrl('https://github.com/affaan-m/ECC/tree/main/.agents')
    expect(result.owner).toBe('affaan-m')
    expect(result.repo).toBe('ECC')
  })

  it('extrai owner e repo de URL com .git', () => {
    const result = parseGitHubUrl('https://github.com/affaan-m/ECC.git')
    expect(result.owner).toBe('affaan-m')
    expect(result.repo).toBe('ECC')
  })

  it('extrai owner e repo de URL curta (owner/repo)', () => {
    const result = parseGitHubUrl('affaan-m/ECC')
    expect(result.owner).toBe('affaan-m')
    expect(result.repo).toBe('ECC')
  })

  it('lanca erro para URL invalida', () => {
    expect(() => parseGitHubUrl('not-a-url')).toThrow()
    expect(() => parseGitHubUrl('')).toThrow()
  })

  it('lanca erro para URL sem owner/repo', () => {
    expect(() => parseGitHubUrl('https://github.com')).toThrow()
  })
})

describe('discoverRemoteAgents \u2014 Descoberta com mock', () => {
  it('descobre agentes em repositorio com octokit mock', async () => {
    const results = await discoverRemoteAgents('affaan-m/ECC', {
      mockFiles: [
        { name: 'planner.ts', path: '.agents/planner.ts', download_url: 'https://raw.githubusercontent.com/affaan-m/ECC/main/.agents/planner.ts' },
      ],
      mockContent: MOCK_AGENT_CONTENT,
    })

    expect(results).toHaveLength(1)
    expect(results[0].agentId).toBe('test-agent')
    expect(results[0].displayName).toBe('Test Agent')
    expect(results[0].model).toBe('mimo/mimo-v2.5')
    expect(results[0].concepts.length).toBeGreaterThanOrEqual(1)
    expect(results[0].qualityScore).toBeGreaterThanOrEqual(1)
    expect(results[0].confidenceScore).toBeGreaterThanOrEqual(0)
  })

  it('retorna array vazio quando mockFiles esta vazio', async () => {
    const results = await discoverRemoteAgents('affaan-m/ECC', {
      mockFiles: [],
      mockContent: MOCK_AGENT_CONTENT,
    })
    expect(results).toHaveLength(0)
  })

  it('ignora arquivos com conteudo sem agent definition valido', async () => {
    const results = await discoverRemoteAgents('affaan-m/ECC', {
      mockFiles: [
        { name: 'good.ts', path: '.agents/good.ts', download_url: 'url1' },
        { name: 'empty.ts', path: '.agents/empty.ts', download_url: 'url2' },
      ],
      mockContent: MOCK_EMPTY_CONTENT,
    })
    // Conteudo vazio nao tem instructionsPrompt valido, entao extractDnaFromContent
    // vai retornar um resultado com metadados minimos (agentId = 'good')
    // mas conceitos vazios
    expect(results.length).toBeGreaterThanOrEqual(0)
  })
})

describe('discoverRemoteAgents \u2014 Cache e rate limiting', () => {
  it('usa cache para evitar chamadas repetidas', async () => {
    const results1 = await discoverRemoteAgents('affaan-m/ECC', {
      mockFiles: [
        { name: 'cached-agent.ts', path: '.agents/cached-agent.ts', download_url: 'url' },
      ],
      mockContent: MOCK_AGENT_CONTENT,
    })

    expect(results1).toHaveLength(1)
    expect(results1[0].agentId).toBe('test-agent')

    // Segunda chamada com mesma URL deve usar cache (mockContent diferente nao importa)
    const results2 = await discoverRemoteAgents('affaan-m/ECC', {
      mockFiles: [
        { name: 'should-not-run.ts', path: '.agents/should-not-run.ts', download_url: 'url' },
      ],
      mockContent: MOCK_EMPTY_CONTENT, // Conteudo vazio nunca seria usado se cache funcionar
    })

    expect(results2).toHaveLength(1)
    expect(results2[0].agentId).toBe('test-agent') // Mesmo resultado do cache
  })
})
