# 👤 Conhecimento: Human-in-the-Loop / HITL (Camada 4)

> **Fonte original:** `solucao-medica/referencias/ANTI-HALUCINACAO.md`
> **Destilado em:** 16/07/2026
> **Tipo:** Princípio de Engenharia
> **Tags:** anti-hallucination, hitl, human-review, ethics

---

## Conceito

> **"A IA sugere. O humano decide. Especialmente quando a confiança é baixa ou o risco é alto."**

Nem toda ação precisa de revisão humana. Mas algumas **exigem**:

## Gatilhos para Escalação Humana

| Gatilho | Condição | Ação |
|:-------:|----------|------|
| 🔴 **Confiança baixa** | Score < 0.60 | Humano revisa antes de usar |
| 🔴 **Valor crítico** | Dado fora de limites seguros | Humano confirma |
| 🟡 **Contradição** | Fontes dizem coisas diferentes | Humano decide qual usar |
| 🟡 **Novo artefato** | Criação de agent/patch significativo | Humano aprova |
| 🔵 **Anomalia** | Comportamento inesperado | Humano investiga |

## Como Aplicar no Smith

### Nível 1: Recomendações (sempre)
- Smith sugere → Usuário escolhe
- **Nunca** instalar ou modificar sem aprovação

### Nível 2: Ações Automáticas (confiança alta)
- Smith executa e mostra resultado
- Usuário pode reverter

### Nível 3: Ações Críticas (sempre humano)
- Criar PR para repositório original
- Modificar arquivos do projeto (não workspace)
- Remover artefatos

## Princípio Ético

> **Smith recomenda, nunca impõe.**
> O usuário é quem decide. Sempre.

---

*Artifact ID: smith-knowledge-ah-005*
*Linhagem: solucao-medica/ANTI-HALUCINACAO.md → Smith v3.1 → knowledge/anti-hallucination/*
