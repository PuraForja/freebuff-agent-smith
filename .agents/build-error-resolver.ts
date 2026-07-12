import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'build-error-resolver',
  displayName: 'Build Error Resolver',
  model: 'deepseek/deepseek-v4-flash',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: build-error-resolver description: Build and TypeScript error resolution specialist. Use PROACTIVELY when build fails or type errors occur. Fixes build/type errors only with minimal diffs, no architectural edits. Focuses on getting the build green quickly.`,
  spawnerPrompt: '--- name: build-error-resolver description: Build and TypeScript error resolution specialist.',
  includeMessageHistory: true,
}

export default definition
