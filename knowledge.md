# 🧠 ECC Bridge — Knowledge File

## O que é este projeto?

O **ECC Bridge** (nome temporário) é um sistema de instalação e gerenciamento de skills, agents e rules do ecossistema [ECC](https://github.com/affaan-m/ECC) para o [Codebuff/Freebuff](https://codebuff.com).

## Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│  USUÁRIO                                                        │
│  Executa install.sh ou usa @agent-manager                       │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  @agent-manager (Agente Instalador)                            │
│  - Lê repositório ECC                                           │
│  - Instala skills/agents/rules                                  │
│  - Gerencia atualizações                                        │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  ECC (Repositório Original)                                    │
│  - 277+ skills                                                 │
│  - 67+ agents                                                  │
│  - 121+ rules                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Estrutura de Diretórios

```
.projeto/
├── .agents/
│   ├── agent-manager.ts        ← Agente gerenciador
│   ├── types/
│   │   ├── agent-definition.ts
│   │   ├── tools.ts
│   │   └── util-types.ts
│   └── installed/
│       ├── ecc-skills/         ← Skills do ECC
│       ├── ecc-agents/         ← Agents do ECC
│       ├── ecc-rules/          ← Rules do ECC
│       └── custom/             ← Seus resources personalizados
├── .ecc-config.json            ← Configuração e registro
├── knowledge.md                ← Este arquivo
└── install.sh                  ← Script de instalação
```

## Como Usar

### Instalação Rápida
```bash
curl -fsSL https://raw.githubusercontent.com/PuraForja/NOVO-NOME/main/install.sh | bash
```

### Gerenciamento via @agent-manager
```bash
# No Codebuff/Freebuff, use:
@agent-managerliste as skills instaladas
@agent-managerinstale python-patterns
@agent-manageratualize tudo
```

## Perfis de Instalação

| Perfil | Descrição | Recursos |
|--------|-----------|----------|
| `minimal` | Apenas essenciais | coding-standards, error-handling, git-workflow |
| `core` | Desenvolvimento completo | + python-patterns, typescript-patterns, react-patterns |
| `full` | Todos os recursos | Todos os 277+ skills, 67+ agents, 121+ rules |

## Comandos Úteis

```bash
# Sincronizar com ECC
./scripts/sync-ecc.sh

# Gerar catálogo
./scripts/gerar-catalogo.sh

# Auto-revisão
./scripts/auto-review.sh
```

## Notas Importantes

- Este projeto é uma **ponte** entre o ECC e o Codebuff/Freebuff
- As skills são arquivos `.md` que devem ser lidos com `read_files`
- Os agents são documentos de referência, não spawnáveis diretamente
- Use `@agent-manager` para gerenciar instalações
