# 🧠 Skill: infinite-improvement-loop

> **Criada em:** 01/07/2026
> **Propósito:** Loop infinito de melhoria contínua com checkpoint persistente e crash recovery.
> **Inspirada no ECC:** loop-operator + continuous-agent-loop + verification-loop + auto-review

---

## Descrição

Skill que implementa um **loop infinito de melhoria contínua** para o projeto.
A cada iteração, o loop:

1. 🔍 **Verifica** o estado atual (auto-review + code-review)
2. 🐛 **Detecta** problemas no código, scripts, configurações
3. 🔧 **Corrige** os problemas encontrados
4. 💾 **Persiste** checkpoint em `logs/LOOP_STATUS.md`
5. 🔄 **Repete** até não encontrar mais problemas

### 🛡️ Crash Recovery

Se houver queda de energia ou interrupção, o loop **retoma de onde parou**
lendo o arquivo `logs/LOOP_STATUS.md`.

---

## 📋 Pré-requisitos

Antes de iniciar o loop, verifique:

- [ ] `scripts/infinite-improvement-loop.sh` existe e é executável
- [ ] `logs/LOOP_STATUS.md` existe (checkpoint)
- [ ] `scripts/auto-review.sh` existe e funciona
- [ ] Há conexão com internet (para code-reviewer)

---

## 🔄 Protocolo do Loop

### A cada iteração:

```
1. 📖 LER LOOP_STATUS.md → saber onde parou (crash recovery)
2. 🔍 RODAR auto-review → verification-loop + quality-gate
3. 📊 AVALIAR resultados:
   - Se 0 falhas E 0 alertas críticos → loop CONCLUÍDO 🎉
   - Se falhas/alertas → CONTINUAR para passo 4
4. 🎯 CORRIGIR problemas encontrados (um por um)
5. 💾 SALVAR checkpoint em LOOP_STATUS.md
6. 🔄 VOLTAR ao passo 1
```

### Condição de parada:

O loop para quando **todas** as condições forem verdadeiras:
- ✅ Auto-review passa com 0 falhas
- ✅ Code-reviewer aprova sem issues críticos
- ✅ Nenhum problema novo encontrado na iteração

---

## 📁 Arquivos Gerenciados

| Arquivo | Função | Atualizado por |
|---------|--------|:--------------:|
| `logs/LOOP_STATUS.md` | Checkpoint persistente (crash recovery) | Loop |
| `logs/auto-review-*.md` | Relatórios de cada iteração | auto-review.sh |
| `SESSAO.md` | Aprendizado contínuo | Usuário + Loop |

---

## 🚀 Como Usar no Codebuff

Para iniciar o loop infinito de melhoria:

```
skill "infinite-improvement-loop"
Inicie o loop de melhoria contínua. Verifique o LOOP_STATUS.md primeiro.
```

Para continuar após crash:

```
skill "infinite-improvement-loop"
Houve uma interrupção. Leia o LOOP_STATUS.md e continue de onde paramos.
```

Para parar o loop:

```
skill "infinite-improvement-loop"
Pare o loop e registre o status atual.
```

---

## 🖥️ Como Usar no Terminal

```bash
# Iniciar/continuar o loop
bash scripts/infinite-improvement-loop.sh

# Ver status atual
cat logs/LOOP_STATUS.md

# Forçar parada segura
pkill -f infinite-improvement-loop
```

---

## 🔗 Referências

- **Checkpoint:** `logs/LOOP_STATUS.md`
- **Script do loop:** `scripts/infinite-improvement-loop.sh`
- **Auto-review:** `scripts/auto-review.sh`
- **Skill manual:** `skills/auto-review.md`
- **Verification Loop:** `skills/verification-loop.md`
- **Loop Operator (ECC):** `ECC/agents/loop-operator.md`
- **Continuous Agent Loop (ECC):** `ECC/skills/continuous-agent-loop/SKILL.md`
- **Sessão:** `SESSAO.md`

---

## 🧠 Aprendizado Incorporado

### Lições do ECC (continuous-agent-loop)

1. **Sempre tenha condição de parada explícita** — Loop infinito sem stop condition queima tokens
2. **Checkpoint a cada iteração** — Crash recovery só funciona se o estado for persistente
3. **Escopo decrescente em falhas repetidas** — Se o mesmo problema persiste, reduza o escopo
4. **Um problema por vez** — Corrigir um problema de cada vez é mais eficaz que tentar resolver tudo junto

### Lições do ECC (loop-operator)

1. **Quality gates ativos** — Sem quality gates, o loop aceita soluções de baixa qualidade
2. **Caminho de rollback** — Cada correção deve poder ser desfeita
3. **Escalar quando falha repetida** — 2 checkpoints sem progresso → escalar

---

*Skill criada em 01/07/2026.*
*Use `skill "infinite-improvement-loop"` para carregar.*
