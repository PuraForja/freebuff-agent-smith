# 🛡️ Conhecimento: Grounding Rules (Camada 0)

> **Fonte original:** `solucao-medica/referencias/ANTI-HALUCINACAO.md`
> **Destilado em:** 16/07/2026
> **Tipo:** Padrão de Engenharia
> **Tags:** anti-hallucination, grounding, source-of-truth

---

## Conceito

> **"A IA nunca deve responder com base em seu conhecimento de treinamento. Toda resposta deve ser fundada em dados reais."**

Grounding é a defesa **mais fundamental** contra alucinação. Se o dado não está em uma fonte verificável, a IA não deve inventá-lo.

## Regras de Ouro

```
1. NUNCA invente dados
   → Se não tem na fonte, diga "não sei"

2. SEMPRE cite a fonte do dado
   → "Creatinina 8.2 (exame de 28/06)"

3. COMUNIQUE incerteza
   → Confiança alta: "sua creatinina está 8.2"
   → Confiança baixa: "parece ser 8.2, mas o exame está borrado"

4. VALIDE antes de responder
   → Cross-check com limites conhecidos

5. HUMANO decide, IA sugere
   → Toda recomendação é sugestão, nunca ordem
```

## Estrutura de Fontes (Ordem de Precedência)

| Prioridade | Fonte | Confiança Padrão |
|:----------:|-------|:----------------:|
| 1 | Dados estruturados (banco local) | 0.95 |
| 2 | Documentos originais preservados | 0.90 |
| 3 | Histórico de conversas/fontes secundárias | 0.80 |
| 4 | Diretrizes e documentação carregada | 0.85 |

## Como Aplicar no Smith

- **Antes de gerar um agent:** Verificar na Biblioteca Smith se o padrão já existe
- **Antes de recomendar:** Verificar na fonte original (ECC, GitHub) se a informação procede
- **Ao criar patches:** Não inventar APIs ou tools que não existem
- **Ao gerar código:** Não usar bibliotecas ou funções que não estão disponíveis

## Origem

Este conhecimento foi extraído do sistema anti-alucinação do projeto `solucao-medica`,
que implementou 5 camadas de defesa para agentes clínicos de IA. O grounding é a
Camada 0 — a base de todo o sistema.

---

*Artifact ID: smith-knowledge-ah-001*
*Linhagem: solucao-medica/ANTI-HALUCINACAO.md → Smith v3.1 → knowledge/anti-hallucination/*
