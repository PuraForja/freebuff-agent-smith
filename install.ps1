# ═══════════════════════════════════════════════════════════════
#  install.ps1 — Instalador Leve do Freebuff Agente Smit (Windows)
# ═══════════════════════════════════════════════════════════════
#  Baixa APENAS o @agent-smith e configura o ambiente.
#  O @agent-smith é quem faz o trabalho pesado (lê ECC via API).
#
#  Uso (PowerShell):
#  iex (Invoke-WebRequest -Uri "https://raw.githubusercontent.com/PuraForja/freebuff-agent-smith/master/install.ps1").Content
# ═══════════════════════════════════════════════════════════════

$ErrorActionPreference = "Stop"

# Configurações
$BRIDGE_REPO = "https://github.com/PuraForja/freebuff-agent-smith"
$RAW_BASE = "$BRIDGE_REPO/raw/master"
$INSTALL_DIR = Get-Location

# Cores
function Write-Color {
    param([string]$Text, [string]$Color = "White")
    Write-Host $Text -ForegroundColor $Color
}

# Função para verificar se arquivo é TypeScript válido
function Test-TypeScript {
    param([string]$FilePath)
    if (Test-Path $FilePath) {
        $firstLines = Get-Content $FilePath -Head 5 -ErrorAction SilentlyContinue
        return ($firstLines -match "export default|export const|// ")
    }
    return $false
}

# Função para verificar se Freebuff está instalado
function Test-FreebuffInstalled {
    return [bool](Get-Command freebuff -ErrorAction SilentlyContinue)
}

Write-Color ""
Write-Color "╔═══════════════════════════════════════════════════════════════╗" "Cyan"
Write-Color "║      🔄  FREEBUFF AGENTE SMIT — Instalador Leve (Windows)             ║" "Cyan"
Write-Color "║      Baixa apenas o @agent-smith (sem baixar ECC)         ║" "Cyan"
Write-Color "╚═══════════════════════════════════════════════════════════════╝" "Cyan"
Write-Color ""

# ═══════════════════════════════════════════════════════════════
# STEP 1: VERIFICAR PREREQUISITOS
# ═══════════════════════════════════════════════════════════════
Write-Color "[1/6] Verificando pré-requisitos..." "Cyan"

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
Write-Color "[2/6] Criando estrutura..." "Cyan"

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
# STEP 3: BAIXAR @AGENT-SMITH (APENAS 1 ARQUIVO)
# ═══════════════════════════════════════════════════════════════
Write-Color "[3/6] Baixando @agent-smith..." "Cyan"

try {
    $ProgressPreference = "SilentlyContinue"
    Invoke-WebRequest -Uri "$RAW_BASE/.agents/agent-smith.ts" -OutFile "$INSTALL_DIR\.agents\agent-smith.ts" -UseBasicParsing
    
    if (Test-TypeScript "$INSTALL_DIR\.agents\agent-smith.ts") {
        Write-Color "  ✅ agent-smith.ts baixado e verificado" "Green"
    } else {
        Write-Color "  ❌ Arquivo baixado não é TypeScript válido" "Red"
        Remove-Item "$INSTALL_DIR\.agents\agent-smith.ts" -Force -ErrorAction SilentlyContinue
        exit 1
    }
} catch {
    Write-Color "  ❌ Erro ao baixar agent-smith.ts" "Red"
    exit 1
}

Write-Color ""

# ═══════════════════════════════════════════════════════════════
# STEP 4: BAIXAR TIPOS TYPESCRIPT
# ═══════════════════════════════════════════════════════════════
Write-Color "[4/6] Baixando tipos TypeScript..." "Cyan"

$types = @("agent-definition.ts", "tools.ts", "util-types.ts")
$downloaded = 0
$failed = 0

foreach ($type_file in $types) {
    try {
        $ProgressPreference = "SilentlyContinue"
        Invoke-WebRequest -Uri "$RAW_BASE/.agents/types/$type_file" -OutFile "$INSTALL_DIR\.agents\types\$type_file" -UseBasicParsing
        
        if (Test-TypeScript "$INSTALL_DIR\.agents\types\$type_file") {
            Write-Color "  ✅ $type_file baixado" "Green"
            $downloaded++
        } else {
            Write-Color "  ⚠️  $type_file baixado mas conteúdo inválido" "Yellow"
            Remove-Item "$INSTALL_DIR\.agents\types\$type_file" -Force -ErrorAction SilentlyContinue
            $failed++
        }
    } catch {
        Write-Color "  ⚠️  $type_file não encontrado (opcional)" "Yellow"
        $failed++
    }
}

Write-Color ""

# ═══════════════════════════════════════════════════════════════
# STEP 5: CRIAR ARQUIVO DE CONFIGURAÇÃO E KNOWLEDGE
# ═══════════════════════════════════════════════════════════════
Write-Color "[5/6] Criando configuração..." "Cyan"

