# 🧠 Skill: buffy-ecc-agents

> **Criado para:** freebuff-ecc-bridge
> **Descrição:** Define como Buffy deve sempre ler e seguir instruções dos agents ECC antes de executar tarefas relevantes.

---

## 📋 Descrição

Este skill documenta o **sistema obrigatório** que Buffy deve seguir para sempre usar os agents ECC de forma proativa e transparente. Buffy NÃO pode executar tarefas relevantes sem antes ler e seguir as instruções do agent correspondente.

---

## 🎯 Regra Principal

**Buffy DEVE sempre ler e seguir as instruções dos agents ECC antes de executar tarefas relevantes.**

---

## 📊 Fluxo Obrigatório (4 Passos)

### Passo 1: IDENTIFICAR

Antes de QUALQUER tarefa, Buffy deve perguntar:

> "Existe um agent ECC que possa auxiliar nesta tarefa?"

**Lista de agents e quando usar:**

| Tarefa | Agent ECC | Arquivo |
|--------|-----------|---------|
| Revisão TypeScript/JavaScript | `typescript-reviewer` | `.agents/typescript-reviewer.ts` |
| Revisão de código geral | `code-reviewer` | `.agents/code-reviewer.ts` |
| Revisão de segurança | `security-reviewer` | `.agents/security-reviewer.ts` |
| Arquitetura de software | `architect` | `.agents/architect.ts` |
| Design de features | `code-architect` | `.agents/code-architect.ts` |
| Erros de build TypeScript | `build-error-resolver` | `.agents/build-error-resolver.ts` |
| Simplificação de código | `code-simplifier` | `.agents/code-simplifier.ts` |
| Análise de comments | `comment-analyzer` | `.agents/comment-analyzer.ts` |
| Documentação | `doc-updater` | `.agents/doc-updater.ts` |
| Python review | `python-reviewer` | `.agents/python-reviewer.ts` |
| React review | `react-reviewer` | `.agents/react-reviewer.ts` |
| Vue review | `vue-reviewer` | `.agents/vue-reviewer.ts` |
| Angular | `angular-developer` | `.agents/angular-developer.ts` |
| Go review | `go-reviewer` | `.agents/go-reviewer.ts` |
| Rust review | `rust-reviewer` | `.agents/rust-reviewer.ts` |
| Java review | `java-reviewer` | `.agents/java-reviewer.ts` |
| C++ review | `cpp-reviewer` | `.agents/cpp-reviewer.ts` |
| C# review | `csharp-reviewer` | `.agents/csharp-reviewer.ts` |
| PHP review | `php-reviewer` | `.agents/php-reviewer.ts` |
| Swift review | `swift-reviewer` | `.agents/swift-reviewer.ts` |
| Kotlin review | `kotlin-reviewer` | `.agents/kotlin-reviewer.ts` |
| Flutter/Dart review | `flutter-reviewer` | `.agents/flutter-reviewer.ts` |
| Database review | `database-reviewer` | `.agents/database-reviewer.ts` |
| Performance optimization | `performance-optimizer` | `.agents/performance-optimizer.ts` |
| Code exploration | `code-explorer` | `.agents/code-explorer.ts` |
| Agent management | `agent-smith` | `.agents/agent-smith.ts` |
| SEO | `seo-specialist` | `.agents/seo-specialist.ts` |
| Marketing | `marketing-agent` | `.agents/marketing-agent.ts` |
| TDD | `tdd-guide` | `.agents/tdd-guide.ts` |
| Planner | `planner` | `.agents/planner.ts` |
| E2E testing | `e2e-runner` | `.agents/e2e-runner.ts` |

---

### Passo 2: LER

Após identificar o agent correto, Buffy deve:

```bash
# Ler o arquivo do agent
read_files [".agents/[agent-name].ts"]

# Extrair o instructionsPrompt
# Este contém todas as instruções do agent
```

**Exemplo:**
```bash
read_files [".agents/code-reviewer.ts"]
```

---

### Passo 3: SEGUIR

Buffy deve aplicar 100% das instruções extraídas na execução da tarefa.

**Regras:**
- ✅ NUNCA pular a leitura do agent
- ✅ NUNCA ignorar instruções
- ✅ SEGUIR todas as diretrizes
- ✅ Aplicar checklists quando fornecidos

---

### Passo 4: REPORTAR

Buffy DEVE informar ao usuário qual agent está sendo usado:

**Formato obrigatório:**
```
🔧 Usando @[agent-name] para [motivo]

[Instruções extraídas do agent]

[Execução seguindo as instruções]

[Resultado]
```

---

## 📝 Exemplos Práticos

### Exemplo 1: Revisão de Código

**Usuário pede:** "Revise este código TypeScript"

**Buffy executa:**
```
🔧 Usando @typescript-reviewer para revisão TypeScript

[Leitura do agent: .agents/typescript-reviewer.ts]

[Instruções extraídas:]
- Type safety
- Async correctness
- Node/web security
- Idiomatic patterns

[Aplicação das instruções no código]

[Resultado da revisão]
```

---

### Exemplo 2: Erro de Build

**Usuário pede:** "Estou com erro de build no TypeScript"

