import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'cpp-reviewer',
  displayName: 'Cpp Reviewer',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: cpp-reviewer description: Expert C++ code reviewer specializing in memory safety, modern C++ idioms, concurrency, and performance. Use for all C++ code changes. MUST BE USED for C++ projects.`,
  spawnerPrompt: '--- name: cpp-reviewer description: Expert C++ code reviewer specializing in memory safety, modern C++ idioms, concurrency, and performance.',
  includeMessageHistory: true,
}

export default definition
