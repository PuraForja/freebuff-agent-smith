import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'gan-planner',
  displayName: 'Gan Planner',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: gan-planner description: \"GAN Harness — Planner agent. Expands a one-line prompt into a full product specification with features, sprints, evaluation criteria, and design direction.\"`,
  spawnerPrompt: '--- name: gan-planner description: \"GAN Harness — Planner agent.',
  includeMessageHistory: true,
}

export default definition
