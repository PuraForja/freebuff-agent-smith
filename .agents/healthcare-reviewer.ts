import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'healthcare-reviewer',
  displayName: 'Healthcare Reviewer',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: healthcare-reviewer description: Reviews healthcare application code for clinical safety, CDSS accuracy, PHI compliance, and medical data integrity. Specialized for EMR/EHR, clinical decision support, and health information systems.`,
  spawnerPrompt: '--- name: healthcare-reviewer description: Reviews healthcare application code for clinical safety, CDSS accuracy, PHI compliance, and medical data integrity.',
  includeMessageHistory: true,
}

export default definition
