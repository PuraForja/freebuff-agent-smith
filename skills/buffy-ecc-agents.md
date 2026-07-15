# 🧠 Skill: buffy-ecc-agents

--- name: buffy-ecc-agents description: Define como Buffy deve sempre ler e seguir instruções dos agents ECC antes de executar tarefas relevantes. Use quando Buffy precisar executar qualquer tarefa que possa se beneficiar de agents especializados.

---

## 📋 Descrição

Este skill documenta o **sistema obrigatório** que Buffy deve seguir para sempre usar os agents ECC de forma proativa e transparente. Buffy NÃO pode executar tarefas relevantes sem antes ler e seguir as instruções do agent correspondente.

## When to Activate

- Ao revisar código de qualquer linguagem
- Ao arquitetar soluções ou features
- Ao depurar erros de build ou runtime
- Ao documentar código ou APIs
- Ao implementar segurança
- Ao otimizar performance
- Ao trabalhar com banco de dados
- Qualquer tarefa que tenha um agent ECC especializado

> **Nota:** Este skill lista todos os 67 agents ECC disponíveis. Para referência rápida, consulte `CATALOGO.md`.

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
| Angular | `code-reviewer` | Revisão geral para Angular |
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

### 🔍 Revisão de Código (14 agents)
| Linguagem | Agent | Descrição |
|-----------|-------|-----------|
| TypeScript/JS | `typescript-reviewer` | Type safety, async correctness, security |
| Python | `python-reviewer` | PEP 8, idiomatism, type hints, security |
| React | `react-reviewer` | Hooks, performance, SSR/CSR, a11y |
| Vue | `vue-reviewer` | Composition API, reatividade, segurança |
| Go | `go-reviewer` | Idiomatic Go, concorrência, performance |
| Rust | `rust-reviewer` | Ownership, lifetimes, unsafe, padrões |
| Java | `java-reviewer` | Spring Boot, Quarkus, padrões Java |
| C++ | `cpp-reviewer` | Memory safety, modern C++, concorrência |
| C# | `csharp-reviewer` | .NET, padrões C# |
| PHP | `php-reviewer` | PSR-12, Eloquent, segurança |
| Swift | `swift-reviewer` | Protocol-oriented, ARC, concorrência |
| Kotlin | `kotlin-reviewer` | Android/KMP, coroutines |
| Flutter/Dart | `flutter-reviewer` | Widgets, state management, performance |
| F# | `fsharp-reviewer` | Functional idioms, type safety |

### 🏗️ Arquitetura e Design (5 agents)
| Tarefa | Agent | Descrição |
|--------|-------|-----------|
| Arquitetura geral | `architect` | System design, escalabilidade |
| Design de features | `code-architect` | Blueprints, interfaces, data flow |
| Exploração de código | `code-explorer` | Trace execution paths, mapear arquitetura |
| Refatoração | `refactor-cleaner` | Dead code cleanup, consolidação |
| Simplificação | `code-simplifier` | Clareza, consistência, manutenibilidade |

### 🛡️ Qualidade e Segurança (8 agents)
| Tarefa | Agent | Descrição |
|--------|-------|-----------|
| Revisão geral | `code-reviewer` | Quality, security, maintainability |
| Segurança | `security-reviewer` | OWASP Top 10, vulnerabilidades |
| Comments | `comment-analyzer` | Accuracy, completeness, comment rot |
| Performance | `performance-optimizer` | Análise e otimização |
| Database | `database-reviewer` | PostgreSQL, queries, schema |
| Silent failures | `silent-failure-hunter` | Erros ignorados, fallbacks |
| Type design | `type-design-analyzer` | Encapsulamento, invariantes |
| PR tests | `pr-test-analyzer` | Cobertura de testes em PRs |

