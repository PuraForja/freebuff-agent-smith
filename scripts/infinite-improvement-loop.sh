#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
#  infinite-improvement-loop.sh
#  Loop infinito de melhoria contínua com checkpoint persistente
# ═══════════════════════════════════════════════════════════════
#  Uso:   bash scripts/infinite-improvement-loop.sh [--max-iter N] [--dry-run]
#         bash scripts/infinite-improvement-loop.sh --status
#         bash scripts/infinite-improvement-loop.sh --reset
# ═══════════════════════════════════════════════════════════════

set -euo pipefail

# ─── Configuração ──────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BRIDGE_DIR="$(dirname "$SCRIPT_DIR")"
AUTO_REVIEW="$SCRIPT_DIR/auto-review.sh"
SYNC_ECC="$SCRIPT_DIR/sync-ecc.sh"
LOOP_STATUS="$BRIDGE_DIR/logs/LOOP_STATUS.md"
SESSAO="$BRIDGE_DIR/SESSAO.md"

MAX_ITER=100        # Safety limit: max iterations before forced stop
MAX_CONSECUTIVE_CLEAN=3  # Stop after N consecutive clean iterations
DRY_RUN=false

# Cores
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; MAGENTA='\033[0;35m'; CYAN='\033[0;36m'; NC='\033[0m'

# ─── Parsing de argumentos ─────────────────────────────────
for arg in "$@"; do
    case "$arg" in
        --max-iter=*) MAX_ITER="${arg#*=}" ;;
        --dry-run) DRY_RUN=true ;;
        --status) cat "$LOOP_STATUS" 2>/dev/null || echo "Arquivo de status não encontrado."; exit 0 ;;
        --reset)
            RESET_DATE="$(date '+%Y-%m-%d %H:%M:%S')"
            echo -e "${YELLOW}⚠️  Resetando LOOP_STATUS.md...${NC}"
            # Usando printf para evitar problemas de heredoc com variáveis
            printf '# 🔄 Infinite Improvement Loop — Status\n\n' > "$LOOP_STATUS"
            printf '> **Checkpoint resetado manualmente.**\n\n' >> "$LOOP_STATUS"
            printf '## 📍 Estado Atual do Loop\n\n' >> "$LOOP_STATUS"
            printf '| Campo | Valor |\n' >> "$LOOP_STATUS"
            printf '|-------|-------|\n' >> "$LOOP_STATUS"
            printf '| **Iteração atual** | `0` |\n' >> "$LOOP_STATUS"
            printf '| **Status** | `AGUARDANDO_INICIO` |\n' >> "$LOOP_STATUS"
            printf '| **Última execução** | `—` |\n' >> "$LOOP_STATUS"
            printf '| **Hash do checkpoint** | `—` |\n' >> "$LOOP_STATUS"
            printf '\n## 📊 Resumo Acumulado\n\n' >> "$LOOP_STATUS"
            printf '| Métrica | Valor |\n' >> "$LOOP_STATUS"
            printf '|---------|:-----:|\n' >> "$LOOP_STATUS"
            printf '| 🔄 Total de iterações | `0` |\n' >> "$LOOP_STATUS"
            printf '| 🐛 Problemas encontrados | `0` |\n' >> "$LOOP_STATUS"
            printf '| ✅ Problemas corrigidos | `0` |\n' >> "$LOOP_STATUS"
            printf '| ❌ Problemas não resolvidos | `0` |\n' >> "$LOOP_STATUS"
            printf '\n## 📜 Histórico de Iterações\n\n' >> "$LOOP_STATUS"
            printf '| # | Data | Hora | Encontrados | Corrigidos | Restantes | Status |\n' >> "$LOOP_STATUS"
            printf '|:-:|:----:|:----:|:-----------:|:----------:|:---------:|:------:|\n' >> "$LOOP_STATUS"
            printf '| — | — | — | — | — | — | — |\n\n' >> "$LOOP_STATUS"
            printf '*Resetado em %s*\n' "$RESET_DATE" >> "$LOOP_STATUS"
            echo -e "${GREEN}✅ LOOP_STATUS.md resetado.${NC}"
            exit 0
            ;;
        --help|-h)
            echo "Uso: bash scripts/infinite-improvement-loop.sh [opções]"
            echo ""
            echo "Opções:"
            echo "  --max-iter=N   Número máximo de iterações (default: 100)"
            echo "  --dry-run      Mostra o que faria, sem executar"
            echo "  --status       Mostra o status atual do loop"
            echo "  --reset        Reseta o checkpoint (começa do zero)"
            echo "  --help         Mostra esta ajuda"
            exit 0
            ;;
    esac
