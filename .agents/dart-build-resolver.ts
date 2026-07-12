import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'dart-build-resolver',
  displayName: 'Dart Build Resolver',
  model: 'deepseek/deepseek-v4-flash',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: dart-build-resolver description: Dart/Flutter build, analysis, and dependency error resolution specialist. Fixes \`dart analyze\` errors, Flutter compilation failures, pub dependency conflicts, and build_runner issues with minimal, surgical changes. Use when Dart/Flutter builds fail.`,
  spawnerPrompt: '--- name: dart-build-resolver description: Dart/Flutter build, analysis, and dependency error resolution specialist.',
  includeMessageHistory: true,
}

export default definition
