# 🧠 Skill: quality-gate

> **Adaptada do ECC:** `delivery-gate` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/delivery-gate/`

## Descrição

Portão de qualidade mecânico que verifica automaticamente se os dados foram
coletados, validados e documentados corretamente antes de considerar uma
tarefa como concluída.

## Quando usar

- Após baixar dados de uma fonte oficial
- Antes de marcar um relatório municipal como "completo"
- Ao finalizar uma sessão de coleta de dados
- Sempre que houver alterações em arquivos CSV/JSON do projeto

## Checklist de Qualidade

### 1. Integridade dos Dados

- [ ] Arquivo baixado com tamanho mínimo > 1KB
- [ ] Encoding UTF-8 (converter de Latin-1 se necessário)
- [ ] Cabeçalho CSV presente e correto
- [ ] Número de linhas é compatível com o esperado

### 2. Documentação

- [ ] `fonte.txt` salvo com URL e data da coleta
- [ ] `_metadata.json` salvo com metadados completos
- [ ] Arquivo `.md` de resumo gerado (se aplicável)

### 3. Validação Cruzada

- [ ] Dados conferidos com fonte original (amostragem)
- [ ] Sem valores nulos indevidos
- [ ] Códigos IBGE válidos (7 dígitos para AM: 13xxxxx)

### 4. Proveniência

- [ ] URL de origem registrada
- [ ] Data de coleta registrada
- [ ] Período de referência dos dados registrado
- [ ] Formato original documentado

## Uso no Codebuff

Para ativar o quality gate, carregue esta skill e depois siga o checklist:

```
skill "quality-gate"
```

A skill será carregada e você poderá consultar o checklist durante a execução.

## Referência

- **ECC Original:** `delivery-gate` — usa hooks Stop para verificar qualidade
  mecanicamente antes de permitir que Claude termine a sessão.
- **Adaptação Codebuff:** No Codebuff, o quality gate é uma skill que você carrega
  quando necessário. Use o checklist manualmente ou peça para a IA verificar.

---

*Atualizado em: 2026-07-01*
