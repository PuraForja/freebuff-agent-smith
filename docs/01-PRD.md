# PRD — Freebuff Agent Smith V2 v3.0

> **Product Requirements Document**
> Versão: 3.1 · Data: 16/07/2026 · Autor: Rolim + Buffy (IA)
>
> 📌 **Propósito deste documento:** Alinhar o time sobre O QUE será construído e POR QUÊ.
> Ele é a "constituição" do projeto — toda decisão deve ser validada contra ele.

---

## 1. Objetivo

> **Por que o Smith existe?**

O Freebuff Agent Smith V2 é um **auto-engenheiro de agentes AI** inspirado no Agent Smith V2 do Matrix. Assim como o vilão copiava a si mesmo, modificava outros programas e criou uma comunidade inteira, o Smith:

- **Descobre** agents em repositórios (GitHub, ECC, CrewAI, Hermes, LangGraph, entre outros)
- **Analisa** e extrai conhecimento (CONCEITOS, não código)
- **Clona e adapta** agents para o formato Freebuff
- **Instala** e gerencia um ecossistema crescente de agents
- **Observa ativamente** o ecossistema e sugere melhorias automaticamente, com inteligência contextual para não interromper atividades em andamento

### Frase Definitiva

> **"O Smith não coleciona código. Ele coleciona conhecimento de engenharia."**

### Como funciona na prática

1. 🔍 Usuário pede: "Quero um agente de pesquisa"
2. 🧠 Smith pesquisa local + GitHub, encontra soluções existentes
3. 📊 Compara, apresenta opções ao usuário (com explicações do que cada opção faz)
4. 🧬 Extrai o CONHECIMENTO (padrões, princípios), não o código
5. 🔧 Adapta e cria o agente no formato Freebuff
6. 📦 Instala, registra linhagem, mantém rastreabilidade
7. 👁️ Monitora o ecossistema contínua e ativamente — sugere melhorias, detecta problemas e oportunidades sem precisar ser solicitado
8. 🧠 **Inteligência contextual:** Se o usuário estiver no meio de uma atividade complexa, o Smith **aguarda** o momento adequado para sugerir melhorias, anotando descobertas para apresentar depois

---

## 2. Problema

> **Qual dor o Smith resolve?**

| Problema | Impacto |
|----------|---------|
| Ecossistemas de agents estão fragmentados (ECC, CrewAI, Hermes, LangGraph, etc.) | Não dá para reaproveitar conhecimento entre frameworks |
| Criar agents do zero é demorado e propenso a erros | Horas/dias para cada novo agent |
| Não existe rastreabilidade de onde um agent veio | Impossível saber origem, versão, patches aplicados |
| Atualizações de frameworks quebram agents personalizados | Retrabalho constante |
| Não existe "gerenciador de pacotes" para agents | Impossível atualizar, versionar ou contribuir de volta |
| Agents viram "bagunça" conforme crescem | Código duplicado, padrões inconsistentes |
| Agentes podem parar de funcionar sem aviso | Diagnóstico manual e demorado |
| LLMs podem alucinar ao gerar código para agents | Risco de agents quebrados ou inseguros |

**Solução:** Uma plataforma que aprende CONHECIMENTO de engenharia (não copia código), mantém linhagem completa, diagnostica e repara agents problemáticos, e evolui o ecossistema com segurança — usando técnicas anti-alucinação para garantir qualidade.

---

## 3. Público-Alvo

| Perfil | Descrição | Contexto de uso |
|--------|-----------|-----------------|
| **Desenvolvedor AI** | Cria e gerencia agents para Freebuff/Codebuff | Projeto pessoal ou profissional |
| **Equipe de AI** | Múltiplos devs criando agents em paralelo | Colaboração, revisão, versionamento |
| **Explorador** | Quer descobrir e instalar agents prontos | GitHub, ECC, outros repositórios |
| **Contribuidor** | Quer contribuir de volta para projetos originais | Criar PRs automaticamente |

---

## 4. User Stories

> 💡 **IDs estáveis:** Cada User Story tem um ID único (`PRD-US-NNN`) para rastreamento de mudanças entre versões.

### PRD-US-001 — Criar Agente
**Como** desenvolvedor AI,
**quero** pedir ao Smith para criar um agente de pesquisa
**para** ter um agente funcional em minutos, não horas.

### PRD-US-002 — Descobrir Agents
**Como** explorador,
**quero** que o Smith pesquise GitHub e encontre agents relevantes
**para** não precisar buscar manualmente em dezenas de repositórios.

