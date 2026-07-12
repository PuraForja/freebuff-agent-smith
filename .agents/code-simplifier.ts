import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'code-simplifier',
  displayName: 'Code Simplifier',
  model: 'deepseek/deepseek-v4-flash',
  toolNames: ["read_files", "code_search", "set_output", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: code-simplifier description: Simplifies and refines code for clarity, consistency, and maintainability while preserving behavior. Focus on recently modified code unless instructed otherwise.`,
  spawnerPrompt: '--- name: code-simplifier description: Simplifies and refines code for clarity, consistency, and maintainability while preserving behavior.',
  includeMessageHistory: true,
}

export default definition
