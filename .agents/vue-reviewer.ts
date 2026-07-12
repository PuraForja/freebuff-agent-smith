import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'vue-reviewer',
  displayName: 'Vue Reviewer',
  model: 'mimo/mimo-v2.5',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: vue-reviewer description: Expert Vue.js code reviewer specializing in Composition API correctness, reactivity pitfalls, component architecture, template security, and Vue-specific performance. Use for any change touching .vue, .ts/.js files with Vue imports, or Vue ecosystem code (Pinia, Vue Router, Nuxt). MUST BE USED for Vue projects.`,
  spawnerPrompt: '--- name: vue-reviewer description: Expert Vue.',
  includeMessageHistory: true,
}

export default definition
