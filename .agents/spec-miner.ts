import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'spec-miner',
  displayName: 'Spec Miner',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: spec-miner description: Extracts behavioral specs from existing codebases for OpenSpec. Produces flat Requirement and Invariant blocks with structured metadata (entities, enforced, id, test anchors). Outputs openspec/specs/<capability>/spec.md. Fully self-bootstrapping — no dependency on codebase-onboarding. Use when onboarding a brownfield project to spec-driven development.`,
  spawnerPrompt: '--- name: spec-miner description: Extracts behavioral specs from existing codebases for OpenSpec.',
  includeMessageHistory: true,
}

export default definition
