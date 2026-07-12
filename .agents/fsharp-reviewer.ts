import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'fsharp-reviewer',
  displayName: 'Fsharp Reviewer',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: fsharp-reviewer description: Expert F# code reviewer specializing in functional idioms, type safety, pattern matching, computation expressions, and performance. Use for all F# code changes. MUST BE USED for F# projects.`,
  spawnerPrompt: '--- name: fsharp-reviewer description: Expert F# code reviewer specializing in functional idioms, type safety, pattern matching, computation expressions, and performance.',
  includeMessageHistory: true,
}

export default definition
