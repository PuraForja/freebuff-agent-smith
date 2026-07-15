# Creating Your First Agent

This guide walks you through creating your first custom agent in Codebuff.

## Prerequisites

1. Install Codebuff: `npm install -g codebuff`
2. Initialize your project: `codebuff` then run `/init`

## Step 1: Create the Agent File

Create a new file in `.agents/` directory:

```typescript
// .agents/my-first-agent.ts
export default {
  id: 'my-first-agent',
  displayName: 'My First Agent',
  model: 'openai/gpt-4o',
  toolNames: ['read_files', 'run_terminal_command'],
  instructionsPrompt: `
You are a helpful assistant that helps with code tasks.

## Your Responsibilities
- Read and understand code files
- Make suggestions for improvements
- Help with debugging

## How to Use
When the user asks for help, use read_files to examine the relevant code.
  `,
}
```

## Step 2: Test Your Agent

1. Run `codebuff` in your terminal
2. Type `@my-first-agent` followed by your request
3. The agent will use the tools you specified

## Key Fields Explained

| Field | Description |
|-------|-------------|
| `id` | Unique identifier for the agent |
| `displayName` | Name shown in the UI |
| `model` | LLM model to use |
| `toolNames` | Tools the agent can access |
| `instructionsPrompt` | System prompt defining agent behavior |

## Next Steps

- Read the full [Creating New Agents](creating-new-agents.md) guide
- See [Agents Overview](agents-overview.md) for all available options
