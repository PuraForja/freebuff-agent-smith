# 🧠 Skill: healthcare-eval-harness

> **Adaptada do ECC:** `healthcare-eval-harness` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/healthcare-eval-harness/SKILL.md`

## Descrição

Patient safety evaluation harness for healthcare application deployments. Automated test suites for CDSS accuracy, PHI exposure, clinical workflow integrity, and integration compliance. Blocks deployments on safety failures.

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

# Healthcare Eval Harness — Patient Safety Verification

Automated verification system for healthcare application deployments. A single CRITICAL failure blocks deployment. Patient safety is non-negotiable.

> **Note:** Examples use Jest as the reference test runner. Adapt commands for your framework (Vitest, pytest, PHPUnit, etc.) — the test categories and pass thresholds are framework-agnostic.

## When to Use

- Before any deployment of EMR/EHR applications
- After modifying CDSS logic (drug interactions, dose validation, scoring)
- After changing database schemas that touch patient data
- After modifying authentication or access control
- During CI/CD pipeline configuration for healthcare apps
- After resolving merge conflicts in clinical modules

## How It Works

The eval harness runs five test categories in order. The first three (CDSS Accuracy, PHI Exposure, Data Integrity) are CRITICAL gates requiring 100% pass rate — a single failure blocks deployment. The remaining two (Clinical Workflow, Integration) are HIGH gates requiring 95%+ pass rate.

Each category maps to a Jest test path pattern. The CI pipeline runs CRITICAL gates with `--bail` (stop on first failure) and enforces coverage thresholds with `--coverage --coverageThreshold`.

### Eval Categories

**1. CDSS Accuracy (CRITICAL — 100% required)**

Tests all clinical decision support logic: drug interaction pairs (both directions), dose validation rules, clinical scoring vs published specs, no false negatives, no silent failures.

```bash
npx jest --testPathPattern='tests/cdss' --bail --ci --coverage
```

**2. PHI Exposure (CRITICAL — 100% required)**

Tests for protected health information leaks: API error responses, console output, URL parameters, browser storage, cross-facility isolation, unauthenticated access, service role key absence.

```bash
npx jest --testPathPattern='tests/security/phi' --bail --ci
```

**3. Data Integrity (CRITICAL — 100% required)**

Tests clinical data safety: locked encounters, audit trail entries, cascade delete protection, concurrent edit handling, no orphaned records.

```bash
npx jest --testPathPattern='tests/data-integrity' --bail --ci
```

**4. Clinical Workflow (HIGH — 95%+ required)**

Tests end-to-end flows: encounter lifecycle, template rendering, medication sets, drug/diagnosis search, prescription PDF, red flag alerts.

```bash
tmp_json=$(mktemp)
npx jest --testPathPattern='tests/clinical' --ci --json --outputFile="$tmp_json" || true
total=$(jq '.numTotalTests // 0' "$tmp_json")
passed=$(jq '.numPassedTests // 0' "$tmp_json")
if [ "$total" -eq 0 ]; then
  echo "No clinical tests found" >&2
  exit 1
fi
rate=$(echo "scale=2; $passed * 100 / $total" | bc)
echo "Clinical pass rate: ${rate}% ($passed/$total)"
```

**5. Integration Compliance (HIGH — 95%+ required)**

Tests external systems: HL7 message parsing (v2.x), FHIR validation, lab result mapping, malformed message handling.

```bash
tmp_json=$(mktemp)
npx jest --testPathPattern='tests/int

---

**ECC Original:** `ECC/skills/healthcare-eval-harness/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:24
