import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'csharp-reviewer',
  displayName: 'Csharp Reviewer',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: csharp-reviewer description: Expert C# code reviewer specializing in .NET conventions, async patterns, security, nullable reference types, and performance. Use for all C# code changes. MUST BE USED for C# projects.`,
  spawnerPrompt: '--- name: csharp-reviewer description: Expert C# code reviewer specializing in .',
  includeMessageHistory: true,
}

export default definition
