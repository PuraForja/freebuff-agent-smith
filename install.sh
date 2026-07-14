#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
#  install.sh — Instalador Leve do ECC Bridge
# ═══════════════════════════════════════════════════════════════
#  Baixa APENAS o @agent-manager e configura o ambiente.
#  O @agent-manager é quem faz o trabalho pesado (lê ECC via API).
#
#  Uso: curl -fsSL https://raw.githubusercontent.com/PuraForja/freebuff-ecc-bridge/main/install.sh | bash
#  Ou:  bash install.sh
# ═══════════════════════════════════════════════════════════════

set -euo pipefail

# Cores
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; NC='\033[0m'

# Configurações
BRIDGE_REPO="https://github.com/PuraForja/freebuff-ecc-bridge"
RAW_BASE="${BRIDGE_REPO}/raw/main"
INSTALL_DIR="$(pwd)"
TYPES_DOWNLOADED=0
TYPES_FAILED=0

# Função para baixar arquivo
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

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      🔄  ECC BRIDGE — Instalador Leve                       ║${NC}"
echo -e "${BLUE}║      Baixa apenas o @agent-manager (sem baixar ECC)         ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════
# STEP 1: VERIFICAR PREREQUISITOS
# ═══════════════════════════════════════════════════════════════
echo -e "${CYAN}[1/6] Verificando pré-requisitos...${NC}"

if ! command -v curl &> /dev/null && ! command -v wget &> /dev/null; then
    echo -e "  ${RED}❌${NC} curl ou wget necessário"
    exit 1
fi

echo -e "  ${GREEN}✅${NC} Ferramenta de download encontrada"
echo ""

# ═══════════════════════════════════════════════════════════════
# STEP 2: CRIAR ESTRUTURA DE DIRETÓRIOS
# ═══════════════════════════════════════════════════════════════
echo -e "${CYAN}[2/6] Criando estrutura...${NC}"

mkdir -p "${INSTALL_DIR}/.agents/types"
mkdir -p "${INSTALL_DIR}/.agents/installed/ecc-skills"
mkdir -p "${INSTALL_DIR}/.agents/installed/ecc-agents"
mkdir -p "${INSTALL_DIR}/.agents/installed/ecc-rules"
mkdir -p "${INSTALL_DIR}/.agents/installed/custom"

echo -e "  ${GREEN}✅${NC} Estrutura criada em ${INSTALL_DIR}/.agents/"
echo ""

# ═══════════════════════════════════════════════════════════════
# STEP 3: BAIXAR @AGENT-MANAGER (APENAS 1 ARQUIVO)
# ═══════════════════════════════════════════════════════════════
echo -e "${CYAN}[3/6] Baixando @agent-manager...${NC}"

if download_file "${RAW_BASE}/.agents/agent-manager.ts" "${INSTALL_DIR}/.agents/agent-manager.ts"; then
    echo -e "  ${GREEN}✅${NC} @agent-manager.ts baixado"
else
    echo -e "  ${RED}❌${NC} Erro ao baixar @agent-manager"
    exit 1
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# STEP 4: BAIXAR TIPOS TYPESCRIPT
# ═══════════════════════════════════════════════════════════════
echo -e "${CYAN}[4/6] Baixando tipos TypeScript...${NC}"

TYPES=("agent-definition.ts" "tools.ts" "util-types.ts")
for type_file in "${TYPES[@]}"; do
    if download_file "${RAW_BASE}/.agents/types/${type_file}" "${INSTALL_DIR}/.agents/types/${type_file}"; then
        echo -e "  ${GREEN}✅${NC} ${type_file} baixado"
        TYPES_DOWNLOADED=$((TYPES_DOWNLOADED + 1))
    else
        echo -e "  ${YELLOW}⚠️${NC} ${type_file} não encontrado (opcional)"
        TYPES_FAILED=$((TYPES_FAILED + 1))
    fi
done

if [ "$TYPES_DOWNLOADED" -eq 0 ] && [ "$TYPES_FAILED" -gt 0 ]; then
    echo -e "  ${YELLOW}⚠️${NC} Nenhum tipo baixado. Verifique o repositório."
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# STEP 5: CRIAR ARQUIVO DE CONFIGURAÇÃO
# ═══════════════════════════════════════════════════════════════
echo -e "${CYAN}[5/6] Criando configuração...${NC}"

INSTALLED_AT=$(date -u +%Y-%m-%dT%H:%M:%SZ)

cat > "${INSTALL_DIR}/.ecc-config.json" << CONFIG_EOF
{
  "ecc_repo": "https://github.com/affaan-m/ECC",
  "bridge_repo": "https://github.com/PuraForja/freebuff-ecc-bridge",
  "installed_skills": [],
  "installed_agents": [],
  "installed_rules": [],
  "last_sync": null,
  "installed_at": "${INSTALLED_AT}",
  "version": "1.0.0",
  "note": "Use @agent-manager no Codebuff/Freebuff para instalar recursos do ECC"
}
CONFIG_EOF

echo -e "  ${GREEN}✅${NC} Arquivo de configuração criado"
echo ""

# ═══════════════════════════════════════════════════════════════
# STEP 6: ATUALIZAR .GITIGNORE
# ═══════════════════════════════════════════════════════════════
echo -e "${CYAN}[6/6] Atualizando .gitignore...${NC}"

GITIGNORE_FILE="${INSTALL_DIR}/.gitignore"

# Verificar se .gitignore existe e se já tem a entrada
if [ -f "$GITIGNORE_FILE" ]; then
    if ! grep -q "^\.agents/installed/" "$GITIGNORE_FILE" 2>/dev/null; then
        echo "" >> "$GITIGNORE_FILE"
        echo "# ECC Bridge - conteúdo instalado (runtime)" >> "$GITIGNORE_FILE"
        echo ".agents/installed/" >> "$GITIGNORE_FILE"
        echo -e "  ${GREEN}✅${NC} Entrada adicionada ao .gitignore"
    else
        echo -e "  ${YELLOW}⚠️${NC} .gitignore já contém a entrada"
    fi
else
    echo "# ECC Bridge - conteúdo instalado (runtime)" > "$GITIGNORE_FILE"
    echo ".agents/installed/" >> "$GITIGNORE_FILE"
    echo -e "  ${GREEN}✅${NC} .gitignore criado"
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# RESUMO FINAL
# ═══════════════════════════════════════════════════════════════
echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                     ✅  INSTALAÇÃO CONCLUÍDA                  ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "   📁 ${GREEN}Projeto:${NC} ${INSTALL_DIR}"
echo -e "   🤖 ${GREEN}Agent Manager:${NC} .agents/agent-manager.ts"
echo -e "   📝 ${GREEN}Tipos:${NC} ${TYPES_DOWNLOADED} baixados, ${TYPES_FAILED} não encontrados"
echo -e "   📄 ${GREEN}Config:${NC} .ecc-config.json"
echo -e "   📋 ${GREEN}Gitignore:${NC} .agents/installed/ ignorado"
echo ""
echo -e "   ${CYAN}📋 Próximos passos:${NC}"
echo -e "   1. Abra o Freebuff/Codebuff no diretório do projeto"
echo -e "   2. Use ${YELLOW}@agent-manager${NC} para instalar recursos do ECC"
echo -e "   3. Exemplo: ${YELLOW}@agent-manager instale python-patterns${NC}"
echo ""
echo -e "   ${YELLOW}💡 O @agent-manager lê o ECC via GitHub API (sem baixar para sua máquina).${NC}"
echo ""
