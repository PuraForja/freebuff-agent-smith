import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'doc-updater',
  displayName: 'Doc Updater',
  model: 'deepseek/deepseek-v4-flash',
  toolNames: ["read_files", "code_search", "set_output", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: doc-updater description: Documentation and codemap specialist. Use PROACTIVELY for updating codemaps and documentation. Runs /update-codemaps and /update-docs, generates docs/CODEMAPS/*, updates READMEs and guides.`,
  spawnerPrompt: '--- name: doc-updater description: Documentation and codemap specialist.',
  includeMessageHistory: true,
}

export default definition
