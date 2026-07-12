# 🧠 freebuff-ecc-bridge — Instruções do Projeto

## 📋 Sobre este projeto

Este projeto fornece **agentes TypeScript** e **skills Markdown** derivados do [ECC](https://github.com/affaan-m/ECC) (224k+ ⭐) para uso com [Freebuff](https://freebuff.com).

### Estrutura atual

```
freebuff-ecc-bridge/
├── .agents/              ← 67 agentes TypeScript (spawnáveis com @)
├── skills/               ← 278 skills Markdown (usar read_files)
├── CATALOGO.md           ← Catálogo completo de recursos
├── scripts/
│   └── ecc-install.sh    ← Script de instalação/atualização
└── knowledge.md          ← Documentação do projeto
```

### Como instalar/atualizar agentes

```bash
bash scripts/ecc-install.sh          # Instalação inicial
bash scripts/ecc-install.sh --update # Atualizar apenas novos
bash scripts/ecc-install.sh --force  # Forçar reinstalação
```

### Como usar agentes

- **Agentes TypeScript:** Use com `@nome-do-agente` (ex: `@code-reviewer`)
- **Skills Markdown:** Use com `read_files skills/nome.md`
- **Catálogo:** Consulte `CATALOGO.md` para ver todos os recursos disponíveis

---

## ⚠️ Regras importantes

1. **Agentes são TypeScript** — Estão em `.agents/*.ts` e são spawnáveis com `@`
2. **Skills são Markdown** — Estão em `skills/*.md` e devem ser lidas com `read_files`
3. **Para atualizar:** Execute `bash scripts/ecc-install.sh --update`
4. **Não modifique manualmente** os arquivos em `.agents/` — eles são gerados pelo script
