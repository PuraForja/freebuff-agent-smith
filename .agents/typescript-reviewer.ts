import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'typescript-reviewer',
  displayName: 'Typescript Reviewer',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: typescript-reviewer description: Expert TypeScript/JavaScript code reviewer specializing in type safety, async correctness, Node/web security, and idiomatic patterns. Use for all TypeScript and JavaScript code changes. MUST BE USED for TypeScript/JavaScript projects.`,
  spawnerPrompt: '--- name: typescript-reviewer description: Expert TypeScript/JavaScript code reviewer specializing in type safety, async correctness, Node/web security, and idiomatic patterns.',
  includeMessageHistory: true,
}

export default definition