### PRD-US-003 — Gerenciar Patches
**Como** desenvolvedor AI,
**quero** que o Smith detecte quando uma atualização do ECC quebra meus patches
**para** corrigir problemas antes que afetem meu trabalho.

### PRD-US-004 — Contribuir de Volta
**Como** contribuidor,
**quero** que o Smith gere automaticamente um PR quando minha melhoria for significativa
**para** contribuir para o ecossistema sem trabalho manual.

### PRD-US-005 — Observar Ecossistema
**Como** gerente de agents,
**quero** que o Smith detecte código duplicado e sugira consolidação
**para** manter o ecossistema limpo e eficiente.

### PRD-US-006 — Atualizar com Segurança
**Como** desenvolvedor AI,
**quero** que o Smith me avise quando uma atualização do ECC torna meu patch obsoleto
**para** remover patches desnecessários e manter tudo atualizado.

### PRD-US-007 — Rastrear Linhagem
**Como** desenvolvedor AI,
**quero** saber a origem completa de cada agent (projeto, versão, patches, autor)
**para** ter rastreabilidade total do conhecimento.

### PRD-US-008 — Revalidar Agente Problemático
**Como** desenvolvedor AI,
**quero** dizer "Smith, o agente X está esquisito, revalide o código dele"
**para** que o Smith diagnostique o problema, busque conceitos de outras fontes para melhorar o agente, e me ofereça a escolha entre apenas corrigir (patch) ou evoluir para uma nova versão (v2.0).

### PRD-US-009 — Proatividade com Contexto
**Como** desenvolvedor AI,
**quero** que o Smith perceba ativamente oportunidades de melhoria no ecossistema
**para** não perder otimizações importantes — mas sem me interromper se eu estiver no meio de uma atividade crítica.

---

## 5. Requisitos Não-Funcionais

| Requisito | Critério |
|-----------|----------|
| **Performance** | Destilação de repos < 5min, criação de agent < 1min |
| **Segurança** | Nunca modificar originais sem autorização explícita |
| **Rastreabilidade** | Todo artefato tem linhagem completa (origem, transformação, destino) |
| **Compatibilidade** | Funciona com ECC, CrewAI, Hermes, LangGraph, projetos GitHub, etc. |
| **Extensibilidade** | Novos frameworks podem ser adicionados como fontes |
| **Ética** | Smith recomenda, nunca impõe. Usuário sempre decide |
| **Contexto-Aware** | Smith percebe quando o usuário está ocupado e agenda sugestões para depois |
| **Anti-Alucinação** | Agents gerados pelo Smith passam por validação anti-alucinação (grounding, chain-of-verification, confidence scoring) |

---

## 6. Fora do Escopo

- ❌ Smith não executa código de terceiros diretamente
- ❌ Smith não modifica repositórios originais sem autorização
- ❌ Smith não modifica agents locais sem autorização explícita do usuário
- ❌ Smith não substitui o desenvolvedor — apenas assessoria
- ❌ Smith não garante qualidade de agents de terceiros — apenas avalia
- ❌ Smith não é um framework de agents — é uma PLATAFORMA de conhecimento

---

## 7. Métricas de Sucesso

| Métrica | Meta |
|---------|------|
| Tempo para criar um agent funcional | < 5 minutos |
| Precisão da recomendação de agents | ≥ 92% |
| Patches detectados como incompatíveis | 100% antes de quebra |
| PRs gerados automaticamente que são aceitos | > 50% |
| Padrões de engenharia extraídos | > 100 após analisar 500 repos |
| Cobertura de linhagem | 100% dos artefatos rastreados |
| Tempo médio de diagnóstico (US-08) | < 2 minutos |
| Taxa de agents que voltam a funcionar após correção | > 95% |
| Sugestões proativas consideradas úteis pelo usuário | > 70% |

---

## 8. Integração com Repositórios Git — Duas Modalidades

O Smith suporta **duas formas** de interagir com repositórios Git:

### Modalidade 1: Clone Local
- O Smith baixa o repositório completo para a máquina local
- **Prós:** Análise completa de todos os arquivos, funciona offline, permite modificações profundas
- **Contras:** Ocupa espaço em disco, requer git instalado, necessário para patches e PRs
- **Uso típico:** Instalação definitiva de agents, criação de patches, contribuição de volta (PRs)

