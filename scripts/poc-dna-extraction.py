#!/usr/bin/env python3
"""
POC: Extracao de DNA de Agentes

Proposito: Validar o conceito central do Smith v3.0 - extrair CONHECIMENTO
(conceitos, padroes, principios) de arquivos de agentes, NAO codigo.

Uso:
    python3 scripts/poc-dna-extraction.py
    python3 scripts/poc-dna-extraction.py --agent CAMINHO_DO_ARQUIVO

Autor: Rolim + Buffy
Data: 17/07/2026
"""

import re, json, os, sys
from pathlib import Path


def read_file(path):
    try:
        p = Path(path)
        if not p.exists():
            return None
        return p.read_text(encoding="utf-8")
    except Exception as e:
        print(f"  Erro ao ler {path}: {e}")
        return None


def extract_agent_metadata(text, filename):
    """Extrai metadados basicos do agente."""
    meta = {"filename": filename, "id": None, "displayName": None,
            "model": None, "tools": [], "description": None}

    # Extrair id, displayName, model (formato TS: chave: "valor" ou chave: 'valor')
    for key in ("id", "displayName", "model"):
        m = re.search(rf"{key}:\s*['\"]([^'\"]+)['\"]", text)
        if m:
            meta[key] = m.group(1)

    # Extrair toolNames (formato: toolNames: ["a", "b"])
    m = re.search(r'toolNames:\s*\[(.*?)\]', text, re.DOTALL)
    if m:
        meta["tools"] = re.findall(r'"([^"]+)"', m.group(1))

    # Extrair description (aceita aspas duplas, simples, ou sem aspas)
    m = re.search(r"description:\s*['\"]([^'\"]+)['\"]", text)
    if m:
        meta["description"] = m.group(1).strip()
    if not meta.get("description"):
        m = re.search(r'description:\s*([^\n,]+)', text)
        if m:
            d = m.group(1).strip().strip('"').strip("'")
            if not d.startswith("---") and len(d) > 5:
                meta["description"] = d

    return meta


def extract_dna(text):
    """Extrai o DNA do agente: conceito, padrao, principios, etc."""
    dna = {"concept": None, "pattern": None, "principles": [],
           "workflow": [], "redFlags": [], "qualityChecks": []}

    # --- REGRA 1: Identificar workflow pattern ---
    patterns = [
        ("tdd.*workflow|write test first|red.*green.*refactor",
         "Test-Driven Development (Red-Green-Refactor)",
         "red -> green -> refactor -> verify",
         ["Testes primeiro, codigo depois",
          "Minimo codigo para passar no teste",
          "Refatorar so com testes verdes"]),

        ("planning process|plan before execute|requirements analysis|architecture review",
         "Planner Before Execute",
         "analyze -> design -> plan -> review -> execute -> verify",
         ["Analisar requisitos antes de planejar",
          "Arquitetura antes de implementacao",
          "Steps incrementais e verificaVeis",
          "Documentar decisoes, nao so acoes"]),

        ("research.*before.*code|search.*first|tool availability preflight",
         "Search First (Research Before Code)",
         "analyze -> search -> evaluate -> decide -> implement",
         ["Pesquisar antes de codificar",
          "Avaliar candidatos com criterios objetivos",
          "Preferir adopt/extend sobre build",
          "Verificar canais disponiveis antes de pesquisar"]),
    ]

    for regex, concept, pattern, principles in patterns:
        if re.search(regex, text, re.IGNORECASE):
            dna["concept"] = concept
            dna["pattern"] = pattern
            dna["principles"] = principles
            break

    # Fallback: se nao encontrou pattern, inferir do nome
    if not dna["concept"]:
        m = re.search(r'displayName:\s*"([^"]+)"', text)
        if m:
            name = m.group(1)
            dna["concept"] = f"{name} Agent"
            dna["pattern"] = f"{name.lower()} workflow"

    # --- REGRA 2: Extrair workflow steps ---
    # Busca secoes nomeadas
    sec_names = r"(?:TDD Workflow|Workflow|Planning Process|Process|Steps)"
    m = re.search(sec_names + r"\s*\n(.*?)(?=\n#|\Z)", text, re.DOTALL | re.IGNORECASE)
    if m:
        steps = re.findall(r"^\s*\d+[.)]\s+(.*)$", m.group(1), re.MULTILINE)
        if steps:
            dna["workflow"] = [s.strip().rstrip(":**") for s in steps[:10]]

    # Fallback: qualquer lista numerada
    if not dna["workflow"]:
        steps = re.findall(r"(?:^|\n)\s*\d+[.)]\s+([^\n]+)", text)
        if steps:
            dna["workflow"] = [s.strip() for s in steps[:8]]

    # --- REGRA 3: Extrair red flags / anti-patterns ---
    m = re.search(r"(?:Red Flag|Anti.Pattern|Warning|Cuidado|Atencao|Evite|Avoid)"
                  r"[^\n]*\n(.*?)(?=\n#|\Z)", text, re.DOTALL | re.IGNORECASE)
    if m:
        flags = re.findall(r"(?:^|\n)\s*[-*]\s+([^\n]+)", m.group(1))
        if not flags:
            flags = re.findall(r"(?:^|\n)\s*\d+[.)]\s+([^\n]+)", m.group(1))
        dna["redFlags"] = [f.strip() for f in flags[:6]]

    # --- REGRA 4: Extrair quality checks ---
    m = re.search(r"(?:Quality Checklist|Checklist|Success Criteria|Definition of Done)"
                  r"[^\n]*\n(.*?)(?=\n#|\Z)", text, re.DOTALL | re.IGNORECASE)
    if m:
        checks = re.findall(r"(?:^|\n)\s*[-*\[\]vV\s]*([^\n]+)", m.group(1))
        dna["qualityChecks"] = [c.strip() for c in checks[:12] if len(c.strip()) > 3]

    return dna


