# 🧠 Skill: frontend-a11y

> **Adaptada do ECC:** `frontend-a11y` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/frontend-a11y/SKILL.md`

## Descrição

>

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

# Frontend Accessibility Patterns

Practical accessibility patterns for React and Next.js. Covers the issues most commonly flagged in code review: missing form labels, incorrect ARIA usage, non-semantic interactive elements, and broken keyboard navigation.

## When to Activate

- Building or reviewing form components (`<input>`, `<select>`, `<textarea>`)
- Creating interactive elements (modals, dropdowns, tooltips, tabs)
- Using `<div>` or `<span>` with `onClick`
- Adding `aria-*` attributes to any element
- Implementing keyboard navigation or focus management
- Receiving accessibility feedback from code review tools (CodeRabbit, ESLint a11y)
- Building components that must support screen readers

## Form Accessibility

Missing `htmlFor` / `id` pairing and disconnected error messages are the most common issues flagged in code review.

### Label Connection

```tsx
// BAD: label has no connection to input — screen readers cannot associate them
<label>Email</label>
<input type="email" />

// GOOD: htmlFor matches input id
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

### Required Fields

```tsx
// BAD: visual-only asterisk conveys nothing to screen readers
<label htmlFor="email">Email *</label>
<input id="email" type="email" />

// GOOD: required enables native browser validation; aria-required signals it to screen readers
<label htmlFor="email">
  Email <span aria-hidden="true">*</span>
</label>
<input id="email" type="email" required aria-required="true" />
```

### Error Messages

```tsx
// BAD: error text exists visually but is not linked to the input
<input id="email" type="email" />
<span className="error">Invalid email address</span>

// GOOD: aria-describedby connects input to its error message
// aria-invalid signals the invalid state to screen readers
<input
  id="email"
  type="email"
  aria-describedby="email-error"
  aria-invalid={!!error}
/>
{error && (
  <span id="email-error" role="alert">
    {error}
  </span>
)}
```

### Complete Accessible Form

```tsx
interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="email">
          Email <span aria-hidden="true">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.targ

---

**ECC Original:** `ECC/skills/frontend-a11y/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:23
