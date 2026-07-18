# 🧠 Skill: anti-hallucination-baseline

> **Fonte original:** `solucao-medica/referencias/ANTI-HALUCINACAO.md`
> **Adaptada para:** Freebuff Agent Smith
> **Tipo:** Skill de Qualidade

---

## Descrição

Use esta skill sempre que estiver **gerando, modificando ou recomendando agents** para o Freebuff. Ela fornece um baseline anti-alucinação que garante que os artefatos gerados sejam confiáveis.

## Quando Ativar

- Antes de criar um novo agent → aplicar grounding
- Antes de recomendar uma opção → verificar fontes
- Após gerar código TypeScript → validar sintaxe
- Ao diagnosticar agent problemático → CoVe
- Ao sugerir patch → verificar compatibilidade

## Baseline Anti-Alucinação (5 Camadas)

### Camada 0: Grounding
- Toda recomendação deve ter fonte verificável
- Se o dado não está na fonte → não invente
- Cite sempre a origem do conhecimento

### Camada 1: Chain-of-Verification
- Decomponha a resposta em afirmações atômicas
- Verifique cada afirmação contra as fontes
- Corrija ou remova o que não passar

### Camada 2: Confidence Scoring
- Atribua score de 0.0 a 1.0 para cada recomendação
- Score ≥ 0.85 → recomendar diretamente
- Score 0.60 - 0.84 → recomendar com ressalvas
- Score < 0.60 → não recomendar, pedir revisão

### Camada 3: Output Guardrails
- Código gerado deve ser sintaticamente válido
- Tools referenciadas devem existir
- Estrutura AgentDefinition deve estar completa

### Camada 4: Human-in-the-Loop
- Toda ação com impacto requer aprovação
- Smith recomenda, nunca impõe
- Usuário decide sempre

## Checklist de Qualidade

Antes de entregar qualquer artefato:

- [ ] Fonte do conhecimento foi citada
- [ ] Confiança da recomendação foi calculada
- [ ] Código gerado é sintaticamente válido
- [ ] Tools referenciadas existem no sistema
- [ ] Não há contradições com conhecimento existente
- [ ] Linhagem do artefato está registrada
- [ ] Usuário pode aprovar ou rejeitar

## Referências na Biblioteca Smith

| Técnica | Arquivo |
|---------|---------|
| Grounding Rules | `knowledge/anti-hallucination/grounding-rules.md` |
| Chain-of-Verification | `knowledge/anti-hallucination/chain-of-verification.md` |
| Confidence Scoring | `knowledge/anti-hallucination/confidence-scoring.md` |
| Output Guardrails | `knowledge/anti-hallucination/output-guardrails.md` |
| Human-in-the-Loop | `knowledge/anti-hallucination/human-in-the-loop.md` |
| Pipeline Pattern | `knowledge/patterns/anti-hallucination-pipeline.json` |
| Grounding First | `knowledge/principles/grounding-first.json` |

### Técnicas Complementares (ECC)

Além das 5 camadas, o ecossistema ECC oferece técnicas complementares:

| Técnica | Descrição | Origem |
|:--------|-----------|:------:|
| **Santa Method** | Revisão dupla independente — 2 revisores sem compartilhar contexto. A saída só passa se ambos aprovarem. | ECC/skills/santa-method |
| **Agent Self-Evaluation** | Autoavaliação em 5 eixos (Accuracy, Completeness, Clarity, Consistency, Efficiency), cada um com score 1-5. | ECC/skills/agent-self-evaluation |

**Aplicação:** Use o Santa Method para revisões críticas de agents gerados, e o Self-Evaluation como verificador adicional pós-guardrails.

---

**ECC Original:** `solucao-medica` (referencias/) + `ECC` (skills/santa-method + skills/agent-self-evaluation)
**Atualizado em:** 2026-07-16
