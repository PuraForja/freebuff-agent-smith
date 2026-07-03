# 🧠 Skill: network-config-validation

> **Adaptada do ECC:** `network-config-validation` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/network-config-validation/SKILL.md`

## Descrição

Pre-deployment checks for router and switch configuration, including dangerous commands, duplicate addresses, subnet overlaps, stale references, management-plane risk, and IOS-style security hygiene.

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

# Network Config Validation

Use this skill to review network configuration before a change window or before
an automation run touches production devices.

## When to Use

- Reviewing Cisco IOS or IOS-XE style snippets before deployment.
- Auditing generated config from scripts or templates.
- Looking for dangerous commands, duplicate IP addresses, or subnet overlaps.
- Checking whether ACLs, route-maps, prefix-lists, or line policies are referenced
  but not defined.
- Building lightweight pre-flight scripts for network automation.

## How It Works

Treat config validation as layered evidence, not as a complete parser. Regex
checks are useful for pre-flight warnings, but final approval still needs a
network engineer to review intent, platform syntax, and rollback steps.

Validate in this order:

1. Destructive commands.
2. Credential and management-plane exposure.
3. Duplicate addresses and overlapping subnets.
4. Stale references to ACLs, route-maps, prefix-lists, and interfaces.
5. Operational hygiene such as NTP, timestamps, remote logging, and banners.

## Dangerous Command Detection

```python
import re

DANGEROUS_PATTERNS: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"reload", re.I), "reload causes downtime"),
    (re.compile(r"erase\s+(startup|nvram|flash)", re.I), "erases persistent storage"),
    (re.compile(r"format", re.I), "formats a device filesystem"),
    (re.compile(r"no\s+router\s+(bgp|ospf|eigrp)", re.I), "removes a routing process"),
    (re.compile(r"no\s+interface\s+\S+", re.I), "removes interface configuration"),
    (re.compile(r"aaa\s+new-model", re.I), "changes authentication behavior"),
    (re.compile(r"crypto\s+key\s+(zeroize|generate)", re.I), "changes device SSH keys"),
]

def find_dangerous_commands(lines: list[str]) -> list[dict[str, str | int]]:
    findings = []
    for line_number, line in enumerate(lines, start=1):
        stripped = line.strip()
        for pattern, reason in DANGEROUS_PATTERNS:
            if pattern.search(stripped):
                findings.append({
                    "line": line_number,
                    "command": stripped,
                    "reason": reason,
                })
    return findings
```

## Duplicate IPs And Subnet Overlaps

```python
import ipaddress
import re
from collections import Counter

IP_ADDRESS_RE = re.compile(
    r"^\s*ip address\s+"
    r"(?P<ip>\d{1,3}(?:\.\d{1,3}){3})\s+"
    r"(?P<mask>\d{1,3}(?:\.\d{1,3}){3})",
    re.I | re.M,
)

def extract_interfaces(config: str) -> list[dict[str, str]]:
    results = []
    current = None
    for line in config.splitlines():
        if line.startswith("interface "):
            current = line.split(maxsplit=1)[1]
            continue
        match = IP_ADDRESS_RE.match(line)
        if current and match:
            ip = match.group("ip")
            mask = match.group("mask")
            network = ipaddress.ip_interface(f"{ip}/{mask}").network
            results.append({"interface": curre

---

**ECC Original:** `ECC/skills/network-config-validation/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:28
