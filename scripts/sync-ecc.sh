#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
#  sync-ecc.sh — Sincronizador ECC → Freebuff Bridge
# ═══════════════════════════════════════════════════════════════
#  Uso:   ./scripts/sync-ecc.sh
#  Função:
#   1. git pull no repositório ECC oficial
#   2. Mostra as NOVIDADES do ECC (commits recentes + changelog)
#   3. Detecta skills NOVOS ou ATUALIZADOS
#   4. Detecta agentes NOVOS ou ATUALIZADOS
#   5. Detecta regras NOVAS ou ATUALIZADAS
#   6. Detecta comandos NOVOS ou ATUALIZADOS
#   7. Detecta hooks NOVOS ou ATUALIZADOS
#   8. Detecta contextos NOVOS ou ATUALIZADOS
#   9. Atualiza catálogo (CATALOGO.md) e histórico
# ═══════════════════════════════════════════════════════════════

set -euo pipefail
shopt -s nullglob 2>/dev/null || true

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; MAGENTA='\033[0;35m'; CYAN='\033[0;36m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BRIDGE_DIR="$(dirname "$SCRIPT_DIR")"

detectar_workspace() {
    local dir="$BRIDGE_DIR"
    while [ "$dir" != "/" ]; do
        if [ -d "$dir/ECC/.git" ]; then
            echo "$dir"
            return 0
        fi
        dir="$(dirname "$dir")"
    done
    echo ""
    return 1
}

WORKSPACE_DIR=$(detectar_workspace) || {
    echo -e "${RED}❌ Não foi possível encontrar o workspace (pasta com ECC/)${NC}"
    echo "   Esperado em: $(dirname "$BRIDGE_DIR")/ECC/"
    exit 1
}

ECC_DIR="$WORKSPACE_DIR/ECC"
BRIDGE_SKILLS="$BRIDGE_DIR/skills"
BRIDGE_AGENTS="$BRIDGE_DIR/agents"
BRIDGE_RULES="$BRIDGE_DIR/rules"
BRIDGE_COMMANDS="$BRIDGE_DIR/commands"
BRIDGE_HOOKS="$BRIDGE_DIR/hooks"
BRIDGE_CONTEXTS="$BRIDGE_DIR/contexts"
BRIDGE_LOGS="$BRIDGE_DIR/logs"
mkdir -p "$BRIDGE_SKILLS" "$BRIDGE_AGENTS" "$BRIDGE_RULES" "$BRIDGE_COMMANDS" \
        "$BRIDGE_HOOKS" "$BRIDGE_CONTEXTS" "$BRIDGE_LOGS"

LAST_HASH_FILE="$BRIDGE_DIR/logs/.ultimo_hash_ecc"
TIMESTAMP_FILE="$BRIDGE_DIR/logs/.ultima_sincronizacao"

NOVAS_SKILLS=0; NOVOS_AGENTES=0; NOVAS_REGRAS=0; NOVOS_COMANDOS=0
NOVOS_HOOKS=0; NOVOS_CONTEXTOS=0
SKILLS_ATUALIZADAS=0; AGENTES_ATUALIZADOS=0; REGRAS_ATUALIZADAS=0
COMANDOS_ATUALIZADOS=0; HOOKS_ATUALIZADOS=0; CONTEXTOS_ATUALIZADOS=0
TEVE_NOVIDADES=false

# ═══════════════════════════════════════════════════════════════
# FUNÇÕES
# ═══════════════════════════════════════════════════════════════

