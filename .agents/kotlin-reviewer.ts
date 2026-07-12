import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'kotlin-reviewer',
  displayName: 'Kotlin Reviewer',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: kotlin-reviewer description: Kotlin and Android/KMP code reviewer. Reviews Kotlin code for idiomatic patterns, coroutine safety, Compose best practices, clean architecture violations, and common Android pitfalls.`,
  spawnerPrompt: '--- name: kotlin-reviewer description: Kotlin and Android/KMP code reviewer.',
  includeMessageHistory: true,
}

export default definition
