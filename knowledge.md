# 🧠 Freebuff Agente Smit — Knowledge File

## ⚠️ INSTRUÇÕES AUTOMÁTICAS (Obrigatório ler)

**Quando este projeto for aberto no Freebuff/Codebuff:**

1. **Detecte automaticamente** que o `@agent-smith` está disponível em `.agents/agent-smith.ts`
2. **Ofereça ao usuário** instalar recursos do ECC usando o `@agent-smith`
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

O **Freebuff Agente Smit** é um agente que instala e gerencia skills, agents e rules do [ECC](https://github.com/affaan-m/ECC) (224k+ ⭐) para o [Freebuff](https://freebuff.com) e [Codebuff](https://codebuff.com).

## Como Funciona

```
┌─────────────────────────────────────────────────────────────────┐
│  USUÁRIO                                                        │
│  Executa install.sh ou install.ps1                              │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  @agent-smith (Agente Instalador)                               │
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
.seu-projeto/
├── .agents/
│   ├── agent-smith.ts         ← O agente instalador
│   ├── types/                 ← Tipos TypeScript
│   └── installed/
│       ├── ecc-skills/        ← Skills do ECC
│       ├── ecc-agents/        ← Agents do ECC
│       ├── ecc-rules/         ← Rules do ECC
│       └── custom/            ← Seus resources personalizados
├── .ecc-config.json           ← Configuração e registro
├── knowledge.md               ← Este arquivo
└── .gitignore                 ← Ignora .agents/installed/
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
@agent-smith instale python-patterns
@agent-smith instale error-handling
@agent-smith liste
@agent-smith atualize
```

## Recursos Disponíveis

| Categoria | Quantidade |
|-----------|:----------:|
| 🧠 Skills | 277 |
| 🎯 Agents | 67 |
| 📏 Rules | 121 |
| ⚡ Commands | 92 |
| 🔌 Hooks | 3 |
| 📝 Contexts | 3 |
| **Total** | **563** |

## Notas Importantes

- Este projeto instala e gerencia recursos do ECC para Freebuff/Codebuff
- As skills são arquivos `.md` que devem ser lidos com `read_files`
- Os agents são documentos de referência, não spawnáveis diretamente
- Use `@agent-smith` para gerenciar instalações
- O @agent-smith lê o ECC via GitHub API (sem baixar para sua máquina)

## 📚 Documentação Disponível

O @agent-smith tem acesso à documentação oficial do Codebuff na pasta docs/:

| Arquivo | Descrição |
|---------|----------|
| docs/creating-first-agent.md | Guia para criar seu primeiro agente |
| docs/creating-new-agents.md | Padrões avançados de criação |
| docs/agents-overview.md | Visão geral da arquitetura |
| docs/quick-start.md | Guia de início rápido |

### Como Criar um Novo Agente

Ao usar \`@agent-smith\`, ele:
1. Lê a documentação em docs/
2. Analisa agentes existentes em .agents/
3. Consulta GitHub para inspiração
4. Gera o novo agente seguindo padrões oficiais
5. Instala e registra automaticamente

