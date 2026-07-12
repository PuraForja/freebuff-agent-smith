import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'type-design-analyzer',
  displayName: 'Type Design Analyzer',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: type-design-analyzer description: Analyze type design for encapsulation, invariant expression, usefulness, and enforcement.`,
  spawnerPrompt: '--- name: type-design-analyzer description: Analyze type design for encapsulation, invariant expression, usefulness, and enforcement.',
  includeMessageHistory: true,
}

export default definition
