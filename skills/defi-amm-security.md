# 🧠 Skill: defi-amm-security

> **Adaptada do ECC:** `defi-amm-security` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/defi-amm-security/SKILL.md`

## Descrição

Security checklist for Solidity AMM contracts, liquidity pools, and swap flows. Covers reentrancy, CEI ordering, donation or inflation attacks, oracle manipulation, slippage, admin controls, and integer math.

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

# DeFi AMM Security

Critical vulnerability patterns and hardened implementations for Solidity AMM contracts, LP vaults, and swap functions.

## When to Use

- Writing or auditing a Solidity AMM or liquidity-pool contract
- Implementing swap, deposit, withdraw, mint, or burn flows that hold token balances
- Reviewing any contract that uses `token.balanceOf(address(this))` in share or reserve math
- Adding fee setters, pausers, oracle updates, or other admin functions to a DeFi protocol

## How It Works

Use this as a checklist-plus-pattern library. Review every user entrypoint against the categories below and prefer the hardened examples over hand-rolled variants.

## Execution Safety

The shell commands in this skill are local audit examples. Run them only in a trusted checkout or disposable sandbox, and do not splice untrusted contract names, paths, RPC URLs, private keys, or user-supplied flags into shell commands. Ask before installing tools or running long fuzzing/static-analysis jobs that may consume significant local or paid resources.

Never include secrets, private keys, seed phrases, API tokens, or mainnet signing credentials in command examples, logs, or reports.

## Examples

### Reentrancy: enforce CEI order

Vulnerable:

```solidity
function withdraw(uint256 amount) external {
    require(balances[msg.sender] >= amount);
    token.transfer(msg.sender, amount);
    balances[msg.sender] -= amount;
}
```

Safe:

```solidity
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

using SafeERC20 for IERC20;

function withdraw(uint256 amount) external nonReentrant {
    require(balances[msg.sender] >= amount, "Insufficient");
    balances[msg.sender] -= amount;
    token.safeTransfer(msg.sender, amount);
}
```

Do not write your own guard when a hardened library exists.

### Donation or inflation attacks

Using `token.balanceOf(address(this))` directly for share math lets attackers manipulate the denominator by sending tokens to the contract outside the intended path.

```solidity
// Vulnerable
function deposit(uint256 assets) external returns (uint256 shares) {
    shares = (assets * totalShares) / token.balanceOf(address(this));
}
```

```solidity
// Safe
uint256 private _totalAssets;

function deposit(uint256 assets) external nonReentrant returns (uint256 shares) {
    uint256 balBefore = token.balanceOf(address(this));
    token.safeTransferFrom(msg.sender, address(this), assets);
    uint256 received = token.balanceOf(address(this)) - balBefore;

    shares = totalShares == 0 ? received : (received * totalShares) / _totalAssets;
    _totalAssets += received;
    totalShares += shares;
}
```

Track internal accounting and measure actual tokens received.

### Oracle manipulation

Spot prices are flash-loan manipulable. Prefer TWAP.

```solidity
uint32[] memory secondsAgos = new uint32[](2);
secondsAgos[0] = 1800;
secondsAgos[

---

**ECC Original:** `ECC/skills/defi-amm-security/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:21
