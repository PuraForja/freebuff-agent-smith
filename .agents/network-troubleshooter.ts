import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'network-troubleshooter',
  displayName: 'Network Troubleshooter',
  model: 'deepseek/deepseek-v4-flash',
  toolNames: ["read_files", "code_search", "set_output", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: network-troubleshooter description: Diagnoses network connectivity, routing, DNS, interface, and policy symptoms with a read-only OSI-layer workflow and evidence-backed root cause summary.`,
  spawnerPrompt: '--- name: network-troubleshooter description: Diagnoses network connectivity, routing, DNS, interface, and policy symptoms with a read-only OSI-layer workflow and evidence-backed root cause summary.',
  includeMessageHistory: true,
}

export default definition
