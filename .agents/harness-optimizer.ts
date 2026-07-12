import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'harness-optimizer',
  displayName: 'Harness Optimizer',
  model: 'deepseek/deepseek-v4-flash',
  toolNames: ["read_files", "code_search", "set_output", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: harness-optimizer description: Analyze and improve the local agent harness configuration for reliability, cost, and throughput.`,
  spawnerPrompt: '--- name: harness-optimizer description: Analyze and improve the local agent harness configuration for reliability, cost, and throughput.',
  includeMessageHistory: true,
}

export default definition
