# 🧠 Skill: verification-loop

> **Adaptada do ECC:** `verification-loop` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/verification-loop/`

## Descrição

Loop de verificação que implementa quality gates em pipelines de dados.
Complementa o `quality-gate` com verificações contínuas durante o desenvolvimento.

## Quando usar

- Durante o desenvolvimento de scripts de download
- Após modificar arquivos de dados existentes
- Antes de considerar uma tarefa como "pronta para revisão"

## Tipos de Verificação

### 1. Verificação de Checkpoint

```python
def ja_baixado(caminho, tamanho_minimo=1024):
    """Verifica se arquivo já foi baixado (checkpoint)."""
    return caminho.exists() and caminho.stat().st_size >= tamanho_minimo
```

### 2. Verificação de Integridade

```python
def validar_csv(caminho):
    """Valida se CSV está bem formado."""
    import csv
    with open(caminho, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        cabecalho = next(reader)
        linhas = 0
        for linha in reader:
            if len(linha) != len(cabecalho):
                return False, f"Linha {linhas+2}: {len(linha)} colunas (esperado {len(cabecalho)})"
            linhas += 1
    return True, f"OK: {cabecalho[0]}... ({linhas} linhas)"
```

### 3. Verificação de Encoding

```python
def verificar_encoding(caminho):
    """Detecta e reporta encoding do arquivo."""
    with open(caminho, 'rb') as f:
        raw = f.read(10000)
    import chardet
    resultado = chardet.detect(raw)
    return resultado['encoding']
```

### 4. Verificação de Metadados

```python
def verificar_metadados(diretorio):
    """Verifica se metadados obrigatórios existem."""
    obrigatorios = ['fonte.txt', '_metadata.json']
    presentes = [f for f in obrigatorios if (diretorio / f).exists()]
    ausentes = [f for f in obrigatorios if not (diretorio / f).exists()]
    return presentes, ausentes
```

## Pipeline de Verificação

```
1. Antes da execução:
   - Verificar checkpoint (já foi baixado?)
   
2. Durante a execução:
   - Logging contínuo do progresso
   - Tratamento de erros HTTP/FTP
   
3. Após a execução:
   - Validar integridade do arquivo baixado
   - Verificar encoding (deve ser UTF-8)
   - Confirmar metadados salvos
```

## Referência

- **ECC Original:** `verification-loop` — implementa quality gates como hooks
  do Claude Code para verificar build/type/lint/test antes de permitir avançar.

---

*Atualizado em: 2026-07-01*
