import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'django-reviewer',
  displayName: 'Django Reviewer',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: django-reviewer description: Expert Django code reviewer specializing in ORM correctness, DRF patterns, migration safety, security misconfigurations, and production-grade Django practices. Use for all Django code changes. MUST BE USED for Django projects.`,
  spawnerPrompt: '--- name: django-reviewer description: Expert Django code reviewer specializing in ORM correctness, DRF patterns, migration safety, security misconfigurations, and production-grade Django practices.',
  includeMessageHistory: true,
}

export default definition
