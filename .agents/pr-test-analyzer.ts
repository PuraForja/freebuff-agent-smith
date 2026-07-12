import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'pr-test-analyzer',
  displayName: 'Pr Test Analyzer',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: pr-test-analyzer description: Review pull request test coverage quality and completeness, with emphasis on behavioral coverage and real bug prevention.`,
  spawnerPrompt: '--- name: pr-test-analyzer description: Review pull request test coverage quality and completeness, with emphasis on behavioral coverage and real bug prevention.',
  includeMessageHistory: true,
}

export default definition
