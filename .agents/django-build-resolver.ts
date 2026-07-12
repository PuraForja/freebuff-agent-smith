import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'django-build-resolver',
  displayName: 'Django Build Resolver',
  model: 'deepseek/deepseek-v4-flash',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: django-build-resolver description: Django/Python build, migration, and dependency error resolution specialist. Fixes pip/Poetry errors, migration conflicts, import errors, Django configuration issues, and collectstatic failures with minimal changes. Use when Django setup or startup fails.`,
  spawnerPrompt: '--- name: django-build-resolver description: Django/Python build, migration, and dependency error resolution specialist.',
  includeMessageHistory: true,
}

export default definition
