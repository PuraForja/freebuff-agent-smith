#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
#  ecc-install.sh
#  Instalação direta do ECC para .agents/ (Freebuff)
# ═══════════════════════════════════════════════════════════════
#  Uso:   bash scripts/ecc-install.sh [--update] [--force]
#  Desc:  Baixa ECC do GitHub e converte para .agents/ TypeScript
# ═══════════════════════════════════════════════════════════════

set -euo pipefail

# ─── Cores ──────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; NC='\033[0m'

# ─── Configurações ──────────────────────────────────────────
ECC_REPO="https://github.com/affaan-m/ECC.git"
ECC_BRANCH="main"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
OUTPUT_DIR="$PROJECT_DIR/.agents"
TEMP_DIR="/tmp/ecc-install-$$"
VERSION_FILE="$OUTPUT_DIR/.ecc-version"
SKILLS_DIR="$PROJECT_DIR/skills"
CATALOGO_FILE="$PROJECT_DIR/CATALOGO.md"

# ─── Flags ──────────────────────────────────────────────────
UPDATE_MODE=false
FORCE_MODE=false

# ─── Parse argumentos ───────────────────────────────────────
for arg in "$@"; do
    case $arg in
        --update) UPDATE_MODE=true ;;
        --force) FORCE_MODE=true ;;
        --help|-h)
            echo "Uso: bash scripts/ecc-install.sh [opções]"
            echo ""
            echo "Opções:"
            echo "  --update    Atualizar apenas novos recursos"
            echo "  --force     Forçar reinstalação completa"
            echo "  --help      Mostrar esta ajuda"
            exit 0
            ;;
    esac
done

# ─── Cleanup trap ───────────────────────────────────────────
trap "rm -rf $TEMP_DIR" EXIT

# ─── Funções auxiliares ─────────────────────────────────────
log()    { echo -e "${BLUE}[ECC]${NC} $*"; }
ok()     { echo -e "${GREEN}[✅]${NC} $*"; }
warn()   { echo -e "${YELLOW}[⚠️]${NC} $*"; }
fail()   { echo -e "${RED}[❌]${NC} $*"; }
header() { echo ""; echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"; echo -e "${CYAN}  $*${NC}"; echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"; echo ""; }

