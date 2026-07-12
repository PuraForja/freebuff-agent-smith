import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'flutter-reviewer',
  displayName: 'Flutter Reviewer',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: flutter-reviewer description: Flutter and Dart code reviewer. Reviews Flutter code for widget best practices, state management patterns, Dart idioms, performance pitfalls, accessibility, and clean architecture violations. Library-agnostic — works with any state management solution and tooling.`,
  spawnerPrompt: '--- name: flutter-reviewer description: Flutter and Dart code reviewer.',
  includeMessageHistory: true,
}

export default definition
