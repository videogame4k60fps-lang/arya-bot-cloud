#!/bin/bash
set -e

# ============================================================
#  ARYA Hair Image — Deploy automatico su VPS
# ============================================================

REPO_URL="https://github.com/videogame4k60fps-lang/arya-bot-cloud.git"
BRANCH="claude/install-skill-caveman-VoIYc"
APP_DIR="/opt/arya-bot"
CONTAINER_NAME="arya-bot"
IMAGE_NAME="arya-bot"
PORT=3000

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log()  { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err()  { echo -e "${RED}[✗]${NC} $1"; exit 1; }
info() { echo -e "${BLUE}[→]${NC} $1"; }

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   ARYA Hair Image — Deploy automatico    ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# ── Controllo root ──────────────────────────────────────────
if [ "$EUID" -ne 0 ]; then
    err "Esegui lo script come root: sudo bash deploy.sh"
fi

# ── 1. Installa Docker ──────────────────────────────────────
if ! command -v docker &>/dev/null; then
    info "Installo Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    log "Docker installato"
else
    log "Docker già presente: $(docker --version)"
fi

# ── 2. Installa git se manca ────────────────────────────────
if ! command -v git &>/dev/null; then
    info "Installo git..."
    apt-get update -qq && apt-get install -y -qq git
fi

# ── 3. Clona o aggiorna il repo ─────────────────────────────
if [ -d "$APP_DIR/.git" ]; then
    info "Aggiorno il codice esistente..."
    git -C "$APP_DIR" fetch origin
    git -C "$APP_DIR" checkout "$BRANCH"
    git -C "$APP_DIR" pull origin "$BRANCH"
    log "Codice aggiornato"
else
    info "Clono il repository in $APP_DIR..."
    git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
    log "Repository clonato"
fi

cd "$APP_DIR"

# ── 4. Crea .env ────────────────────────────────────────────
if [ ! -f "$APP_DIR/.env" ]; then
    echo ""
    warn "File .env non trovato — inserisci la tua GROQ API Key."
    warn "La trovi su: https://console.groq.com/keys"
    echo ""
    read -rp "  GROQ_API_KEY: " GROQ_KEY
    if [ -z "$GROQ_KEY" ]; then
        err "GROQ_API_KEY non può essere vuota."
    fi
    cat > "$APP_DIR/.env" <<EOF
GROQ_API_KEY=${GROQ_KEY}
PORT=${PORT}
DB_PATH=/usr/src/app/data/database.sqlite
SESSION_PATH=/usr/src/app/session
EOF
    log ".env creato"
else
    log ".env già presente — non sovrascritto"
fi

# ── 5. Crea directory persistenti ──────────────────────────
mkdir -p "$APP_DIR/data"
mkdir -p "$APP_DIR/session"

# ── 6. Ferma container precedente se esiste ─────────────────
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    warn "Container precedente trovato — lo fermo e rimuovo..."
    docker stop "$CONTAINER_NAME" 2>/dev/null || true
    docker rm "$CONTAINER_NAME" 2>/dev/null || true
fi

# ── 7. Build immagine ───────────────────────────────────────
info "Build immagine Docker (può richiedere 2-4 minuti la prima volta)..."
docker build -t "$IMAGE_NAME" "$APP_DIR"
log "Immagine buildата"

# ── 8. Avvia container ──────────────────────────────────────
info "Avvio il container..."
docker run -d \
    --name "$CONTAINER_NAME" \
    --restart always \
    -p ${PORT}:${PORT} \
    --env-file "$APP_DIR/.env" \
    -v "$APP_DIR/data:/usr/src/app/data" \
    -v "$APP_DIR/session:/usr/src/app/session" \
    "$IMAGE_NAME"

log "Container avviato (restart automatico attivo)"

# ── 9. Apri firewall ────────────────────────────────────────
if command -v ufw &>/dev/null; then
    ufw allow "$PORT" > /dev/null 2>&1 || true
    log "Porta $PORT aperta nel firewall"
fi

# ── 10. Test connessione Groq ───────────────────────────────
info "Aspetto che il server si avvii..."
sleep 6

echo ""
info "Test connessione Groq API..."
GROQ_TEST=$(curl -s "http://localhost:${PORT}/api/test-groq" 2>/dev/null || echo '{"ok":false,"error":"server non raggiungibile"}')
if echo "$GROQ_TEST" | grep -q '"ok":true'; then
    log "Groq API funzionante: $(echo $GROQ_TEST | grep -o '"reply":"[^"]*"')"
else
    warn "Groq API non risponde: $GROQ_TEST"
    warn "Controlla la GROQ_API_KEY nel file $APP_DIR/.env"
fi

# ── 11. Mostra QR WhatsApp ──────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║   SCANSIONA IL QR CODE CON WHATSAPP                 ║"
echo "║   Apri WhatsApp → Dispositivi collegati → Collega   ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
warn "Premi Ctrl+C quando hai scansionato il QR. Il bot continuerà in background."
echo ""
docker logs -f "$CONTAINER_NAME"
