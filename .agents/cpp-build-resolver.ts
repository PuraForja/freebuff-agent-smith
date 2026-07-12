import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'cpp-build-resolver',
  displayName: 'Cpp Build Resolver',
  model: 'deepseek/deepseek-v4-flash',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: cpp-build-resolver description: C++ build, CMake, and compilation error resolution specialist. Fixes build errors, linker issues, and template errors with minimal changes. Use when C++ builds fail.`,
  spawnerPrompt: '--- name: cpp-build-resolver description: C++ build, CMake, and compilation error resolution specialist.',
  includeMessageHistory: true,
}

export default definition
