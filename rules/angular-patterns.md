# 📏 Regra: angular — patterns

> **Adaptada do ECC:** \`rules/angular/patterns.md\`
> **Fonte original:** \`ECC/rules/angular/patterns.md\`

## Descrição

Regra ECC para angular: patterns

---

## Conteúdo Adaptado

---
paths:
  - "**/*.component.ts"
  - "**/*.component.html"
  - "**/*.service.ts"
  - "**/*.store.ts"
  - "**/*.routes.ts"
---
# Angular Patterns

> This file extends [common/patterns.md](../common/patterns.md) with Angular specific content.

## Smart / Dumb Component Split

Smart (container) components own data fetching and state. Dumb (presentational) components receive inputs and emit outputs only — no service injection.

```typescript
// Smart — owns data
@Component({ standalone: true, changeDetection: ChangeDetectionStrategy.OnPush })
export class UserPageComponent {
  private userService = inject(UserService);
  user = toSignal(this.userService.getUser(this.userId));
}
```

```html
<!-- Dumb — pure presentation -->
<app-user-card [user]="user()" (select)="onSelect($event)" />
```

## Service Layer

Services own all data access and business logic. Components delegate — no `HttpClient` in components.

```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }
}
```

## Async Data with `resource`

Use `resource()` for reactive async fetching. Prefer over manual RxJS pipelines for simple data loading:

```typescript
export class UserDetailComponent {
  userId = input.required<string>();

  userResource = resource({
    request: () => ({ id: this.userId() }),
    loader: ({ request }) =>
      firstValueFrom(inject(UserService).getUser(request.id)),
  });
}
```

Access state: `userResource.value()`, `userResource.isLoading()`, `userResource.error()`, `userResource.reload()`.

## Signal State Patterns

```typescript
// Local mutable state
count = signal(0);

// Derived (never duplicated)
doubled = computed(() => this.count() * 2);

// Writable derived state that resets with source
selectedItem = linkedSignal(() => this.items()[0]);

// Bridge Observable to signal
users = toSignal(this.userService.getUsers(), { initialValue: [] });
```

Never store derived values in separate signals — use `computed`. Never use `effect` to sync signals — use `computed` or `linkedSignal`.

## Subscription Cleanup

Use `takeUntilDestroyed()` for all manual subscriptions. Never use manual `ngOnDestroy` + `Subject` + `takeUntil` on new code.

```typescript
export class UserComponent {
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.userService.updates$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(update => this.handleUpdate(update));
  }
}
```

## Routing

### Route Definition

---

**ECC Original:** \`ECC/rules/angular/patterns.md\`
**Atualizado em:** 2026-07-02 23:01:49
