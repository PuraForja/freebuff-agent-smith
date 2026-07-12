import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'loop-operator',
  displayName: 'Loop Operator',
  model: 'deepseek/deepseek-v4-flash',
  toolNames: ["read_files", "code_search", "set_output", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: loop-operator description: Operate autonomous agent loops, monitor progress, and intervene safely when loops stall.`,
  spawnerPrompt: '--- name: loop-operator description: Operate autonomous agent loops, monitor progress, and intervene safely when loops stall.',
  includeMessageHistory: true,
}

export default definition
