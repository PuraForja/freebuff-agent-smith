import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'go-reviewer',
  displayName: 'Go Reviewer',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: go-reviewer description: Expert Go code reviewer specializing in idiomatic Go, concurrency patterns, error handling, and performance. Use for all Go code changes. MUST BE USED for Go projects.`,
  spawnerPrompt: '--- name: go-reviewer description: Expert Go code reviewer specializing in idiomatic Go, concurrency patterns, error handling, and performance.',
  includeMessageHistory: true,
}

export default definition
