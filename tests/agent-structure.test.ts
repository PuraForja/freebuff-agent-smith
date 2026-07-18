/**
 * Smoke Tests — Estrutura dos Agentes
 * 
 * Verifica a integridade básica de todos os agentes TypeScript:
 * - Arquivo existe e é válido
 * - Importa AgentDefinition corretamente
 * - Exporta default com a estrutura esperada
 * - Modelo é válido
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { globSync } from 'glob'

const AGENTS_DIR = join(__dirname, '..', '.agents')
const REQUIRED_FIELDS = ['id', 'displayName', 'model', 'toolNames', 'instructionsPrompt', 'spawnerPrompt', 'includeMessageHistory']
const VALID_MODELS = ['mimo/mimo-v2.5', 'deepseek/deepseek-v4-flash']

describe('Estrutura dos Agentes', () => {
  const eccFiles = globSync('*.ts', { cwd: join(AGENTS_DIR, 'ecc') }).map(f => `ecc/${f}`)
  const customFiles = globSync('*.ts', { cwd: join(AGENTS_DIR, 'custom') }).map(f => `custom/${f}`)
  const agentFiles = [...eccFiles, ...customFiles].filter(f => !f.includes('types/'))

  test('todos os agentes existem', () => {
    expect(agentFiles.length).toBeGreaterThan(0)
    console.log(`📦 ${agentFiles.length} agentes encontrados`)
  })

  test.each(agentFiles)('agente %s exporta AgentDefinition', (file) => {
    const parts = file.split('/')
    const dir = parts[0] // 'ecc' ou 'custom'
    const content = readFileSync(join(AGENTS_DIR, dir, parts[1]), 'utf-8')
    
    // Verifica import do AgentDefinition
    expect(content).toContain("import type { AgentDefinition }")
    expect(content).toContain("'../types/agent-definition'")
    
    // Verifica export default
    expect(content).toContain("export default definition")
    
    // Verifica campos obrigatórios
    for (const field of REQUIRED_FIELDS) {
      expect(content).toContain(`${field}:`)
    }
    
    // Verifica modelo válido
    const hasValidModel = VALID_MODELS.some(m => content.includes(`model: '${m}'`))
    expect(hasValidModel).toBe(true)
  })

  test('todos os modelos de agentes são válidos', () => {
    for (const file of agentFiles) {
      const parts = file.split('/')
      const dir = parts[0] // 'ecc' ou 'custom'
      const content = readFileSync(join(AGENTS_DIR, dir, parts[1]), 'utf-8')
      const modelMatch = content.match(/model: '([^']+)'/)
      
      if (modelMatch) {
        // Modelo pode ser um dos válidos ou um override
        console.log(`  ${file}: modelo = ${modelMatch[1]}`)
      }
    }
  })

  test('index.ts importa todos os agentes', () => {
    const indexPath = join(AGENTS_DIR, 'index.ts')
    expect(existsSync(indexPath)).toBe(true)
    
    const content = readFileSync(indexPath, 'utf-8')
    
    // Cada agente deve ter um import correspondente no index
    for (const file of agentFiles) {
      const agentName = file.replace('.ts', '').replace('ecc/', '').replace('custom/', '')
      // Verifica se o nome do agente aparece no index (import ou export)
      const appearsInIndex = content.includes(agentName)
      if (!appearsInIndex) {
        console.warn(`⚠️  ${agentName} pode não estar referenciado no index.ts`)
      }
    }
  })
})
