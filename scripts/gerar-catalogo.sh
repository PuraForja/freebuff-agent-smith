#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
#  gerar-catalogo.sh — Gerador do Catálogo Freebuff Agente Smit
# ═══════════════════════════════════════════════════════════════
#  Atualiza o CATALOGO.md com TODOS os agentes e skills
#  disponíveis na bridge e no ECC (incluindo descrições).
# ═══════════════════════════════════════════════════════════════

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BRIDGE_DIR="$(dirname "$SCRIPT_DIR")"
ECC_DIR="$(dirname "$BRIDGE_DIR")/ECC"

CATALOGO="$BRIDGE_DIR/CATALOGO.md"
TIMESTAMP=$(date "+%d/%m/%Y")

# Função para escapar pipes e caracteres especiais em descrições
escapedesc() {
    echo "$1" | sed 's/|/\\|/g' | sed 's/^ *//;s/ *$//' | head -c 100
}

echo "🔍 Gerando catálogo..."
echo "   Bridge: $BRIDGE_DIR"
echo "   ECC:    $ECC_DIR"
echo ""

# ─── Início do catálogo ───────────────────────────────────
cat > "$CATALOGO" << EOF
# 📋 Catálogo — Freebuff Agente Smit

> **Última atualização:** $TIMESTAMP
> **Propósito:** Listar TODOS os agentes, skills e recursos disponíveis na bridge e no ECC.
> **Fonte:** [github.com/affaan-m/ECC](https://github.com/affaan-m/ECC) — adaptado via bridge
> **Gerado automaticamente por:** \`scripts/gerar-catalogo.sh\`

---

## 🎯 Agentes na Bridge

Adaptados do ECC para usar no Codebuff via \`@NomeDoAgente\`.

| Agente | Descrição | Origem |
|--------|-----------|:------:|
EOF

for f in "$BRIDGE_DIR/agents/"*.md; do
    [ ! -f "$f" ] && continue
    name=$(basename "$f" .md)
    desc_raw=$(grep -m1 '## Descrição' "$f" 2>/dev/null | sed 's/## Descrição//' | head -c 80 || echo "")
    [ -z "$desc_raw" ] && desc_raw=$(grep -m1 'description:' "$f" 2>/dev/null | sed 's/description: *//' | tr -d '"' | head -c 80 || echo "Sem descrição")
    desc=$(escapedesc "$desc_raw")
    echo "| \`$name\` | $desc | ECC |" >> "$CATALOGO"
done

# ─── Skills na Bridge ──────────────────────────────────────
cat >> "$CATALOGO" << EOF

---

## 🧠 Skills na Bridge

Adaptadas do ECC para usar no Codebuff via \`skill "nome-da-skill"\`.

| Skill | Descrição | Origem |
|-------|-----------|:------:|
EOF

for f in "$BRIDGE_DIR/skills/"*.md; do
    [ ! -f "$f" ] && continue
    name=$(basename "$f" .md)
    desc_raw=$(grep -m1 '## Descrição' "$f" 2>/dev/null | sed 's/## Descrição//' | head -c 100 || echo "")
    [ -z "$desc_raw" ] && desc_raw=$(grep -m1 '# 🧠' "$f" 2>/dev/null | sed 's/# 🧠 Skill: //' | head -c 100 || echo "Sem descrição")
    desc=$(escapedesc "$desc_raw")
    echo "| \`$name\` | $desc | ECC → Bridge |" >> "$CATALOGO"
done

# ─── Catálogo COMPLETO do ECC ──────────────────────────────
if [ -d "$ECC_DIR/agents" ]; then
    TOTAL_AGENTES_ECC=$(ls "$ECC_DIR/agents/"*.md 2>/dev/null | wc -l)
fi
if [ -d "$ECC_DIR/skills" ]; then
    TOTAL_SKILLS_ECC=$(ls -d "$ECC_DIR/skills/"*/ 2>/dev/null | wc -l)
fi

# --- Skills ECC (TODAS as 277) ---
if [ -d "$ECC_DIR/skills" ] && [ "$TOTAL_SKILLS_ECC" -gt 0 ]; then

    cat >> "$CATALOGO" << EOF

---

## 🌐 Catálogo Completo do ECC ($((TOTAL_AGENTES_ECC + TOTAL_SKILLS_ECC)) recursos)

### 🧠 Skills ECC ($TOTAL_SKILLS_ECC disponíveis)

<details>
<summary>📋 Clique para ver TODAS as $TOTAL_SKILLS_ECC skills</summary>

| Skill | Na Bridge |
|-------|:---------:|
EOF

    # Constrói array associativo bridge skills para lookup O(1)
    declare -A BRIDGE_SKILL_NAMES
    for bf in "$BRIDGE_DIR/skills/"*.md; do
        [ ! -f "$bf" ] && continue
        bn=$(basename "$bf" .md)
        BRIDGE_SKILL_NAMES["$bn"]=1
    done

    # Lista TODAS as skills do ECC, não só as mapeadas
    for skill_dir in "$ECC_DIR/skills/"*/; do
        [ ! -d "$skill_dir" ] && continue
        name=$(basename "$skill_dir")
        # Verificação rápida: nome exato OU renomeado via SKILL_RENAME
        if [ -n "${BRIDGE_SKILL_NAMES[$name]:-}" ]; then
            na_bridge="✅"
        else
            # Verifica renomeações comuns
            for bsn in "${!BRIDGE_SKILL_NAMES[@]}"; do
                if grep -qi "$name" <<< "$bsn" 2>/dev/null; then
                    na_bridge="✅"
                    break
                fi
            done
        fi
        echo "| \`$name\` | $na_bridge |" >> "$CATALOGO"
    done

    echo "</details>" >> "$CATALOGO"
fi

# --- Agentes ECC (TODOS os 66) ---
if [ -d "$ECC_DIR/agents" ] && [ "$TOTAL_AGENTES_ECC" -gt 0 ]; then

    cat >> "$CATALOGO" << EOF

### 🎯 Agentes ECC ($TOTAL_AGENTES_ECC disponíveis)

<details>
<summary>📋 Clique para ver TODOS os $TOTAL_AGENTES_ECC agentes</summary>

| Agente | Descrição | Na Bridge |
|--------|-----------|:---------:|
EOF

    for f in "$ECC_DIR/agents/"*.md; do
        [ ! -f "$f" ] && continue
        name=$(basename "$f" .md)
        desc_raw=$(grep -m1 'description:' "$f" 2>/dev/null | sed 's/description: *//' | tr -d '"' | head -c 80 || echo "Sem descrição")
        desc=$(escapedesc "$desc_raw")
        na_bridge="❌"
        [ -f "$BRIDGE_DIR/agents/$name.md" ] && na_bridge="✅"
        echo "| $name | $desc | $na_bridge |" >> "$CATALOGO"
    done

    echo "</details>" >> "$CATALOGO"
fi

# ─── Estatísticas ──────────────────────────────────────────
SKILLS_BRIDGE=$(ls "$BRIDGE_DIR/skills/"*.md 2>/dev/null | wc -l)
AGENTES_BRIDGE=$(ls "$BRIDGE_DIR/agents/"*.md 2>/dev/null | wc -l)

cat >> "$CATALOGO" << EOF

---

## 📈 Estatísticas

| Item | Qtde |
|------|:----:|
| Skills ECC | $TOTAL_SKILLS_ECC |
| Agentes ECC | $TOTAL_AGENTES_ECC |
| Skills na Bridge | $SKILLS_BRIDGE |
| Agentes na Bridge | $AGENTES_BRIDGE |
| **Cobertura (skills)** | **$(echo "scale=1; $SKILLS_BRIDGE * 100 / $TOTAL_SKILLS_ECC" | bc 2>/dev/null || echo "0")%** |
| **Cobertura (agentes)** | **$(echo "scale=1; $AGENTES_BRIDGE * 100 / $TOTAL_AGENTES_ECC" | bc 2>/dev/null || echo "0")%** |

---

*Catálogo gerado em $TIMESTAMP. Para atualizar: \`scripts/gerar-catalogo.sh\`*
EOF

echo "✅ Catálogo gerado: $CATALOGO"
echo "   Bridge: $AGENTES_BRIDGE agentes · $SKILLS_BRIDGE skills"
echo "   ECC:    $TOTAL_AGENTES_ECC agentes · $TOTAL_SKILLS_ECC skills"
