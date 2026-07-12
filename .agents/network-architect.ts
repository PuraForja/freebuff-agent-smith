import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'network-architect',
  displayName: 'Network Architect',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: network-architect description: Designs enterprise or multi-site network architecture from requirements, using existing network skills for focused routing, validation, automation, and troubleshooting detail.`,
  spawnerPrompt: '--- name: network-architect description: Designs enterprise or multi-site network architecture from requirements, using existing network skills for focused routing, validation, automation, and troubleshooting detail.',
  includeMessageHistory: true,
}

export default definition
