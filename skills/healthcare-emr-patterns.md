# 🧠 Skill: healthcare-emr-patterns

> **Adaptada do ECC:** `healthcare-emr-patterns` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/healthcare-emr-patterns/SKILL.md`

## Descrição

EMR/EHR development patterns for healthcare applications. Clinical safety, encounter workflows, prescription generation, clinical decision support integration, and accessibility-first UI for medical data entry.

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

# Healthcare EMR Development Patterns

Patterns for building Electronic Medical Record (EMR) and Electronic Health Record (EHR) systems. Prioritizes patient safety, clinical accuracy, and practitioner efficiency.

## When to Use

- Building patient encounter workflows (complaint, exam, diagnosis, prescription)
- Implementing clinical note-taking (structured + free text + voice-to-text)
- Designing prescription/medication modules with drug interaction checking
- Integrating Clinical Decision Support Systems (CDSS)
- Building lab result displays with reference range highlighting
- Implementing audit trails for clinical data
- Designing healthcare-accessible UIs for clinical data entry

## How It Works

### Patient Safety First

Every design decision must be evaluated against: "Could this harm a patient?"

- Drug interactions MUST alert, not silently pass
- Abnormal lab values MUST be visually flagged
- Critical vitals MUST trigger escalation workflows
- No clinical data modification without audit trail

### Single-Page Encounter Flow

Clinical encounters should flow vertically on a single page — no tab switching:

```
Patient Header (sticky — always visible)
├── Demographics, allergies, active medications
│
Encounter Flow (vertical scroll)
├── 1. Chief Complaint (structured templates + free text)
├── 2. History of Present Illness
├── 3. Physical Examination (system-wise)
├── 4. Vitals (auto-trigger clinical scoring)
├── 5. Diagnosis (ICD-10/SNOMED search)
├── 6. Medications (drug DB + interaction check)
├── 7. Investigations (lab/radiology orders)
├── 8. Plan & Follow-up
└── 9. Sign / Lock / Print
```

### Smart Template System

```typescript
interface ClinicalTemplate {
  id: string;
  name: string;             // e.g., "Chest Pain"
  chips: string[];          // clickable symptom chips
  requiredFields: string[]; // mandatory data points
  redFlags: string[];       // triggers non-dismissable alert
  icdSuggestions: string[]; // pre-mapped diagnosis codes
}
```

Red flags in any template must trigger a visible, non-dismissable alert — NOT a toast notification.

### Medication Safety Pattern

```
User selects drug
  → Check current medications for interactions
  → Check encounter medications for interactions
  → Check patient allergies
  → Validate dose against weight/age/renal function
  → If CRITICAL interaction: BLOCK prescribing entirely
  → Clinician must document override reason to proceed past a block
  → If MAJOR interaction: display warning, require acknowledgment
  → Log all alerts and override reasons in audit trail
```

Critical interactions **block prescribing by default**. The clinician must explicitly override with a documented reason stored in the audit trail. The system never silently allows a critical interaction.

### Locked Encounter Pattern

Once a clinical encounter is signed:
- No edits allowed — only an addendum (a separate linked record)
- Both original and addendum appear in the patient timeline
- Audit trail captures who

---

**ECC Original:** `ECC/skills/healthcare-emr-patterns/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:24
