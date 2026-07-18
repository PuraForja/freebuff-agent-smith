# 📊 Conhecimento: Confidence Scoring (Camada 2)

> **Fonte original:** `solucao-medica/referencias/ANTI-HALUCINACAO.md`
> **Destilado em:** 16/07/2026
> **Tipo:** Técnica de Engenharia
> **Tags:** anti-hallucination, confidence, scoring, metrics

---

## Conceito

> **"Nem todo dado tem o mesmo nível de confiança. Uma fonte direta é mais confiável que uma extração indireta."**

Cada dado/recomendação tem um **score de confiança** que determina como deve ser tratado.

## Fatores de Confiança

| Fator | Peso | Descrição |
|:-----:|:----:|-----------|
| **Fonte** | 35% | Qualidade da fonte (dados estruturados > OCR > relato) |
| **Temporal** | 20% | Quão recente é o dado (mais recente = mais confiança) |
| **Tipo de dado** | 25% | Confiabilidade inerente do tipo de dado |
| **Consistência** | 20% | Não conflita com outros dados disponíveis |

## Níveis de Confiança

| Score | Nível | Ação |
|:-----:|:-----:|------|
| ≥ 0.85 | 🔵 **ALTO** | Pode usar diretamente |
| 0.60 - 0.84 | 🟡 **MÉDIO** | Usar com ressalvas, comunicar incerteza |
| < 0.60 | 🔴 **BAIXO** | Escalar para humano, ou não usar |
| 0.0 | ⚫ **SEM DADOS** | "Não encontrei esse dado" |

## Como Aplicar no Smith

| Contexto | Score | O que fazer |
|----------|:-----:|-------------|
| Recomendação de agent (fonte oficial ECC) | ≥ 0.90 | Recomendar diretamente |
| Recomendação de agent (fonte GitHub desconhecida) | 0.60 | Recomendar com ressalvas, "não verificado" |
| Conhecimento extraído (padrão claro) | ≥ 0.85 | Adicionar à Biblioteca |
| Conhecimento extraído (padrão ambíguo) | 0.50 | Marcar para revisão humana |
| Patch criado (verificado) | 0.90 | Aplicar automaticamente |
| Patch criado (não verificado) | 0.40 | Pedir confirmação |

## Origem

Implementado no projeto `solucao-medica` como Camada 2 do pipeline anti-alucinação.
Utiliza 4 fatores combinados (fonte, temporal, tipo, consistência) para calcular
confiança geral de cada dado e da resposta final.

---

*Artifact ID: smith-knowledge-ah-003*
*Linhagem: solucao-medica/ANTI-HALUCINACAO.md → Smith v3.1 → knowledge/anti-hallucination/*
