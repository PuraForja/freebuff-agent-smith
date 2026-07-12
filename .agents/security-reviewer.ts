import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'security-reviewer',
  displayName: 'Security Reviewer',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: security-reviewer description: Security vulnerability detection and remediation specialist. Use PROACTIVELY after writing code that handles user input, authentication, API endpoints, or sensitive data. Flags secrets, SSRF, injection, unsafe crypto, and OWASP Top 10 vulnerabilities.`,
  spawnerPrompt: '--- name: security-reviewer description: Security vulnerability detection and remediation specialist.',
  includeMessageHistory: true,
}

export default definition
