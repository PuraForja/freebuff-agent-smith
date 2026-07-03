# 🧠 Skill: kubernetes-patterns

> **Adaptada do ECC:** `kubernetes-patterns` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/kubernetes-patterns/SKILL.md`

## Descrição

Kubernetes workload patterns, resource management, RBAC, probes, autoscaling, ConfigMap/Secret handling, and kubectl debugging for production-grade deployments.

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

# Kubernetes Patterns

Production-grade Kubernetes patterns for deploying, managing, and debugging workloads reliably.

## When to Activate

- Writing Kubernetes manifests (Deployments, Services, Ingress, Jobs)
- Configuring resource requests/limits, liveness/readiness probes
- Setting up RBAC, namespaces, or ServiceAccounts
- Managing configuration and secrets in K8s
- Debugging CrashLoopBackOff, OOMKilled, pending pods, or image pull errors
- Configuring HPA (Horizontal Pod Autoscaler) or PodDisruptionBudgets
- Reviewing K8s YAML for security or correctness

## When to Use

> Same as **When to Activate** above. This alias satisfies repo skill-format conventions. Use this skill any time you are writing, reviewing, or debugging Kubernetes YAML and workloads.

## How It Works

This skill provides **copy-pasteable, production-grade YAML patterns** and **kubectl debugging commands** organized by task:

1. **Deployment template** — A fully configured production `Deployment` with security context, rolling update strategy, all three probe types, resource limits, and environment injection from ConfigMap/Secret.
2. **Probes** — Decision table for startup vs liveness vs readiness, with correct `failureThreshold × periodSeconds` math.
3. **Services & Ingress** — ClusterIP, LoadBalancer, and TLS Ingress patterns with cert-manager annotations.
4. **ConfigMaps & Secrets** — `envFrom`, file-mount, and external secrets guidance.
5. **Resource management** — Requests vs limits rules of thumb by workload type (web API, JVM, worker, sidecar).
6. **RBAC** — Least-privilege ServiceAccount → Role → RoleBinding chain.
7. **HPA & PDB** — Autoscaling and node-drain safety configurations.
8. **Jobs & CronJobs** — One-off and scheduled workload patterns with correct `restartPolicy`.
9. **kubectl cheatsheet** — Logs, exec, rollback, port-forward, dry-run, and common error diagnosis commands.
10. **Anti-patterns & checklist** — What NOT to do, and a security/reliability/observability checklist.

## Examples

See the sections below for complete, runnable examples. Quick references:

| Task | Jump to |
|------|---------|
| Full production Deployment YAML | [Core Workload Patterns](#core-workload-patterns) |
| Probe configuration | [Probes](#probes--liveness-readiness-startup) |
| RBAC least-privilege setup | [RBAC](#rbac--roles-and-serviceaccounts) |
| Debug a CrashLoopBackOff | [kubectl Debugging Cheatsheet](#kubectl-debugging-cheatsheet) |
| Autoscaling | [HPA](#horizontal-pod-autoscaler-hpa) |

---

## Core Workload Patterns

### Deployment — Production Template

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  namespace: my-namespace
  labels:
    app: my-app
    version: "1.0.0"
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1          # Allow 1 extra pod during update
      maxUnavailable: 0    # Never reduce below desired count
  template:
    metadata:
   

---

**ECC Original:** `ECC/skills/kubernetes-patterns/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:26
