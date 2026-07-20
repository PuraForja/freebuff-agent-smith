#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
#  install.sh — Instalador Interativo do Freebuff Agent Smith V2 v2.0
# ═══════════════════════════════════════════════════════════════
#  Uso: curl -fsSL https://raw.githubusercontent.com/.../install.sh | bash
#  Ou:  bash install.sh
#
#  Funciona em 3 etapas:
#    1. Instala o @agent-smith-v2 (sempre)
#    2. PERGUNTA: Quer instalar ECC + outros repositórios?
#    3. Instala os selecionados e adapta para Freebuff
# ═══════════════════════════════════════════════════════════════

set -euo pipefail

# ─── Cores ──────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; MAGENTA='\033[0;35m'
NC='\033[0m'

# ─── Configurações ──────────────────────────────────────────
BRIDGE_REPO="https://github.com/PuraForja/freebuff-agent-smith-v2"
RAW_BASE="${BRIDGE_REPO}/raw/master"
INSTALL_DIR="$(pwd)"
TYPES_DOWNLOADED=0
TYPES_FAILED=0
STDIN_TTY=""
# Detecta se estamos rodando com pipe (curl | bash) e usa /dev/tty
if [ ! -t 0 ]; then
    STDIN_TTY="</dev/tty"
fi

# ─── Funções Utilitárias ────────────────────────────────────
download_file() {
    local url="$1"
    local dest="$2"
    if command -v curl &> /dev/null; then
        curl -fsSL "$url" -o "$dest" 2>/dev/null
    elif command -v wget &> /dev/null; then
        wget -q "$url" -O "$dest" 2>/dev/null
    else
        return 1
    fi
}

verify_typescript() {
    local file="$1"
    if [ -f "$file" ]; then
        if head -5 "$file" | grep -qE "(export default|export const|// )"; then
            return 0
        fi
    fi
    return 1
}

check_freebuff() {
    command -v freebuff &> /dev/null && return 0
    return 1
}

# ─── Cabeçalho ──────────────────────────────────────────────
clear 2>/dev/null || true
echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     🤖  FREEBUFF AGENT SMITH v2.0 — Instalador Interativo   ║${NC}"
echo -e "${BLUE}║     Auto-engenheiro de Agentes AI para Freebuff              ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════
# STEP 1: VERIFICAR PRÉ-REQUISITOS
# ═══════════════════════════════════════════════════════════════
echo -e "${CYAN}[1/5] Verificando pré-requisitos...${NC}"

if ! command -v curl &> /dev/null && ! command -v wget &> /dev/null; then
    echo -e "  ${RED}❌${NC} curl ou wget necessário. Instale um deles."
    exit 1
fi
echo -e "  ${GREEN}✅${NC} Ferramenta de download encontrada"

if command -v git &> /dev/null; then
    echo -e "  ${GREEN}✅${NC} Git encontrado"
    GIT_AVAILABLE=true
else
    echo -e "  ${YELLOW}⚠️${NC} Git não encontrado (necessário apenas para instalação ECC)"
    GIT_AVAILABLE=false
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# STEP 2: CRIAR ESTRUTURA
# ═══════════════════════════════════════════════════════════════
echo -e "${CYAN}[2/5] Criando estrutura de diretórios...${NC}"

mkdir -p "${INSTALL_DIR}/.agents/types"
mkdir -p "${INSTALL_DIR}/scripts"

echo -e "  ${GREEN}✅${NC} Estrutura criada em ${INSTALL_DIR}/.agents/ e ${INSTALL_DIR}/scripts/"
echo ""

# ═══════════════════════════════════════════════════════════════
# STEP 3: BAIXAR @AGENT-SMITH + SCRIPTS (OBRIGATÓRIO)
# ═══════════════════════════════════════════════════════════════
echo -e "${CYAN}[3/5] Baixando @agent-smith-v2 e scripts...${NC}"

