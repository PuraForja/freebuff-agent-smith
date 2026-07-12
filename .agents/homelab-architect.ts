import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'homelab-architect',
  displayName: 'Homelab Architect',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: homelab-architect description: Designs home and small-lab network plans from hardware inventory, goals, and operator experience level, with safe staged changes and rollback guidance.`,
  spawnerPrompt: '--- name: homelab-architect description: Designs home and small-lab network plans from hardware inventory, goals, and operator experience level, with safe staged changes and rollback guidance.',
  includeMessageHistory: true,
}

export default definition
