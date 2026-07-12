import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'chief-of-staff',
  displayName: 'Chief Of Staff',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: chief-of-staff description: Personal communication chief of staff that triages email, Slack, LINE, and Messenger. Classifies messages into 4 tiers (skip/info_only/meeting_info/action_required), generates draft replies, and enforces post-send follow-through via hooks. Use when managing multi-channel communication workflows.`,
  spawnerPrompt: '--- name: chief-of-staff description: Personal communication chief of staff that triages email, Slack, LINE, and Messenger.',
  includeMessageHistory: true,
}

export default definition
