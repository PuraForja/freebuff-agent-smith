# 📏 Regra: dart — security

> **Adaptada do ECC:** \`rules/dart/security.md\`
> **Fonte original:** \`ECC/rules/dart/security.md\`

## Descrição

Regra ECC para dart: security

---

## Conteúdo Adaptado

---
paths:
  - "**/*.dart"
  - "**/pubspec.yaml"
  - "**/AndroidManifest.xml"
  - "**/Info.plist"
---
# Dart/Flutter Security

> This file extends [common/security.md](../common/security.md) with Dart, Flutter, and mobile-specific content.

## Secrets Management

- Never hardcode API keys, tokens, or credentials in Dart source
- Use `--dart-define` or `--dart-define-from-file` for compile-time config (values are not truly secret — use a backend proxy for server-side secrets)
- Use `flutter_dotenv` or equivalent, with `.env` files listed in `.gitignore`
- Store runtime secrets in platform-secure storage: `flutter_secure_storage` (Keychain on iOS, EncryptedSharedPreferences on Android)

```dart
// BAD
const apiKey = 'sk-abc123...';

// GOOD — compile-time config (not secret, just configurable)
const apiKey = String.fromEnvironment('API_KEY');

// GOOD — runtime secret from secure storage
final token = await secureStorage.read(key: 'auth_token');
```

## Network Security

- Enforce HTTPS — no `http://` calls in production
- Configure Android `network_security_config.xml` to block cleartext traffic
- Set `NSAppTransportSecurity` in `Info.plist` to disallow arbitrary loads
- Set request timeouts on all HTTP clients — never leave defaults
- Consider certificate pinning for high-security endpoints

```dart
// Dio with timeout and HTTPS enforcement
final dio = Dio(BaseOptions(
  baseUrl: 'https://api.example.com',
  connectTimeout: const Duration(seconds: 10),
  receiveTimeout: const Duration(seconds: 30),
));
```

## Input Validation

- Validate and sanitize all user input before sending to API or storage
- Never pass unsanitized input to SQL queries — use parameterized queries (sqflite, drift)
- Sanitize deep link URLs before navigation — validate scheme, host, and path parameters
- Use `Uri.tryParse` and validate before navigating

```dart
// BAD — SQL injection
await db.rawQuery("SELECT * FROM users WHERE email = '$userInput'");

// GOOD — parameterized
await db.query('users', where: 'email = ?', whereArgs: [userInput]);

// BAD — unvalidated deep link
final uri = Uri.parse(incomingLink);
context.go(uri.path); // could navigate to any route

// GOOD — validated deep link
final uri = Uri.tryParse(incomingLink);
if (uri != null && uri.host == 'myapp.com' && _allowedPaths.contains(uri.path)) {
  context.go(uri.path);
}
```

## Data Protection

- Store tokens, PII, and credentials only in `flutter_secure_storage`
- Never write sensitive data to `SharedPreferences` or local files in plaintext
- Clear auth state on logout: tokens, cached user data, cookies
- Use biometric authentication (`local_auth`) for sensitive operations
- Avoid logging sensitive data — no `print(token)` or `debugPrint(password)`

## Android-Specific

- Declare only required permissions in `AndroidManifest.xml`
- Export Android components (`Activity`, `Service`, `BroadcastReceiver`) only when necessary; add `android:exported="false"` where not needed
- Review intent filters — exported

---

**ECC Original:** \`ECC/rules/dart/security.md\`
**Atualizado em:** 2026-07-02 23:01:51
