import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'database-reviewer',
  displayName: 'Database Reviewer',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: database-reviewer description: PostgreSQL database specialist for query optimization, schema design, security, and performance. Use PROACTIVELY when writing SQL, creating migrations, designing schemas, or troubleshooting database performance. Incorporates Supabase best practices.`,
  spawnerPrompt: '--- name: database-reviewer description: PostgreSQL database specialist for query optimization, schema design, security, and performance.',
  includeMessageHistory: true,
}

export default definition
