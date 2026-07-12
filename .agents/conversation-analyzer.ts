import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'conversation-analyzer',
  displayName: 'Conversation Analyzer',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: conversation-analyzer description: Use this agent when analyzing conversation transcripts to find behaviors worth preventing with hooks. Triggered by /hookify without arguments.`,
  spawnerPrompt: '--- name: conversation-analyzer description: Use this agent when analyzing conversation transcripts to find behaviors worth preventing with hooks.',
  includeMessageHistory: true,
}

export default definition
