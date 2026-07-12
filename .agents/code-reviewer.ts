import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'code-reviewer',
  displayName: 'Code Reviewer',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: code-reviewer description: Expert code review specialist. Proactively reviews code for quality, security, and maintainability. Use immediately after writing or modifying code. MUST BE USED for all code changes.`,
  spawnerPrompt: '--- name: code-reviewer description: Expert code review specialist.',
  includeMessageHistory: true,
}

export default definition
