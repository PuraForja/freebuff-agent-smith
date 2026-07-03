# 📏 Regra: arkts — testing

> **Adaptada do ECC:** \`rules/arkts/testing.md\`
> **Fonte original:** \`ECC/rules/arkts/testing.md\`

## Descrição

Regra ECC para arkts: testing

---

## Conteúdo Adaptado

---
paths:
  - "**/*.ets"
  - "**/*.ts"
  - "**/ohosTest/**"
---
# HarmonyOS / ArkTS Testing

> This file extends [common/testing.md](../common/testing.md) with HarmonyOS-specific testing practices.

## Test Framework

HarmonyOS uses the built-in test framework with `@ohos.test` capabilities:

- **Unit tests**: Located in `src/ohosTest/ets/test/`
- **UI tests**: Use `@ohos.UiTest` for component testing
- **Instrument tests**: Run on device/emulator

## Test Directory Structure

```
module/
  |-- src/
  |   |-- main/ets/          # Production code
  |   |-- ohosTest/ets/      # Test code
  |       |-- test/
  |       |   |-- Ability.test.ets
  |       |   |-- List.test.ets
  |       |-- TestAbility.ets
  |       |-- TestRunner.ets
```

## Running Tests

```bash
# Run all tests for a module
hvigorw testHap -p product=default

# Run tests on connected device
hdc shell aa test -b com.example.app -m entry_test -s unittest /ets/TestRunner/OpenHarmonyTestRunner
```

## Unit Test Example

```typescript
import { describe, it, expect } from '@ohos/hypium';

export default function UserViewModelTest() {
  describe('UserViewModel', () => {
    it('should_initialize_with_empty_state', 0, () => {
      const vm = new UserViewModel();
      expect(vm.userName).assertEqual('');
      expect(vm.isLoading).assertFalse();
    });

    it('should_update_user_name', 0, () => {
      const vm = new UserViewModel();
      vm.updateUserName('Alice');
      expect(vm.userName).assertEqual('Alice');
    });

    it('should_handle_empty_input', 0, () => {
      const vm = new UserViewModel();
      vm.updateUserName('');
      expect(vm.userName).assertEqual('');
      expect(vm.hasError).assertFalse();
    });
  });
}
```

## UI Test Example

```typescript
import { describe, it, expect } from '@ohos/hypium';
import { Driver, ON } from '@ohos.UiTest';

export default function HomePageUITest() {
  describe('HomePage_UI', () => {
    it('should_display_title', 0, async () => {
      const driver = Driver.create();
      await driver.delayMs(1000);

      const title = await driver.findComponent(ON.text('Home'));
      expect(title !== null).assertTrue();
    });

    it('should_navigate_to_detail_on_click', 0, async () => {
      const driver = Driver.create();
      const button = await driver.findComponent(ON.id('detailButton'));
      await button.click();
      await driver.delayMs(500);

      const detailTitle = await driver.findComponent(ON.text('Detail'));
      expect(detailTitle !== null).assertTrue();
    });
  });
}
```

---

**ECC Original:** \`ECC/rules/arkts/testing.md\`
**Atualizado em:** 2026-07-02 23:01:50
