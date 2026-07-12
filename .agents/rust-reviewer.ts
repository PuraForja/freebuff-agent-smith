import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'rust-reviewer',
  displayName: 'Rust Reviewer',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: rust-reviewer description: Expert Rust code reviewer specializing in ownership, lifetimes, error handling, unsafe usage, and idiomatic patterns. Use for all Rust code changes. MUST BE USED for Rust projects.`,
  spawnerPrompt: '--- name: rust-reviewer description: Expert Rust code reviewer specializing in ownership, lifetimes, error handling, unsafe usage, and idiomatic patterns.',
  includeMessageHistory: true,
}

export default definition
