# 🧠 Skill: healthcare-cdss-patterns

> **Adaptada do ECC:** `healthcare-cdss-patterns` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/healthcare-cdss-patterns/SKILL.md`

## Descrição

Clinical Decision Support System (CDSS) development patterns. Drug interaction checking, dose validation, clinical scoring (NEWS2, qSOFA), alert severity classification, and integration into EMR workflows.

---

## ⚠️ Adaptação para Codebuff



| Conceito ECC (Claude) | Equivalente Codebuff |
|-----------------------|---------------------|
| Hooks | Instruções no `.codebuff/instructions.md` |
| Comandos slash | Skills via `skill` tool |
| `settings.json` | `.codebuff/instructions.md` |
| Rules em `~/.claude/rules/` | Skills em `.agents/skills/` |

---

## Conteúdo Adaptado

# Healthcare CDSS Development Patterns

Patterns for building Clinical Decision Support Systems that integrate into EMR workflows. CDSS modules are patient safety critical — zero tolerance for false negatives.

## When to Use

- Implementing drug interaction checking
- Building dose validation engines
- Implementing clinical scoring systems (NEWS2, qSOFA, APACHE, GCS)
- Designing alert systems for abnormal clinical values
- Building medication order entry with safety checks
- Integrating lab result interpretation with clinical context

## How It Works

The CDSS engine is a **pure function library with zero side effects**. Input clinical data, output alerts. This makes it fully testable.

Three primary modules:

1. **`checkInteractions(newDrug, currentMeds, allergies)`** — Checks a new drug against current medications and known allergies. Returns severity-sorted `InteractionAlert[]`. Uses `DrugInteractionPair` data model.
2. **`validateDose(drug, dose, route, weight, age, renalFunction)`** — Validates a prescribed dose against weight-based, age-adjusted, and renal-adjusted rules. Returns `DoseValidationResult`.
3. **`calculateNEWS2(vitals)`** — National Early Warning Score 2 from `NEWS2Input`. Returns `NEWS2Result` with total score, risk level, and escalation guidance.

```
EMR UI
  ↓ (user enters data)
CDSS Engine (pure functions, no side effects)
  ├── Drug Interaction Checker
  ├── Dose Validator
  ├── Clinical Scoring (NEWS2, qSOFA, etc.)
  └── Alert Classifier
  ↓ (returns alerts)
EMR UI (displays alerts inline, blocks if critical)
```

### Drug Interaction Checking

```typescript
interface DrugInteractionPair {
  drugA: string;           // generic name
  drugB: string;           // generic name
  severity: 'critical' | 'major' | 'minor';
  mechanism: string;
  clinicalEffect: string;
  recommendation: string;
}

function checkInteractions(
  newDrug: string,
  currentMedications: string[],
  allergyList: string[]
): InteractionAlert[] {
  if (!newDrug) return [];
  const alerts: InteractionAlert[] = [];
  for (const current of currentMedications) {
    const interaction = findInteraction(newDrug, current);
    if (interaction) {
      alerts.push({ severity: interaction.severity, pair: [newDrug, current],
        message: interaction.clinicalEffect, recommendation: interaction.recommendation });
    }
  }
  for (const allergy of allergyList) {
    if (isCrossReactive(newDrug, allergy)) {
      alerts.push({ severity: 'critical', pair: [newDrug, allergy],
        message: `Cross-reactivity with documented allergy: ${allergy}`,
        recommendation: 'Do not prescribe without allergy consultation' });
    }
  }
  return alerts.sort((a, b) => severityOrder(a.severity) - severityOrder(b.severity));
}
```

Interaction pairs must be **bidirectional**: if Drug A interacts with Drug B, then Drug B interacts with Drug A.

### Dose Validation

```typescript
interface DoseValidationResult {
  valid: boolean;
  message: string;
  suggestedRange: { min

---

**ECC Original:** `ECC/skills/healthcare-cdss-patterns/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:24