mostrar_novidades_ecc() {
    local hash_anterior="$1"
    local hash_atual="$2"

    echo ""
    echo -e "${MAGENTA}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║          🆕  NOVIDADES DO ECC  🆕                            ║${NC}"
    echo -e "${MAGENTA}╚═══════════════════════════════════════════════════════════════╝${NC}"
    echo ""

    [ ! -d "$ECC_DIR/.git" ] && return

    local changelog="$ECC_DIR/CHANGELOG.md"
    if [ -f "$changelog" ]; then
        echo -e "   ${CYAN}📋 Últimas versões do ECC:${NC}"
        echo ""
        grep "^## " "$changelog" | head -5 | while IFS= read -r line; do
            echo -e "     ${GREEN}${line}${NC}"
        done
        echo ""
    fi

    cd "$ECC_DIR"
    local total_commits
    total_commits=$(git log --oneline "${hash_anterior}..${hash_atual}" 2>/dev/null | wc -l || echo 0)
    cd "$WORKSPACE_DIR"

    if [ "$total_commits" -gt 0 ]; then
        echo -e "   ${CYAN}📝 ${total_commits} novos commits desde a última sincronização:${NC}"
        echo ""

        cd "$ECC_DIR"
        local feat_count=0 fix_count=0 chore_count=0 docs_count=0 refactor_count=0 other_count=0
        while IFS= read -r linha; do
            case "$linha" in
                *feat*) feat_count=$((feat_count + 1)) ;;
                *fix*)  fix_count=$((fix_count + 1)) ;;
                *chore*) chore_count=$((chore_count + 1)) ;;
                *docs*) docs_count=$((docs_count + 1)) ;;
                *refactor*) refactor_count=$((refactor_count + 1)) ;;
                *) other_count=$((other_count + 1)) ;;
            esac
        done < <(git log --oneline "${hash_anterior}..${hash_atual}" 2>/dev/null || true)
        cd "$WORKSPACE_DIR"

        echo -e "     ${GREEN}✨ feat:${NC} $feat_count   ${RED}🐛 fix:${NC} $fix_count   ${YELLOW}🔧 chore:${NC} $chore_count"
        echo -e "     ${BLUE}📖 docs:${NC} $docs_count   ${MAGENTA}♻️ refactor:${NC} $refactor_count   outros: $other_count"
        echo ""

        echo -e "   ${CYAN}📌 Commits mais recentes:${NC}"
        echo ""
        cd "$ECC_DIR"
        git log --oneline --color=always "${hash_anterior}..${hash_atual}" 2>/dev/null | head -15 | while IFS= read -r linha; do
            echo -e "     ${linha}"
        done
        cd "$WORKSPACE_DIR"

        if [ "$total_commits" -gt 15 ]; then
            echo -e "     ${YELLOW}... e mais $((total_commits - 15)) commits ($total_commits no total)${NC}"
        fi
        echo ""

        cd "$ECC_DIR"
        local changed_skills=$(git diff --name-only "${hash_anterior}..${hash_atual}" -- skills/ 2>/dev/null | grep -c "/SKILL.md" || true)
        local changed_agents=$(git diff --name-only "${hash_anterior}..${hash_atual}" -- agents/ 2>/dev/null | wc -l || true)
        local changed_rules=$(git diff --name-only "${hash_anterior}..${hash_atual}" -- rules/ 2>/dev/null | wc -l || true)
        local changed_commands=$(git diff --name-only "${hash_anterior}..${hash_atual}" -- commands/ 2>/dev/null | wc -l || true)
        local changed_hooks=$(git diff --name-only "${hash_anterior}..${hash_atual}" -- hooks/ 2>/dev/null | wc -l || true)
        local changed_contexts=$(git diff --name-only "${hash_anterior}..${hash_atual}" -- contexts/ 2>/dev/null | wc -l || true)

        if [ "$changed_skills" -gt 0 ]; then
            echo -e "   ${GREEN}🧠 Skills alteradas: $changed_skills${NC}"
        fi
        if [ "$changed_agents" -gt 0 ]; then
            echo -e "   ${GREEN}🎯 Agentes alterados: $changed_agents${NC}"
        fi
        if [ "$changed_rules" -gt 0 ]; then
            echo -e "   ${GREEN}📏 Regras alteradas: $changed_rules${NC}"
        fi
        if [ "$changed_commands" -gt 0 ]; then
            echo -e "   ${GREEN}⚡ Comandos alterados: $changed_commands${NC}"
        fi
        if [ "$changed_hooks" -gt 0 ]; then
            echo -e "   ${GREEN}🔌 Hooks alterados: $changed_hooks${NC}"
        fi
        if [ "$changed_contexts" -gt 0 ]; then
            echo -e "   ${GREEN}📝 Contextos alterados: $changed_contexts${NC}"
        fi

        cd "$WORKSPACE_DIR"
        local hca="${hash_anterior:0:7}"
        local hcu="${hash_atual:0:7}"
        echo -e "   ${YELLOW}🔗 Compare: https://github.com/affaan-m/ECC/compare/${hca}...${hcu}${NC}"
        echo ""
    fi
}

# ═══════════════════════════════════════════════════════════════
# GERADORES — Usam env vars para passar dados ao Python
# ═══════════════════════════════════════════════════════════════

gerar_skill() {
    local origem="$1" destino="$2" nome_ecc="$3" nome_bridge="$4"
    local descricao=$(grep -m1 'description:' "$origem" 2>/dev/null | sed 's/description: *//' | tr -d '"' || echo "Skill adaptada do ECC: $nome_ecc")
    local corpo=$(sed -n '/^#/,$p' "$origem" 2>/dev/null || echo "")
    [ -z "$corpo" ] && corpo=$(tail -n +20 "$origem" 2>/dev/null | head -50)
    local tem_hooks=false
    grep -qi "hook\\|PreToolUse\\|PostToolUse\\|/multi-plan\\|settings.json" <<< "$corpo" 2>/dev/null && tem_hooks=true
    local data_agora=$(date "+%Y-%m-%d %H:%M:%S")

    export PY_SRC_NOME_BRIDGE="$nome_bridge"
    export PY_SRC_NOME_ECC="$nome_ecc"
    export PY_SRC_DESTINO="$destino"
    export PY_SRC_DESCRICAO="$descricao"
    export PY_SRC_CORPO="$corpo"
    export PY_SRC_DATA="$data_agora"
    export PY_SRC_TEM_HOOKS="$([ "$tem_hooks" = true ] && echo 'True' || echo 'False')"

    if ! python3 << 'PYEOF' 2>&1; then
import os
nb = os.environ.get('PY_SRC_NOME_BRIDGE', '')
ne = os.environ.get('PY_SRC_NOME_ECC', '')
de = os.environ.get('PY_SRC_DESTINO', '')
ds = os.environ.get('PY_SRC_DESCRICAO', '')
cp = os.environ.get('PY_SRC_CORPO', '')[:3000]
da = os.environ.get('PY_SRC_DATA', '')
th = os.environ.get('PY_SRC_TEM_HOOKS', 'False') == 'True'
ah = '> ⚠️ Esta skill original usava hooks do Claude Code. Adaptada para Codebuff.' if th else ''

c = f'''# 🧠 Skill: {nb}

> **Adaptada do ECC:** \\`{ne}\\` — via \\`sync-ecc.sh\\`
> **Fonte original:** \\`ECC/skills/{ne}/SKILL.md\\`

## Descrição

{ds}

---

## ⚠️ Adaptação para Codebuff

{ah}

| Conceito ECC (Claude) | Equivalente Codebuff |
|-----------------------|---------------------|
| Hooks | Instruções no .codebuff/instructions.md |
| Comandos slash | Skills via \\`skill\\` tool |
| \\`settings.json\\` | .codebuff/instructions.md |
| Rules em \\`~/.claude/rules/\\` | Skills em .agents/skills/ |

---

## Conteúdo Adaptado

{cp}

---

**ECC Original:** \\`ECC/skills/{ne}/SKILL.md\\`
**Atualizado em:** {da}
'''

with open(de, 'w', encoding='utf-8') as f:
    f.write(c)
print('OK')
PYEOF
        echo -e "   ${RED}✗${NC} Erro ao gerar ${nome_bridge} (fallback)"
        {
            echo "# 🧠 Skill: ${nome_bridge}"
            echo ""
            echo "**Adaptada do ECC:** \\`${nome_ecc}\\`"
            echo ""
            echo "## Descrição"
            echo "${descricao}"
            echo ""
            echo "## Referência"
            echo "- ECC Original: \\`ECC/skills/${nome_ecc}/SKILL.md\\`"
            echo ""
            echo "⚠️ **Arquivo gerado via fallback — versão pode estar incompleta**"
        } > "$destino"
    fi
    echo -e "   ${GREEN}   ✔${NC} Adaptado: ${nome_bridge}"
}

