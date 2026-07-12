import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'code-architect',
  displayName: 'Code Architect',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: code-architect description: Designs feature architectures by analyzing existing codebase patterns and conventions, then providing implementation blueprints with concrete files, interfaces, data flow, and build order.`,
  spawnerPrompt: '--- name: code-architect description: Designs feature architectures by analyzing existing codebase patterns and conventions, then providing implementation blueprints with concrete files, interfaces, data flow, and build order.',
  includeMessageHistory: true,
}

export default definition
