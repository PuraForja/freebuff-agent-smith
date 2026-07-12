import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'go-build-resolver',
  displayName: 'Go Build Resolver',
  model: 'deepseek/deepseek-v4-flash',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: go-build-resolver description: Go build, vet, and compilation error resolution specialist. Fixes build errors, go vet issues, and linter warnings with minimal changes. Use when Go builds fail.`,
  spawnerPrompt: '--- name: go-build-resolver description: Go build, vet, and compilation error resolution specialist.',
  includeMessageHistory: true,
}

export default definition