gerar_agente() {
    local origem="$1" destino="$2" nome_ecc="$3" nome_bridge="$4"
    local descricao=$(grep -m1 'description:' "$origem" 2>/dev/null | sed 's/description: *//' | tr -d '"' || echo "Agente adaptado do ECC: $nome_ecc")
    local corpo=$(tail -n +20 "$origem" 2>/dev/null | head -80)
    local data_agora=$(date "+%Y-%m-%d %H:%M:%S")

    export PY_SRC_NOME_BRIDGE="$nome_bridge"
    export PY_SRC_NOME_ECC="$nome_ecc"
    export PY_SRC_DESTINO="$destino"
    export PY_SRC_DESCRICAO="$descricao"
    export PY_SRC_CORPO="$corpo"
    export PY_SRC_DATA="$data_agora"

    if ! python3 << 'PYEOF' 2>&1; then
import os
nb = os.environ.get('PY_SRC_NOME_BRIDGE', '')
ne = os.environ.get('PY_SRC_NOME_ECC', '')
de = os.environ.get('PY_SRC_DESTINO', '')
ds = os.environ.get('PY_SRC_DESCRICAO', '')
cp = os.environ.get('PY_SRC_CORPO', '')
da = os.environ.get('PY_SRC_DATA', '')

c = f'''# 🎯 Agente: {nb}

**Adaptado do ECC:** \\`{ne}\\`
**Fonte:** \\`ECC/agents/{ne}.md\\`

## Descrição
{ds}

## Como usar
> @"{nb}" [sua solicitação]

---

{cp}

**Atualizado em:** {da}
'''

with open(de, 'w', encoding='utf-8') as f:
    f.write(c)
print('OK')
PYEOF
        echo -e "   ${RED}✗${NC} Erro ao gerar ${nome_bridge} (fallback)"
        {
            echo "# 🎯 Agente: ${nome_bridge}"
            echo ""
            echo "**Adaptado do ECC:** \\`${nome_ecc}\\`"
            echo ""
            echo "## Descrição"
            echo "${descricao}"
            echo ""
            echo "⚠️ **Arquivo gerado via fallback — versão pode estar incompleta**"
        } > "$destino"
    fi
    echo -e "   ${GREEN}   ✔${NC} Adaptado: ${nome_bridge}"
}

gerar_regra() {
    local origem="$1" destino="$2" linguagem="$3" tipo="$4"
    local nome_bridge="${linguagem}-${tipo}"
    local descricao=$(head -5 "$origem" 2>/dev/null | grep -m1 '#' | sed 's/^#* *//' || echo "Regra ECC para $linguagem: $tipo")
    local corpo=$(cat "$origem" 2>/dev/null | head -100)
    local data_agora=$(date "+%Y-%m-%d %H:%M:%S")

    export PY_SRC_LINGUAGEM="$linguagem"
    export PY_SRC_TIPO="$tipo"
    export PY_SRC_DESTINO="$destino"
    export PY_SRC_DESCRICAO="$descricao"
    export PY_SRC_CORPO="$corpo"
    export PY_SRC_DATA="$data_agora"

    if ! python3 << 'PYEOF' 2>&1; then
import os
lg = os.environ.get('PY_SRC_LINGUAGEM', '')
tp = os.environ.get('PY_SRC_TIPO', '')
de = os.environ.get('PY_SRC_DESTINO', '')
ds = os.environ.get('PY_SRC_DESCRICAO', '')
cp = os.environ.get('PY_SRC_CORPO', '')[:3000]
da = os.environ.get('PY_SRC_DATA', '')

c = f'''# 📏 Regra: {lg} — {tp}

> **Adaptada do ECC:** \\`rules/{lg}/{tp}.md\\`
> **Fonte original:** \\`ECC/rules/{lg}/{tp}.md\\`

## Descrição

{ds}

---

## Conteúdo Adaptado

{cp}

---

**ECC Original:** \\`ECC/rules/{lg}/{tp}.md\\`
**Atualizado em:** {da}
'''

with open(de, 'w', encoding='utf-8') as f:
    f.write(c)
print('OK')
PYEOF
        echo -e "   ${RED}✗${NC} Erro ao gerar ${nome_bridge} (fallback)"
        {
            echo "# 📏 Regra: ${linguagem} — ${tipo}"
            echo ""
            echo "**Adaptada do ECC:** \\`rules/${linguagem}/${tipo}.md\\`"
            echo ""
            echo "${descricao}"
            echo ""
            echo "⚠️ **Arquivo gerado via fallback — versão pode estar incompleta**"
        } > "$destino"
    fi
    echo -e "   ${GREEN}   ✔${NC} Adaptado: ${nome_bridge}"
}

