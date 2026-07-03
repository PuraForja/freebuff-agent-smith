# 🧠 Skill: pytorch-patterns

> **Adaptada do ECC:** `pytorch-patterns` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/pytorch-patterns/SKILL.md`

## Descrição

PyTorch deep learning patterns and best practices for building robust, efficient, and reproducible training pipelines, model architectures, and data loading.

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

# PyTorch Development Patterns

Idiomatic PyTorch patterns and best practices for building robust, efficient, and reproducible deep learning applications.

## When to Activate

- Writing new PyTorch models or training scripts
- Reviewing deep learning code
- Debugging training loops or data pipelines
- Optimizing GPU memory usage or training speed
- Setting up reproducible experiments

## Core Principles

### 1. Device-Agnostic Code

Always write code that works on both CPU and GPU without hardcoding devices.

```python
# Good: Device-agnostic
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = MyModel().to(device)
data = data.to(device)

# Bad: Hardcoded device
model = MyModel().cuda()  # Crashes if no GPU
data = data.cuda()
```

### 2. Reproducibility First

Set all random seeds for reproducible results.

```python
# Good: Full reproducibility setup
def set_seed(seed: int = 42) -> None:
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    np.random.seed(seed)
    random.seed(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False

# Bad: No seed control
model = MyModel()  # Different weights every run
```

### 3. Explicit Shape Management

Always document and verify tensor shapes.

```python
# Good: Shape-annotated forward pass
def forward(self, x: torch.Tensor) -> torch.Tensor:
    # x: (batch_size, channels, height, width)
    x = self.conv1(x)    # -> (batch_size, 32, H, W)
    x = self.pool(x)     # -> (batch_size, 32, H//2, W//2)
    x = x.view(x.size(0), -1)  # -> (batch_size, 32*H//2*W//2)
    return self.fc(x)    # -> (batch_size, num_classes)

# Bad: No shape tracking
def forward(self, x):
    x = self.conv1(x)
    x = self.pool(x)
    x = x.view(x.size(0), -1)  # What size is this?
    return self.fc(x)           # Will this even work?
```

## Model Architecture Patterns

### Clean nn.Module Structure

```python
# Good: Well-organized module
class ImageClassifier(nn.Module):
    def __init__(self, num_classes: int, dropout: float = 0.5) -> None:
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2),
        )
        self.classifier = nn.Sequential(
            nn.Dropout(dropout),
            nn.Linear(64 * 16 * 16, num_classes),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.features(x)
        x = x.view(x.size(0), -1)
        return self.classifier(x)

# Bad: Everything in forward
class ImageClassifier(nn.Module):
    def __init__(self):
        super().__init__()

    def forward(self, x):
        x = F.conv2d(x, weight=self.make_weight())  # Creates weight each call!
        return x
```

### Proper Weight Initialization

```python
# Good: Explicit initialization
def _init_weights(self, module: nn.Module) -> None:
    if isinstance(module, nn.Linear):
 

---

**ECC Original:** `ECC/skills/pytorch-patterns/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:30