### Modalidade 2: Análise Remota (via API GitHub)
- O Smith lê os arquivos diretamente do GitHub via API REST/GraphQL
- **Prós:** Não ocupa espaço, sempre a versão mais recente, rápido para descoberta
- **Contras:** Limitado por rate limit da API (5000 req/hora), depende de internet
- **Uso típico:** Descoberta inicial, catálogo e avaliação, comparação entre opções

**Fluxo típico:** Smith descobre via análise remota → você aprova → Smith clona localmente para instalar/patchar/contribuir.

---

## 9. Cronograma Estimado

| Fase | Duração | Dependências |
|------|---------|--------------|
| Fase 1: Fundação (Artefatos + Linhagem) | 2 semanas | — |
| Fase 2: Destilador de Conhecimento | 2 semanas | Fase 1 |
| Fase 3: Patches + Smith Update | 2 semanas | Fase 1 |
| Fase 4: Observador + Assimilação | 2 semanas | Fase 2 |
| Fase 5: Contribuição Automática | 1 semana | Fase 3 |
| Fase 6: Biblioteca de Padrões | 1 semana | Fase 2 |

---

## 10. Visão de Arquitetura (Alto Nível)

```
┌─────────────────────────────────────────────────────────┐
│                    FREEBUFF AGENT SMITH                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  DESTILADOR  │  │  OBSERVADOR  │  │  GERENCIADOR │  │
│  │  de          │  │  de          │  │  de          │  │
│  │  Conhecimento│  │  Ecossistema │  │  Patches     │  │
│  │  (+ Anti-    │  │  (+ Contexto │  │  (+ Diagnos- │  │
│  │   Alucinação)│  │   Aware)     │  │   tico)      │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                 │                 │            │
│         └────────┬────────┘                 │            │
│                  │                          │            │
│         ┌────────▼────────────────────────▼───────┐     │
│         │         BIBLIOTECA SMITH                │     │
│         │    (Conhecimento + Linhagem + DNA)      │     │
│         └─────────────────┬───────────────────────┘     │
│                           │                              │
│         ┌─────────────────▼───────────────────────┐     │
│         │         WORKSPACE                       │     │
│         │    (Artefatos temporários)              │     │
│         └─────────────────┬───────────────────────┘     │
│                           │                              │
│         ┌─────────────────▼───────────────────────┐     │
│         │         RESULTADO                       │     │
│         │    (Agents, Skills, Patches, PRs)       │     │
│         └─────────────────────────────────────────┘     │
│                                                          │
└─────────────────────────────────────────────────────────┘
         ▲                    ▲                    ▲
         │                    │                    │
    ┌────┴────┐         ┌────┴────┐         ┌────┴────┐
    │  ECC    │         │ GitHub  │         │ CrewAI  │
    │  Hermes │         │ Repos   │         │ LangGraph│
    │  + etc  │         │         │         │ + etc    │
    └─────────┘         └─────────┘         └─────────┘
```

---

## 11. Anti-Alucinação no Smith

> 📖 **Especificação completa:** `02-SPEC.md#4.5-sistema-anti-alucinação`

Assim como o projeto `solucao-medica` desenvolveu técnicas para evitar que a IA alucine em contexto clínico, o Smith adotará princípios similares. O sistema anti-alucinação é composto por **5 camadas** (Grounding, Chain-of-Verification, Confidence Scoring, Output Guardrails, Human-in-the-Loop), já implementadas como artefatos de conhecimento na Biblioteca Smith.

A Biblioteca Smith já contém o conhecimento destilado — consulte `knowledge/index.json` para a lista completa e atualizada de artefatos anti-alucinação disponíveis. Inclui: 5 camadas completas, 1 padrão de pipeline, 1 princípio fundamental e 1 skill reutilizável.

---

## 12. Referências

> 📚 **Achado de:** `@docs-lookup`

- [Freebuff Docs - Criando Agents](https://freebuff.com/docs/creating-new-agents)
- [Freebuff Docs - Agents Overview](https://freebuff.com/docs/agents-overview)
- [ECC Repository](https://github.com/affaan-m/ECC)
- [Freebuff Agent Smith V2](https://github.com/PuraForja/freebuff-agent-smith-v2)
- [solucao-medica (Anti-Hallucination Reference)](https://github.com/PuraForja/solucao-medica)
- [Chain-of-Verification Paper (Meta FAIR, 2024)](https://arxiv.org/abs/2309.11495)

---

*Documento mantido por: Rolim + Buffy*
*ID do documento: PRD-v3.1*
*Próxima revisão: Após aprovação do GATE 1*
