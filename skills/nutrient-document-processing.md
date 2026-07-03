# 🧠 Skill: nutrient-document-processing

> **Adaptada do ECC:** `nutrient-document-processing` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/nutrient-document-processing/SKILL.md`

## Descrição

Process, convert, OCR, extract, redact, sign, and fill documents using the Nutrient DWS API. Works with PDFs, DOCX, XLSX, PPTX, HTML, and images.

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

# Nutrient Document Processing

> **Note:** This skill integrates with the Nutrient commercial API. Review their terms before use.

Process documents with the [Nutrient DWS Processor API](https://www.nutrient.io/api/). Convert formats, extract text and tables, OCR scanned documents, redact PII, add watermarks, digitally sign, and fill PDF forms.

## Setup

Get a free API key at **[nutrient.io](https://dashboard.nutrient.io/sign_up/?product=processor)**

```bash
export NUTRIENT_API_KEY="pdf_live_..."
```

All requests go to `https://api.nutrient.io/build` as multipart POST with an `instructions` JSON field.

## Operations

### Convert Documents

```bash
# DOCX to PDF
curl -X POST https://api.nutrient.io/build   -H "Authorization: Bearer $NUTRIENT_API_KEY"   -F "document.docx=@document.docx"   -F 'instructions={"parts":[{"file":"document.docx"}]}'   -o output.pdf

# PDF to DOCX
curl -X POST https://api.nutrient.io/build   -H "Authorization: Bearer $NUTRIENT_API_KEY"   -F "document.pdf=@document.pdf"   -F 'instructions={"parts":[{"file":"document.pdf"}],"output":{"type":"docx"}}'   -o output.docx

# HTML to PDF
curl -X POST https://api.nutrient.io/build   -H "Authorization: Bearer $NUTRIENT_API_KEY"   -F "index.html=@index.html"   -F 'instructions={"parts":[{"html":"index.html"}]}'   -o output.pdf
```

Supported inputs: PDF, DOCX, XLSX, PPTX, DOC, XLS, PPT, PPS, PPSX, ODT, RTF, HTML, JPG, PNG, TIFF, HEIC, GIF, WebP, SVG, TGA, EPS.

### Extract Text and Data

```bash
# Extract plain text
curl -X POST https://api.nutrient.io/build   -H "Authorization: Bearer $NUTRIENT_API_KEY"   -F "document.pdf=@document.pdf"   -F 'instructions={"parts":[{"file":"document.pdf"}],"output":{"type":"text"}}'   -o output.txt

# Extract tables as Excel
curl -X POST https://api.nutrient.io/build   -H "Authorization: Bearer $NUTRIENT_API_KEY"   -F "document.pdf=@document.pdf"   -F 'instructions={"parts":[{"file":"document.pdf"}],"output":{"type":"xlsx"}}'   -o tables.xlsx
```

### OCR Scanned Documents

```bash
# OCR to searchable PDF (supports 100+ languages)
curl -X POST https://api.nutrient.io/build   -H "Authorization: Bearer $NUTRIENT_API_KEY"   -F "scanned.pdf=@scanned.pdf"   -F 'instructions={"parts":[{"file":"scanned.pdf"}],"actions":[{"type":"ocr","language":"english"}]}'   -o searchable.pdf
```

Languages: Supports 100+ languages via ISO 639-2 codes (e.g., `eng`, `deu`, `fra`, `spa`, `jpn`, `kor`, `chi_sim`, `chi_tra`, `ara`, `hin`, `rus`). Full language names like `english` or `german` also work. See the [complete OCR language table](https://www.nutrient.io/guides/document-engine/ocr/language-support/) for all supported codes.

### Redact Sensitive Information

```bash
# Pattern-based (SSN, email)
curl -X POST https://api.nutrient.io/build   -H "Authorization: Bearer $NUTRIENT_API_KEY"   -F "document.pdf=@document.pdf"   -F 'instructions={"parts":[{"file":"document.pdf"}],"actions":[{"type":"redaction","strategy":"preset","strategyOptions":{"preset":"social-secur

---

**ECC Original:** `ECC/skills/nutrient-document-processing/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:28
