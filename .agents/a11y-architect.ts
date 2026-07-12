import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'a11y-architect',
  displayName: 'A11y Architect',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: a11y-architect description: Accessibility Architect specializing in WCAG 2.2 compliance for Web and Native platforms. Use PROACTIVELY when designing UI components, establishing design systems, or auditing code for inclusive user experiences.`,
  spawnerPrompt: '--- name: a11y-architect description: Accessibility Architect specializing in WCAG 2.',
  includeMessageHistory: true,
}

export default definition