# Criar .ecc-config.json
$installedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")

$config = @"
{
  "ecc_repo": "https://github.com/affaan-m/ECC",
  "bridge_repo": "https://github.com/PuraForja/freebuff-agent-smith",
  "installed_skills": [],
  "installed_agents": [],
  "installed_rules": [],
  "last_sync": null,
  "installed_at": "$installedAt",
  "version": "1.0.0",
  "note": "Use @agent-smith no Codebuff/Freebuff para instalar recursos do ECC"
}
"@

$config | Out-File -FilePath "$INSTALL_DIR\.ecc-config.json" -Encoding UTF8
Write-Color "  ✅ Arquivo de configuração criado" "Green"

# Baixar knowledge.md se não existir
$knowledgeFile = "$INSTALL_DIR\knowledge.md"
if (-not (Test-Path $knowledgeFile)) {
    Write-Color "  Baixando knowledge.md..." "Cyan"
    try {
        $ProgressPreference = "SilentlyContinue"
        Invoke-WebRequest -Uri "$RAW_BASE/knowledge.md" -OutFile $knowledgeFile -UseBasicParsing
        Write-Color "  ✅ knowledge.md baixado" "Green"
    } catch {
        Write-Color "  ⚠️  knowledge.md não encontrado no repositório" "Yellow"
    }
} else {
    Write-Color "  ✅ knowledge.md já existe" "Green"
}

Write-Color ""

# ═══════════════════════════════════════════════════════════════
# STEP 6: ATUALIZAR .GITIGNORE
# ═══════════════════════════════════════════════════════════════
Write-Color "[6/6] Atualizando .gitignore..." "Cyan"

$gitignoreFile = "$INSTALL_DIR\.gitignore"

if (Test-Path $gitignoreFile) {
    $content = Get-Content $gitignoreFile -Raw
    if ($content -notmatch "\.agents/installed/") {
        Add-Content -Path $gitignoreFile -Value "`n# Freebuff Agente Smit - conteúdo instalado (runtime)`n.agents/installed/"
        Write-Color "  ✅ Entrada adicionada ao .gitignore" "Green"
    } else {
        Write-Color "  ⚠️  .gitignore já contém a entrada" "Yellow"
    }
} else {
    Set-Content -Path $gitignoreFile -Value "# Freebuff Agente Smit - conteúdo instalado (runtime)`n.agents/installed/"
    Write-Color "  ✅ .gitignore criado" "Green"
}

Write-Color ""

# ═══════════════════════════════════════════════════════════════
# RESUMO FINAL
# ═══════════════════════════════════════════════════════════════
Write-Color "╔═══════════════════════════════════════════════════════════════╗" "Blue"
Write-Color "║                     ✅  INSTALAÇÃO CONCLUÍDA                  ║" "Blue"
Write-Color "╚═══════════════════════════════════════════════════════════════╝" "Blue"
Write-Color ""
Write-Color "   📁 Projeto: $INSTALL_DIR" "Green"
Write-Color "   🤖 Agent Manager: .agents\agent-smith.ts" "Green"
Write-Color "   📝 Tipos: $downloaded baixados, $failed não encontrados" "Green"
Write-Color "   📄 Config: .ecc-config.json" "Green"
Write-Color "   📖 Knowledge: knowledge.md" "Green"
Write-Color "   📋 Gitignore: .agents\installed\ ignorado" "Green"
Write-Color ""

# Verificar se Freebuff está instalado e oferecer para abrir
if (Test-FreebuffInstalled) {
    Write-Color "   🚀 Freebuff detectado!" "Cyan"
    Write-Color ""
    $response = Read-Host "   Deseja abrir o Freebuff agora? (S/N)"
    if ($response -eq "S" -or $response -eq "s") {
        Write-Color "   Abrindo Freebuff..." "Green"
        Start-Process freebuff
    } else {
        Write-Color "   Para abrir depois, execute: freebuff" "Yellow"
    }
} else {
    Write-Color "   📦 Freebuff não encontrado" "Yellow"
    Write-Color "   Para instalar: npm install -g freebuff" "Yellow"
    Write-Color ""
    Write-Color "   📋 Próximos passos:" "Cyan"
    Write-Color "   1. Instale o Freebuff: npm install -g freebuff"
    Write-Color "   2. Navegue até este diretório: cd $INSTALL_DIR"
    Write-Color "   3. Execute: freebuff"
    Write-Color "   4. Use: @agent-smith instale python-patterns"
}

Write-Color ""
Write-Color "   💡 O @agent-smith lê o ECC via GitHub API (sem baixar para sua máquina)." "Yellow"
Write-Color ""
