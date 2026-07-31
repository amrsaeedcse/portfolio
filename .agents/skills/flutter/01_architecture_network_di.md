# Frontend Architecture (Flutter)
The Flutter app follows a modular/feature-based approach combined with a solid `core` layer.

## 1. Network & API Handling (`lib/core/api`)
- `api_consumer.dart`: Abstract class/Interface for API requests.
- `dio_consumer.dart`: The concrete implementation of `ApiConsumer` using the `Dio` package.
- `api_interceptors.dart`: Handles Token/Refresh Token logic. **Rule:** If the current feature does not require authentication, comment out the token-handling logic inside the interceptor rather than deleting it.
- `end_points.dart`: STRICTLY use the provided classes:
  - `EndPoints.baseUrl` → for all API calls (includes `/api/` path).
  - `EndPoints.domain` → for static asset/image URLs (root domain, no `/api/` path).
  - `ApiKeys` → for all header names, body keys, and query parameter keys.
- HTTP status codes MUST be referenced via `StatusCode` (`lib/core/api/status_code.dart`). Never use raw integers like `401` or `200`.

## 2. Error Handling (`lib/core/errors`)
- STRICTLY use the custom `Failure` classes (`ServerFailure`, `UnexpectedFailure`, `CacheFailure`).
- When catching errors in a Repository/Cubit:
  - Use `on DioException catch (e)` and return `ServerFailure.fromDioError(e)`.
  - Use `catch (e)` for generic errors and return `UnexpectedFailure()`. If there is no specific or convincing error message to pass, leave it empty to use the default message.
- The state emitted by Cubits upon failure MUST contain the `Failure` object or its message.
- **NEVER display raw backend error strings directly to the user.** Backend messages are always English keys (e.g. `'no_internet_connection'`, `'server_error'`). ALWAYS translate them via `context.translateError(state.failure.message)` in the UI layer.
- **`ErrorTranslator` extension** lives in `lib/core/utils/error_translator.dart`:
  ```dart
  // UI layer:
  Text(context.translateError(state.failure.message))

  // error_translator.dart:
  extension ErrorTranslator on BuildContext {
    String translateError(String errorKey) {
      final loc = AppLocalizations.of(this)!;
      switch (errorKey) {
        case 'no_internet_connection': return loc.no_internet_connection;
        case 'server_error':           return loc.server_error;
        case 'timeout_error':          return loc.timeout_error;
        default: return errorKey; // unknown key → show as-is
      }
    }
  }
  ```
- **Custom (non-Dio) errors:** If you throw a manual exception (e.g. validation, local logic), wrap it in `UnexpectedFailure(message: 'your_l10n_key')` and use the **same** `translateError` flow. Never bypass the translation chain, even for custom errors.

```dart
// Repository pattern:
Future<MediaInfo> analyzeUrl(String url) async {
  final response = await _apiConsumer.post(...);
  return MediaInfo.fromJson(response[ApiKeys.data]);
  // Dio auto-throws on error → caught in Cubit
}

// Cubit pattern:
try {
  final result = await _mediaRepository.analyzeUrl(url);
  emit(AnalysisSuccess(result));
} on DioException catch (e) {
  emit(AnalysisError(ServerFailure.fromDioError(e)));
} catch (e) {
  emit(AnalysisError(UnexpectedFailure()));
}
```

## 5. Repositories (`lib/repository`)
- **Abstract -> Implementation Pattern (MANDATORY):** Every Repository MUST consist of an abstract class (Interface) defining the contract, and a separate implementation class (e.g., `abstract class UserRepository` and `class UserRepositoryImpl implements UserRepository`). Never create a concrete repository directly without its abstract interface.

## 6. Dependency Injection (`get_it` + `injectable`)
- The project uses `get_it` alongside the `injectable` package for code generation.
- **Registration Annotations (CRITICAL RULES):**
  - **`@singleton` / `@lazySingleton`:** Use this for dependencies that MUST maintain the exact same instance/state across the entire app (e.g. Global Cubits like `CartCubit`, Local Storage, Core Services).
  - **`@injectable` (Factory):** Use this for dependencies that should create a **NEW instance** every time they are requested (e.g. Local Cubits like `ProductDetailsCubit`, `SearchCubit`).
- **Code Generation Command:** After adding or modifying any injected class, you MUST run this command to update the DI graph:
  ```bash
  dart run build_runner build --delete-conflicting-outputs
  ```
- **At call sites, resolve dependencies using: `GetIt.I<ServiceName>()`**
  ```dart
  // ✅ Correct
  final ytBridge = GetIt.I<YtDlpBridgeService>();
  final repo = GetIt.I<DownloadRepository>();
  
  // ❌ Never resolve inside a widget constructor or initState directly
  // — use it inside methods or pass via constructor injection instead.
  ```
- **Never instantiate services manually** with `MyService()` at the call site. Always go through `GetIt.I<MyService>()` to ensure you get the injected instance.