### 🔨 Build e Erros (10 agents)
| Tarefa | Agent | Descrição |
|--------|-------|-----------|
| Erros TypeScript | `build-error-resolver` | Build e TS errors |
| Erros Dart/Flutter | `dart-build-resolver` | Dart/Flutter build errors |
| Erros Rust | `rust-build-resolver` | Borrow checker, compilação |
| Erros Go | `go-build-resolver` | Build, vet, compilação |
| Erros Java | `java-build-resolver` | Maven/Gradle errors |
| Erros Python/Django | `django-build-resolver` | Django/Python build errors |
| Erros Kotlin | `kotlin-build-resolver` | Kotlin/Gradle errors |
| Erros C++ | `cpp-build-resolver` | CMake, compilação |
| Erros React | `react-build-resolver` | Vite, webpack, Next.js |
| Erros Swift | `swift-build-resolver` | Xcode, SPM errors |

### 🌐 Frameworks Específicos (6 agents)
| Framework | Agent | Descrição |
|-----------|-------|-----------|
| Django | `django-reviewer` | ORM, DRF, migrations, segurança |
| FastAPI | `fastapi-reviewer` | Async, DI, Pydantic, OpenAPI |
| PyTorch | `pytorch-build-resolver` | Runtime, CUDA, treinamento |
| HarmonyOS | `harmonyos-app-resolver` | ArkTS, ArkUI |
| Healthcare | `healthcare-reviewer` | Clinical safety, CDSS, PHI |
| MLE | `mle-reviewer` | ML pipelines, model serving |

### 🔄 GAN Harness (3 agents)
| Tarefa | Agent | Descrição |
|--------|-------|-----------|
| GAN Evaluator | `gan-evaluator` | Testa app via Playwright |
| GAN Generator | `gan-generator` | Implementa features segundo spec |
| GAN Planner | `gan-planner` | Expande prompts em specs completas |

### 🌐 Network (3 agents)
| Tarefa | Agent | Descrição |
|--------|-------|-----------|
| Network architect | `network-architect` | Enterprise/multi-site networks |
| Network config | `network-config-reviewer` | Router/switch config review |
| Network troubleshoot | `network-troubleshooter` | Diagnóstico OSI-layer |

### 🏠 Homelab (1 agent)
| Tarefa | Agent | Descrição |
|--------|-------|-----------|
| Homelab architect | `homelab-architect` | Home/small-lab network plans |

### 📦 Open Source (3 agents)
| Tarefa | Agent | Descrição |
|--------|-------|-----------|
| Fork | `opensource-forker` | Fork projects para open-sourcing |
| Package | `opensource-packager` | Gerar packaging completo |
| Sanitize | `opensource-sanitizer` | Verificar fork sanitizado |

### 🧪 Testes e Qualidade (3 agents)
| Tarefa | Agent | Descrição |
|--------|-------|-----------|
| TDD | `tdd-guide` | Test-Driven Development |
| E2E testing | `e2e-runner` | End-to-end testing |
| Agent evaluator | `agent-evaluator` | Avalia output de agents |

### 📋 Gestão e Planejamento (5 agents)
| Tarefa | Agent | Descrição |
|--------|-------|-----------|
| Agent management | `agent-smith` | Import/create/manage agents |
| Planner | `planner` | Feature planning, refactoring |
| Chief of staff | `chief-of-staff` | Triage comunicações |
| Loop operator | `loop-operator` | Autonomous agent loops |
| Harness optimizer | `harness-optimizer` | Agent harness config |

### 📝 Documentação e Conteúdo (5 agents)
| Tarefa | Agent | Descrição |
|--------|-------|-----------|
| Documentation | `doc-updater` | Documentation specialist |
| Docs lookup | `docs-lookup` | Fetch docs via Context7 MCP |
| Spec miner | `spec-miner` | Extract behavioral specs |
| SEO | `seo-specialist` | SEO técnico, Core Web Vitals |
| Marketing | `marketing-agent` | Campaign planning, copywriting |

### 🌍 Especializados (2 agents)
| Tarefa | Agent | Descrição |
|--------|-------|-----------|
| A11y | `a11y-architect` | WCAG 2.2 compliance |
| Gov data | `gov-data-downloader` | Dados governo brasileiro |

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