def assess_quality(text):
    """Avalia a qualidade do agente objetivamente."""
    score = 5.0

    if re.search(r'/\*\*.*?\*/', text, re.DOTALL):
        score += 0.5
    if re.search(r'(?i)example|exemplo|worked', text):
        score += 0.8
    if re.search(r'(?i)workflow|process|fluxo|step', text):
        score += 0.7
    if re.search(r'(?i)red flag|anti.pattern|warning|cuidado', text):
        score += 0.5
    if re.search(r'(?i)checklist|success criteria|definition of done', text):
        score += 0.5

    lines = text.split('\n')
    if len(lines) > 100:
        score += 0.5
    if re.search(r'(?i)(?:see|refer|fonte|source|docs?):', text):
        score += 0.5
    if re.search(r'(?i)integration|combine|with.*agent', text):
        score += 0.5
    if not re.search(r'(?:##|###)', text):
        score -= 1.0

    score = max(1.0, min(10.0, score))
    confidence = round(0.5 + (score / 10.0) * 0.4, 2)

    return {"quality": round(score, 1), "confidence": confidence, "lines": len(lines)}


def process_agent(filepath):
    """Processa um agente e retorna seu DNA."""
    text = read_file(filepath)
    if not text:
        return None

    fname = os.path.basename(filepath)
    print(f"\n  Analisando: {fname}")

    meta = extract_agent_metadata(text, fname)
    dna = extract_dna(text)
    qual = assess_quality(text)

    print(f"     ID: {meta.get('id', '?')}  |  Model: {meta.get('model', '?')}")
    print(f"     Tools: {', '.join(meta['tools'][:5])}")

    applicable = ["freebuff", "any-agent-framework"]
    if meta["tools"]:
        if any("code" in t.lower() or "search" in t.lower() for t in meta["tools"]):
            applicable.append("any-codebase")

    result = {
        "concept": dna["concept"] or f"{meta.get('id', fname)} Agent",
        "description": meta.get("description") or f"Agente especializado em {dna.get('concept', '...')}",
        "origin": f"ECC/agents/{meta.get('id', 'unknown')}.md (via Smith v3.0)",
        "quality": qual["quality"],
        "confidence": qual["confidence"],
        "applicableTo": applicable,
        "pattern": dna["pattern"] or "generic workflow",
        "metadata": {"filename": fname, "model": meta.get("model"),
                     "tools": meta["tools"], "lines": qual["lines"]},
        "principles": dna["principles"],
        "workflow": dna["workflow"],
        "redFlags": dna["redFlags"],
        "qualityChecks": dna["qualityChecks"],
    }

    print(f"     DNA: {result['concept']}")
    print(f"     Padrao: {result['pattern']}")
    print(f"     Qualidade: {result['quality']}/10 (confianca: {result['confidence']})")

    return result


def run_all():
    root = Path(__file__).parent.parent
    agents = [root / ".agents" / "ecc" / "planner.ts",
              root / ".agents" / "ecc" / "tdd-guide.ts"]

    out_dir = root / "docs" / "poc-results"
    out_dir.mkdir(parents=True, exist_ok=True)

    print("=" * 60)
    print("POC: Extracao de DNA de Agentes")
    print("=" * 60)
    print(f"\nTestando {len(agents)} agentes...")

    results = []
    for ap in agents:
        if not ap.exists():
            print(f"\n  Nao encontrado: {ap}")
            continue
        dna = process_agent(str(ap))
        if dna:
            results.append(dna)
            out = out_dir / f"dna-{dna['metadata']['filename'].replace('.ts', '.json')}"
            with open(out, "w", encoding="utf-8") as f:
                json.dump(dna, f, ensure_ascii=False, indent=2)
            print(f"  Salvo em: {out}")
            print()

    # Resumo
    print("=" * 60)
    print("RESUMO DO POC")
    print("=" * 60)
    print(f"\nAgentes analisados: {len(results)}/{len(agents)}")
    print(f"DNAs extraidos: {len(results)}")

    for r in results:
        print(f"\n  {r['metadata']['filename']}")
        print(f"    -> {r['concept']}")
        print(f"       Padrao: {r['pattern']}")
        print(f"       Qualidade: {r['quality']}/10")
        print(f"       Principios: {len(r['principles'])}")
        print(f"       Steps: {len(r['workflow'])}")
        if r['redFlags']: print(f"       Red flags: {len(r['redFlags'])}")
        if r['qualityChecks']: print(f"       Quality checks: {len(r['qualityChecks'])}")

    print(f"\nResultados em: {out_dir}/")
    print("=" * 60)
    return results


def run_single(path):
    dna = process_agent(path)
    if dna:
        print("\n" + json.dumps(dna, ensure_ascii=False, indent=2))
    return dna


if __name__ == "__main__":
    if "--agent" in sys.argv:
        i = sys.argv.index("--agent") + 1
        if i < len(sys.argv):
            run_single(sys.argv[i])
        else:
            print("Uso: python3 scripts/poc-dna-extraction.py --agent CAMINHO")
    else:
        run_all()
