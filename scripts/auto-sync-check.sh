#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
#  auto-sync-check.sh — Verificador leve de sincronização ECC
# ═══════════════════════════════════════════════════════════════
#  Chamado pelo .bashrc. Verifica se ECC precisa sincronizar.
#  Se tiver NOVIDADES, mostra um resumo pra você!
# ═══════════════════════════════════════════════════════════════

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BRIDGE_DIR="$(dirname "$SCRIPT_DIR")"
WORKSPACE_DIR="$(dirname "$BRIDGE_DIR")"
ECC_DIR="$WORKSPACE_DIR/ECC"
TIMESTAMP_FILE="$BRIDGE_DIR/logs/.ultima_sincronizacao"
LAST_HASH_FILE="$BRIDGE_DIR/logs/.ultimo_hash_ecc"

# ═══ Só roda se estiver no workspace ═══
case "$PWD" in */freebuff-workspace*) ;; *) exit 0 ;; esac

# ═══ Verifica se já sincronizou hoje ═══
if [ -f "$TIMESTAMP_FILE" ]; then
    [ "$(cat "$TIMESTAMP_FILE")" = "$(date +%Y%m%d)" ] && exit 0
fi

# ═══ Verifica se ECC existe ═══
[ ! -d "$ECC_DIR/.git" ] && exit 0

# ═══ Primeiro, verifica se TEM novidade (rápido, sem rodar sync completo) ═══
cd "$ECC_DIR"
timeout 3 git fetch --quiet origin 2>/dev/null || true
LOCAL=$(git rev-parse HEAD 2>/dev/null || echo "")
REMOTE=$(git rev-parse @{upstream} 2>/dev/null || echo "")

if [ "$LOCAL" = "$REMOTE" ] && [ -f "$TIMESTAMP_FILE" ]; then
    # Já está atualizado, só marca o timestamp e sai
    echo "$(date +%Y%m%d)" > "$TIMESTAMP_FILE"
    exit 0
fi
cd "$WORKSPACE_DIR"

# ═══ Tem novidade! Roda sync e mostra resultado ═══
echo ""
echo -e "  \033[0;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\033[0m"
echo -e "  \033[0;34m🔄 Freebuff Agente Smit:\033[0m Novidades detectadas! Sincronizando..."
echo -e "  \033[0;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\033[0m"
echo ""

# Roda o sync e CAPTURA a saída
if [ -f "$SCRIPT_DIR/sync-ecc.sh" ]; then
    bash "$SCRIPT_DIR/sync-ecc.sh" 2>&1
else
    echo -e "  \033[0;31m❌ Script sync-ecc.sh não encontrado em $SCRIPT_DIR\033[0m"
fi

echo ""
echo -e "  \033[0;32m✅ Sincronização automática concluída!\033[0m"
echo ""
