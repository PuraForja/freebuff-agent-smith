# 🧠 Skill: homelab-pihole-dns

> **Adaptada do ECC:** `homelab-pihole-dns` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/homelab-pihole-dns/SKILL.md`

## Descrição

Pi-hole installation, blocklist management, DNS-over-HTTPS setup, DHCP integration, local DNS records, and troubleshooting broken DNS resolution on a home network.

---

## ⚠️ Adaptação para Codebuff



| Conceito ECC (Claude) | Equivalente Codebuff |
|-----------------------|---------------------|
| Hooks | Instruções no `.codebuff/instructions.md` |
| Comandos slash | Skills via `skill` tool |
| `settings.json` | `.codebuff/instructions.md` |
| Rules em `~/.claude/rules/` | Skills em `.agents/skills/` |

---

## Conteúdo Adaptado

# Homelab Pi-hole DNS

Pi-hole is a network-wide DNS ad blocker that runs on a Raspberry Pi or any Linux host.
Every device on your network gets ad and malware domain blocking automatically — no browser
extension needed.

## When to Use

- Installing Pi-hole on a Raspberry Pi or Linux host
- Configuring Pi-hole as the DNS server for a home network
- Adding or managing blocklists
- Setting up DNS-over-HTTPS (DoH) upstream resolvers
- Creating local DNS records (e.g. `nas.home.lan`, `pi.home.lan`)
- Troubleshooting devices that lose internet access after Pi-hole is installed
- Running Pi-hole alongside or instead of DHCP

## How Pi-hole Works

```
Normal flow (without Pi-hole):
  Device → requests ads.tracker.com → ISP DNS → real IP → ads load

With Pi-hole:
  Device → requests ads.tracker.com → Pi-hole DNS → blocked (returns 0.0.0.0) → no ad

All DNS queries go through Pi-hole first.
Pi-hole checks against blocklists.
Blocked domains return a null response — the ad/tracker never loads.
Allowed domains get forwarded to your upstream resolver (Cloudflare, Google, etc.).
```

## Installation

### Docker (Recommended)

Docker is the easiest way to install Pi-hole and makes updates and backups
straightforward.

```yaml
# docker-compose.yml
services:
  pihole:
    image: pihole/pihole:<pinned-release-tag>
    container_name: pihole
    ports:
      - "53:53/tcp"
      - "53:53/udp"
      - "80:80/tcp"          # Web admin
    environment:
      TZ: "America/New_York"
      WEBPASSWORD: "${PIHOLE_WEBPASSWORD}"   # set via .env file or secret
      PIHOLE_DNS_: "1.1.1.1;1.0.0.1"
      DNSMASQ_LISTENING: "all"
    volumes:
      - "./etc-pihole:/etc/pihole"
      - "./etc-dnsmasq.d:/etc/dnsmasq.d"
    restart: unless-stopped
    cap_add:
      - NET_ADMIN              # only needed if Pi-hole will serve DHCP
```

Replace `<pinned-release-tag>` with a current Pi-hole release tag before deploying.
Avoid `latest` for long-lived DNS infrastructure so upgrades are deliberate and
reviewable.

Set `PIHOLE_WEBPASSWORD` in a `.env` file next to `docker-compose.yml`, chmod it to
`600`, and keep it out of git — do not put the password directly in the compose file.

Access web admin at: `http://<pi-ip>/admin`

### Bare-Metal Install (Raspberry Pi OS / Debian / Ubuntu)

Pi-hole requires a static IP before installing.

```bash
# Step 1: Assign a static IP (edit /etc/dhcpcd.conf on Pi OS)
sudo nano /etc/dhcpcd.conf
# Add at the bottom:
interface eth0
static ip_address=192.168.3.2/24
static routers=192.168.3.1
static domain_name_servers=192.168.3.1

# Step 2: Download and inspect the installer before running it.
# Prefer the package or installer path documented by Pi-hole for your OS/version.
curl -sSL https://install.pi-hole.net -o pi-hole-install.sh
less pi-hole-install.sh   # review before proceeding

# Step 3: Run
bash pi-hole-install.sh

# Follow the interactive installer:
# 1. Select network interface (eth0 for wired — recommended)
# 2. Select upstream DNS (Cloudfla

---

**ECC Original:** `ECC/skills/homelab-pihole-dns/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:24