done

# ═══════════════════════════════════════════════════════════════
# FUNÇÕES
# ═══════════════════════════════════════════════════════════════

log()    { echo -e "${BLUE}[LOOP]${NC} $*"; }
ok()     { echo -e "${GREEN}[✅]${NC} $*"; }
fail()   { echo -e "${RED}[❌]${NC} $*"; }
warn()   { echo -e "${YELLOW}[⚠️]${NC} $*"; }
header() { echo ""; echo -e "${MAGENTA}═══════════════════════════════════════════════════════════════════${NC}"; echo -e "${MAGENTA}  $*${NC}"; echo -e "${MAGENTA}═══════════════════════════════════════════════════════════════════${NC}"; }

# ─── Ler checkpoint atual ─────────────────────────────────
# Retorna: iter_atual|status|encontrados_acum|corrigidos_acum|restantes_acum
ler_checkpoint() {
    local iter_atual=0 status="AGUARDANDO_INICIO" encontrados=0 corrigidos=0 restantes=0

    if [ -f "$LOOP_STATUS" ]; then
        iter_atual=$(grep -m1 "Iteração atual" "$LOOP_STATUS" 2>/dev/null | grep -oP '`\K[^`]+' || echo "0")
        status=$(grep -m1 "Status" "$LOOP_STATUS" 2>/dev/null | grep -oP '`\K[^`]+' || echo "AGUARDANDO_INICIO")
        encontrados=$(grep -m1 "Problemas encontrados" "$LOOP_STATUS" 2>/dev/null | grep -oP '`\K[^`]+' || echo "0")
        corrigidos=$(grep -m1 "Problemas corrigidos" "$LOOP_STATUS" 2>/dev/null | grep -oP '`\K[^`]+' || echo "0")
        restantes=$(grep -m1 "Problemas não resolvidos" "$LOOP_STATUS" 2>/dev/null | grep -oP '`\K[^`]+' || echo "0")
    fi

    echo "$iter_atual|$status|$encontrados|$corrigidos|$restantes"
}

# ─── Salvar checkpoint ────────────────────────────────────
# Parâmetros: iter status encontrados_acum corrigidos_acum restantes_acum
#   encontrados_acum = total ACUMULADO de todas as iterações
#   encontrados_iter = quantos na iteração ATUAL (para o histórico)
#   corrigidos_iter  = quantos corrigidos na iteração ATUAL
salvar_checkpoint() {
    local iter="$1" status="$2" encontrados_acum="$3" corrigidos_acum="$4" restantes_acum="$5"
    local encontrados_iter="${6:-$encontrados_acum}"  # Opcional: quantos na iteração atual
    local corrigidos_iter="${7:-$corrigidos_acum}"    # Opcional: quantos corrigidos agora
    local data=$(date '+%Y-%m-%d')
    local hora=$(date '+%H:%M:%S')
    local hash=$(echo "$iter-$data-$hora-$status" | md5sum 2>/dev/null | cut -c1-8 || echo "ckpt-$(date +%s)")

    # Determinar emoji de status
    local status_emoji="🔄"
    case "$status" in
        "EM_ANDAMENTO")     status_emoji="🔄" ;;
        "CONCLUIDO")        status_emoji="✅" ;;
        "PARADO_POR_ERRO")  status_emoji="❌" ;;
        "SEM_PROBLEMAS")    status_emoji="🎉" ;;
        "AGUARDANDO_INICIO") status_emoji="⏸️" ;;
    esac

    # Construir tabela de histórico preservando linhas antigas + nova
    local historico=""
    local i=1
    while [ "$i" -lt "$iter" ]; do
        # Preservar linha do histórico anterior
        local linha_antiga
        linha_antiga=$(grep "^| $i |" "$LOOP_STATUS" 2>/dev/null || true)
        if [ -n "$linha_antiga" ]; then
            historico="${historico}${linha_antiga}"$'\n'
        else
            historico="${historico}| $i | — | — | — | — | — | — |"$'\n'
        fi
        i=$((i + 1))
    done
    # Adicionar linha da iteração atual
    historico="${historico}| $iter | ${data} | ${hora} | ${encontrados_iter} | ${corrigidos_iter} | ${restantes_acum} | ${status_emoji} |"$'\n'

    cat > "$LOOP_STATUS" <<- CHKEOF
