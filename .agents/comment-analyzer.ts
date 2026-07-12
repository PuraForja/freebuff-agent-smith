import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'comment-analyzer',
  displayName: 'Comment Analyzer',
  model: 'deepseek/deepseek-v4-flash',
  toolNames: ["read_files", "code_search", "set_output", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: comment-analyzer description: Analyze code comments for accuracy, completeness, maintainability, and comment rot risk.`,
  spawnerPrompt: '--- name: comment-analyzer description: Analyze code comments for accuracy, completeness, maintainability, and comment rot risk.',
  includeMessageHistory: true,
}

export default definition
