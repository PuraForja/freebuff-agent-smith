import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'harmonyos-app-resolver',
  displayName: 'Harmonyos App Resolver',
  model: 'deepseek/deepseek-v4-flash',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: harmonyos-app-resolver description: HarmonyOS application development expert specializing in ArkTS and ArkUI. Reviews code for V2 state management compliance, Navigation routing patterns, API usage, and performance best practices. Use for HarmonyOS/OpenHarmony projects.`,
  spawnerPrompt: '--- name: harmonyos-app-resolver description: HarmonyOS application development expert specializing in ArkTS and ArkUI.',
  includeMessageHistory: true,
}

export default definition
