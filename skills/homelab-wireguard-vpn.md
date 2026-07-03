# 🧠 Skill: homelab-wireguard-vpn

> **Adaptada do ECC:** `homelab-wireguard-vpn` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/homelab-wireguard-vpn/SKILL.md`

## Descrição

WireGuard VPN server setup, peer configuration, key generation, split tunneling vs full tunnel routing, and remote access to a home network from mobile and laptop clients.

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

# Homelab WireGuard VPN

WireGuard is a fast, modern VPN protocol. It is the right choice for remote access to a
home network — simpler to configure than OpenVPN and faster than most alternatives.

All configuration examples show common setups. Review each command — especially the
iptables forwarding rules and key file permissions — before applying them to your
system, and make changes in a maintenance window.

## When to Use

- Setting up WireGuard server on a Raspberry Pi, Linux host, pfSense, or router
- Generating WireGuard keypairs and writing peer config files
- Configuring remote access from a phone or laptop to a home network
- Explaining split tunneling (route only home traffic) vs full tunnel (route all traffic)
- Troubleshooting WireGuard connections that will not come up
- Automating peer configuration generation for multiple clients

## How WireGuard Works

```
Your phone (WireGuard client)
    │
    │  Encrypted UDP tunnel (port 51820)
    │
Your home router (WireGuard server — needs a public IP or DDNS)
    │
    Your home network (192.168.1.0/24, NAS, Pi, etc.)

Every device has a keypair (public + private key).
The server knows each client's public key.
The client knows the server's public key + endpoint (IP:port).
Traffic is encrypted end-to-end with no central server or certificate authority.
```

## Server Setup (Linux)

```bash
# Install WireGuard
sudo apt update && sudo apt install wireguard -y

# Generate server keypair — create files with private permissions from the start
sudo mkdir -p /etc/wireguard
sudo sh -c 'umask 077; wg genkey > /etc/wireguard/server_private.key'
sudo sh -c 'wg pubkey < /etc/wireguard/server_private.key > /etc/wireguard/server_public.key'

# Write server config — substitute the actual private key value
# Do not store private keys in version control or share them
sudo tee /etc/wireguard/wg0.conf << 'EOF'
[Interface]
Address = 10.8.0.1/24              # VPN subnet — server gets .1
ListenPort = 51820
PrivateKey = <paste_server_private_key_here>

# Scoped forwarding rules: allow VPN traffic in/out, not a blanket FORWARD ACCEPT
PostUp   = iptables -A FORWARD -i wg0 -o eth0 -j ACCEPT
PostUp   = iptables -A FORWARD -i eth0 -o wg0 -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
PostUp   = iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -o eth0 -j ACCEPT
PostDown = iptables -D FORWARD -i eth0 -o wg0 -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
PostDown = iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

[Peer]
# Phone — replace with the actual phone public key
PublicKey = <phone_public_key>
AllowedIPs = 10.8.0.2/32

[Peer]
# Laptop — replace with the actual laptop public key
PublicKey = <laptop_public_key>
AllowedIPs = 10.8.0.3/32
EOF
sudo chmod 600 /etc/wireguard/wg0.conf

# Replace eth0 with your actual outbound interface name
# Check with: ip route show default

# Enable IP forwarding (required for routing traffic through the server)
echo "net.ip

---

**ECC Original:** `ECC/skills/homelab-wireguard-vpn/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:24
