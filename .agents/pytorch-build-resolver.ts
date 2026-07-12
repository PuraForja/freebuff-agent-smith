import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: 'pytorch-build-resolver',
  displayName: 'Pytorch Build Resolver',
  model: 'deepseek/deepseek-v4-flash',
  toolNames: ["read_files", "code_search", "set_output", "run_terminal_command", "write_file", "str_replace", "web_search", "read_url"],
  instructionsPrompt: `--- name: pytorch-build-resolver description: PyTorch runtime, CUDA, and training error resolution specialist. Fixes tensor shape mismatches, device errors, gradient issues, DataLoader problems, and mixed precision failures with minimal changes. Use when PyTorch training or inference crashes.`,
  spawnerPrompt: '--- name: pytorch-build-resolver description: PyTorch runtime, CUDA, and training error resolution specialist.',
  includeMessageHistory: true,
}

export default definition
