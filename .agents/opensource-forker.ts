import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'opensource-forker',
  displayName: 'Opensource Forker',
  model: 'deepseek/deepseek-v4-flash',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: opensource-forker description: Fork any project for open-sourcing. Copies files, strips secrets and credentials (20+ patterns), replaces internal references with placeholders, generates .env.example, and cleans git history. First stage of the opensource-pipeline skill.`,
  spawnerPrompt: '--- name: opensource-forker description: Fork any project for open-sourcing.',
  includeMessageHistory: true,
}

export default definition
