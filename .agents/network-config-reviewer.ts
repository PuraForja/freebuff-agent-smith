import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'network-config-reviewer',
  displayName: 'Network Config Reviewer',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: network-config-reviewer description: Reviews router and switch configurations for security, correctness, stale references, risky change-window commands, and missing operational guardrails.`,
  spawnerPrompt: '--- name: network-config-reviewer description: Reviews router and switch configurations for security, correctness, stale references, risky change-window commands, and missing operational guardrails.',
  includeMessageHistory: true,
}

export default definition