# 3a: Agent Smith V2
if download_file "${RAW_BASE}/.agents/agent-smith-v2.ts" "${INSTALL_DIR}/.agents/agent-smith-v2.ts"; then
    if verify_typescript "${INSTALL_DIR}/.agents/agent-smith-v2.ts"; then
        echo -e "  ${GREEN}✅${NC} @agent-smith-v2.ts v2.0 baixado e verificado"
    else
        echo -e "  ${RED}❌${NC} @agent-smith-v2.ts inválido"
        rm -f "${INSTALL_DIR}/.agents/agent-smith-v2.ts"
        exit 1
    fi
else
    echo -e "  ${RED}❌${NC} Erro ao baixar @agent-smith-v2"
    exit 1
fi

# 3b: Types
echo -e "  ${CYAN}📥 Baixando tipos TypeScript...${NC}"
TYPES=("agent-definition.ts" "tools.ts" "util-types.ts")
for type_file in "${TYPES[@]}"; do
    if download_file "${RAW_BASE}/.agents/types/${type_file}" "${INSTALL_DIR}/.agents/types/${type_file}"; then
        if verify_typescript "${INSTALL_DIR}/.agents/types/${type_file}"; then
            echo -e "    ${GREEN}✅${NC} ${type_file}"
            TYPES_DOWNLOADED=$((TYPES_DOWNLOADED + 1))
        else
            echo -e "    ${YELLOW}⚠️${NC} ${type_file} inválido"
            TYPES_FAILED=$((TYPES_FAILED + 1))
        fi
    else
        echo -e "    ${YELLOW}⚠️${NC} ${type_file} não encontrado"
        TYPES_FAILED=$((TYPES_FAILED + 1))
    fi
done

# 3c: Scripts (para instalação ECC)
echo -e "  ${CYAN}📥 Baixando scripts auxiliares...${NC}"
SCRIPTS=("ecc-install.sh" "sync-ecc.sh" "auto-review.sh")
for script in "${SCRIPTS[@]}"; do
    if download_file "${RAW_BASE}/scripts/${script}" "${INSTALL_DIR}/scripts/${script}"; then
        chmod +x "${INSTALL_DIR}/scripts/${script}"
        echo -e "    ${GREEN}✅${NC} ${script}"
    else
        echo -e "    ${YELLOW}⚠️${NC} ${script} não encontrado (opcional)"
    fi
done

echo ""

# ═══════════════════════════════════════════════════════════════
# STEP 4: PERGUNTAR AO USUÁRIO (INTERATIVO)
# ═══════════════════════════════════════════════════════════════
echo -e "${CYAN}[4/5] Configuração interativa...${NC}"
echo ""

echo -e "${MAGENTA}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║            🎯  REPOSITÓRIOS DISPONÍVEIS PARA INSTALAR       ║${NC}"
echo -e "${MAGENTA}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${YELLOW}1)${NC} ${GREEN}ECC - Everything Claude Code${NC}"
echo -e "     ${CYAN}⭐ 224k+ stars${NC}"
echo -e "     📦 277 skills · 67 agents · 121 rules"
echo -e "     📝 https://github.com/affaan-m/ECC"
echo ""
echo -e "  ${YELLOW}2)${NC} ${GREEN}Freebuff Agent Smith V2 (apenas)${NC}"
echo -e "     📦 Só o @agent-smith-v2 (já baixado)"
echo -e "     💡 Use @agent-smith-v2 para instalar mais depois"
echo ""
echo -e "  ${YELLOW}3)${NC} ${GREEN}ECC + Agentes de Programação${NC}"
echo -e "     📦 67 agentes TypeScript (reviewers, build-resolvers, etc)"
echo -e "     🔧 Foco em revisão de código por linguagem"
echo ""
echo -e "  ${YELLOW}4)${NC} ${GREEN}Tudo (recomendado)${NC}"
echo -e "     📦 Completo: ECC + skills + agentes + documentação"
echo ""

# Perguntar
echo -e "${YELLOW}❓ O que você quer instalar?${NC}"
echo -e "   (Digite o número e pressione Enter)"
echo -e "   ${CYAN}Pode digitar múltiplos separados por espaço (ex: 1 3)${NC}"
echo -e "   Ou ${YELLOW}0${NC} para pular e instalar só o @agent-smith-v2"
echo ""
eval "read -p '   Sua escolha: ' USER_CHOICE $STDIN_TTY"
echo ""