**Buffy executa:**
```
🔧 Usando @build-error-resolver para resolver erro de build

[Leitura do agent: .agents/build-error-resolver.ts]

[Instruções extraídas:]
- Analisar mensagem de erro
- Identificar causa raiz
- Sugerir correção

[Aplicação das instruções]

[Resultado: correção sugerida]
```

---

### Exemplo 3: Arquitetura

**Usuário pede:** "Me ajude a projetar a arquitetura desta feature"

**Buffy executa:**
```
🔧 Usando @architect para design de arquitetura

[Leitura do agent: .agents/architect.ts]

[Instruções extraídas:]
- System design
- Scalability patterns
- Technical decision-making

[Aplicação das instruções]

[Resultado: blueprint da arquitetura]
```

---

## ⚠️ Regras Críticas

### 1. NUNCA Pular a Leitura
```bash
# ❌ ERRADO - Executar sem ler
# "Vou revisar o código..." (sem ler o agent)

# ✅ CORRETO - Sempre ler primeiro
read_files [".agents/code-reviewer.ts"]
# "Agora vou revisar seguindo as instruções..."
```

### 2. NUNCA Ignorar Instruções
```bash
# ❌ ERRADO - Ignorar checklist do agent
# "Vou revisar apenas sintaxe..."

# ✅ CORRETO - Seguir 100% das instruções
# "O agent instrui verificar: type safety, security, maintainability..."
# "Vou verificar TODOS os itens..."
```

### 3. SEMPRE Reportar
```bash
# ❌ ERRADO - Não informar qual agent está usando
# "Revisei o código e encontrei..."

# ✅ CORRETO - Transparência total
# "🔧 Usando @code-reviewer para revisão"
# "Revisei o código seguindo as instruções do agent..."
```

### 4. SEMPRE Ser Transparente
```bash
# ❌ ERRADO - Executar sem mostrar o processo
# "Resultado: ..."

# ✅ CORRETO - Mostrar cada etapa
# "🔧 Usando @security-reviewer"
# "1. Li o agent: .agents/security-reviewer.ts"
# "2. Extraí instruções: checklist de segurança"
# "3. Apliquei no código: verifiquei secrets, input validation..."
# "4. Resultado: ..."
```

---

## 🔄 Quando Usar Cada Agent

### Revisão de Código
| Linguagem | Agent |
|-----------|-------|
| TypeScript/JavaScript | `typescript-reviewer` |
| Python | `python-reviewer` |
| React | `react-reviewer` |
| Vue | `vue-reviewer` |
| Go | `go-reviewer` |
| Rust | `rust-reviewer` |
| Java | `java-reviewer` |
| C++ | `cpp-reviewer` |
| C# | `csharp-reviewer` |
| PHP | `php-reviewer` |
| Swift | `swift-reviewer` |
| Kotlin | `kotlin-reviewer` |
| Flutter | `flutter-reviewer` |

### Arquitetura e Design
| Tarefa | Agent |
|--------|-------|
| Arquitetura geral | `architect` |
| Design de features | `code-architect` |
| Exploração de código | `code-explorer` |
| Refatoração | `refactor-cleaner` |
| Simplificação | `code-simplifier` |

### Qualidade e Segurança
| Tarefa | Agent |
|--------|-------|
| Revisão geral | `code-reviewer` |
| Segurança | `security-reviewer` |
| Comments | `comment-analyzer` |
| Performance | `performance-optimizer` |
| Database | `database-reviewer` |

### Build e Erros
| Tarefa | Agent |
|--------|-------|
| Erros TypeScript | `build-error-resolver` |
| Erros Dart | `dart-build-resolver` |
| Erros Rust | `rust-build-resolver` |
| Erros Go | `go-build-resolver` |
| Erros Java | `java-build-resolver` |
| Erros Python | `django-build-resolver` |
| Erros Kotlin | `kotlin-build-resolver` |
| Erros C++ | `cpp-build-resolver` |
| Erros React | `react-build-resolver` |

### Documentação e Outros
| Tarefa | Agent |
|--------|-------|
| Documentação | `doc-updater` |
| SEO | `seo-specialist` |
| Marketing | `marketing-agent` |
| TDD | `tdd-guide` |
| Planner | `planner` |
| E2E testing | `e2e-runner` |
| Agent management | `agent-smith` |

---

## 📚 Referências

- **Arquivo de instruções do projeto:** `.codebuff/instructions.md`
- **Instruções globais:** `~/.codebuff/.instructions.md`
- **Catálogo completo:** `CATALOGO.md`
- **Agents ECC:** `.agents/*.ts`
- **Skills ECC:** `skills/*.md`

---

## 🎯 Resumo

| Etapa | Ação | Obrigatório? |
|-------|------|:------------:|
| 1. IDENTIFICAR | Verificar se há agent relevante | ✅ SIM |
| 2. LER | Ler arquivo `.agents/[name].ts` | ✅ SIM |
| 3. SEGUIR | Aplicar 100% das instruções | ✅ SIM |
| 4. REPORTAR | Informar qual agent está usando | ✅ SIM |

**Lembrete:** Buffy NÃO pode pular nenhuma etapa. O sistema é OBRIGATÓRIO para todas as tarefas relevantes.
