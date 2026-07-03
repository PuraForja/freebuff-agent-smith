# 🧠 Skill: windows-desktop-e2e

> **Adaptada do ECC:** `windows-desktop-e2e` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/windows-desktop-e2e/SKILL.md`

## Descrição

E2E testing for Windows native desktop apps (WPF, WinForms, Win32/MFC, Qt) using pywinauto and Windows UI Automation.

---

## ⚠️ Adaptação para Codebuff

> ⚠️ Esta skill original usava hooks do Claude Code. Adaptada para Codebuff.

| Conceito ECC (Claude) | Equivalente Codebuff |
|-----------------------|---------------------|
| Hooks | Instruções no `.codebuff/instructions.md` |
| Comandos slash | Skills via `skill` tool |
| `settings.json` | `.codebuff/instructions.md` |
| Rules em `~/.claude/rules/` | Skills em `.agents/skills/` |

---

## Conteúdo Adaptado

# Windows Desktop E2E Testing

End-to-end testing for Windows native desktop applications using **pywinauto** backed by Windows UI Automation (UIA). Covers WPF, WinForms, Win32/MFC, and Qt (5.x / 6.x) — with Qt-specific guidance as a dedicated section.

## When to Activate

- Writing or running E2E tests for a Windows native desktop application
- Setting up a desktop GUI test suite from scratch
- Diagnosing flaky or failing desktop automation tests
- Adding testability (AutomationId, accessible names) to an existing app
- Integrating desktop E2E into a CI/CD pipeline (GitHub Actions `windows-latest`)

### When NOT to Use

- Web applications → use `e2e-testing` skill (Playwright)
- Electron / CEF / WebView2 apps → the HTML layer needs browser automation, not UIA
- Mobile apps → use platform-specific tools (UIAutomator, XCUITest)
- Pure unit or integration tests that don't need a running GUI

## Core Concepts

All Windows desktop automation relies on **UI Automation (UIA)**, a Windows-built-in accessibility API. Every supported framework exposes a tree of UIA elements with properties Claude can read and act on:

```
Your test (Python)
    └── pywinauto (UIA backend)
        └── Windows UI Automation API   ← built into Windows, framework-agnostic
            └── App's UIA provider      ← each framework ships its own
                └── Running .exe
```

**UIA quality by framework:**

| Framework | AutomationId | Reliability | Notes |
|-----------|-------------|-------------|-------|
| WPF | 5/5 | Excellent | `x:Name` maps directly to AutomationId |
| WinForms | 4/5 | Good | `AccessibleName` = AutomationId |
| UWP / WinUI 3 | 5/5 | Excellent | Full Microsoft support |
| Qt 6.x | 5/5 | Excellent | Accessibility enabled by default; class names change to `Qt6*` |
| Qt 5.15+ | 4/5 | Good | Improved Accessibility module |
| Qt 5.7–5.14 | 3/5 | Fair | Needs `QT_ACCESSIBILITY=1`; objectName manual |
| Win32 / MFC | 3/5 | Fair | Control IDs accessible; text matching common |

## Setup & Prerequisites

```bash
# Python 3.8+, Windows only
pip install pywinauto pytest pytest-html Pillow pytest-timeout
# Optional: screen recording
# Install ffmpeg and add to PATH: https://ffmpeg.org/download.html
```

Verify UIA is reachable:

```python
from pywinauto import Desktop
Desktop(backend="uia").windows()  # lists all top-level windows
```

Install **Accessibility Insights for Windows** (free, from Microsoft) — your DevTools equivalent for inspecting the UIA element tree before writing any test.

## Testability Setup (by Framework)

The single most impactful thing you can do is **give every interactive control a stable AutomationId** before writing tests.

### WPF

```xml
<!-- XAML: x:Name becomes AutomationId automatically -->
<TextBox x:Name="usernameInput" />
<PasswordBox x:Name="passwordInput" />
<Button x:Name="btnLogin" Content="Login" />
<TextBlock x:Name="lblError" />
```

### WinForms

```csharp
// Set in designer or code
usernameInput.AccessibleName = "userna

---

**ECC Original:** `ECC/skills/windows-desktop-e2e/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:34
