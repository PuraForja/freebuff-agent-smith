# 🧠 freebuff-agent-smith — Instruções do Projeto

## ⚡ PRE-CHECK (Execute BEFORE any task)

> 🚨 **ATENÇÃO MÁXIMA: Esta regra é OBRIGATÓRIA e deve ser ativada 100% das vezes.**

**ANTES de QUALQUER pedido do usuário, Buffy DEVE:**

1. Verificar se a tarefa corresponde a algum agent ECC
2. Se SIM → Ler o arquivo `.agents/[agent-name].ts` e seguir suas instruções
3. Se NÃO → Proceder normalmente

> **NÃO EXISTE EXCEÇÃO:** Esta regra se aplica a QUALQUER tarefa que tenha um agent ECC correspondente.

> 📖 **Para lista completa de 67 agents, consulte `skills/buffy-ecc-agents.md`**

---

## 📋 Sobre este projeto

Este projeto fornece **agentes TypeScript** e **skills Markdown** derivados do [ECC](https://github.com/affaan-m/ECC) (224k+ ⭐) para uso com [Freebuff](https://freebuff.com).

### Estrutura atual

```
freebuff-agent-smith/
├── .agents/              ← 67 agentes TypeScript (spawnáveis com @)
├── skills/               ← 278 skills Markdown (usar read_files)
├── CATALOGO.md           ← Catálogo completo de recursos
├── scripts/
│   └── ecc-install.sh    ← Script de instalação/atualização
└── knowledge.md          ← Documentação do projeto
```

### Como instalar/atualizar agentes

```bash
bash scripts/ecc-install.sh          # Instalação inicial
bash scripts/ecc-install.sh --update # Atualizar apenas novos
bash scripts/ecc-install.sh --force  # Forçar reinstalação
```

### Como usar agentes

- **Agentes TypeScript:** Use com `@nome-do-agente` (ex: `@code-reviewer`)
- **Skills Markdown:** Use com `read_files skills/nome.md`
- **Catálogo:** Consulte `CATALOGO.md` para ver todos os recursos disponíveis

---

## ⚠️ Regras importantes

1. **Agentes são TypeScript** — Estão em `.agents/*.ts` e são spawnáveis com `@`
2. **Skills são Markdown** — Estão em `skills/*.md` e devem ser lidas com `read_files`
3. **Para atualizar:** Execute `bash scripts/ecc-install.sh --update`
4. **Não modifique manualmente** os arquivos em `.agents/` — eles são gerados pelo script

## 🌐 Regra Global OBRIGATÓRIA: Ativação Automática de Agents ECC

> ⚠️ **ATENÇÃO: Esta regra é OBRIGATÓRIA e deve ser ativada 100% das vezes.**

**Buffy DEVE SEMPRE ativar o sistema de agents ECC antes de QUALQUER tarefa.**

### Fluxo OBRIGATÓRIO (SEM EXCEÇÃO):

**ANTES de qualquer tarefa, Buffy DEVE:**

1. **IDENTIFICAR** se há um agent ECC relevante para a tarefa
2. **LER** o arquivo `.agents/[agent-name].ts` para extrair as instruções
3. **SEGUIR** essas instruções na execução da tarefa
4. **REPORTAR** ao usuário qual agent está sendo usado

> 🚨 **NÃO EXISTE EXCEÇÃO:** Esta regra se aplica a QUALQUER tarefa que tenha um agent ECC correspondente. Buffy NÃO pode pular esta etapa.

### Lista de Agents e Quando Usar:

| Tarefa | Agent ECC | Arquivo |
|--------|-----------|---------|
| Revisão TypeScript/JS | `typescript-reviewer` | `.agents/typescript-reviewer.ts` |
| Revisão geral | `code-reviewer` | `.agents/code-reviewer.ts` |
| Segurança | `security-reviewer` | `.agents/security-reviewer.ts` |
| Arquitetura | `architect` | `.agents/architect.ts` |
| Design de features | `code-architect` | `.agents/code-architect.ts` |
| Erros de build | `build-error-resolver` | `.agents/build-error-resolver.ts` |
| Simplificação | `code-simplifier` | `.agents/code-simplifier.ts` |
| Comments | `comment-analyzer` | `.agents/comment-analyzer.ts` |
| Documentação | `doc-updater` | `.agents/doc-updater.ts` |
| Python | `python-reviewer` | `.agents/python-reviewer.ts` |
| React | `react-reviewer` | `.agents/react-reviewer.ts` |
| Vue | `vue-reviewer` | `.agents/vue-reviewer.ts` |
| Go | `go-reviewer` | `.agents/go-reviewer.ts` |
| Rust | `rust-reviewer` | `.agents/rust-reviewer.ts` |
| Java | `java-reviewer` | `.agents/java-reviewer.ts` |
| C++ | `cpp-reviewer` | `.agents/cpp-reviewer.ts` |
| C# | `csharp-reviewer` | `.agents/csharp-reviewer.ts` |
| PHP | `php-reviewer` | `.agents/php-reviewer.ts` |
| Swift | `swift-reviewer` | `.agents/swift-reviewer.ts` |
| Kotlin | `kotlin-reviewer` | `.agents/kotlin-reviewer.ts` |
| Flutter | `flutter-reviewer` | `.agents/flutter-reviewer.ts` |
| Database | `database-reviewer` | `.agents/database-reviewer.ts` |
| Performance | `performance-optimizer` | `.agents/performance-optimizer.ts` |
| Code exploration | `code-explorer` | `.agents/code-explorer.ts` |
| Agent management | `agent-smith` | `.agents/agent-smith.ts` |
| SEO | `seo-specialist` | `.agents/seo-specialist.ts` |
| Marketing | `marketing-agent` | `.agents/marketing-agent.ts` |
| TDD | `tdd-guide` | `.agents/tdd-guide.ts` |
| Planner | `planner` | `.agents/planner.ts` |
| E2E testing | `e2e-runner` | `.agents/e2e-runner.ts` |

### Como Ler um Agent:

```bash
# Ler o arquivo do agent para extrair instruções
read_files [".agents/[agent-name].ts"]

# Extrair o instructionsPrompt do arquivo
# Seguir as instruções na execução da tarefa
```

### Formato de Comunicação:

**Buffy DEVE informar ao usuário quando estiver usando um agent:**

```
🔧 Usando @[agent-name] para [motivo]

[Instruções extraídas do agent]

[Execução seguindo as instruções]

[Resultado]
```

### Regras Críticas:

1. **NUNCA pular a leitura do agent** — Sempre ler antes de executar
2. **NUNCA ignorar instruções** — Seguir 100% do que o agent recomenda
3. **SEMPRE reportar** — Informar qual agent está sendo usado
4. **SEMPRE ser transparente** — Mostrar o que está fazendo e por quê