# 🔄 Infinite Improvement Loop — Status

> **Arquivo de checkpoint persistente.**
> Se houver queda de energia ou interrupção, o loop pode ler este arquivo
> para saber exatamente de onde continuar.

---

## 📍 Estado Atual do Loop

| Campo | Valor |
|-------|-------|
| **Iteração atual** | \`${iter}\` |
| **Status** | \`${status}\` |
| **Última execução** | \`${data} ${hora}\` |
| **Hash do checkpoint** | \`${hash}\` |

---

## 📊 Resumo Acumulado

| Métrica | Valor |
|---------|:-----:|
| 🔄 Total de iterações | \`${iter}\` |
| 🐛 Problemas encontrados | \`${encontrados_acum}\` |
| ✅ Problemas corrigidos | \`${corrigidos_acum}\` |
| ❌ Problemas não resolvidos | \`${restantes_acum}\` |
| 🎯 Problemas restantes (estimado) | \`?\` |

---

## 📜 Histórico de Iterações

| # | Data | Hora | Encontrados | Corrigidos | Restantes | Status |
|:-:|:----:|:----:|:-----------:|:----------:|:---------:|:------:|
${historico}
---

## 🐛 Detalhes dos Problemas Não Resolvidos

*Loop em execução. Verifique os relatórios em logs/auto-review-*.md*

---

## 💾 Instruções de Crash Recovery

Se o loop foi interrompido abruptamente (queda de energia, travamento):

1. **Leia este arquivo** para saber onde parou
2. Verifique o **Status** atual:
   - \`EM_ANDAMENTO\` → O loop estava rodando. Reinicie da iteração atual.
   - \`PARADO_POR_ERRO\` → O loop falhou. Verifique o erro antes de reiniciar.
   - \`SEM_PROBLEMAS\` → O loop concluiu. Todos os problemas foram resolvidos.
3. Se \`EM_ANDAMENTO\`, basta rodar \`bash scripts/infinite-improvement-loop.sh\`

---

*Atualizado em ${data} ${hora} | Hash: ${hash}*
CHKEOF

    echo "$hash"
}

# ─── Rodar auto-review e contar resultados ─────────────────
# Retorna: falhas|alertas|correcoes|passaram
rodar_auto_review() {
    if [ "$DRY_RUN" = true ]; then
        echo "0|0|0|0"
        return 0
    fi

    if [ ! -f "$AUTO_REVIEW" ]; then
        warn "auto-review.sh não encontrado em $AUTO_REVIEW"
        echo "0|0|0|0"
        return 1
    fi

    local output
    output=$(bash "$AUTO_REVIEW" 2>&1 || true)

    local pass fail warns fixes
    pass=$(echo "$output" | grep -oP 'Passaram:\s*\K\d+' || echo "0")
    fail=$(echo "$output" | grep -oP 'Falharam:\s*\K\d+' || echo "0")
    warns=$(echo "$output" | grep -oP 'Alertas:\s*\K\d+' || echo "0")
    fixes=$(echo "$output" | grep -oP 'Correções:\s*\K\d+' || echo "0")

    echo "$fail|$warns|$fixes|$pass"
}

# ─── Correções automáticas ────────────────────────────────
# Tenta corrigir problemas comuns sem intervenção manual
corrigir_automaticamente() {
    local fixes=0

    # Dry-run: não modificar nada
    [ "$DRY_RUN" = true ] && { echo "0|0"; return 0; }

    # 1. Permissões de execução em scripts .sh
    local sem_perm
    sem_perm=$(find "$BRIDGE_DIR/scripts" -name "*.sh" ! -executable 2>/dev/null | wc -l)
    if [ "$sem_perm" -gt 0 ]; then
        find "$BRIDGE_DIR/scripts" -name "*.sh" ! -executable -exec chmod +x {} \; 2>/dev/null
        warn "Permissões de execução corrigidas em $sem_perm script(s)"
        fixes=$((fixes + sem_perm))
    fi

    # 2. Sintaxe bash (apenas verificar, não corrigir automaticamente)
    local erros_sintaxe=0
    local f
    for f in "$BRIDGE_DIR/scripts/"*.sh; do
        if [ -f "$f" ] && ! bash -n "$f" 2>/dev/null; then
            fail "Erro de sintaxe em $(basename "$f") — requer correção manual"
            erros_sintaxe=$((erros_sintaxe + 1))
        fi
    done

    # 3. Garantir que diretórios de log existem
    mkdir -p "$BRIDGE_DIR/logs" 2>/dev/null

    # 4. Garantir que LOOP_STATUS.md existe
    if [ ! -f "$LOOP_STATUS" ]; then
        salvar_checkpoint "0" "AGUARDANDO_INICIO" "0" "0" "0" "0" "0" 2>/dev/null || true
        ok "LOOP_STATUS.md criado automaticamente"
    fi

    echo "$fixes|$erros_sintaxe"
}

# ─── Extrair descrição dos problemas ──────────────────────
extrair_problemas() {
    local fail="$1" warns="$2"
    local problemas=""
    [ "$fail" -gt 0 ] && problemas="${problemas}${fail} falhas no auto-review. "
    [ "$warns" -gt 0 ] && problemas="${problemas}${warns} alertas de qualidade. "
    [ -z "$problemas" ] && problemas="Nenhum problema encontrado."
    echo "$problemas"
}

# ═══════════════════════════════════════════════════════════════
# CABEÇALHO
# ═══════════════════════════════════════════════════════════════

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🔄  INFINITE IMPROVEMENT LOOP                               ║${NC}"
echo -e "${BLUE}║  Melhoria contínua com checkpoint persistente                ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════
# LER CHECKPOINT (crash recovery)
# ═══════════════════════════════════════════════════════════════

IFS='|' read -r ITER_ATUAL STATUS_ATUAL ENCONTRADOS_ACUM CORRIGIDOS_ACUM RESTANTES_ACUM <<< "$(ler_checkpoint)"

log "Checkpoint atual: Iteração $ITER_ATUAL | Status: $STATUS_ATUAL"

if [ "$STATUS_ATUAL" = "SEM_PROBLEMAS" ] || [ "$STATUS_ATUAL" = "CONCLUIDO" ]; then
    header "🎉 LOOP JÁ ESTÁ CONCLUÍDO"
    echo ""
    echo -e "${GREEN}   O loop já concluiu todas as iterações anteriores sem problemas.${NC}"
    echo ""
    echo -e "   Para reiniciar do zero: ${YELLOW}bash $0 --reset${NC}"
    echo ""
    exit 0
fi

if [ "$STATUS_ATUAL" = "EM_ANDAMENTO" ]; then
    warn "Crash recovery detectado! Iteração $ITER_ATUAL estava em andamento."
    warn "Continuando de onde parou..."
    echo ""
fi

# ═══════════════════════════════════════════════════════════════
# LOOP PRINCIPAL
# ═══════════════════════════════════════════════════════════════

CONSECUTIVE_CLEAN=0
ITER=$ITER_ATUAL

while [ "$ITER" -lt "$MAX_ITER" ] && [ "$CONSECUTIVE_CLEAN" -lt "$MAX_CONSECUTIVE_CLEAN" ]; do
    ITER=$((ITER + 1))

    header "🔁 ITERAÇÃO $ITER"
    echo ""

    # ─── Marcar como EM_ANDAMENTO ────────────────────────
    # (ainda sem valores da iteração atual)
    salvar_checkpoint "$ITER" "EM_ANDAMENTO" "$ENCONTRADOS_ACUM" "$CORRIGIDOS_ACUM" "$RESTANTES_ACUM" "0" "0"
    log "Checkpoint salvo. Iteração $ITER em andamento."
    echo ""

    # ─── Sincronizar ECC primeiro ─────────────────────────
    if [ -f "$SYNC_ECC" ] && [ "$DRY_RUN" = false ]; then
        log "Sincronizando com ECC..."
        bash "$SYNC_ECC" 2>&1 | tail -3 || true
    fi
    echo ""

    # ─── PASSO A: Correções automáticas ───────────────────
    log "Executando correções automáticas..."
    IFS='|' read -r AUTO_FIXES ERROS_SINTAXE <<< "$(corrigir_automaticamente)"
    if [ "$AUTO_FIXES" -gt 0 ]; then
        ok "Correções automáticas aplicadas: $AUTO_FIXES"
    fi
    if [ "$ERROS_SINTAXE" -gt 0 ]; then
        fail "Erros de sintaxe requerem correção manual: $ERROS_SINTAXE"
    fi
    echo ""

    # ─── PASSO B: Rodar auto-review ──────────────────────
    log "Rodando auto-review..."
    echo ""
    IFS='|' read -r FAILS WARNS FIXES PASSES <<< "$(rodar_auto_review)"

    if [ "$FAILS" -gt 0 ]; then
        fail "Auto-review: $FAILS falhas, $WARNS alertas"
    elif [ "$WARNS" -gt 0 ]; then
        warn "Auto-review: 0 falhas, $WARNS alertas"
    else
        ok "Auto-review: 0 falhas, 0 alertas (limpo!)"
    fi

    # ─── Calcular contadores da iteração ATUAL ────────────
    # Problemas encontrados nesta iteração = falhas + alertas
    PROBLEMAS_ITER=$((FAILS + WARNS))
    # Correções nesta iteração = correções automáticas + fixes do auto-review
    CORRECOES_ITER=$((AUTO_FIXES + FIXES))

    # ─── Acumular totais ─────────────────────────────────
    ENCONTRADOS_ACUM=$((ENCONTRADOS_ACUM + PROBLEMAS_ITER))
    CORRIGIDOS_ACUM=$((CORRIGIDOS_ACUM + CORRECOES_ITER))
    RESTANTES_ACUM=$((PROBLEMAS_ITER - CORRECOES_ITER))
    [ "$RESTANTES_ACUM" -lt 0 ] && RESTANTES_ACUM=0

    # ─── Avaliar resultado ────────────────────────────────
    if [ "$FAILS" -eq 0 ] && [ "$WARNS" -eq 0 ] && [ "$ERROS_SINTAXE" -eq 0 ]; then
        CONSECUTIVE_CLEAN=$((CONSECUTIVE_CLEAN + 1))
        ok "Iteração limpa! ($CONSECUTIVE_CLEAN/$MAX_CONSECUTIVE_CLEAN consecutivas)"
    else
        CONSECUTIVE_CLEAN=0
        PROBLEMAS_DESC=$(extrair_problemas "$FAILS" "$WARNS")
        warn "Problemas encontrados: $PROBLEMAS_DESC"
    fi

    echo ""

    # ─── Salvar checkpoint da iteração ────────────────────
    local status_iter
    if [ "$FAILS" -eq 0 ] && [ "$WARNS" -eq 0 ] && [ "$ERROS_SINTAXE" -eq 0 ] && [ "$CONSECUTIVE_CLEAN" -ge "$MAX_CONSECUTIVE_CLEAN" ]; then
        status_iter="SEM_PROBLEMAS"
    elif [ "$FAILS" -gt 5 ]; then
        status_iter="PARADO_POR_ERRO"
    else
        status_iter="EM_ANDAMENTO"
    fi

    # Salvar com contadores corretos da iteração atual
    salvar_checkpoint "$ITER" "$status_iter" "$ENCONTRADOS_ACUM" "$CORRIGIDOS_ACUM" "$RESTANTES_ACUM" "$PROBLEMAS_ITER" "$CORRECOES_ITER"
    log "Checkpoint salvo: Iteração $ITER → $status_iter"
    log "  Encontrados (acum): $ENCONTRADOS_ACUM | Corrigidos (acum): $CORRIGIDOS_ACUM | Restantes: $RESTANTES_ACUM"

    # ─── Pausa entre iterações ────────────────────────────
    if [ "$CONSECUTIVE_CLEAN" -lt "$MAX_CONSECUTIVE_CLEAN" ] && [ "$status_iter" != "PARADO_POR_ERRO" ]; then
        log "Aguardando 2 segundos antes da próxima iteração..."
        sleep 2
    fi

    echo ""
done

# ═══════════════════════════════════════════════════════════════
# RESUMO FINAL
# ═══════════════════════════════════════════════════════════════

header "🏁 FIM DO LOOP"

echo ""
if [ "$CONSECUTIVE_CLEAN" -ge "$MAX_CONSECUTIVE_CLEAN" ]; then
    echo -e "${GREEN}   🎉 Loop concluído: ${MAX_CONSECUTIVE_CLEAN} iterações limpas consecutivas!${NC}"
    echo ""
    echo -e "   Todos os problemas encontrados foram resolvidos."
    salvar_checkpoint "$ITER" "SEM_PROBLEMAS" "$ENCONTRADOS_ACUM" "$CORRIGIDOS_ACUM" "0" "0" "0"

elif [ "$ITER" -ge "$MAX_ITER" ]; then
    echo -e "${YELLOW}   ⏸️  Loop pausado: atingiu limite de $MAX_ITER iterações.${NC}"
    echo ""
    echo -e "   Use ${CYAN}--max-iter=N${NC} para aumentar o limite."
    salvar_checkpoint "$ITER" "PARADO_POR_ERRO" "$ENCONTRADOS_ACUM" "$CORRIGIDOS_ACUM" "$RESTANTES_ACUM" "0" "0"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "   📊 Resumo final:"
echo -e "   🔄 Iterações: ${ITER}"
echo -e "   🐛 Problemas encontrados: ${ENCONTRADOS_ACUM}"
echo -e "   ✅ Problemas corrigidos: ${CORRIGIDOS_ACUM}"
echo -e "   ❌ Restantes: ${RESTANTES_ACUM}"
echo ""
echo -e "   📄 Checkpoint: ${LOOP_STATUS}"
echo -e "   🔍 Status: $(grep -m1 'Status' "$LOOP_STATUS" 2>/dev/null | grep -oP '`\K[^`]+' || echo 'N/A')"
echo ""

if [ "$RESTANTES_ACUM" -gt 0 ]; then
    echo -e "   ${YELLOW}💡 Ainda há ${RESTANTES_ACUM} problemas não resolvidos.${NC}"
    echo -e "   ${YELLOW}   Rode o auto-review manualmente para detalhes.${NC}"
    echo ""
fi
