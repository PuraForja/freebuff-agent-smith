import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'silent-failure-hunter',
  displayName: 'Silent Failure Hunter',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: silent-failure-hunter description: Review code for silent failures, swallowed errors, bad fallbacks, and missing error propagation.`,
  spawnerPrompt: '--- name: silent-failure-hunter description: Review code for silent failures, swallowed errors, bad fallbacks, and missing error propagation.',
  includeMessageHistory: true,
}

export default definition
