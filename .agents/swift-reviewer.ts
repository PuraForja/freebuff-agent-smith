import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'swift-reviewer',
  displayName: 'Swift Reviewer',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: swift-reviewer description: Expert Swift code reviewer specializing in protocol-oriented design, value semantics, ARC memory management, Swift Concurrency, and idiomatic patterns. Use for all Swift code changes. MUST BE USED for Swift projects.`,
  spawnerPrompt: '--- name: swift-reviewer description: Expert Swift code reviewer specializing in protocol-oriented design, value semantics, ARC memory management, Swift Concurrency, and idiomatic patterns.',
  includeMessageHistory: true,
}

export default definition
