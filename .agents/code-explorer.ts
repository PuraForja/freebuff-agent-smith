import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'code-explorer',
  displayName: 'Code Explorer',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: code-explorer description: Deeply analyzes existing codebase features by tracing execution paths, mapping architecture layers, and documenting dependencies to inform new development.`,
  spawnerPrompt: '--- name: code-explorer description: Deeply analyzes existing codebase features by tracing execution paths, mapping architecture layers, and documenting dependencies to inform new development.',
  includeMessageHistory: true,
}

export default definition
