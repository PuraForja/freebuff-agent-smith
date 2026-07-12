import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'e2e-runner',
  displayName: 'E2e Runner',
  model: 'deepseek/deepseek-v4-flash',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: e2e-runner description: End-to-end testing specialist using Vercel Agent Browser (preferred) with Playwright fallback. Use PROACTIVELY for generating, maintaining, and running E2E tests. Manages test journeys, quarantines flaky tests, uploads artifacts (screenshots, videos, traces), and ensures critical user flows work.`,
  spawnerPrompt: '--- name: e2e-runner description: End-to-end testing specialist using Vercel Agent Browser (preferred) with Playwright fallback.',
  includeMessageHistory: true,
}

export default definition
