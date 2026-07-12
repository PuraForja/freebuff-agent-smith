import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'swift-build-resolver',
  displayName: 'Swift Build Resolver',
  model: 'deepseek/deepseek-v4-flash',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: swift-build-resolver description: Swift/Xcode build, compilation, and dependency error resolution specialist. Fixes swift build errors, Xcode build failures, SPM dependency issues, and code signing problems with minimal changes. Use when Swift builds fail.`,
  spawnerPrompt: '--- name: swift-build-resolver description: Swift/Xcode build, compilation, and dependency error resolution specialist.',
  includeMessageHistory: true,
}

export default definition
