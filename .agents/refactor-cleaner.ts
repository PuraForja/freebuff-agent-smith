import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'refactor-cleaner',
  displayName: 'Refactor Cleaner',
  model: 'deepseek/deepseek-v4-flash',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: refactor-cleaner description: Dead code cleanup and consolidation specialist. Use PROACTIVELY for removing unused code, duplicates, and refactoring. Runs analysis tools (knip, depcheck, ts-prune) to identify dead code and safely removes it.`,
  spawnerPrompt: '--- name: refactor-cleaner description: Dead code cleanup and consolidation specialist.',
  includeMessageHistory: true,
}

export default definition
