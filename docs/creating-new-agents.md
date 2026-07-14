# Creating New Agents

This guide covers all the options and patterns for creating agents in Codebuff.

## Agent Definition Structure

```typescript
export default {
  id: 'agent-id',              // Unique identifier
  displayName: 'Agent Name',  // Display name in UI
  model: 'openai/gpt-4o',     // LLM model
  systemPrompt: '...',         // Optional: Override default system prompt
  instructionsPrompt: '...',   // Agent-specific instructions
  toolNames: [...],            // Tools the agent can use
  spawnerPrompt: '...',        // When this agent should be spawned
  spawnableAgents: [...],      // Other agents this agent can spawn
  handleSteps: async function*() { ... }  // Programmatic workflow
}
```

## Two Types of Agents

### 1. LLM-based Agents (Prompt-driven)

Best for tasks requiring creative freedom and natural language understanding.

```typescript
export default {
  id: 'code-reviewer',
  displayName: 'Code Reviewer',
  model: 'openai/gpt-4o',
  toolNames: ['read_files', 'run_terminal_command'],
  instructionsPrompt: `
You are an expert code reviewer. When reviewing code:
1. Read the files using read_files
2. Analyze for bugs, performance, and style issues
3. Provide constructive feedback
  `,
}
```

### 2. Programmatic Agents (Generator-based)

Best for deterministic workflows requiring guaranteed execution order.

```typescript
export default {
  id: 'test-runner',
  displayName: 'Test Runner',
  model: 'openai/gpt-4o',
  toolNames: ['run_terminal_command', 'read_files'],
  instructionsPrompt: 'Run tests and report results',
  async *handleSteps() {
    // Step 1: Run tests
    yield { tool: 'run_terminal_command', command: 'npm test' }
    
    // Step 2: Wait for LLM to analyze results
    yield 'STEP'
    
    // Step 3: If tests failed, read error logs
    yield { tool: 'read_files', paths: ['test-results.log'] }
  }
}
```

## Available Tools

| Tool | Description |
|------|-------------|
| `read_files` | Read file contents |
| `run_terminal_command` | Execute shell commands |
| `end_turn` | End the current turn |
| `spawn_agent` | Spawn another agent |

## Agent Coordination

### Using spawnerPrompt

Tell Codebuff when to automatically spawn your agent:

```typescript
export default {
  id: 'security-scanner',
  spawnerPrompt: 'When the user mentions security, vulnerabilities, or asks to scan for issues',
  // ...
}
```

### Spawning Other Agents

```typescript
export default {
  spawnableAgents: ['codebuff/reviewer', 'codebuff/basher'],
  async *handleSteps() {
    // Spawn a code review
    yield { tool: 'spawn_agent', agentId: 'codebuff/reviewer', prompt: 'Review this code' }
  }
}
```

## Built-in Agents

| Agent | Purpose |
|-------|---------|
| `codebuff/base` | Main coding assistant |
| `codebuff/editor` | File modifications |
| `codebuff/reviewer` | Code reviews |
| `codebuff/thinker` | Problem analysis |
| `codebuff/researcher` | Web searches |
| `codebuff/file-picker` | Codebase navigation |
| `codebuff/basher` | Terminal commands |

## Publishing Agents

To share your agent across projects:

1. Create a publisher profile at codebuff.com/publishers/new
2. Add `publisher: 'your-publisher-id'` to your agent definition
3. Run `codebuff publish <agent-id>`

## Reference Links

- [Creating Your First Agent](creating-first-agent.md)
- [Agents Overview](agents-overview.md)
- [Quick Start Guide](quick-start.md)
