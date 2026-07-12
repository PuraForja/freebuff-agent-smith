import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'react-reviewer',
  displayName: 'React Reviewer',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: react-reviewer description: Expert React/JSX code reviewer specializing in hook correctness, render performance, server/client component boundaries, accessibility, and React-specific security. Use for any change touching .tsx/.jsx files or React component logic. MUST BE USED for React projects.`,
  spawnerPrompt: '--- name: react-reviewer description: Expert React/JSX code reviewer specializing in hook correctness, render performance, server/client component boundaries, accessibility, and React-specific security.',
  includeMessageHistory: true,
}

export default definition