# Processar escolha
INSTALL_ECC=false
INSTALL_FULL=false
INSTALL_PROGRAMMING=false
SKIP_EXTRA=false

for choice in $USER_CHOICE; do
    case $choice in
        0) SKIP_EXTRA=true; echo -e "  ${YELLOW}⏭️  Apenas @agent-smith-v2. Use 'scripts/ecc-install.sh' depois.${NC}" ;;
        1) INSTALL_ECC=true ;;
        2) SKIP_EXTRA=true; echo -e "  ${YELLOW}⏭️  Apenas @agent-smith-v2. OK!${NC}" ;;
        3) INSTALL_ECC=true; INSTALL_PROGRAMMING=true ;;
        4) INSTALL_FULL=true ;;
        *) echo -e "  ${RED}❌ Opção inválida: $choice. Ignorando.${NC}" ;;
    esac
done

echo ""

# ═══════════════════════════════════════════════════════════════
# STEP 4B: EXECUTAR INSTALAÇÕES ESCOLHIDAS
# ═══════════════════════════════════════════════════════════════
if [ "$SKIP_EXTRA" = true ]; then
    echo -e "${YELLOW}⏭️  Apenas @agent-smith-v2 instalado.${NC}"
    echo -e "   Você pode instalar mais depois com:"
    echo -e "   • @agent-smith-v2 instale <recurso>"
    echo -e "   • bash scripts/ecc-install.sh"
elif [ "$INSTALL_FULL" = true ]; then
    echo -e "${GREEN}📦 Instalação COMPLETA selecionada!${NC}"
    echo -e "  Isso inclui:"
    echo -e "   • 67 agentes TypeScript (todos)"
    echo -e "   • 278 skills Markdown"
    echo -e "   • Documentação completa"
    echo ""
    if [ "$GIT_AVAILABLE" = true ]; then
        echo -e "${CYAN}   Executando instalação ECC...${NC}"
        bash "${INSTALL_DIR}/scripts/ecc-install.sh" --force 2>&1 || \
            echo -e "  ${YELLOW}⚠️  Instalação ECC teve avisos, mas continuando...${NC}"
    else
        echo -e "  ${YELLOW}⚠️  Git não encontrado. Para instalar ECC:${NC}"
        echo -e "     1. Instale o Git: https://git-scm.com/"
        echo -e "     2. Execute: bash scripts/ecc-install.sh"
    fi
elif [ "$INSTALL_ECC" = true ]; then
    echo -e "${GREEN}📦 Instalação ECC selecionada!${NC}"
    echo ""
    if [ "$GIT_AVAILABLE" = true ]; then
        echo -e "${CYAN}   Executando instalação ECC...${NC}"
        bash "${INSTALL_DIR}/scripts/ecc-install.sh" 2>&1 || \
            echo -e "  ${YELLOW}⚠️  Instalação ECC teve avisos, mas continuando...${NC}"
    else
        echo -e "  ${YELLOW}⚠️  Git não encontrado. Para instalar ECC:${NC}"
        echo -e "     1. Instale o Git: https://git-scm.com/"
        echo -e "     2. Execute: bash scripts/ecc-install.sh"
    fi
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# STEP 5: CONFIGURAÇÃO FINAL
# ═══════════════════════════════════════════════════════════════
echo -e "${CYAN}[5/5] Finalizando configuração...${NC}"

