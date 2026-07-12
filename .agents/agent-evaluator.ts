import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'agent-evaluator',
  displayName: 'Agent Evaluator',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace"],
  instructionsPrompt: `--- name: agent-evaluator description: Evaluates agent output against 5-axis quality rubric (accuracy, completeness, clarity, actionability, conciseness). Use after any non-trivial task when the user wants a quality assessment, or when the agent-self-evaluation skill is active. Produces structured scorecard with evidence and improvement suggestions.`,
  spawnerPrompt: '--- name: agent-evaluator description: Evaluates agent output against 5-axis quality rubric (accuracy, completeness, clarity, actionability, conciseness).',
  includeMessageHistory: true,
}

export default definition
