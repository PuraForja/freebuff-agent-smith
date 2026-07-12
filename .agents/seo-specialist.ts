import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'seo-specialist',
  displayName: 'Seo Specialist',
  model: 'deepseek/deepseek-v4-flash',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: seo-specialist description: SEO specialist for technical SEO audits, on-page optimization, structured data, Core Web Vitals, and content/keyword mapping. Use for site audits, meta tag reviews, schema markup, sitemap and robots issues, and SEO remediation plans.`,
  spawnerPrompt: '--- name: seo-specialist description: SEO specialist for technical SEO audits, on-page optimization, structured data, Core Web Vitals, and content/keyword mapping.',
  includeMessageHistory: true,
}

export default definition