gerar_comando() {
    local origem="$1" destino="$2" nome_comando="$3"
    local descricao=$(grep -m1 'description:' "$origem" 2>/dev/null | sed 's/description: *//' | tr -d '"' || echo "Comando adaptado do ECC: $nome_comando")
    local corpo=$(cat "$origem" 2>/dev/null | head -80)
    local data_agora=$(date "+%Y-%m-%d %H:%M:%S")

    export PY_SRC_NOME="$nome_comando"
    export PY_SRC_DESTINO="$destino"
    export PY_SRC_DESCRICAO="$descricao"
    export PY_SRC_CORPO="$corpo"
    export PY_SRC_DATA="$data_agora"

    if ! python3 << 'PYEOF' 2>&1; then
import os
nm = os.environ.get('PY_SRC_NOME', '')
de = os.environ.get('PY_SRC_DESTINO', '')
ds = os.environ.get('PY_SRC_DESCRICAO', '')
cp = os.environ.get('PY_SRC_CORPO', '')[:3000]
da = os.environ.get('PY_SRC_DATA', '')

c = f'''# ⚡ Comando: {nm}

> **Adaptado do ECC:** \\`ECC/commands/{nm}.md\\`

## Descrição

{ds}

---

## Conteúdo Adaptado

> No Codebuff, comandos do ECC (como /code-review, /build-fix) podem ser
> usados como referência para tarefas similares.

{cp}

---

**ECC Original:** \\`ECC/commands/{nm}.md\\`
**Atualizado em:** {da}
'''

with open(de, 'w', encoding='utf-8') as f:
    f.write(c)
print('OK')
PYEOF
        echo -e "   ${RED}✗${NC} Erro ao gerar ${nome_comando} (fallback)"
        {
            echo "# ⚡ Comando: ${nome_comando}"
            echo ""
            echo "**Adaptado do ECC:** \\`commands/${nome_comando}.md\\`"
            echo ""
            echo "${descricao}"
            echo ""
            echo "⚠️ **Arquivo gerado via fallback — versão pode estar incompleta**"
        } > "$destino"
    fi
    echo -e "   ${GREEN}   ✔${NC} Adaptado: ${nome_comando}"
}

gerar_hook() {
    local origem="$1" destino="$2" nome_hook="$3"
    local data_agora=$(date "+%Y-%m-%d %H:%M:%S")
    local descricao=$(head -5 "$origem" 2>/dev/null | grep -m1 '#' | sed 's/^#* *//' || echo "Hook ECC: $nome_hook")
    local corpo=$(cat "$origem" 2>/dev/null | head -100)

    export PY_SRC_NOME="$nome_hook"
    export PY_SRC_DESTINO="$destino"
    export PY_SRC_DESCRICAO="$descricao"
    export PY_SRC_CORPO="$corpo"
    export PY_SRC_DATA="$data_agora"

    if ! python3 << 'PYEOF' 2>&1; then
import os
nm = os.environ.get('PY_SRC_NOME', '')
de = os.environ.get('PY_SRC_DESTINO', '')
ds = os.environ.get('PY_SRC_DESCRICAO', '')
cp = os.environ.get('PY_SRC_CORPO', '')[:3000]
da = os.environ.get('PY_SRC_DATA', '')

c = f'''# 🔌 Hook ECC: {nm}

> **Adaptado do ECC:** \\`ECC/hooks/{nm}\\`

## Descrição

{ds}

---

## ⚠️ Adaptação para Codebuff

No ECC (Claude Code), hooks controlam comportamento pré/pós-ação via
\\`PreToolUse\\`, \\`PostToolUse\\`, etc. No Codebuff, funcionalidades similares
são configuradas via \\`.codebuff/instructions.md\\`.

---

## Conteúdo Adaptado

{cp}

---

**ECC Original:** \\`ECC/hooks/{nm}\\`
**Atualizado em:** {da}
'''

with open(de, 'w', encoding='utf-8') as f:
    f.write(c)
print('OK')
PYEOF
        echo -e "   ${RED}✗${NC} Erro ao gerar ${nome_hook} (fallback)"
        {
            echo "# 🔌 Hook ECC: ${nome_hook}"
            echo ""
            echo "**Adaptado do ECC:** \\`hooks/${nome_hook}\\`"
            echo ""
            echo "${descricao}"
            echo ""
            echo "⚠️ **Arquivo gerado via fallback — versão pode estar incompleta**"
        } > "$destino"
    fi
    echo -e "   ${GREEN}   ✔${NC} Adaptado: ${nome_hook}"
}

gerar_contexto() {
    local origem="$1" destino="$2" nome_contexto="$3"
    local descricao=$(head -5 "$origem" 2>/dev/null | grep -m1 '#' | sed 's/^#* *//' || echo "Contexto ECC: $nome_contexto")
    local corpo=$(cat "$origem" 2>/dev/null | head -100)
    local data_agora=$(date "+%Y-%m-%d %H:%M:%S")

    export PY_SRC_NOME="$nome_contexto"
    export PY_SRC_DESTINO="$destino"
    export PY_SRC_DESCRICAO="$descricao"
    export PY_SRC_CORPO="$corpo"
    export PY_SRC_DATA="$data_agora"

    if ! python3 << 'PYEOF' 2>&1; then
import os
nm = os.environ.get('PY_SRC_NOME', '')
de = os.environ.get('PY_SRC_DESTINO', '')
ds = os.environ.get('PY_SRC_DESCRICAO', '')
cp = os.environ.get('PY_SRC_CORPO', '')[:3000]
da = os.environ.get('PY_SRC_DATA', '')

c = f'''# 📝 Contexto: {nm}

> **Adaptado do ECC:** \\`ECC/contexts/{nm}.md\\`

## Descrição

{ds}

---

## Conteúdo Adaptado

{cp}

---

**ECC Original:** \\`ECC/contexts/{nm}.md\\`
**Atualizado em:** {da}
'''

with open(de, 'w', encoding='utf-8') as f:
    f.write(c)
print('OK')
PYEOF
        echo -e "   ${RED}✗${NC} Erro ao gerar ${nome_contexto} (fallback)"
        {
            echo "# 📝 Contexto: ${nome_contexto}"
            echo ""
            echo "**Adaptado do ECC:** \\`contexts/${nome_contexto}.md\\`"
            echo ""
            echo "${descricao}"
            echo ""
            echo "⚠️ **Arquivo gerado via fallback — versão pode estar incompleta**"
        } > "$destino"
    fi
    echo -e "   ${GREEN}   ✔${NC} Adaptado: ${nome_contexto}"
}

# ═══════════════════════════════════════════════════════════════
# EXECUÇÃO PRINCIPAL
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      🔄  Freebuff Agente Smit — Sincronizador Freebuff                  ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo -e "   Workspace: ${CYAN}${WORKSPACE_DIR}${NC}"
echo -e "   Bridge:    ${CYAN}${BRIDGE_DIR}${NC}"

