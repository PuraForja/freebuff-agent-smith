# 📏 Regra: angular — testing

> **Adaptada do ECC:** \`rules/angular/testing.md\`
> **Fonte original:** \`ECC/rules/angular/testing.md\`

## Descrição

Regra ECC para angular: testing

---

## Conteúdo Adaptado

---
paths:
  - "**/*.spec.ts"
  - "**/*.test.ts"
---
# Angular Testing

> This file extends [common/testing.md](../common/testing.md) with Angular specific content.

## Test Runner

Use the test runner configured by the project. Check `angular.json` and `package.json`; Angular projects commonly use Vitest, Jest, or Jasmine + Karma.

```bash
ng test               # watch mode
ng test --no-watch    # CI mode
```

## TestBed Setup

For standalone components, import the component directly. Call `compileComponents()` for components with external templates.

```typescript
describe('UserCardComponent', () => {
  let fixture: ComponentFixture<UserCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCardComponent);
  });
});
```

## Signal Inputs

Set signal-based inputs via `fixture.componentRef.setInput()`:

```typescript
fixture.componentRef.setInput('user', mockUser);
fixture.detectChanges();
```

## Component Harnesses

Prefer Angular CDK component harnesses over direct DOM queries for UI interaction. Harnesses are more resilient to markup changes.

```typescript
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';

let loader: HarnessLoader;

beforeEach(() => {
  loader = TestbedHarnessEnvironment.loader(fixture);
});

it('triggers save on button click', async () => {
  const button = await loader.getHarness(MatButtonHarness.with({ text: 'Save' }));
  await button.click();
  expect(saveSpy).toHaveBeenCalled();
});
```

## Router Testing

Use `RouterTestingHarness` for components that depend on the router:

```typescript
import { RouterTestingHarness } from '@angular/router/testing';

it('renders user on navigation', async () => {
  const harness = await RouterTestingHarness.create();
  const component = await harness.navigateByUrl('/users/1', UserDetailComponent);
  expect(component.userId()).toBe('1');
});
```

## Async Testing

Use `fakeAsync` + `tick` for controlled async. Use `waitForAsync` for real async with `fixture.whenStable()`.

```typescript
it('loads user after delay', fakeAsync(() => {
  const service = TestBed.inject(UserService);
  vi.spyOn(service, 'getUser').mockReturnValue(of(mockUser));

  fixture.detectChanges();
  tick();
  fixture.detectChanges();

  expect(fixture.nativeElement.querySelector('.name').textContent).toBe(mockUser.name);
}));
```

## HTTP Testing

---

**ECC Original:** \`ECC/rules/angular/testing.md\`
**Atualizado em:** 2026-07-02 23:01:49
