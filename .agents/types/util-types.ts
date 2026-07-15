// Tipos utilitários para agentes no Codebuff/Freebuff

export interface StepResult {
  tool: string;
  [key: string]: any;
}

export interface AgentContext {
  projectId: string;
  workingDirectory: string;
  config: Record<string, any>;
}

export interface SkillDefinition {
  id: string;
  name: string;
  description: string;
  path: string;
  version?: string;
  dependencies?: string[];
}

export interface RuleDefinition {
  id: string;
  language: string;
  category: string;
  path: string;
  content: string;
}

export interface InstalledResource {
  type: 'skill' | 'agent' | 'rule';
  id: string;
  path: string;
  installedAt: string;
  source: 'ecc' | 'custom';
  version?: string;
}
