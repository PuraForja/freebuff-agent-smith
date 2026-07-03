# 🧠 Skill: continuous-learning

> **Adaptada do ECC:** `continuous-learning-v2` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/continuous-learning-v2/`

## Descrição

Sistema de aprendizado que observa sessões de trabalho e extrai padrões
reutilizáveis como "instintos" — pequenos comportamentos aprendidos com
pontuação de confiança. Com o tempo, instintos podem evoluir para skills
completas.

## Como funciona no Freebuff

No ECC original, o continuous learning usa hooks do Claude Code para capturar
toda interação. No Codebuff, adaptamos para um modelo mais simples baseado em
**registro de decisões**:

```
Sessão de trabalho
      │
      ▼
┌─────────────────────┐
│ Registro de Decisões │ ← Você documenta aprendizados
│ (decisions/log.md)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Extração de Padrões  │ ← IA identifica padrões recorrentes
│ → skills reutilizáveis│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Evolução             │ ← Padrão vira skill ou instrução
│ → .agents/skills/   │
└─────────────────────┘
```

## Registro de Decisões

Mantenha um arquivo `decisions/log.md` no projeto:

```markdown
# Decisões Técnicas — Freebuff

## 2026-07-01: Usar Base dos Dados como fonte principal
- **Contexto:** SNIS não tem download direto
- **Decisão:** Usar bucket público GCS do Base dos Dados
- **Alternativas:** FTP manual, scraping
- **Status:** ✅ Implementado
```

## Quando um padrão vira skill

Um padrão se torna skill quando:
1. Aparece 3+ vezes em contextos diferentes
2. Pode ser descrito como instrução reutilizável
3. Não é específico demais de um projeto

## Promovendo para skill Codebuff

```markdown
# skills/meu-padrao.md
## Descrição
...
## Instruções
...
```

Coloque em `.agents/skills/` do projeto para ficar disponível via `skill`.

## Referência

- **ECC Original:** `continuous-learning-v2` — usa hooks PreToolUse/PostToolUse
  para capturar 100% das interações, cria instintos atômicos com score de confiança.
- **ECC v2.1:** Adiciona escopo por projeto para evitar contaminação entre projetos.

---

*Atualizado em: 2026-07-01*
