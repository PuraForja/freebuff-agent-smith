import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'marketing-agent',
  displayName: 'Marketing Agent',
  model: 'deepseek/deepseek-v4-flash',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: marketing-agent description: Marketing strategist and copywriter for campaign planning, audience research, positioning, copy creation, and content review. Covers landing pages, email sequences, social posts, ad copy, short-form video scripts, and content calendars. Use when the user wants to plan or execute a product launch or marketing campaign.`,
  spawnerPrompt: '--- name: marketing-agent description: Marketing strategist and copywriter for campaign planning, audience research, positioning, copy creation, and content review.',
  includeMessageHistory: true,
}

export default definition
