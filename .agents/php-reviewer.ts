import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'php-reviewer',
  displayName: 'Php Reviewer',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: php-reviewer description: Expert PHP code reviewer specializing in PSR-12 compliance, PHP type system, Eloquent ORM patterns, security, and performance. Use for all PHP code changes. MUST BE USED for PHP projects.`,
  spawnerPrompt: '--- name: php-reviewer description: Expert PHP code reviewer specializing in PSR-12 compliance, PHP type system, Eloquent ORM patterns, security, and performance.',
  includeMessageHistory: true,
}

export default definition