# ─── Função unificada para extrair descrição ──────────────
# Uso: extrair_descricao <arquivo> [--escape]
#   --escape  Escapa aspas e backticks para TypeScript
extrair_descricao() {
    local arquivo="$1"
    local escape_ts=false
    [ "${2:-}" = "--escape" ] && escape_ts=true
    
    local desc
    desc=$(sed -n '/^## Descrição/,/^## \|^---/p' "$arquivo" 2>/dev/null | \
        grep -v "^## Descrição" | \
        grep -v "^---" | \
        head -5 | \
        tr '\n' ' ' | \
        sed 's/  */ /g' | \
        sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
    
    # Fallback: extrair das primeiras linhas não-cabeçalho
    if [ -z "$desc" ]; then
        desc=$(head -10 "$arquivo" | grep -v '^#' | head -3 | \
            tr '\n' ' ' | sed 's/  */ /g' | \
            sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
    fi
    
    # Escapar para TypeScript se solicitado
    if [ "$escape_ts" = true ]; then
        desc=$(echo "$desc" | sed 's/"/\\"/g' | sed 's/`/\\`/g')
    fi
    
    echo "$desc"
}

# ─── Função para determinar ferramentas do agente ───────────
determinar_ferramentas() {
    local arquivo="$1"
    local ferramentas="\"read_files\", \"code_search\", \"set_output\""
    
    if grep -qiE "npm|pip|cargo|go |make|cmake|flutter|gradle|mvn|terminal|build|install" "$arquivo"; then
        ferramentas="$ferramentas, \"run_terminal_command\""
    fi
    
    if grep -qiE "write_file|create|save|generate" "$arquivo"; then
        ferramentas="$ferramentas, \"write_file\""
    fi
    
    if grep -qiE "str_replace|edit|modify|update|fix" "$arquivo"; then
        ferramentas="$ferramentas, \"str_replace\""
    fi
    
    if grep -qiE "web_search|read_url|fetch.*url|browse" "$arquivo"; then
        ferramentas="$ferramentas, \"web_search\", \"read_url\""
    fi
    
    echo "$ferramentas"
}

# ─── Função para determinar modelo do agente ────────────────
determinar_modelo() {
    local nome="$1"
    
    # MiMo 2.5: Agentes que precisam de análise profunda de código
    if echo "$nome" | grep -qiE "reviewer|security|audit|evaluator|architect|planner|spec-miner|performance-optimizer|silent-failure|code-explorer|database-reviewer|mle-reviewer|healthcare-reviewer|network-architect|network-config"; then
        echo "mimo/mimo-v2.5"
    # DeepSeek Flash: Agentes de build, refactor, docs, tarefas rápidas
    elif echo "$nome" | grep -qiE "build-error|resolver|doc-updater|comment-analyzer|code-simplifier|refactor|tdd-guide|marketing|seo|e2e-runner|harness-optimizer|loop-operator|opensource|network-troubleshooter"; then
        echo "deepseek/deepseek-v4-flash"
    # Padrão → MiMo (melhor para código)
    else
        echo "mimo/mimo-v2.5"
    fi
}

# ─── Função para gerar agente TypeScript ────────────────────
gerar_agente_ts() {
    local arquivo_md="$1"
    local nome=$(basename "$arquivo_md" .md)
    local destino="$OUTPUT_DIR/${nome}.ts"
    
    local descricao=$(extrair_descricao "$arquivo_md" --escape)
    local ferramentas=$(determinar_ferramentas "$arquivo_md")
    local modelo=$(determinar_modelo "$nome")
    local display_name=$(echo "$nome" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) substr($i,2)}1')
    local spawner_prompt=$(echo "$descricao" | cut -d. -f1)
    [ -z "$spawner_prompt" ] && spawner_prompt="$descricao"
    
    cat > "$destino" << EOF
import type { AgentDefinition } from './types/agent-definition'

const definition: AgentDefinition = {
  id: '${nome}',
  displayName: '${display_name}',
  model: '${modelo}',
  toolNames: [${ferramentas}],
  instructionsPrompt: \`${descricao}\`,
  spawnerPrompt: '${spawner_prompt}.',
  includeMessageHistory: true,
}

export default definition
EOF
}



# ─── Função para copiar skill do ECC ──────────────────────
copiar_skill_ecc() {
    local skill_dir="$1"
    local skill_name=$(basename "$skill_dir")
    local skill_file="$skill_dir/SKILL.md"
    local destino="$SKILLS_DIR/${skill_name}.md"
    
    if [ ! -f "$skill_file" ]; then
        return 1
    fi
    
    # Extrair descrição
    local descricao=$(extrair_descricao "$skill_file")
    
    # Criar arquivo adaptado
    cat > "$destino" << EOF
# 🧠 Skill: ${skill_name}

> **Adaptada do ECC:** \`${skill_name}\` — via \`ecc-install.sh\`
> **Fonte original:** \`ECC/skills/${skill_name}/SKILL.md\`

## Descrição

${descricao}

---

## Conteúdo Original

EOF
    
    # Copiar conteúdo do SKILL.md (após cabeçalho)
    sed -n '/^---$/,$ p' "$skill_file" | tail -n +2 >> "$destino"
    
    echo "" >> "$destino"
    echo "---" >> "$destino"
    echo "" >> "$destino"
    echo "**ECC Original:** \`ECC/skills/${skill_name}/SKILL.md\`" >> "$destino"
    echo "**Atualizado em:** $(date '+%Y-%m-%d %H:%M:%S')" >> "$destino"
    
    return 0
}

# ─── Função para gerar catálogo ─────────────────────────────
gerar_catalogo() {
    local total_agentes=$(ls -1 "$OUTPUT_DIR"/*.ts 2>/dev/null | wc -l || echo 0)
    local total_mimo=$(grep -l "mimo/mimo-v2.5" "$OUTPUT_DIR"/*.ts 2>/dev/null | wc -l || echo 0)
    local total_deepseek=$(grep -l "deepseek/deepseek-v4-flash" "$OUTPUT_DIR"/*.ts 2>/dev/null | wc -l || echo 0)
    local total_skills=$(ls -1 "$SKILLS_DIR"/*.md 2>/dev/null | wc -l || echo 0)
    
    cat > "$CATALOGO_FILE" << EOF
# 📋 Catálogo — ECC Bridge

> **Última atualização:** $(date '+%d/%m/%Y %H:%M:%S')
> **Repositório ECC:** $ECC_REPO
> **Commit ECC:** $(cd "$TEMP_DIR" 2>/dev/null && git rev-parse --short HEAD 2>/dev/null || echo "N/A")

---

## 📊 Estatísticas

| Modelo | Quantidade | Porcentagem |
|--------|:----------:|:-----------:|
| \`mimo/mimo-v2.5\` | $total_mimo | $(( total_mimo * 100 / (total_agentes > 0 ? total_agentes : 1) ))% |
| \`deepseek/deepseek-v4-flash\` | $total_deepseek | $(( total_deepseek * 100 / (total_agentes > 0 ? total_agentes : 1) ))% |
| **Total Agentes** | **$total_agentes** | **100%** |
| **Total Skills** | **$total_skills** | — |

---

## 🎯 Agentes Disponíveis

| Agente | Modelo | Descrição |
|--------|--------|-----------|
EOF
    
    # Listar todos os agentes
    for arquivo in "$OUTPUT_DIR"/*.ts; do
        [ ! -f "$arquivo" ] && continue
        local nome=$(basename "$arquivo" .ts)
        local modelo=$(grep "model:" "$arquivo" | head -1 | sed "s/.*model: '//;s/',//")
        local desc=$(grep "instructionsPrompt:" "$arquivo" | head -1 | sed 's/.*instructionsPrompt: `//;s/`.*//' | cut -d. -f1)
                echo "| \`$nome\` | \`$modelo\` | ${desc:-Sem descrição}... |" >> "$CATALOGO_FILE"
    done
    
    echo "" >> "$CATALOGO_FILE"
    echo "---" >> "$CATALOGO_FILE"
    echo "" >> "$CATALOGO_FILE"
    
    # Listar skills
    echo "## 🧠 Skills Disponíveis" >> "$CATALOGO_FILE"
    echo "" >> "$CATALOGO_FILE"
    echo "| Skill | Descrição |" >> "$CATALOGO_FILE"
    echo "|-------|-----------|" >> "$CATALOGO_FILE"
    
    for arquivo in "$SKILLS_DIR"/*.md; do
        local nome=$(basename "$arquivo" .md)
        local desc=$(extrair_descricao "$arquivo" | cut -d. -f1)
        echo "| \`$nome\` | ${desc}... |" >> "$CATALOGO_FILE"
    done
    
    echo "" >> "$CATALOGO_FILE"
    echo "---" >> "$CATALOGO_FILE"
    echo "" >> "$CATALOGO_FILE"
    echo "*Gerado automaticamente por \`scripts/ecc-install.sh\`*" >> "$CATALOGO_FILE"
}

# ═══════════════════════════════════════════════════════════════
# CABEÇALHO
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🚀  ECC Install — Instalação Direta para Freebuff          ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "   ${CYAN}Modo:${NC} $([ "$UPDATE_MODE" = true ] && echo "Atualização" || ([ "$FORCE_MODE" = true ] && echo "Forçado" || echo "Instalação"))"
echo -e "   ${CYAN}Destino:${NC} $OUTPUT_DIR"
echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 1: Verificar pré-requisitos
# ═══════════════════════════════════════════════════════════════

header "🔍 Verificando pré-requisitos"

# Verificar git
if ! command -v git &> /dev/null; then
    fail "Git não encontrado. Instale: https://git-scm.com/"
    exit 1
fi
ok "Git instalado"

# Verificar se .agents/types existe
if [ ! -d "$OUTPUT_DIR/types" ]; then
    warn "Diretório .agents/types não encontrado"
    log "Execute '/init' no Freebuff primeiro para criar a estrutura"
    log "Depois execute este script novamente"
    exit 1
fi
ok "Estrutura .agents/ encontrada"

# ═══════════════════════════════════════════════════════════════
# PASSO 2: Baixar ECC do GitHub
# ═══════════════════════════════════════════════════════════════

header "📥 Baixando ECC do GitHub"

# Limpar diretório temporário anterior
rm -rf "$TEMP_DIR"

log "Clonando $ECC_REPO (shallow)..."
if ! git clone --depth 1 --branch "$ECC_BRANCH" "$ECC_REPO" "$TEMP_DIR" 2>&1; then
    fail "Falha ao clonar ECC. Verifique sua conexão."
    exit 1
fi

ECC_HASH=$(cd "$TEMP_DIR" && git rev-parse --short HEAD)
ok "ECC clonado: $ECC_HASH"

# Verificar se há atualização
if [ -f "$VERSION_FILE" ]; then
    OLD_HASH=$(cat "$VERSION_FILE")
    if [ "$OLD_HASH" = "$ECC_HASH" ] && [ "$FORCE_MODE" = false ]; then
        warn "ECC já está na versão mais recente ($ECC_HASH)"
        if [ "$UPDATE_MODE" = false ]; then
            log "Use --force para reinstalar ou --update para verificar novos recursos"
        fi
    else
        log "Nova versão detectada: $OLD_HASH → $ECC_HASH"
    fi
fi

# ═══════════════════════════════════════════════════════════════
# PASSO 3: Converter agentes
# ═══════════════════════════════════════════════════════════════

header "🔄 Convertendo agentes"

mkdir -p "$OUTPUT_DIR"

TOTAL=0
NOVOS=0
ATUALIZADOS=0
FALHA=0

for arquivo in "$TEMP_DIR/agents/"*.md; do
    [ ! -f "$arquivo" ] && continue
    
    TOTAL=$((TOTAL + 1))
    nome=$(basename "$arquivo" .md)
    destino="$OUTPUT_DIR/${nome}.ts"
    
    # Verificar se é novo ou atualização
    if [ -f "$destino" ] && [ "$FORCE_MODE" = false ]; then
        # Verificar se o arquivo mudou
        if [ "$(stat -c %Y "$arquivo" 2>/dev/null || stat -f %m "$arquivo" 2>/dev/null)" -le "$(stat -c %Y "$destino" 2>/dev/null || stat -f %m "$destino" 2>/dev/null)" ]; then
            continue  # Pular se não mudou
        fi
        ATUALIZADOS=$((ATUALIZADOS + 1))
        log "🔄 $nome (atualizado)"
    else
        NOVOS=$((NOVOS + 1))
        log "🆕 $nome (novo)"
    fi
    
    if gerar_agente_ts "$arquivo"; then
        ok "   ✔ $nome.ts"
    else
        FALHA=$((FALHA + 1))
        fail "   ✗ $nome (falha)"
    fi
done

# ═══════════════════════════════════════════════════════════════
# PASSO 4: Converter skills
# ═══════════════════════════════════════════════════════════════

header "🔄 Convertendo skills"

mkdir -p "$SKILLS_DIR"

TOTAL_SKILLS=0
NOVAS_SKILLS=0
ATUALIZADAS_SKILLS=0
FALHA_SKILLS=0

for skill_dir in "$TEMP_DIR/skills/"*/; do
    [ ! -d "$skill_dir" ] && continue
    
    TOTAL_SKILLS=$((TOTAL_SKILLS + 1))
    skill_name=$(basename "$skill_dir")
    skill_file="$skill_dir/SKILL.md"
    destino="$SKILLS_DIR/${skill_name}.md"
    
    # Verificar se SKILL.md existe
    if [ ! -f "$skill_file" ]; then
        continue
    fi
    
    # Verificar se é nova ou atualização
    if [ -f "$destino" ] && [ "$FORCE_MODE" = false ]; then
        # Verificar se o arquivo mudou
        if [ "$(stat -c %Y "$skill_file" 2>/dev/null || stat -f %m "$skill_file" 2>/dev/null)" -le "$(stat -c %Y "$destino" 2>/dev/null || stat -f %m "$destino" 2>/dev/null)" ]; then
            continue  # Pular se não mudou
        fi
        ATUALIZADAS_SKILLS=$((ATUALIZADAS_SKILLS + 1))
        log "🔄 $skill_name (atualizada)"
    else
        NOVAS_SKILLS=$((NOVAS_SKILLS + 1))
        log "🆕 $skill_name (nova)"
    fi
    
    if copiar_skill_ecc "$skill_dir"; then
        ok "   ✔ $skill_name.md"
    else
        FALHA_SKILLS=$((FALHA_SKILLS + 1))
        fail "   ✗ $skill_name (falha)"
    fi
done

# ═══════════════════════════════════════════════════════════════
# PASSO 5: Limpar arquivos órfãos
# ═══════════════════════════════════════════════════════════════

header "🧹 Removendo arquivos órfãos"

REMOVIDOS_AGENTES=0
REMOVIDOS_SKILLS=0

# Remover agentes .ts que não existem mais no ECC
for arquivo_ts in "$OUTPUT_DIR"/*.ts; do
    [ ! -f "$arquivo_ts" ] && continue
    nome=$(basename "$arquivo_ts" .ts)
    # Verificar se o .md correspondente existe no ECC
    if [ ! -f "$TEMP_DIR/agents/${nome}.md" ]; then
        rm -f "$arquivo_ts"
        REMOVIDOS_AGENTES=$((REMOVIDOS_AGENTES + 1))
        log "🗑️  $nome.ts (órfão removido)"
    fi
done

# Remover skills .md que não existem mais no ECC
for arquivo_md in "$SKILLS_DIR"/*.md; do
    [ ! -f "$arquivo_md" ] && continue
    nome=$(basename "$arquivo_md" .md)
    # Verificar se a skill correspondente existe no ECC
    if [ ! -d "$TEMP_DIR/skills/$nome" ] || [ ! -f "$TEMP_DIR/skills/$nome/SKILL.md" ]; then
        rm -f "$arquivo_md"
        REMOVIDOS_SKILLS=$((REMOVIDOS_SKILLS + 1))
        log "🗑️  $nome.md (órfão removido)"
    fi
done

if [ "$REMOVIDOS_AGENTES" -gt 0 ] || [ "$REMOVIDOS_SKILLS" -gt 0 ]; then
    ok "Removidos: $REMOVIDOS_AGENTES agentes + $REMOVIDOS_SKILLS skills órfãos"
else
    ok "Nenhum arquivo órfão encontrado"
fi

# ═══════════════════════════════════════════════════════════════
# PASSO 6: Gerar catálogo
# ═══════════════════════════════════════════════════════════════

header "📋 Gerando catálogo"

gerar_catalogo
ok "CATALOGO.md atualizado"

# ═══════════════════════════════════════════════════════════════
# PASSO 7: Salvar versão
# ═══════════════════════════════════════════════════════════════

echo "$ECC_HASH" > "$VERSION_FILE"
ok "Versão salva: $ECC_HASH"

# ═══════════════════════════════════════════════════════════════
# PASSO 8: Limpar temporários
# ═══════════════════════════════════════════════════════════════

header "🧹 Limpando arquivos temporários"

rm -rf "$TEMP_DIR"
ok "Limpeza concluída"

# ═══════════════════════════════════════════════════════════════
# PASSO 9: Validação
# ═══════════════════════════════════════════════════════════════

header "✅ Validação"

# Contar agentes e skills
TOTAL_TS=$(ls -1 "$OUTPUT_DIR"/*.ts 2>/dev/null | wc -l)
TOTAL_SKILLS_MD=$(ls -1 "$SKILLS_DIR"/*.md 2>/dev/null | wc -l)
log "Agentes TypeScript: $TOTAL_TS"
log "Skills Markdown: $TOTAL_SKILLS_MD"

# Validar TypeScript (se disponível)
if command -v npx &> /dev/null; then
    log "Validando TypeScript..."
    if cd "$OUTPUT_DIR" && npx tsc --noEmit 2>&1; then
        ok "TypeScript válido"
    else
        warn "Alguns arquivos podem ter erros de tipo"
    fi
    cd "$PROJECT_DIR"
else
    warn "npx não encontrado — pulando validação TypeScript"
fi

# ═══════════════════════════════════════════════════════════════
# RELATÓRIO FINAL
# ═══════════════════════════════════════════════════════════════

header "📊 Relatório Final"

echo -e "   ${BLUE}Versão ECC:${NC}       $ECC_HASH"
echo -e "   ${BLUE}Total agentes:${NC}    $TOTAL_TS"
echo -e "   ${GREEN}Novos:${NC}            $NOVOS"
[ "$ATUALIZADOS" -gt 0 ] && echo -e "   ${YELLOW}Atualizados:${NC}      $ATUALIZADOS"
[ "$FALHA" -gt 0 ] && echo -e "   ${RED}Falhas:${NC}           $FALHA"
echo ""
echo -e "   ${BLUE}Total skills:${NC}     $TOTAL_SKILLS_MD"
echo -e "   ${GREEN}Novas:${NC}            $NOVAS_SKILLS"
[ "$ATUALIZADAS_SKILLS" -gt 0 ] && echo -e "   ${YELLOW}Atualizadas:${NC}      $ATUALIZADAS_SKILLS"
[ "$FALHA_SKILLS" -gt 0 ] && echo -e "   ${RED}Falhas:${NC}           $FALHA_SKILLS"
echo ""
echo -e "   ${CYAN}Arquivos:${NC}"
echo -e "     • Agentes:    $OUTPUT_DIR/*.ts"
echo -e "     • Skills:     $SKILLS_DIR/*.md"
echo -e "     • Catálogo:   $CATALOGO_FILE"
echo -e "     • Versão:     $VERSION_FILE"
echo ""
echo -e "   ${YELLOW}💡 Para usar um agente:${NC}"
echo -e "      @\"code-reviewer\" [sua solicitação]"
echo ""
echo -e "   ${YELLOW}💡 Para atualizar:${NC}"
echo -e "      bash scripts/ecc-install.sh --update"
echo ""

# Listar agentes disponíveis
echo -e "${YELLOW}Agentes disponíveis:${NC}"
ls -1 "$OUTPUT_DIR"/*.ts 2>/dev/null | head -20 | while read -r f; do
    basename "$f" .ts | sed 's/^/   • /'
done
TOTAL_LISTED=$(ls -1 "$OUTPUT_DIR"/*.ts 2>/dev/null | wc -l)
[ "$TOTAL_LISTED" -gt 20 ] && echo -e "   ... e mais $((TOTAL_LISTED - 20)) agentes"

# ─── Tornar script executável ──────────────────────────────
chmod +x "$0" 2>/dev/null || true

# ─── Exit code ─────────────────────────────────────────────
if [ "$FALHA" -gt 0 ] || [ "$FALHA_SKILLS" -gt 0 ]; then
    exit 1
fi
