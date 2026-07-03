# 📏 Regra: kotlin — patterns

> **Adaptada do ECC:** \`rules/kotlin/patterns.md\`
> **Fonte original:** \`ECC/rules/kotlin/patterns.md\`

## Descrição

Regra ECC para kotlin: patterns

---

## Conteúdo Adaptado

---
paths:
  - "**/*.kt"
  - "**/*.kts"
---
# Kotlin Patterns

> This file extends [common/patterns.md](../common/patterns.md) with Kotlin and Android/KMP-specific content.

## Dependency Injection

Prefer constructor injection. Use Koin (KMP) or Hilt (Android-only):

```kotlin
// Koin — declare modules
val dataModule = module {
    single<ItemRepository> { ItemRepositoryImpl(get(), get()) }
    factory { GetItemsUseCase(get()) }
    viewModelOf(::ItemListViewModel)
}

// Hilt — annotations
@HiltViewModel
class ItemListViewModel @Inject constructor(
    private val getItems: GetItemsUseCase
) : ViewModel()
```

## ViewModel Pattern

Single state object, event sink, one-way data flow:

```kotlin
data class ScreenState(
    val items: List<Item> = emptyList(),
    val isLoading: Boolean = false
)

class ScreenViewModel(private val useCase: GetItemsUseCase) : ViewModel() {
    private val _state = MutableStateFlow(ScreenState())
    val state = _state.asStateFlow()

    fun onEvent(event: ScreenEvent) {
        when (event) {
            is ScreenEvent.Load -> load()
            is ScreenEvent.Delete -> delete(event.id)
        }
    }
}
```

## Repository Pattern

- `suspend` functions return `Result<T>` or custom error type
- `Flow` for reactive streams
- Coordinate local + remote data sources

```kotlin
interface ItemRepository {
    suspend fun getById(id: String): Result<Item>
    suspend fun getAll(): Result<List<Item>>
    fun observeAll(): Flow<List<Item>>
}
```

## UseCase Pattern

Single responsibility, `operator fun invoke`:

```kotlin
class GetItemUseCase(private val repository: ItemRepository) {
    suspend operator fun invoke(id: String): Result<Item> {
        return repository.getById(id)
    }
}

class GetItemsUseCase(private val repository: ItemRepository) {
    suspend operator fun invoke(): Result<List<Item>> {
        return repository.getAll()
    }
}
```

## expect/actual (KMP)

Use for platform-specific implementations:

```kotlin
// commonMain
expect fun platformName(): String
expect class SecureStorage {
    fun save(key: String, value: String)
    fun get(key: String): String?
}

// androidMain
actual fun platformName(): String = "Android"
actual class SecureStorage {
    actual fun save(key: String, value: String) { /* EncryptedSharedPreferences */ }
    actual fun get(key: String): String? = null /* ... */

---

**ECC Original:** \`ECC/rules/kotlin/patterns.md\`
**Atualizado em:** 2026-07-02 23:01:52