# ─── PASSO 1: Atualizar clone do ECC oficial ───────────────
echo ""
echo -e "${YELLOW}[1/9] Atualizando repositório ECC oficial...${NC}"
if [ ! -d "$ECC_DIR/.git" ]; then
    echo -e "${RED}❌ ECC não encontrado em $ECC_DIR${NC}"
    exit 1
fi

cd "$ECC_DIR"
BEFORE_HASH=$(git rev-parse HEAD 2>/dev/null || echo "unknown")
git pull --ff-only 2>&1 || {
    echo -e "${RED}❌ Falha no git pull. Verifique sua conexão.${NC}"
    exit 1
}
AFTER_HASH=$(git rev-parse HEAD 2>/dev/null || echo "unknown")

if [ "$BEFORE_HASH" != "$AFTER_HASH" ]; then
    echo -e "${GREEN}✅ ECC atualizado: $(echo $BEFORE_HASH | cut -c1-7) → $(echo $AFTER_HASH | cut -c1-7)${NC}"
    TEVE_NOVIDADES=true
else
    echo -e "${GREEN}✅ ECC já está na versão mais recente.${NC}"
fi
cd "$WORKSPACE_DIR" 2>/dev/null || cd "$BRIDGE_DIR"

# ─── PASSO 2: Mostrar NOVIDADES ────────────────────────────
if [ "$TEVE_NOVIDADES" = true ] && [ -f "$LAST_HASH_FILE" ]; then
    hash_anterior=$(cat "$LAST_HASH_FILE" 2>/dev/null || echo "$BEFORE_HASH")
    [ "$hash_anterior" != "$AFTER_HASH" ] && mostrar_novidades_ecc "$hash_anterior" "$AFTER_HASH"
fi
echo "$AFTER_HASH" > "$LAST_HASH_FILE"

# ─── PASSO 3: Skills ───────────────────────────────────────
echo ""
echo -e "${YELLOW}[3/9] Escaneando skills do ECC...${NC}"

declare -A SKILL_RENAME=(
    ["data-scraper-agent"]="data-scraper"
    ["automation-audit-ops"]="automation-audit"
    ["benchmark-optimization-loop"]="benchmark-optimization"
    ["delivery-gate"]="quality-gate"
    ["continuous-learning-v2"]="continuous-learning"
)

TOTAL_SKILLS_ECC=$(ls -d "$ECC_DIR/skills/"*/ 2>/dev/null | wc -l)
echo -e "   Skills no ECC: ${BLUE}$TOTAL_SKILLS_ECC${NC}"

for SKILL_DIR in "$ECC_DIR/skills/"*/; do
    [ ! -d "$SKILL_DIR" ] && continue
    SKILL=$(basename "$SKILL_DIR")
    SRC="$ECC_DIR/skills/$SKILL/SKILL.md"
    [ ! -f "$SRC" ] && continue
    NAME="${SKILL_RENAME[$SKILL]:-$SKILL}"
    DST="$BRIDGE_SKILLS/$NAME.md"

    if [ ! -f "$DST" ]; then
        echo -e "   ${BLUE}🆕${NC} $SKILL → $NAME"
        gerar_skill "$SRC" "$DST" "$SKILL" "$NAME"
        NOVAS_SKILLS=$((NOVAS_SKILLS + 1))
    else
        EM=$(stat -c %Y "$SRC" 2>/dev/null || echo 0)
        BM=$(stat -c %Y "$DST" 2>/dev/null || echo 0)
        if [ "$EM" -gt "$BM" ]; then
            echo -e "   ${YELLOW}🔄${NC} $SKILL"
            gerar_skill "$SRC" "$DST" "$SKILL" "$NAME"
            SKILLS_ATUALIZADAS=$((SKILLS_ATUALIZADAS + 1))
        fi
    fi
done

# ─── PASSO 4: Agentes ──────────────────────────────────────
echo ""
echo -e "${YELLOW}[4/9] Escaneando agentes do ECC...${NC}"

declare -A AGENT_RENAME=()
TOTAL_AGENTS_ECC=$(ls "$ECC_DIR/agents/"*.md 2>/dev/null | wc -l)
echo -e "   Agentes no ECC: ${BLUE}$TOTAL_AGENTS_ECC${NC}"

for AGENT_PATH in "$ECC_DIR/agents/"*.md; do
    [ ! -f "$AGENT_PATH" ] && continue
    AGENT=$(basename "$AGENT_PATH" .md)
    NAME="${AGENT_RENAME[$AGENT]:-$AGENT}"
    DST="$BRIDGE_AGENTS/$NAME.md"

    if [ ! -f "$DST" ]; then
        echo -e "   ${BLUE}🆕${NC} $AGENT"
        gerar_agente "$AGENT_PATH" "$DST" "$AGENT" "$NAME"
        NOVOS_AGENTES=$((NOVOS_AGENTES + 1))
    else
        EM=$(stat -c %Y "$AGENT_PATH" 2>/dev/null || echo 0)
        BM=$(stat -c %Y "$DST" 2>/dev/null || echo 0)
        if [ "$EM" -gt "$BM" ]; then
            echo -e "   ${YELLOW}🔄${NC} $AGENT"
            gerar_agente "$AGENT_PATH" "$DST" "$AGENT" "$NAME"
            AGENTES_ATUALIZADOS=$((AGENTES_ATUALIZADOS + 1))
        fi
    fi
done

# ─── PASSO 5: Regras (rules/) ──────────────────────────────
echo ""
echo -e "${YELLOW}[5/9] Escaneando regras do ECC...${NC}"

