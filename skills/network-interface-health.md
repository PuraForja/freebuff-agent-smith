# 🧠 Skill: network-interface-health

> **Adaptada do ECC:** `network-interface-health` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/network-interface-health/SKILL.md`

## Descrição

Diagnose interface errors, drops, CRCs, duplex mismatches, flapping, speed negotiation issues, and counter trends on routers, switches, and Linux hosts.

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

# Network Interface Health

Use this skill when a network symptom might be caused by a physical link, switch
port, cable, transceiver, duplex setting, or congested interface.

## When to Use

- A host or VLAN has packet loss, latency spikes, or intermittent reachability.
- A switch or router interface shows CRCs, runts, giants, drops, resets, or flaps.
- You need to compare both ends of a link before replacing hardware.
- A change window needs before/after interface counter evidence.
- Monitoring reports rising `ifInErrors`, `ifOutErrors`, or `ifOutDiscards`.

## How It Works

Interface counters are evidence, but the trend matters more than the absolute
number. Capture a baseline, wait a measurement interval, capture again, then
compare increments.

```text
show interfaces <interface>
show interfaces <interface> status
show logging | include <interface>|changed state|line protocol
```

On Linux hosts:

```text
ip -s link show <interface>
ethtool <interface>
ethtool -S <interface>
```

## Counter Reference

| Counter | Meaning | Common cause |
| --- | --- | --- |
| CRC | Received frame checksum failed | Bad cable, dirty fiber, bad optic, duplex mismatch |
| input errors | Aggregate receive-side errors | Check sub-counters before concluding |
| runts | Frames below minimum Ethernet size | Duplex mismatch, collision domain, faulty NIC |
| giants | Frames larger than expected MTU | MTU mismatch or jumbo-frame boundary |
| input drops | Device could not accept inbound packets | Burst, oversubscription, CPU path, queue pressure |
| output drops | Egress queue discarded packets | Congestion, QoS policy, undersized uplink |
| resets | Interface hardware reset | Flapping, keepalive, driver, optic, power |
| collisions | Ethernet collision counter | Half duplex or negotiation mismatch |

## Diagnosis Flow

### CRCs Or Input Errors

1. Confirm counters are incrementing, not just historical.
2. Check both ends of the link. Receive-side errors usually point to the signal
   arriving on that side, not necessarily the port reporting the error.
3. Replace patch cable or clean/replace fiber and optics.
4. Confirm speed/duplex settings match on both sides.
5. Check logs for flap events around the same timestamp.

### Drops

1. Separate input drops from output drops.
2. Compare interface rate against capacity.
3. Check QoS policy, queue counters, and whether the link is an oversubscribed
   uplink.
4. Treat queue tuning as secondary. First prove whether the link is congested.

### Duplex And Speed

Prefer auto-negotiation on modern Ethernet links when both sides support it. If
one side must be fixed, configure both sides explicitly and document why. Never
mix fixed speed/duplex on one side with auto on the other.

```text
show interfaces <interface> | include duplex|speed
```

## Safe Parser Example

Slice each interface block from one header to the next. Do not use an arbitrary
character window; large interface blocks can cause counters to be missed or
assigned to

---

**ECC Original:** `ECC/skills/network-interface-health/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:28
