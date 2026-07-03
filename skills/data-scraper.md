# 🧠 Skill: data-scraper

> **Adaptada do ECC:** `data-scraper-agent` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/data-scraper-agent/`

## Descrição

Coleta automatizada de dados públicos brasileiros usando downloads diretos,
APIs REST, bucket GCS e FTP. Baseada nos padrões do projeto Dados_Municipios_BR.

## Quando usar

- Para baixar dados de novas fontes oficiais
- Para automatizar a coleta periódica de dados
- Para substituir downloads manuais por scripts

## Tipos de Fonte

### 1. Download Direto (CSV, XLSX, ZIP)

```
curl -sI "URL"                        # Testar URL primeiro
curl -sIL "URL"                       # Verificar redirects
# Formato: urllib.request.urlretrieve ou httpx
```

### 2. Base dos Dados (GCS Public Bucket)

```
URL padrão:
https://storage.googleapis.com/basedosdados-public/
  one-click-download/{dataset_id}/{tabela}/{tabela}.csv.gz

Exemplo (SIM mortalidade):
https://storage.googleapis.com/basedosdados-public/
  one-click-download/br_ms_sim/municipio/municipio.csv.gz
```

### 3. API REST Paginada

```python
def baixar_api(url_base, params, limite=100):
    """Baixa todos os registros de API paginada."""
    offset = 0
    todos = []
    while True:
        params.update({"offset": offset, "limit": limite})
        resp = httpx.get(url_base, params=params)
        dados = resp.json()
        if not dados:
            break
        todos.extend(dados)
        offset += limite
        time.sleep(1)  # rate limiting
    return todos
```

### 4. FTP (DataSUS)

```python
# DataSUS SIM (mortalidade) - AM
host = "ftp.datasus.gov.br"
caminho = "/dissemin/publicos/SIM/CID10/DADOS/"
```

## Estrutura do Script de Download

```
NN_FONTE/
├── download.py          # Script de download
├── data/
│   ├── dados.csv         # Dados baixados
│   ├── dados.md          # Resumo Markdown
│   ├── fonte.txt         # Documentação da fonte
│   └── _metadata.json    # Metadados estruturados
```

## Checklist de Implementação

- [ ] URL testada com curl -sI
- [ ] Checkpoint implementado (skip se existe)
- [ ] Logging com logger.info/error
- [ ] Tratamento de erros HTTP/FTP
- [ ] Validação de tamanho mínimo (1KB)
- [ ] Encoding convertido para UTF-8
- [ ] fonte.txt salvo
- [ ] _metadata.json salvo
- [ ] Resumo .md gerado

## Referência

- **ECC Original:** `data-scraper-agent` — skill para scraping de dados.
- **Projeto:** Dados_Municipios_BR — pipeline de dados públicos brasileiros.
- **Documentação:** `docs/PADROES_DOWNLOAD.md` (padrões do projeto).

---

*Atualizado em: 2026-07-01*
