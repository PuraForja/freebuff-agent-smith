// Ferramentas disponíveis para agentes no Codebuff/Freebuff

export type ToolName =
  | 'read_files'
  | 'write_file'
  | 'str_replace'
  | 'run_terminal_command'
  | 'list_directory'
  | 'glob'
  | 'code_search'
  | 'spawn_agents'
  | 'end_turn';

export interface ToolDefinition {
  name: ToolName;
  description: string;
  parameters?: Record<string, any>;
}

export const AVAILABLE_TOOLS: ToolDefinition[] = [
  {
    name: 'read_files',
    description: 'Lê arquivos do sistema de arquivos'
  },
  {
    name: 'write_file',
    description: 'Cria ou sobrescreve um arquivo'
  },
  {
    name: 'str_replace',
    description: 'Substitui strings em um arquivo'
  },
  {
    name: 'run_terminal_command',
    description: 'Executa um comando no terminal'
  },
  {
    name: 'list_directory',
    description: 'Lista arquivos e diretórios'
  },
  {
    name: 'glob',
    description: 'Busca arquivos por padrão glob'
  },
  {
    name: 'code_search',
    description: 'Busca código-fonte por padrão'
  },
  {
    name: 'spawn_agents',
    description: 'Lança agentes especializados'
  },
  {
    name: 'end_turn',
    description: 'Finaliza o turno do agente'
  }
];
