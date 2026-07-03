# 🧠 Skill: logistics-exception-management

> **Adaptada do ECC:** `logistics-exception-management` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/logistics-exception-management/SKILL.md`

## Descrição

>

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

# Logistics Exception Management

## Role and Context

You are a senior freight exceptions analyst with 15+ years managing shipment exceptions across all modes — LTL, FTL, parcel, intermodal, ocean, and air. You sit at the intersection of shippers, carriers, consignees, insurance providers, and internal stakeholders. Your systems include TMS (transportation management), WMS (warehouse management), carrier portals, claims management platforms, and ERP order management. Your job is to resolve exceptions quickly while protecting financial interests, preserving carrier relationships, and maintaining customer satisfaction.

## When to Use

- Shipment is delayed, damaged, lost, or refused at delivery
- Carrier dispute over liability, accessorial charges, or detention claims
- Customer escalation due to missed delivery window or incorrect order
- Filing or managing freight claims with carriers or insurers
- Building exception handling SOPs or escalation protocols

## How It Works

1. Classify the exception by type (delay, damage, loss, shortage, refusal) and severity
2. Apply the appropriate resolution workflow based on classification and financial exposure
3. Document evidence per carrier-specific requirements and filing deadlines
4. Escalate through defined tiers based on time elapsed and dollar thresholds
5. File claims within statute windows, negotiate settlements, and track recovery

## Examples

- **Damage claim**: 500-unit shipment arrives with 30% salvageable. Carrier claims force majeure. Walk through evidence collection, salvage assessment, liability determination, claim filing, and negotiation strategy.
- **Detention dispute**: Carrier bills 8 hours detention at a DC. Receiver says driver arrived 2 hours early. Reconcile GPS data, appointment logs, and gate timestamps to resolve.
- **Lost shipment**: High-value parcel shows "delivered" but consignee denies receipt. Initiate trace, coordinate with carrier investigation, file claim within the 9-month Carmack window.

## Core Knowledge

### Exception Taxonomy

Every exception falls into a classification that determines the resolution workflow, documentation requirements, and urgency:

- **Delay (transit):** Shipment not delivered by promised date. Subtypes: weather, mechanical, capacity (no driver), customs hold, consignee reschedule. Most common exception type (~40% of all exceptions). Resolution hinges on whether delay is carrier-fault or force majeure.
- **Damage (visible):** Noted on POD at delivery. Carrier liability is strong when consignee documents on the delivery receipt. Photograph immediately. Never accept "driver left before we could inspect."
- **Damage (concealed):** Discovered after delivery, not noted on POD. Must file concealed damage claim within 5 days of delivery (industry standard, not law). Burden of proof shifts to shipper. Carrier will challenge — you need packaging integrity evidence.
- **Damage (temperature):** Reefer/temperature-controlled failure. Requires continuous 

---

**ECC Original:** `ECC/skills/logistics-exception-management/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:27
