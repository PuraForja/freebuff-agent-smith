import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'java-build-resolver',
  displayName: 'Java Build Resolver',
  model: 'deepseek/deepseek-v4-flash',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: java-build-resolver description: Java/Maven/Gradle build, compilation, and dependency error resolution specialist. Automatically detects Spring Boot or Quarkus and applies framework-specific fixes. Fixes build errors, Java compiler errors, and Maven/Gradle issues with minimal changes. Use when Java builds fail.`,
  spawnerPrompt: '--- name: java-build-resolver description: Java/Maven/Gradle build, compilation, and dependency error resolution specialist.',
  includeMessageHistory: true,
}

export default definition
