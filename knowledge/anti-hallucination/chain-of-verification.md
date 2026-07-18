# 🔗 Conhecimento: Chain-of-Verification / CoVe (Camada 1)

> **Fonte original:** `solucao-medica/referencias/ANTI-HALUCINACAO.md` (baseado em Meta/FAIR, 2024)
> **Destilado em:** 16/07/2026
> **Tipo:** Técnica de Engenharia
> **Tags:** anti-hallucination, verification, self-check, CoVe

---

## Conceito

> **"Antes de entregar a resposta, a IA verifica se cada afirmação está suportada por dados reais."**

Chain-of-Verification (CoVe) é uma técnica onde o modelo:
1. **Gera** uma resposta preliminar
2. **Decompõe** a resposta em afirmações atômicas verificáveis
3. **Executa** a verificação de cada afirmação contra as fontes
4. **Corrige** ou **remove** o que não passar

## Fluxo

```
RESPOSTA PRELIMINAR
        │
        ▼
DECOMPOR EM AFIRMAÇÕES ATÔMICAS
  ├── Afirmação 1: "creatinina = 8.2"     → Verificar no banco
  ├── Afirmação 2: "data = 28/06/2026"    → Verificar no banco
  └── Afirmação 3: "está estável"         → Verificar histórico
        │
        ▼
VERIFICAR CADA AFIRMAÇÃO
  ├── ✅ Achou: 8.2 em 28/06 (confiança 0.95)
  ├── ✅ Achou: confirmado
  └── ⚠️ Subiu 9.3% em 44 dias → suavizar tom
        │
        ▼
CORRIGIR RESPOSTA
  └── "Sua creatinina foi de 7.5 (15/05) para 8.2 (28/06).
       É uma variação pequena."
```

## Tipos de Verificação

| Tipo | O que verifica | Exemplo de falha |
|:----:|----------------|------------------|
| factual_check | O dado existe na fonte? | "Valor 8.2 não encontrado no banco" |
| numerical_check | O valor está correto? | "Valor real é 6.5, não 8.2" |
| temporal_check | A data está correta? | "Data real é 15/05, não 28/06" |
| source_check | A fonte é confiável? | "OCR com apenas 50% de confiança" |
| consistency_check | Não contradiz outros dados? | "Pressão 12x8 contradiz 16x10 de ontem" |
| limit_check | Está dentro dos limites? | "K+ 8.5 — ACIMA DO LIMITE CRÍTICO" |

## Como Aplicar no Smith

- **Ao gerar um agent novo:** Decompor o instructionsPrompt gerado em afirmações (tools usadas, fontes citadas, padrões mencionados) e verificar cada uma
- **Ao recomendar opções:** Verificar se as qualidades e métricas apresentadas são reais
- **Ao diagnosticar agents problemáticos:** Decompor o agent em partes e verificar cada uma contra a fonte original

## Origem

Técnica baseada no paper **"Chain-of-Verification Reduces Hallucination in LLMs"**
(Google DeepMind / Meta FAIR, 2024). Implementada no projeto `solucao-medica` como
Camada 1 do pipeline anti-alucinação.

---

*Artifact ID: smith-knowledge-ah-002*
*Linhagem: solucao-medica/ANTI-HALUCINACAO.md → Smith v3.1 → knowledge/anti-hallucination/*