TOTAL_RULES_ECC=0
for RULE_DIR in "$ECC_DIR/rules/"*/; do
    [ ! -d "$RULE_DIR" ] && continue
    LINGUAGEM=$(basename "$RULE_DIR")
    [ "$LINGUAGEM" = "README.md" ] && continue
    for RULE_FILE in "$RULE_DIR"*.md; do
        [ ! -f "$RULE_FILE" ] && continue
        TIPO=$(basename "$RULE_FILE" .md)
        TOTAL_RULES_ECC=$((TOTAL_RULES_ECC + 1))
        NAME="${LINGUAGEM}-${TIPO}"
        DST="$BRIDGE_RULES/$NAME.md"

        if [ ! -f "$DST" ]; then
            echo -e "   ${BLUE}🆕${NC} $LINGUAGEM/$TIPO"
            gerar_regra "$RULE_FILE" "$DST" "$LINGUAGEM" "$TIPO"
            NOVAS_REGRAS=$((NOVAS_REGRAS + 1))
        else
            EM=$(stat -c %Y "$RULE_FILE" 2>/dev/null || echo 0)
            BM=$(stat -c %Y "$DST" 2>/dev/null || echo 0)
            if [ "$EM" -gt "$BM" ]; then
                echo -e "   ${YELLOW}🔄${NC} $LINGUAGEM/$TIPO"
                gerar_regra "$RULE_FILE" "$DST" "$LINGUAGEM" "$TIPO"
                REGRAS_ATUALIZADAS=$((REGRAS_ATUALIZADAS + 1))
            fi
        fi
    done
done
echo -e "   Regras no ECC: ${BLUE}$TOTAL_RULES_ECC${NC}"

# ─── PASSO 6: Comandos (commands/) ─────────────────────────
echo ""
echo -e "${YELLOW}[6/9] Escaneando comandos do ECC...${NC}"

TOTAL_COMMANDS_ECC=$(ls "$ECC_DIR/commands/"*.md 2>/dev/null | wc -l)
echo -e "   Comandos no ECC: ${BLUE}$TOTAL_COMMANDS_ECC${NC}"

for CMD_PATH in "$ECC_DIR/commands/"*.md; do
    [ ! -f "$CMD_PATH" ] && continue
    CMD=$(basename "$CMD_PATH" .md)
    DST="$BRIDGE_COMMANDS/$CMD.md"

    if [ ! -f "$DST" ]; then
        echo -e "   ${BLUE}🆕${NC} $CMD"
        gerar_comando "$CMD_PATH" "$DST" "$CMD"
        NOVOS_COMANDOS=$((NOVOS_COMANDOS + 1))
    else
        EM=$(stat -c %Y "$CMD_PATH" 2>/dev/null || echo 0)
        BM=$(stat -c %Y "$DST" 2>/dev/null || echo 0)
        if [ "$EM" -gt "$BM" ]; then
            echo -e "   ${YELLOW}🔄${NC} $CMD"
            gerar_comando "$CMD_PATH" "$DST" "$CMD"
            COMANDOS_ATUALIZADOS=$((COMANDOS_ATUALIZADOS + 1))
        fi
    fi
done

# ─── PASSO 7: Hooks ────────────────────────────────────────
echo ""
echo -e "${YELLOW}[7/9] Escaneando hooks do ECC...${NC}"

TOTAL_HOOKS_ECC=0
# hooks.json — copiar diretamente
if [ -f "$ECC_DIR/hooks/hooks.json" ]; then
    TOTAL_HOOKS_ECC=$((TOTAL_HOOKS_ECC + 1))
    SRC="$ECC_DIR/hooks/hooks.json"
    DST="$BRIDGE_HOOKS/hooks.json"
    if [ ! -f "$DST" ]; then
        echo -e "   ${BLUE}🆕${NC} hooks.json (config)"
        cp "$SRC" "$DST"
        NOVOS_HOOKS=$((NOVOS_HOOKS + 1))
    else
        EM=$(stat -c %Y "$SRC" 2>/dev/null || echo 0)
        BM=$(stat -c %Y "$DST" 2>/dev/null || echo 0)
        if [ "$EM" -gt "$BM" ]; then
            echo -e "   ${YELLOW}🔄${NC} hooks.json (config)"
            cp "$SRC" "$DST"
            HOOKS_ATUALIZADOS=$((HOOKS_ATUALIZADOS + 1))
        fi
    fi
fi
# README.md do hooks
if [ -f "$ECC_DIR/hooks/README.md" ]; then
    TOTAL_HOOKS_ECC=$((TOTAL_HOOKS_ECC + 1))
    SRC="$ECC_DIR/hooks/README.md"
    DST="$BRIDGE_HOOKS/README.md"
    if [ ! -f "$DST" ]; then
        echo -e "   ${BLUE}🆕${NC} hooks/README.md"
        gerar_hook "$SRC" "$DST" "README"
        NOVOS_HOOKS=$((NOVOS_HOOKS + 1))
    else
        EM=$(stat -c %Y "$SRC" 2>/dev/null || echo 0)
        BM=$(stat -c %Y "$DST" 2>/dev/null || echo 0)
        if [ "$EM" -gt "$BM" ]; then
            echo -e "   ${YELLOW}🔄${NC} hooks/README.md"
            gerar_hook "$SRC" "$DST" "README"
            HOOKS_ATUALIZADOS=$((HOOKS_ATUALIZADOS + 1))
        fi
    fi
fi
# memory-persistence/ (subdiretório com arquivos .md)
if [ -d "$ECC_DIR/hooks/memory-persistence" ]; then
    for MP_FILE in "$ECC_DIR/hooks/memory-persistence/"*.md; do
        [ ! -f "$MP_FILE" ] && continue
        TOTAL_HOOKS_ECC=$((TOTAL_HOOKS_ECC + 1))
        MP_BASE=$(basename "$MP_FILE" .md)
        SRC="$MP_FILE"
        DST="$BRIDGE_HOOKS/memory-persistence-${MP_BASE}.md"
        if [ ! -f "$DST" ]; then
            echo -e "   ${BLUE}🆕${NC} hooks/memory-persistence/${MP_BASE}"
            gerar_hook "$SRC" "$DST" "memory-persistence-${MP_BASE}"
            NOVOS_HOOKS=$((NOVOS_HOOKS + 1))
        else
            EM=$(stat -c %Y "$SRC" 2>/dev/null || echo 0)
            BM=$(stat -c %Y "$DST" 2>/dev/null || echo 0)
            if [ "$EM" -gt "$BM" ]; then
                echo -e "   ${YELLOW}🔄${NC} hooks/memory-persistence/${MP_BASE}"
                gerar_hook "$SRC" "$DST" "memory-persistence-${MP_BASE}"
                HOOKS_ATUALIZADOS=$((HOOKS_ATUALIZADOS + 1))
            fi
        fi
    done
