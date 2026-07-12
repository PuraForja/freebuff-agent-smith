import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'docs-lookup',
  displayName: 'Docs Lookup',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: docs-lookup description: When the user asks how to use a library, framework, or API or needs up-to-date code examples, use Context7 MCP to fetch current documentation and return answers with examples. Invoke for docs/API/setup questions.`,
  spawnerPrompt: '--- name: docs-lookup description: When the user asks how to use a library, framework, or API or needs up-to-date code examples, use Context7 MCP to fetch current documentation and return answers with examples.',
  includeMessageHistory: true,
}

export default definition
