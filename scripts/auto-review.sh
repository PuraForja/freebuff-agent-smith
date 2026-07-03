#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
#  auto-review.sh — Ciclo de Auto-Revisão Automatizado
# ═══════════════════════════════════════════════════════════════
#  Executa verification-loop + quality-gate em sequência.
#  Uso:   bash scripts/auto-review.sh
# ═══════════════════════════════════════════════════════════════

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BRIDGE_DIR="$(dirname "$SCRIPT_DIR")"
REPORT="$BRIDGE_DIR/logs/auto-review-$(date +%Y%m%d-%H%M%S).md"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; NC='\033[0m'

PASS=0; FAIL=0; WARN=0; FIXES=0

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      🔄  AUTO-REVIEW — Ciclo Completo de Qualidade          ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

check() {
    local desc="$1"; shift
    if "$@" 2>/dev/null; then
        echo -e "  ${GREEN}✅${NC} $desc"
        PASS=$((PASS + 1))
        return 0
    else
        echo -e "  ${RED}❌${NC} $desc"
        FAIL=$((FAIL + 1))
        return 1
    fi
}

warn() {
    local desc="$1"; shift
    if "$@" 2>/dev/null; then
        echo -e "  ${GREEN}✅${NC} $desc"
        PASS=$((PASS + 1))
    else
        echo -e "  ${YELLOW}⚠️${NC} $desc"
        WARN=$((WARN + 1))
    fi
}

# ═══════════════════════════════════════════════════════════════
# STEP 1: VERIFICATION LOOP
# ═══════════════════════════════════════════════════════════════
echo -e "${CYAN}[1/4] VERIFICATION LOOP — Verificações Técnicas${NC}"
echo ""

# Sintaxe bash
cd "$BRIDGE_DIR"
for f in scripts/*.sh; do
    check "Sintaxe: $f" bash -n "$f"
done

# Permissões
for f in scripts/*.sh; do
    if [ ! -x "$f" ]; then
        chmod +x "$f"
        echo -e "  ${YELLOW}🔧${NC} Permissão corrigida: $f"
        FIXES=$((FIXES + 1))
    fi
done
echo -e "  ${GREEN}✅${NC} Permissões de execução verificadas"
PASS=$((PASS + 1))

# Arquivos essenciais
for f in CATALOGO.md SESSAO.md README.md .codebuff/instructions.md scripts/sync-ecc.sh; do
    [ -f "$f" ] && check "Arquivo existe: $f" test -f "$f"
done

# Encoding
echo ""
for f in CATALOGO.md SESSAO.md README.md .codebuff/instructions.md scripts/*.sh skills/*.md agents/*.md; do
    if [ -f "$f" ]; then
        enc=$(file -b --mime-encoding "$f" 2>/dev/null)
        warn "Encoding UTF-8: $f ($enc)" test "$enc" = "utf-8"
    fi
done
echo ""

# ═══════════════════════════════════════════════════════════════
# STEP 2: QUALITY GATE
# ═══════════════════════════════════════════════════════════════
echo -e "${CYAN}[2/4] QUALITY GATE — Checklist de Qualidade${NC}"
echo ""

# Integridade
warn "Tamanho mínimo CATALOGO.md > 1KB" test "$(stat -c%s CATALOGO.md 2>/dev/null || echo 0)" -gt 1024
warn "SESSAO.md contém instruções de continuidade" grep -q "continuar" SESSAO.md 2>/dev/null

# Documentação
warn "README.md existe e tem conteúdo" test -s README.md 2>/dev/null
warn ".codebuff/instructions.md existe" test -f .codebuff/instructions.md 2>/dev/null

# Validação cruzada (skills no diretório vs skills listadas no catálogo)
SKILLS_DIR=$(ls skills/*.md 2>/dev/null | wc -l)
SKILLS_CAT=$(grep -c "ECC → Bridge |" CATALOGO.md 2>/dev/null || echo 0)
warn "Skills no diretório ($SKILLS_DIR) ≈ Skills no catálogo ($SKILLS_CAT)" \
    test "$SKILLS_DIR" -eq "$SKILLS_CAT" 2>/dev/null || test "$((SKILLS_DIR - SKILLS_CAT))" -lt 2 2>/dev/null

# Proveniência
warn "Fonte ECC registrada no CATALOGO" grep -q "affaan-m/ECC" CATALOGO.md 2>/dev/null
warn "Data no SESSAO.md" grep -q "2026" SESSAO.md 2>/dev/null

echo ""

# ═══════════════════════════════════════════════════════════════
# STEP 3: CONTINUOUS LEARNING
# ═══════════════════════════════════════════════════════════════
echo -e "${CYAN}[3/4] CONTINUOUS LEARNING — Registro${NC}"
echo ""

cd "$BRIDGE_DIR"
LEARN_COUNT=$(grep -c "Lições aprendidas" SESSAO.md 2>/dev/null || echo 0)
TOTAL=$((LEARN_COUNT + 1))
[ "$TOTAL" -eq 1 ] && LABEL="seção" || LABEL="seções"
echo -e "  ${GREEN}📝${NC} $TOTAL $LABEL de aprendizado registrada(s) no SESSAO.md"
echo ""

# ═══════════════════════════════════════════════════════════════
# STEP 4: RELATÓRIO
# ═══════════════════════════════════════════════════════════════
echo -e "${CYAN}[4/4] Gerando relatório...${NC}"

{
    echo "# 📋 Auto-Review Report"
    echo "**Data:** $(date '+%Y-%m-%d %H:%M:%S')"
    echo "**Projeto:** freebuff-ecc-bridge"
    echo ""
    echo "## Resultados"
    echo ""
    echo "| Status | Qtde |"
    echo "|--------|:----:|"
    echo "| ✅ Passaram | $PASS |"
    echo "| ❌ Falharam | $FAIL |"
    echo "| ⚠️ Alertas  | $WARN |"
    echo "| 🔧 Correções | $FIXES |"
    echo ""
    if [ "$FIXES" -gt 0 ]; then
        echo "**🔧 Correções automáticas aplicadas:**"
        echo "- Permissões de execução em scripts"
        echo ""
    fi
    echo "## Itens Verificados"
    echo "- Sintaxe bash de todos os scripts"
    echo "- Permissões de execução"
    echo "- Arquivos essenciais existem"
    echo "- Encoding UTF-8"
    echo "- Tamanho mínimo dos arquivos"
    echo "- Documentação presente"
    echo "- Validação cruzada diretório × catálogo"
    echo "- Proveniência e datas registradas"
} > "$REPORT"

# ═══════════════════════════════════════════════════════════════
# RESUMO FINAL
# ═══════════════════════════════════════════════════════════════
echo ""
echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                     ✅  AUTO-REVIEW CONCLUÍDO                 ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "   ✅ ${GREEN}Passaram:${NC} $PASS   ❌ ${RED}Falharam:${NC} $FAIL   ⚠️  ${YELLOW}Alertas:${NC} $WARN   🔧 ${CYAN}Correções:${NC} $FIXES"
echo ""
echo -e "   📄 ${BLUE}Relatório:${NC} $REPORT"
echo ""

if [ "$FAIL" -gt 0 ] || [ "$WARN" -gt 0 ]; then
    echo -e "   ${YELLOW}💡 Dica: Revise os itens com ❌ ou ⚠️ antes de prosseguir.${NC}"
    echo ""
fi

exit $((FAIL > 0 ? 1 : 0))
