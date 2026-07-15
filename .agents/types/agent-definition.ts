// Tipos para definição de agentes no Codebuff/Freebuff

export interface AgentDefinition {
  id: string;
  displayName: string;
  model: string;
  toolNames: string[];
  instructionsPrompt: string;
  handleSteps?: () => AsyncGenerator<any>;
}

export interface AgentConfig {
  id: string;
  displayName: string;
  description?: string;
  model?: string;
  tools?: string[];
  permissions?: string[];
}

export interface InstalledAgent {
  id: string;
  path: string;
  installedAt: string;
  version?: string;
  source: 'ecc' | 'custom';
}