fi
echo -e "   Hooks no ECC: ${BLUE}$TOTAL_HOOKS_ECC${NC}"

# ─── PASSO 8: Contextos (contexts/) ────────────────────────
echo ""
echo -e "${YELLOW}[8/9] Escaneando contextos do ECC...${NC}"

TOTAL_CONTEXTS_ECC=0
for CTX_FILE in "$ECC_DIR/contexts/"*.md; do
    [ ! -f "$CTX_FILE" ] && continue
    TOTAL_CONTEXTS_ECC=$((TOTAL_CONTEXTS_ECC + 1))
    CTX=$(basename "$CTX_FILE" .md)
    DST="$BRIDGE_CONTEXTS/$CTX.md"

    if [ ! -f "$DST" ]; then
        echo -e "   ${BLUE}🆕${NC} $CTX"
        gerar_contexto "$CTX_FILE" "$DST" "$CTX"
        NOVOS_CONTEXTOS=$((NOVOS_CONTEXTOS + 1))
    else
        EM=$(stat -c %Y "$CTX_FILE" 2>/dev/null || echo 0)
        BM=$(stat -c %Y "$DST" 2>/dev/null || echo 0)
        if [ "$EM" -gt "$BM" ]; then
            echo -e "   ${YELLOW}🔄${NC} $CTX"
            gerar_contexto "$CTX_FILE" "$DST" "$CTX"
            CONTEXTOS_ATUALIZADOS=$((CONTEXTOS_ATUALIZADOS + 1))
        fi
    fi
done
echo -e "   Contextos no ECC: ${BLUE}$TOTAL_CONTEXTS_ECC${NC}"

# ─── PASSO 9: Atualizar catálogo e histórico ───────────────
echo ""
echo -e "${YELLOW}[9/9] Atualizando catálogo e histórico...${NC}"

if [ -f "$SCRIPT_DIR/gerar-catalogo.sh" ]; then
    CAT_OUT=$(bash "$SCRIPT_DIR/gerar-catalogo.sh" 2>&1) && \
        echo -e "   ${GREEN}✅${NC} Catálogo atualizado" || {
        echo -e "   ${YELLOW}⚠️${NC} Erro ao gerar catálogo"
        echo "$CAT_OUT" | head -5 | while IFS= read -r line; do
            echo -e "   ${YELLOW}   |${NC} $line"
        done
    }
fi

HISTORICO="$BRIDGE_LOGS/HISTORICO_ATUALIZACOES.md"
DATA_ATUAL=$(date "+%d/%m/%Y")
HAVE_NEW=$((NOVAS_SKILLS + SKILLS_ATUALIZADAS + NOVOS_AGENTES + AGENTES_ATUALIZADOS + \
           NOVAS_REGRAS + REGRAS_ATUALIZADAS + NOVOS_COMANDOS + COMANDOS_ATUALIZADOS + \
           NOVOS_HOOKS + HOOKS_ATUALIZADOS + NOVOS_CONTEXTOS + CONTEXTOS_ATUALIZADOS))

if [ "$HAVE_NEW" -gt 0 ] || [ "$TEVE_NOVIDADES" = true ]; then
    {
        echo ""
        echo "### $DATA_ATUAL — Sincronização"
        echo ""
        echo "**Hash ECC:** $(cd "$ECC_DIR" 2>/dev/null && git rev-parse --short HEAD 2>/dev/null || echo 'N/A')"
        echo ""
        [ "$NOVAS_SKILLS" -gt 0 ]      && echo "**🧠 Skills novas:** $NOVAS_SKILLS" && echo ""
        [ "$NOVOS_AGENTES" -gt 0 ]      && echo "**🎯 Agentes novos:** $NOVOS_AGENTES" && echo ""
        [ "$NOVAS_REGRAS" -gt 0 ]       && echo "**📏 Regras novas:** $NOVAS_REGRAS" && echo ""
        [ "$NOVOS_COMANDOS" -gt 0 ]     && echo "**⚡ Comandos novos:** $NOVOS_COMANDOS" && echo ""
        [ "$NOVOS_HOOKS" -gt 0 ]        && echo "**🔌 Hooks novos:** $NOVOS_HOOKS" && echo ""
        [ "$NOVOS_CONTEXTOS" -gt 0 ]    && echo "**📝 Contextos novos:** $NOVOS_CONTEXTOS" && echo ""
        echo "---"
    } >> "$HISTORICO"
    echo -e "   ${GREEN}✅${NC} Histórico atualizado"
fi

# ─── RELATÓRIO FINAL ───────────────────────────────────────
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
RELATORIO="$BRIDGE_LOGS/sync-$(date +%Y%m%d-%H%M%S).md"
echo "$(date +%Y%m%d)" > "$TIMESTAMP_FILE"

