import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'mle-reviewer',
  displayName: 'Mle Reviewer',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: mle-reviewer description: Production machine-learning engineering reviewer for data contracts, feature pipelines, training reproducibility, offline/online evaluation, model serving, monitoring, and rollback. Use when ML, MLOps, model training, inference, feature store, or evaluation code changes.`,
  spawnerPrompt: '--- name: mle-reviewer description: Production machine-learning engineering reviewer for data contracts, feature pipelines, training reproducibility, offline/online evaluation, model serving, monitoring, and rollback.',
  includeMessageHistory: true,
}

export default definition
