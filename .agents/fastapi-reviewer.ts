import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'fastapi-reviewer',
  displayName: 'Fastapi Reviewer',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: fastapi-reviewer description: Reviews FastAPI applications for async correctness, dependency injection, Pydantic schemas, security, OpenAPI quality, testing, and production readiness.`,
  spawnerPrompt: '--- name: fastapi-reviewer description: Reviews FastAPI applications for async correctness, dependency injection, Pydantic schemas, security, OpenAPI quality, testing, and production readiness.',
  includeMessageHistory: true,
}

export default definition
