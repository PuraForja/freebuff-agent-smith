# 🧠 Skill: deep-research

> **Adaptada do ECC:** `deep-research` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/deep-research/`

## Descrição

Pesquisa profunda e estruturada para coleta de informações sobre municípios.
Projetada especificamente para o projeto Relatorio-Municipios-AM.

## Quando usar

- Para preencher seções de relatórios municipais que ainda estão vazias
- Para encontrar dados de segurança pública (SSP-AM, FBSP)
- Para encontrar investigações e processos (TCE-AM, MP-AM, PF)
- Para história e formação dos municípios

## Método de Pesquisa

### Passo 1: Fontes Prioritárias (consultar antes)

Consulte SEMPRE estas fontes primeiro (nesta ordem):

1. **Dados do próprio projeto:**
   - `DADOS_MUNICIPIOS/01_MASTER_CONSOLIDADO_62_MUNICIPIOS.txt`
   - `DADOS_MUNICIPIOS/TCE_AM_contratos.csv`
   - `DADOS_MUNICIPIOS/ALERTAS_COLARINHO_BRANCO.txt`

2. **Dados_Municipios_BR (fonte externa):**
   - `/home/rolim/freebuff-workspace/Dados_Municipios_BR`
   - 7 fontes oficiais (SNIS, DataSUS, SICONFI, etc.)

### Passo 2: Pesquisa Web Estruturada

Para cada município, execute 4 pesquisas:

| Prompt | O que buscar |
|--------|--------------|
| `PROMPT_1_Dados_Oficiais.txt` | IBGE, PNUD, INEP, DataSUS, IPEA |
| `PROMPT_2_Gestao_Publica.txt` | TSE, TCE-AM, CGU, TCU, Transparência |
| `PROMPT_3_Seguranca_Investigacoes.txt` | SSP-AM, FBSP, MP-AM, PF, G1 |
| `PROMPT_4_Infraestrutura_Problemas.txt` | IBGE infra, ANEEL, ANATEL, DNIT |

### Passo 3: Hierarquia de Evidência

Classifique cada dado encontrado:

| Nível | Significado | Cor |
|-------|-------------|:---:|
| ALTA | Dado oficial (IBGE, TSE, INEP, DataSUS) | 🔵 |
| MÉDIA | Imprensa reconhecida (G1, Amazonas1) | 🟡 |
| BAIXA | Documentação limitada, sem confirmação | 🔴 |
| SEM DADO | Não encontrado em fontes públicas | 🔘 |

### Passo 4: Documentação

Para cada dado encontrado, registre:
- **Valor:** O dado em si
- **Fonte:** Nome da instituição
- **URL:** Link direto para verificação
- **Ano:** Ano de referência
- **Nível:** 🔵 ALTA / 🟡 MÉDIA / 🔴 BAIXA / 🔘 SEM DADO

## Regras Absolutas

1. ✅ Cada dado precisa de LINK DIRETO da fonte original
2. ✅ Cada dado precisa de ANO/DATA de referência
3. ❌ NUNCA inventar dados, estimativas ou aproximações
4. ❌ NUNCA tratar investigação como condenação
5. ❌ NUNCA modificar, encurtar ou substituir URLs
6. ✅ Se não encontrar: "DADO NÃO ENCONTRADO EM [FONTE]"

## Referência

- **ECC Original:** `deep-research` — skill de pesquisa profunda multi-etapas.
- **Projeto:** Relatorio-Municipios-AM — 62 municípios do Amazonas.

---

*Atualizado em: 2026-07-01*