INSTALLED_AT=$(date -u +%Y-%m-%dT%H:%M:%SZ)
ECC_INSTALLED=$(ls "${INSTALL_DIR}/.agents"/*.ts 2>/dev/null | wc -l || echo 1)

cat > "${INSTALL_DIR}/.ecc-config.json" << CONFIG_EOF
{
  "ecc_repo": "https://github.com/affaan-m/ECC",
  "bridge_repo": "https://github.com/PuraForja/freebuff-agent-smith-v2",
  "installed_skills": [],
  "installed_agents": [],
  "installed_rules": [],
  "last_sync": null,
  "installed_at": "${INSTALLED_AT}",
  "version": "2.0.0",
  "agents_count": ${ECC_INSTALLED},
  "note": "Agent Smith V2 v2.0 - Use @agent-smith-v2 para gerenciar. 'descubra' para achar repos. 'reavalie' para multi-avaliação."
}
CONFIG_EOF
echo -e "  ${GREEN}✅${NC} Configuração salva (.ecc-config.json)"

# Baixar knowledge.md
if ! [ -f "${INSTALL_DIR}/knowledge.md" ]; then
    echo -e "  ${CYAN}📥 Baixando knowledge.md...${NC}"
    download_file "${RAW_BASE}/knowledge.md" "${INSTALL_DIR}/knowledge.md" && \
        echo -e "  ${GREEN}✅${NC} knowledge.md baixado" || \
        echo -e "  ${YELLOW}⚠️${NC} knowledge.md não baixado"
fi

# Atualizar .gitignore
GITIGNORE_FILE="${INSTALL_DIR}/.gitignore"
if ! grep -q "\.agents/types/" "$GITIGNORE_FILE" 2>/dev/null; then
    {
        echo ""
        echo "# Freebuff Agent Smith V2"
        echo ".agents/types/"
        echo "skills/"
        echo "CATALOGO.md"
    } >> "$GITIGNORE_FILE"
    echo -e "  ${GREEN}✅${NC} .gitignore atualizado"
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# RESUMO FINAL
# ═══════════════════════════════════════════════════════════════
echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║             ✅  INSTALAÇÃO CONCLUÍDA COM SUCESSO             ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "   ${CYAN}📋 Resumo da Instalação:${NC}"
echo -e "   ─────────────────────────────────────────────"
echo -e "   📁 ${GREEN}Projeto:${NC}       ${INSTALL_DIR}"
echo -e "   🤖 ${GREEN}Agent Smith V2:${NC}    .agents/agent-smith-v2.ts ${MAGENTA}v2.0${NC}"
echo -e "   📝 ${GREEN}Tipos:${NC}          ${TYPES_DOWNLOADED}/3 baixados"
echo -e "   📖 ${GREEN}Knowledge:${NC}      knowledge.md"
echo -e "   ⚙️  ${GREEN}Config:${NC}        .ecc-config.json"
echo -e "   📦 ${GREEN}Agentes:${NC}        ${ECC_INSTALLED} arquivos .ts"
echo -e "   🌐 ${GREEN}Freebuff:${NC}       $([ "$(check_freebuff && echo '✅ instalado' || echo '⚠️ não encontrado')" )"
echo ""
echo -e "   ${YELLOW}💡 Comandos Rápidos (dentro do Freebuff):${NC}"
echo -e "   ─────────────────────────────────────────────"
echo -e "   ${GREEN}@agent-smith-v2 reavalie${NC}        → Reavaliar todos os agentes"
echo -e "   ${GREEN}@agent-smith-v2 descubra${NC}        → Pesquisar GitHub por novos repos"
echo -e "   ${GREEN}@agent-smith-v2 crie <desc>${NC}     → Criar novo agente"
echo -e "   ${GREEN}@agent-smith-v2 clone <nome>${NC}    → Clonar agente existente"
echo -e "   ${GREEN}@agent-smith-v2 liste${NC}           → Listar agentes instalados"
echo -e "   ${GREEN}@agent-smith-v2 status${NC}          → Saúde do sistema"
echo ""

# Instalar Freebuff se não tiver
if ! check_freebuff; then
    echo -e "   ${YELLOW}📦 Freebuff não encontrado. Quer instalar? (s/N)${NC}"
    eval "read -p '   ' INSTALL_FB $STDIN_TTY"
    if [ "$INSTALL_FB" = "s" ] || [ "$INSTALL_FB" = "S" ]; then
        echo -e "   ${CYAN}   Instalando Freebuff...${NC}"
        npm install -g freebuff 2>&1 || \
            echo -e "   ${RED}❌ Erro. Tente: npm install -g freebuff${NC}"
    fi
fi

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         O @agent-smith-v2 está pronto! Use freebuff!           ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""
