# Agents Overview

This document provides an overview of the agent system in Codebuff/Freebuff.

## What are Agents?

Agents are specialized AI assistants that can:
- Read and analyze code files
- Execute terminal commands
- Coordinate with other agents
- Perform complex workflows

## Agent Architecture

```
┌─────────────────────────────────────────────────────┐
│                    User Request                      │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│              Agent Selection (spawnerPrompt)         │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│              Agent Execution                         │
│  ┌─────────────────────────────────────────────┐    │
│  │  LLM Processing (instructionsPrompt)        │    │
│  └─────────────────────────────────────────────┘    │
│                      │                               │
│                      ▼                               │
│  ┌─────────────────────────────────────────────┐    │
│  │  Tool Execution (toolNames)                  │    │
│  │  - read_files                                │    │
│  │  - run_terminal_command                      │    │
│  │  - spawn_agent                               │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

## Agent Types

### 1. LLM-based Agents
- Prompt-driven with creative freedom
- Best for: Code review, documentation, analysis

### 2. Programmatic Agents
- Generator-based workflows
- Best for: Test runners, CI/CD, complex orchestrations

## Key Concepts

### Agent Definition
Each agent is a TypeScript file exporting an `AgentDefinition` object.

### Tools
Agents can use tools to interact with the system:
- `read_files`: Read file contents
- `run_terminal_command`: Execute shell commands
- `spawn_agent`: Coordinate with other agents

### Agent Coordination
- `spawnerPrompt`: When this agent should be spawned automatically
- `spawnableAgents`: Other agents this agent can invoke

## Directory Structure

```
.agents/
├── my-agent.ts           # Your custom agent
├── types/                # TypeScript definitions
│   ├── agent-definition.ts
│   ├── tools.ts
│   └── util-types.ts
└── installed/            # Installed agents
    ├── ecc-agents/
    └── custom/
```

## Reference Links

- [Creating Your First Agent](creating-first-agent.md)
- [Creating New Agents](creating-new-agents.md)
- [Quick Start Guide](quick-start.md)
