import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'opensource-packager',
  displayName: 'Opensource Packager',
  model: 'deepseek/deepseek-v4-flash',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: opensource-packager description: Generate complete open-source packaging for a sanitized project. Produces CLAUDE.md, setup.sh, README.md, LICENSE, CONTRIBUTING.md, and GitHub issue templates. Makes any repo immediately usable with Claude Code. Third stage of the opensource-pipeline skill.`,
  spawnerPrompt: '--- name: opensource-packager description: Generate complete open-source packaging for a sanitized project.',
  includeMessageHistory: true,
}

export default definition
