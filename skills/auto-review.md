# 🧠 Skill: auto-review

> **Criada em:** 01/07/2026
> **Propósito:** Automatizar o ciclo completo de auto-melhoria.
> **Inspirada no ECC:** verification-loop + delivery-gate + code-reviewer + continuous-learning

---

## Descrição

Skill de **auto-revisão** que orquestra todo o ciclo de qualidade em um único fluxo.
Ela combina:

1. 🔍 **verification-loop** — Verificações técnicas (sintaxe, integridade, encoding)
2. ✅ **quality-gate** — Checklist de qualidade (documentação, validação, proveniência)
3. 🎯 **@code-reviewer** — Revisão de código por IA
4. 📝 **continuous-learning** — Registro de aprendizado

---

## Quando usar

- **Sempre que criar ou modificar** scripts, skills, agentes ou configurações
- **Antes de encerrar uma sessão** — para garantir que tudo está íntegro
- **Após o sync-ecc.sh** — para validar as adaptações automáticas
- **Periodicamente** — como manutenção preventiva do projeto

---

## Fluxo Completo

### Passo 1: Verification Loop (técnico)

```bash
# Verificar sintaxe de todos os scripts bash
for f in scripts/*.sh; do
    bash -n "$f" && echo "✅ $f" || echo "❌ $f"
done

# Verificar encoding UTF-8
for f in skills/*.md agents/*.md CATALOGO.md SESSAO.md; do
    encoding=$(file -b --mime-encoding "$f" 2>/dev/null)
    echo "  $f → $encoding"
done

# Verificar permissões de execução
for f in scripts/*.sh; do
    [ -x "$f" ] || { chmod +x "$f"; echo "  ⚠️ Permissão corrigida: $f"; }
done
```

### Passo 2: Quality Gate (checklist)

- [ ] **Integridade:** Arquivos existem e têm tamanho > 1KB
- [ ] **Documentação:** README.md, SESSAO.md, .codebuff/instructions.md atualizados
- [ ] **Validação:** Skills no diretório batem com as listadas no CATALOGO.md
- [ ] **Proveniência:** Fonte ECC registrada, datas atualizadas

### Passo 3: Code Review (IA)

Invoque o agente de code review do Codebuff:

> @code-reviewer-deepseek-flash Revise as alterações feitas nesta sessão.
> Verifique: lógica, segurança, boas práticas, padrões do projeto.

> 💡 **Nota:** O Codebuff tem um agente nativo chamado `code-reviewer-deepseek-flash`.
> O arquivo adaptado em `agents/code-reviewer.md` é uma referência conceitual do ECC.

### Passo 4: Continuous Learning (registro)

- [ ] Adicionar ao SESSAO.md: o que foi aprendido, problemas encontrados, decisões tomadas
- [ ] Atualizar CATALOGO.md (rodar `scripts/gerar-catalogo.sh`)
- [ ] Atualizar HISTORICO_ATUALIZACOES.md (se houver novidades)

---

## Uso Rápido

No Codebuff, durante a conversa:

```
skill "auto-review"
```

Depois, peça para executar o ciclo completo:

```
Execute o auto-review completo nos scripts que criamos
```

Ou execute etapas específicas:

```
Execute apenas o passo 1 e 2 do auto-review
```

---

## Automação via Script

Para rodar o ciclo completo via terminal (sem Codebuff):

```bash
bash scripts/auto-review.sh
```

O script executa todos os checks e gera um relatório.

---

## Referências

- **Verification Loop:** `skills/verification-loop.md`
- **Quality Gate:** `skills/quality-gate.md`
- **Code Reviewer:** `agents/code-reviewer.md` ou `@code-reviewer`
- **Continuous Learning:** `skills/continuous-learning.md`
- **Sessão:** `SESSAO.md`
- **Catálogo:** `CATALOGO.md`
- **Histórico:** `logs/HISTORICO_ATUALIZACOES.md`

---

*Skill gerada em 01/07/2026. Use skill "auto-review" para carregar.*
