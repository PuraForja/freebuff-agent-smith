import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'react-build-resolver',
  displayName: 'React Build Resolver',
  model: 'deepseek/deepseek-v4-flash',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: react-build-resolver description: Diagnose and fix React build failures across Vite, webpack, Next.js, CRA, Parcel, esbuild, and Bun. Handles JSX/TSX compile errors, hydration mismatches, server/client component boundary failures, missing types, and bundler-specific configuration issues with minimal, surgical changes. MUST BE USED when a React build fails.`,
  spawnerPrompt: '--- name: react-build-resolver description: Diagnose and fix React build failures across Vite, webpack, Next.',
  includeMessageHistory: true,
}

export default definition
