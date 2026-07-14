# ═══════════════════════════════════════════════════════════════
#  install.ps1 — Instalador Leve do ECC Bridge (Windows)
# ═══════════════════════════════════════════════════════════════
#  Baixa APENAS o @agent-manager e configura o ambiente.
#  O @agent-manager é quem faz o trabalho pesado (lê ECC via API).
#
#  Uso (PowerShell):
#  iex (Invoke-WebRequest -Uri "https://raw.githubusercontent.com/PuraForja/freebuff-ecc-bridge/master/install.ps1").Content
# ═══════════════════════════════════════════════════════════════

$ErrorActionPreference = "Stop"

# Configurações
$BRIDGE_REPO = "https://github.com/PuraForja/freebuff-ecc-bridge"
$RAW_BASE = "$BRIDGE_REPO/raw/master"
$INSTALL_DIR = Get-Location

# Cores
function Write-Color {
    param([string]$Text, [string]$Color = "White")
    Write-Host $Text -ForegroundColor $Color
}

Write-Color ""
Write-Color "╔═══════════════════════════════════════════════════════════════╗" "Cyan"
Write-Color "║      🔄  ECC BRIDGE — Instalador Leve (Windows)             ║" "Cyan"
Write-Color "║      Baixa apenas o @agent-manager (sem baixar ECC)         ║" "Cyan"
Write-Color "╚═══════════════════════════════════════════════════════════════╝" "Cyan"
Write-Color ""

# ═══════════════════════════════════════════════════════════════
# STEP 1: VERIFICAR PREREQUISITOS
# ═══════════════════════════════════════════════════════════════
Write-Color "[1/5] Verificando pré-requisitos..." "Cyan"

try {
    $ProgressPreference = "SilentlyContinue"
    Invoke-WebRequest -Uri "https://github.com" -Method Head -UseBasicParsing | Out-Null
    Write-Color "  ✅ Conexão com internet OK" "Green"
} catch {
    Write-Color "  ❌ Sem conexão com internet" "Red"
    exit 1
}

Write-Color ""

# ═══════════════════════════════════════════════════════════════
# STEP 2: CRIAR ESTRUTURA DE DIRETÓRIOS
# ═══════════════════════════════════════════════════════════════
Write-Color "[2/5] Criando estrutura..." "Cyan"

$dirs = @(
    "$INSTALL_DIR\.agents\types",
    "$INSTALL_DIR\.agents\installed\ecc-skills",
    "$INSTALL_DIR\.agents\installed\ecc-agents",
    "$INSTALL_DIR\.agents\installed\ecc-rules",
    "$INSTALL_DIR\.agents\installed\custom"
)

foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

Write-Color "  ✅ Estrutura criada em $INSTALL_DIR\.agents\" "Green"
Write-Color ""

# ═══════════════════════════════════════════════════════════════
# STEP 3: BAIXAR @AGENT-MANAGER (APENAS 1 ARQUIVO)
# ═══════════════════════════════════════════════════════════════
Write-Color "[3/5] Baixando @agent-manager..." "Cyan"

try {
    $ProgressPreference = "SilentlyContinue"
    Invoke-WebRequest -Uri "$RAW_BASE/.agents/agent-manager.ts" -OutFile "$INSTALL_DIR\.agents\agent-manager.ts" -UseBasicParsing
    Write-Color "  ✅ agent-manager.ts baixado" "Green"
} catch {
    Write-Color "  ❌ Erro ao baixar agent-manager.ts" "Red"
    exit 1
}

Write-Color ""

# ═══════════════════════════════════════════════════════════════
# STEP 4: BAIXAR TIPOS TYPESCRIPT
# ═══════════════════════════════════════════════════════════════
Write-Color "[4/5] Baixando tipos TypeScript..." "Cyan"

$types = @("agent-definition.ts", "tools.ts", "util-types.ts")
$downloaded = 0
$failed = 0

foreach ($type_file in $types) {
    try {
        $ProgressPreference = "SilentlyContinue"
        Invoke-WebRequest -Uri "$RAW_BASE/.agents/types/$type_file" -OutFile "$INSTALL_DIR\.agents\types\$type_file" -UseBasicParsing
        Write-Color "  ✅ $type_file baixado" "Green"
        $downloaded++
    } catch {
        Write-Color "  ⚠️  $type_file não encontrado (opcional)" "Yellow"
        $failed++
    }
}

Write-Color ""

# ═══════════════════════════════════════════════════════════════
# STEP 5: CRIAR ARQUIVO DE CONFIGURAÇÃO
# ═══════════════════════════════════════════════════════════════
Write-Color "[5/5] Criando configuração..." "Cyan"

$installedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")

$config = @"
{
  "ecc_repo": "https://github.com/affaan-m/ECC",
  "bridge_repo": "https://github.com/PuraForja/freebuff-ecc-bridge",
  "installed_skills": [],
  "installed_agents": [],
  "installed_rules": [],
  "last_sync": null,
  "installed_at": "$installedAt",
  "version": "1.0.0",
  "note": "Use @agent-manager no Codebuff/Freebuff para instalar recursos do ECC"
}
"@

$config | Out-File -FilePath "$INSTALL_DIR\.ecc-config.json" -Encoding UTF8
Write-Color "  ✅ Arquivo de configuração criado" "Green"
Write-Color ""

# ═══════════════════════════════════════════════════════════════
# RESUMO FINAL
# ═══════════════════════════════════════════════════════════════
Write-Color "╔═══════════════════════════════════════════════════════════════╗" "Blue"
Write-Color "║                     ✅  INSTALAÇÃO CONCLUÍDA                  ║" "Blue"
Write-Color "╚═══════════════════════════════════════════════════════════════╝" "Blue"
Write-Color ""
Write-Color "   📁 Projeto: $INSTALL_DIR" "Green"
Write-Color "   🤖 Agent Manager: .agents\agent-manager.ts" "Green"
Write-Color "   📝 Tipos: $downloaded baixados, $failed não encontrados" "Green"
Write-Color "   📄 Config: .ecc-config.json" "Green"
Write-Color ""
Write-Color "   📋 Próximos passos:" "Cyan"
Write-Color "   1. Abra o Freebuff/Codebuff no diretório do projeto"
Write-Color "   2. Use @agent-manager para instalar recursos do ECC"
Write-Color "   3. Exemplo: @agent-manager instale python-patterns"
Write-Color ""
Write-Color "   💡 O @agent-manager lê o ECC via GitHub API (sem baixar para sua máquina)." "Yellow"
Write-Color ""
