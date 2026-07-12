import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'gan-evaluator',
  displayName: 'Gan Evaluator',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: gan-evaluator description: \"GAN Harness — Evaluator agent. Tests the live running application via Playwright, scores against rubric, and provides actionable feedback to the Generator.\"`,
  spawnerPrompt: '--- name: gan-evaluator description: \"GAN Harness — Evaluator agent.',
  includeMessageHistory: true,
}

export default definition
