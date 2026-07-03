# 📏 Regra: react — security

> **Adaptada do ECC:** \`rules/react/security.md\`
> **Fonte original:** \`ECC/rules/react/security.md\`

## Descrição

Regra ECC para react: security

---

## Conteúdo Adaptado

---
paths:
  - "**/*.tsx"
  - "**/*.jsx"
  - "**/components/**/*.ts"
  - "**/app/**/*.ts"
  - "**/pages/**/*.ts"
---
# React Security

> This file extends [typescript/security.md](../typescript/security.md) and [common/security.md](../common/security.md) with React specific content.

## XSS via `dangerouslySetInnerHTML`

CRITICAL. The prop name is deliberately scary — treat every usage as a code review halt.

```tsx
// CRITICAL: unsanitized user input
<div dangerouslySetInnerHTML={{ __html: userBio }} />

// CORRECT options:
// 1. Render as text
<div>{userBio}</div>

// 2. Render parsed markdown via a library that sanitizes
<ReactMarkdown>{userBio}</ReactMarkdown>

// 3. If raw HTML is required, sanitize first with DOMPurify
import DOMPurify from "isomorphic-dompurify";
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userBio) }} />
```

Audit checklist for every `dangerouslySetInnerHTML` call:

- Is the input always under our control? Document the source.
- If user-derived: is it sanitized at the **same call site**? (Sanitization at the API boundary is acceptable only if every consumer is verified.)
- Is the sanitizer config allowlisting tags, not denylisting?

## Unsafe URL Schemes

`javascript:` and `data:` URLs in `href`, `src`, and `xlink:href` execute arbitrary code.

```tsx
// CRITICAL: javascript: URL injection
<a href={user.website}>Visit</a>   // if user.website = "javascript:alert(1)"

// CORRECT: validate scheme
function safeUrl(url: string): string | undefined {
  try {
    const parsed = new URL(url);
    if (["http:", "https:", "mailto:"].includes(parsed.protocol)) return url;
  } catch {
    return undefined;
  }
  return undefined;
}
<a href={safeUrl(user.website)}>Visit</a>
```

React warns about `javascript:` URLs in `href` in development mode, but does not block them at runtime. `data:` URLs and other schemes also slip through. Always validate.

## `target="_blank"` Without `rel`

`<a target="_blank">` without `rel="noopener noreferrer"` lets the target page access `window.opener` and run navigation hijacks.

```tsx
// WRONG
<a href={externalUrl} target="_blank">External</a>

// CORRECT
<a href={externalUrl} target="_blank" rel="noopener noreferrer">External</a>
```

Modern browsers default to `noopener` when `target="_blank"`, but do not rely on browser defaults — be explicit.

## Server Action Input Validation

Server Actions (`"use server"`) run with the same trust level as a public API endpoint. Validate every input.

```tsx
"use server";
import { z } from "zod";

const Input = z.object({
  email: z.string().email(),
  age: z.number().int().min(0).max(120),
});

export async function updateUser(_state: unknown, formData: FormData) {
  const parsed = Input.safeParse({
    email: formData.get("email"),
    age: Number(formData.get("age")),
  });
  if (!parsed.success) return { error: parsed.error.flatten() };
  // ...
}
```

- Authenticate inside the action — do not trust the client-side route gate
- Authorize: con

---

**ECC Original:** \`ECC/rules/react/security.md\`
**Atualizado em:** 2026-07-02 23:01:54
