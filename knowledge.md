# 🧠 Freebuff Agente Smit — Knowledge File

## ⚠️ INSTRUÇÕES AUTOMÁTICAS (Obrigatório ler)

**Quando este projeto for aberto no Freebuff/Codebuff:**

1. **Detecte automaticamente** que o @agent-smith está disponível em `.agents/agent-smith.ts`
2. **Ofereça ao usuário** instalar recursos do ECC usando o @agent-smith
3. **Leia o arquivo** `.ecc-config.json` para saber o que já está instalado

### Comandos Disponíveis

O usuário pode usar os seguintes comandos:

| Comando | Descrição |
|---------|-----------|
| `@agent-smith instale <skill>` | Instala uma skill específica do ECC |
| `@agent-smith liste` | Lista skills/agents instalados |
| `@agent-smith atualize` | Atualiza recursos do ECC |
| `@agent-smith remova <skill>` | Remove uma skill instalada |

### Exemplos de Uso

```
@agent-smith instale python-patterns
@agent-smith instale error-handling
@agent-smith instale api-design
@agent-smith liste
```

---

## O que é este projeto?

O **Freebuff Agente Smit** é um sistema de instalação e gerenciamento de skills, agents e rules do ecossistema [ECC](https://github.com/affaan-m/ECC) para o [Codebuff/Freebuff](https://codebuff.com).

## Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│  USUÁRIO                                                        │
│  Executa install.sh ou usa @agent-smith                       │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  @agent-smith (Agente Instalador)                            │
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
│   ├── agent-smith.ts        ← Agente gerenciador
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
curl -fsSL https://raw.githubusercontent.com/PuraForja/freebuff-agent-smith/master/install.sh | bash
```

**Windows (PowerShell):**
```powershell
iex (Invoke-WebRequest -Uri "https://raw.githubusercontent.com/PuraForja/freebuff-agent-smith/master/install.ps1").Content
```

### Gerenciamento via @agent-smith

```bash
# No Freebuff/Codebuff, use:
@agent-smith liste as skills instaladas
@agent-smith instale python-patterns
@agent-smith instale error-handling
@agent-smith atualize tudo
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
- Use `@agent-smith` para gerenciar instalações
- O @agent-smith lê o ECC via GitHub API (sem baixar para sua máquina)
