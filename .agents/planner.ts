import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'planner',
  displayName: 'Planner',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: planner description: Expert planning specialist for complex features and refactoring. Use PROACTIVELY when users request feature implementation, architectural changes, or complex refactoring. Automatically activated for planning tasks.`,
  spawnerPrompt: '--- name: planner description: Expert planning specialist for complex features and refactoring.',
  includeMessageHistory: true,
}

export default definition
