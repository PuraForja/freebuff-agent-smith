import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'gan-generator',
  displayName: 'Gan Generator',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: gan-generator description: \"GAN Harness — Generator agent. Implements features according to the spec, reads evaluator feedback, and iterates until quality threshold is met.\"`,
  spawnerPrompt: '--- name: gan-generator description: \"GAN Harness — Generator agent.',
  includeMessageHistory: true,
}

export default definition
