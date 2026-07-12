import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'python-reviewer',
  displayName: 'Python Reviewer',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: python-reviewer description: Expert Python code reviewer specializing in PEP 8 compliance, Pythonic idioms, type hints, security, and performance. Use for all Python code changes. MUST BE USED for Python projects.`,
  spawnerPrompt: '--- name: python-reviewer description: Expert Python code reviewer specializing in PEP 8 compliance, Pythonic idioms, type hints, security, and performance.',
  includeMessageHistory: true,
}

export default definition
