import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'architect',
  displayName: 'Architect',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: architect description: Software architecture specialist for system design, scalability, and technical decision-making. Use PROACTIVELY when planning new features, refactoring large systems, or making architectural decisions.`,
  spawnerPrompt: '--- name: architect description: Software architecture specialist for system design, scalability, and technical decision-making.',
  includeMessageHistory: true,
}

export default definition
