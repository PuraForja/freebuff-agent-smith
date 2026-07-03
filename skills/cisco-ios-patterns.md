# 🧠 Skill: cisco-ios-patterns

> **Adaptada do ECC:** `cisco-ios-patterns` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/cisco-ios-patterns/SKILL.md`

## Descrição

Cisco IOS and IOS-XE review patterns for show commands, config hierarchy, wildcard masks, ACL placement, interface hygiene, and safe change-window verification.

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

# Cisco IOS Patterns

Use this skill when reviewing Cisco IOS or IOS-XE snippets, building a
change-window checklist, or explaining how to collect evidence from a router or
switch without making the incident worse.

## When to Use

- Reviewing IOS or IOS-XE configuration before a planned change.
- Choosing read-only `show` commands for troubleshooting.
- Checking ACL wildcard masks and interface direction.
- Explaining global, interface, routing process, and line configuration modes.
- Verifying that a change landed in running config and was saved intentionally.

## Operating Rules

Treat IOS examples as patterns, not paste-ready production changes. Confirm the
platform, interface names, current config, rollback path, and out-of-band access
before making changes on a real device.

Prefer this workflow:

1. Capture current state with read-only commands.
2. Review the exact candidate config.
3. Confirm management access cannot be locked out.
4. Apply the smallest change in a maintenance window.
5. Re-read state, compare to the baseline, then save only after validation.

## Mode Reference

```text
Router> enable
Router# show running-config
Router# configure terminal
Router(config)# interface GigabitEthernet0/1
Router(config-if)# description UPLINK-TO-CORE
Router(config-if)# no shutdown
Router(config-if)# exit
Router(config)# end
Router# show running-config interface GigabitEthernet0/1
```

`running-config` is active memory. `startup-config` is what survives reload.
Do not save a change just because a command was accepted; validate behavior
first, then use `copy running-config startup-config` if the change is approved.

## Read-Only Collection

```text
show version
show inventory
show processes cpu sorted
show memory statistics
show logging
show running-config | section line vty
show running-config | section interface
show running-config | section router bgp
show ip interface brief
show interfaces
show interfaces status
show vlan brief
show mac address-table
show spanning-tree
show ip route
show ip protocols
show ip access-lists
show route-map
show ip prefix-list
```

Collect the specific section you need instead of dumping full config into a
ticket when the config may contain secrets, customer names, or private topology.

## Wildcard Masks

IOS ACL and many routing statements use wildcard masks, not subnet masks.

```text
Subnet mask       Wildcard mask
255.255.255.255   0.0.0.0
255.255.255.252   0.0.0.3
255.255.255.0     0.0.0.255
255.255.0.0       0.0.255.255
```

Review wildcard masks before deployment. A subnet mask accidentally used as a
wildcard can match far more traffic than intended.

```text
ip access-list extended WEB-IN
  10 permit tcp 192.0.2.0 0.0.0.255 any eq 443
  999 deny ip any any log
```

Every ACL has an implicit deny at the end. Add an explicit logged deny when the
operational goal includes observing misses, and confirm logging volume is safe.

## ACL Placement Review

Before applying an ACL to an interface, answer these questi

---

**ECC Original:** `ECC/skills/cisco-ios-patterns/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:20
