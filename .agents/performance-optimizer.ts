import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'performance-optimizer',
  displayName: 'Performance Optimizer',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: performance-optimizer description: Performance analysis and optimization specialist. Use PROACTIVELY for identifying bottlenecks, optimizing slow code, reducing bundle sizes, and improving runtime performance. Profiling, memory leaks, render optimization, and algorithmic improvements.`,
  spawnerPrompt: '--- name: performance-optimizer description: Performance analysis and optimization specialist.',
  includeMessageHistory: true,
}

export default definition
