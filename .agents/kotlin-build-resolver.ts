import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'kotlin-build-resolver',
  displayName: 'Kotlin Build Resolver',
  model: 'deepseek/deepseek-v4-flash',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: kotlin-build-resolver description: Kotlin/Gradle build, compilation, and dependency error resolution specialist. Fixes build errors, Kotlin compiler errors, and Gradle issues with minimal changes. Use when Kotlin builds fail.`,
  spawnerPrompt: '--- name: kotlin-build-resolver description: Kotlin/Gradle build, compilation, and dependency error resolution specialist.',
  includeMessageHistory: true,
}

export default definition
