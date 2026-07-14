# Quick Start Guide

Get started with Codebuff/Freebuff in minutes.

## Installation

```bash
npm install -g codebuff
```

Or for Freebuff:
```bash
npm install -g freebuff
```

## Initialize Your Project

```bash
cd your-project
codebuff
```

Then run:
```
/init
```

This creates:
- `knowledge.md`: Project context for the AI
- `.agents/types/`: TypeScript definitions for agents

## Using Agents

### Built-in Agents

```
@codebuff/base help me refactor this function
@codebuff/reviewer review this pull request
@codebuff/basher run the tests
```

### Custom Agents

```
@my-agent do something specific
```

## Creating Your First Agent

1. Create `.agents/my-agent.ts`:

```typescript
export default {
  id: 'my-agent',
  displayName: 'My Agent',
  model: 'openai/gpt-4o',
  toolNames: ['read_files', 'run_terminal_command'],
  instructionsPrompt: 'You are a helpful coding assistant.'
}
```

2. Use it:
```
@my-agent help me with this task
```

## Common Commands

| Command | Description |
|---------|-------------|
| `/init` | Initialize project |
| `@agent` | Invoke a specific agent |
| `/help` | Show available commands |

## Next Steps

- Read [Creating Your First Agent](creating-first-agent.md)
- See [Agents Overview](agents-overview.md)
- Explore [Creating New Agents](creating-new-agents.md)
