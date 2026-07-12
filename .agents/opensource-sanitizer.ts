import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'opensource-sanitizer',
  displayName: 'Opensource Sanitizer',
  model: 'deepseek/deepseek-v4-flash',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: opensource-sanitizer description: Verify an open-source fork is fully sanitized before release. Scans for leaked secrets, PII, internal references, and dangerous files using 20+ regex patterns. Generates a PASS/FAIL/PASS-WITH-WARNINGS report. Second stage of the opensource-pipeline skill. Use PROACTIVELY before any public release.`,
  spawnerPrompt: '--- name: opensource-sanitizer description: Verify an open-source fork is fully sanitized before release.',
  includeMessageHistory: true,
}

export default definition
