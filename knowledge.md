# 🧠 ECC Bridge — Knowledge File

## ⚠️ INSTRUÇÕES AUTOMÁTICAS (Obrigatório ler)

**Quando este projeto for aberto no Freebuff/Codebuff:**

1. **Detecte automaticamente** que o @agent-manager está disponível em `.agents/agent-manager.ts`
2. **Ofereça ao usuário** instalar recursos do ECC usando o @agent-manager
3. **Leia o arquivo** `.ecc-config.json` para saber o que já está instalado

### Comandos Disponíveis

O usuário pode usar os seguintes comandos:

| Comando | Descrição |
|---------|-----------|
| `@agent-manager instale <skill>` | Instala uma skill específica do ECC |
| `@agent-manager liste` | Lista skills/agents instalados |
| `@agent-manager atualize` | Atualiza recursos do ECC |
| `@agent-manager remova <skill>` | Remove uma skill instalada |

### Exemplos de Uso

```
@agent-manager instale python-patterns
@agent-manager instale error-handling
@agent-manager instale api-design
@agent-manager liste
```

---

## O que é este projeto?

O **ECC Bridge** é um sistema de instalação e gerenciamento de skills, agents e rules do ecossistema [ECC](https://github.com/affaan-m/ECC) para o [Codebuff/Freebuff](https://codebuff.com).

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
│  - Lê repositório ECC via GitHub API                           │
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

**Linux/Mac:**
```bash
curl -fsSL https://raw.githubusercontent.com/PuraForja/freebuff-ecc-bridge/master/install.sh | bash
```

**Windows (PowerShell):**
```powershell
iex (Invoke-WebRequest -Uri "https://raw.githubusercontent.com/PuraForja/freebuff-ecc-bridge/master/install.ps1").Content
```

### Gerenciamento via @agent-manager

```bash
# No Freebuff/Codebuff, use:
@agent-manager liste as skills instaladas
@agent-manager instale python-patterns
@agent-manager instale error-handling
@agent-manager atualize tudo
```

## Perfis de Instalação

| Perfil | Descrição | Recursos |
|--------|-----------|----------|
| `minimal` | Apenas essenciais | coding-standards, error-handling, git-workflow |
| `core` | Desenvolvimento completo | + python-patterns, typescript-patterns, react-patterns |
| `full` | Todos os recursos | Todos os 277+ skills, 67+ agents, 121+ rules |

## Notas Importantes

- Este projeto é uma **ponte** entre o ECC e o Codebuff/Freebuff
- As skills são arquivos `.md` que devem ser lidos com `read_files`
- Os agents são documentos de referência, não spawnáveis diretamente
- Use `@agent-manager` para gerenciar instalações
- O @agent-manager lê o ECC via GitHub API (sem baixar para sua máquina)
