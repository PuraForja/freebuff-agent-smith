# 🚧 Conhecimento: Output Guardrails (Camada 3)

> **Fonte original:** `solucao-medica/referencias/ANTI-HALUCINACAO.md`
> **Destilado em:** 16/07/2026
> **Tipo:** Padrão de Engenharia
> **Tags:** anti-hallucination, guardrails, validation, safety

---

## Conceito

> **"Mesmo que a IA acerte os dados, a saída precisa ser segura, formatada corretamente e adequada ao contexto."**

Guardrails são **barreiras de proteção** que interceptam a saída antes de entregá-la.

## Tipos de Guardrails

| Guardrail | O que verifica | Exemplo de bloqueio |
|-----------|----------------|---------------------|
| **Limites** | Valores dentro de ranges aceitáveis | "K+ 8.5 — FORA DO LIMITE (> 6.0)" |
| **Formatação** | Saída bem estruturada | Código TypeScript sem erros de sintaxe |
| **Audiência** | Tom adequado ao contexto | "Você tem X" → "Sugiro consultar um médico" |
| **Confiança** | Advertência se confiança baixa | "⚠️ Este dado tem confiança baixa" |
| **Emergência** | Template fixo para situações críticas | Template de emergência (não gerado por LLM) |

## Guardrails Específicos para o Smith

### 1. Validação de Código Gerado
- [ ] TypeScript sintaticamente válido
- [ ] Tools referenciadas existem no sistema
- [ ] Estrutura AgentDefinition completa
- [ ] Nenhum campo obrigatório ausente
- [ ] Imports resolvem corretamente

### 2. Validação de Recomendações
- [ ] A fonte citada realmente contém o conhecimento
- [ ] A qualidade atribuída é realista
- [ ] Não há contradição com outros dados na Biblioteca
- [ ] A linhagem está completa (origem → transformação → destino)

### 3. Validação de Patches
- [ ] O patch não quebra a estrutura do artefato original
- [ ] As modificações são syntacticamente válidas
- [ ] O patch é reversível

## Como Aplicar no Smith

**Sempre que o Smith GERAR algo** (agent, patch, recomendação, código), aplicar guardrails:

```
GERAÇÃO
   │
   ▼
┌─────────────────────┐
│ GUARDRAILS           │
│ ├── Sintaxe OK?      │ → ❌ Rejeitar + explicar
│ ├── Tools existem?   │ → ❌ Rejeitar + sugerir
│ ├── Estrutura OK?    │ → ❌ Corrigir automaticamente
│ ├── Confiança > .70? │ → ⚠️ Adicionar ressalva
│ └── Fonte citada?    │ → ❌ Adicionar linhagem
└─────────────────────┘
   │
   ▼
ENTREGA AO USUÁRIO
```

## Origem

Implementado no projeto `solucao-medica` como Camada 3 do pipeline anti-alucinação.
Utiliza 5 tipos de barreiras: limites clínicos, formatação, audiência, confiança e emergência.

---

*Artifact ID: smith-knowledge-ah-004*
*Linhagem: solucao-medica/ANTI-HALUCINACAO.md → Smith v3.1 → knowledge/anti-hallucination/*
