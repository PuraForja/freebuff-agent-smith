# 📏 Regra: angular — coding-style

> **Adaptada do ECC:** \`rules/angular/coding-style.md\`
> **Fonte original:** \`ECC/rules/angular/coding-style.md\`

## Descrição

Regra ECC para angular: coding-style

---

## Conteúdo Adaptado

---
paths:
  - "**/*.component.ts"
  - "**/*.component.html"
  - "**/*.service.ts"
  - "**/*.directive.ts"
  - "**/*.pipe.ts"
  - "**/*.guard.ts"
  - "**/*.resolver.ts"
  - "**/*.module.ts"
---
# Angular Coding Style

> This file extends [common/coding-style.md](../common/coding-style.md) with Angular specific content.

## Version Awareness

Always check the project's Angular version before writing code — features differ significantly between versions. Run `ng version` or inspect `package.json`. When creating a new project, do not pin a version unless the user specifies one.

After generating or modifying Angular code, always run `ng build` to catch errors before finishing.

## File Naming

Follow Angular CLI conventions — one artifact per file:

- `user-profile.component.ts` + `user-profile.component.html` + `user-profile.component.spec.ts`
- `user.service.ts`, `auth.guard.ts`, `date-format.pipe.ts`
- Feature folders: `features/users/`, `features/auth/`
- Generate with the CLI: `ng generate component features/users/user-card`

## Components

Prefer standalone components (v17+ default). Use `OnPush` change detection on all new components.

```typescript
@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './user-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardComponent {
  user = input.required<User>();
  select = output<string>();
}
```

## Dependency Injection

Use `inject()` over constructor injection. Keep constructors empty or remove them entirely.

```typescript
// CORRECT
@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private router = inject(Router);
}

// WRONG: Constructor injection is verbose and harder to tree-shake
constructor(private http: HttpClient, private router: Router) {}
```

Use `InjectionToken` for non-class dependencies:

```typescript
const API_URL = new InjectionToken<string>('API_URL');

// Provide:
{ provide: API_URL, useValue: 'https://api.example.com' }

// Consume:
private apiUrl = inject(API_URL);
```

## Signals

### Core Primitives

```typescript
count = signal(0);
doubled = computed(() => this.count() * 2);

increment() {
  this.count.update(n => n + 1);
}
```

### `linkedSignal` — Writable Derived State

Use `linkedSignal` when a signal must reset or adapt when a source changes, but also be independently writable:

```typescript
selectedOption = linkedSignal(() => this.options()[0]);
// Resets to first option when options changes, but user can override
```

### `resource` — Async Data into Signals

---

**ECC Original:** \`ECC/rules/angular/coding-style.md\`
**Atualizado em:** 2026-07-02 23:01:49
