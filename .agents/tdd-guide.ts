import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'tdd-guide',
  displayName: 'Tdd Guide',
  model: 'deepseek/deepseek-v4-flash',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: tdd-guide description: Test-Driven Development specialist enforcing write-tests-first methodology. Use PROACTIVELY when writing new features, fixing bugs, or refactoring code. Ensures 80%+ test coverage.`,
  spawnerPrompt: '--- name: tdd-guide description: Test-Driven Development specialist enforcing write-tests-first methodology.',
  includeMessageHistory: true,
}

export default definition
