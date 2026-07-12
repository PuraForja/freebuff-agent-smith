import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'rust-build-resolver',
  displayName: 'Rust Build Resolver',
  model: 'deepseek/deepseek-v4-flash',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: rust-build-resolver description: Rust build, compilation, and dependency error resolution specialist. Fixes cargo build errors, borrow checker issues, and Cargo.toml problems with minimal changes. Use when Rust builds fail.`,
  spawnerPrompt: '--- name: rust-build-resolver description: Rust build, compilation, and dependency error resolution specialist.',
  includeMessageHistory: true,
}

export default definition