{
    echo "# 📋 Relatório de Sincronização ECC → Freebuff"
    echo "**Data:** $TIMESTAMP"
    echo "**ECC Commit:** $(cd "$ECC_DIR" 2>/dev/null && git rev-parse --short HEAD 2>/dev/null || echo 'N/A')"
    echo ""
    echo "## Resumo"
    echo "| Item | ECC | Bridge |"
    echo "|------|:---:|:-----:|"
    echo "| 🧠 Skills | $TOTAL_SKILLS_ECC | $(ls $BRIDGE_SKILLS/*.md 2>/dev/null | wc -l) |"
    echo "| 🎯 Agentes | $TOTAL_AGENTS_ECC | $(ls $BRIDGE_AGENTS/*.md 2>/dev/null | wc -l) |"
    echo "| 📏 Regras | $TOTAL_RULES_ECC | $(ls $BRIDGE_RULES/*.md 2>/dev/null | wc -l) |"
    echo "| ⚡ Comandos | $TOTAL_COMMANDS_ECC | $(ls $BRIDGE_COMMANDS/*.md 2>/dev/null | wc -l) |"
    echo "| 🔌 Hooks | $TOTAL_HOOKS_ECC | $(ls $BRIDGE_HOOKS/*.md $BRIDGE_HOOKS/*.json 2>/dev/null | wc -l) |"
    echo "| 📝 Contextos | $TOTAL_CONTEXTS_ECC | $(ls $BRIDGE_CONTEXTS/*.md 2>/dev/null | wc -l) |"
    echo ""
    echo "### Novidades desta sincronização"
    [ "$NOVAS_SKILLS" -gt 0 ]           && echo "- 🧠 $NOVAS_SKILLS novas skills"
    [ "$SKILLS_ATUALIZADAS" -gt 0 ]     && echo "- 🔄 $SKILLS_ATUALIZADAS skills atualizadas"
    [ "$NOVOS_AGENTES" -gt 0 ]          && echo "- 🎯 $NOVOS_AGENTES novos agentes"
    [ "$AGENTES_ATUALIZADOS" -gt 0 ]    && echo "- 🔄 $AGENTES_ATUALIZADOS agentes atualizados"
    [ "$NOVAS_REGRAS" -gt 0 ]           && echo "- 📏 $NOVAS_REGRAS novas regras"
    [ "$REGRAS_ATUALIZADAS" -gt 0 ]     && echo "- 🔄 $REGRAS_ATUALIZADAS regras atualizadas"
    [ "$NOVOS_COMANDOS" -gt 0 ]         && echo "- ⚡ $NOVOS_COMANDOS novos comandos"
    [ "$COMANDOS_ATUALIZADOS" -gt 0 ]   && echo "- 🔄 $COMANDOS_ATUALIZADOS comandos atualizados"
    [ "$NOVOS_HOOKS" -gt 0 ]            && echo "- 🔌 $NOVOS_HOOKS novos hooks"
    [ "$HOOKS_ATUALIZADOS" -gt 0 ]      && echo "- 🔄 $HOOKS_ATUALIZADOS hooks atualizados"
    [ "$NOVOS_CONTEXTOS" -gt 0 ]        && echo "- 📝 $NOVOS_CONTEXTOS novos contextos"
    [ "$CONTEXTOS_ATUALIZADOS" -gt 0 ]  && echo "- 🔄 $CONTEXTOS_ATUALIZADOS contextos atualizados"
} > "$RELATORIO"

# ─── RESUMO FINAL ──────────────────────────────────────────
BRIDGE_SKILLS_COUNT=$(ls "$BRIDGE_SKILLS"/*.md 2>/dev/null | wc -l)
BRIDGE_AGENTS_COUNT=$(ls "$BRIDGE_AGENTS"/*.md 2>/dev/null | wc -l)
BRIDGE_RULES_COUNT=$(ls "$BRIDGE_RULES"/*.md 2>/dev/null | wc -l)
BRIDGE_COMMANDS_COUNT=$(ls "$BRIDGE_COMMANDS"/*.md 2>/dev/null | wc -l)
BRIDGE_HOOKS_COUNT=$(ls "$BRIDGE_HOOKS"/*.md "$BRIDGE_HOOKS"/*.json 2>/dev/null | wc -l)
BRIDGE_CONTEXTS_COUNT=$(ls "$BRIDGE_CONTEXTS"/*.md 2>/dev/null | wc -l)

echo ""
echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                     ✅  SINCRONIZAÇÃO CONCLUÍDA               ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "   📊 ${BLUE}ECC:${NC} $TOTAL_SKILLS_ECC skills · $TOTAL_AGENTS_ECC agentes · $TOTAL_RULES_ECC regras · $TOTAL_COMMANDS_ECC comandos · $TOTAL_HOOKS_ECC hooks · $TOTAL_CONTEXTS_ECC contextos"
echo -e "   📊 ${BLUE}Bridge:${NC} $BRIDGE_SKILLS_COUNT skills · $BRIDGE_AGENTS_COUNT agentes · $BRIDGE_RULES_COUNT regras · $BRIDGE_COMMANDS_COUNT comandos · $BRIDGE_HOOKS_COUNT hooks · $BRIDGE_CONTEXTS_COUNT contextos"
echo ""
[ "$NOVAS_SKILLS" -gt 0 ]      && echo -e "   🆕 ${GREEN}Skills novas:${NC} $NOVAS_SKILLS"
[ "$NOVOS_AGENTES" -gt 0 ]      && echo -e "   🆕 ${GREEN}Agentes novos:${NC} $NOVOS_AGENTES"
[ "$NOVAS_REGRAS" -gt 0 ]       && echo -e "   🆕 ${GREEN}Regras novas:${NC} $NOVAS_REGRAS"
[ "$NOVOS_COMANDOS" -gt 0 ]     && echo -e "   🆕 ${GREEN}Comandos novos:${NC} $NOVOS_COMANDOS"
[ "$NOVOS_HOOKS" -gt 0 ]        && echo -e "   🆕 ${GREEN}Hooks novos:${NC} $NOVOS_HOOKS"
[ "$NOVOS_CONTEXTOS" -gt 0 ]    && echo -e "   🆕 ${GREEN}Contextos novos:${NC} $NOVOS_CONTEXTOS"
echo ""
echo -e "   📄 ${BLUE}Relatório:${NC} $RELATORIO"
echo ""
echo -e "   ${YELLOW}💡 Dica: use 'sync-ecc' para sincronizar manualmente.${NC}"
echo ""
