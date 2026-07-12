import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'java-reviewer',
  displayName: 'Java Reviewer',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: java-reviewer description: Expert Java code reviewer for Spring Boot and Quarkus projects. Automatically detects the framework and applies the appropriate review rules. Covers layered architecture, JPA/Panache, MongoDB, security, and concurrency. MUST BE USED for all Java code changes.`,
  spawnerPrompt: '--- name: java-reviewer description: Expert Java code reviewer for Spring Boot and Quarkus projects.',
  includeMessageHistory: true,
}

export default definition
