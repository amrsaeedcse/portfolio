# Frontend Architecture (React Native / TypeScript)
The app follows a modular/feature-based approach combined with a solid `core` layer.

## 1. Network & API Handling (`src/core/api`)
- `apiConsumer.ts`: Abstract interface for API requests (`ApiConsumer`).
- `axiosConsumer.ts`: The concrete implementation of `ApiConsumer` using `axios` (the standard HTTP client in RN — same role as `Dio`).
- `apiInterceptors.ts`: Handles Token/Refresh Token logic via axios interceptors. **Rule:** If the current feature does not require authentication, comment out the token-handling logic inside the interceptor rather than deleting it.
- `endPoints.ts`: STRICTLY use the provided constants:
  - `EndPoints.baseUrl` → for all API calls (includes `/api/` path).
  - `EndPoints.domain` → for static asset/image URLs (root domain, no `/api/` path).
  - `ApiKeys` → for all header names, body keys, and query parameter keys.
- HTTP status codes MUST be referenced via `StatusCode` enum (`src/core/api/statusCode.ts`). Never use raw numbers like `401` or `200`.

## 2. Error Handling (`src/core/errors`)
- STRICTLY use the custom `Failure` classes (`ServerFailure`, `UnexpectedFailure`, `CacheFailure`).
- When catching errors in a Repository/Store action:
  - Use `catch (e)` with `axios.isAxiosError(e)` and return `ServerFailure.fromAxiosError(e)`.
  - For anything else, return `UnexpectedFailure()`. If there is no specific or convincing error message to pass, leave it empty to use the default message.
- The state emitted upon failure MUST carry the `Failure` object (see `02_state_management_zustand.md` for the discriminated-union shape).
- **NEVER display raw backend error strings directly to the user.** Backend messages are always English keys (e.g. `'no_internet_connection'`, `'server_error'`). ALWAYS translate them via `useTranslateError()(failure.message)` in the UI layer.
- **`useTranslateError` hook** lives in `src/core/utils/errorTranslator.ts`:
  ```typescript
  // UI layer:
  <CustomText data={translateError(failure.message)} fontSize={14} />

  // errorTranslator.ts:
  import { useTranslation } from 'react-i18next';

  export function useTranslateError() {
    const { t } = useTranslation();
    return (errorKey: string): string => {
      switch (errorKey) {
        case 'no_internet_connection': return t('errors.no_internet_connection');
        case 'server_error':           return t('errors.server_error');
        case 'timeout_error':          return t('errors.timeout_error');
        default: return errorKey; // unknown key → show as-is
      }
    };
  }
  ```
- **Custom (non-axios) errors:** If you throw a manual exception (e.g. validation, local logic), wrap it in `new UnexpectedFailure('your_i18n_key')` and use the **same** `translateError` flow. Never bypass the translation chain, even for custom errors.

```typescript
// Repository pattern:
async function analyzeUrl(url: string): Promise<MediaInfo> {
  const response = await apiConsumer.post(EndPoints.analyze, { [ApiKeys.url]: url });
  return response[ApiKeys.data] as MediaInfo; // typed at the boundary — see §13 in file 04
}

// Store action pattern:
try {
  const data = await mediaRepository.analyzeUrl(url);
  set({ state: { status: 'success', data } });
} catch (e) {
  const failure = axios.isAxiosError(e) ? ServerFailure.fromAxiosError(e) : new UnexpectedFailure();
  set({ state: { status: 'error', failure } });
}
```

## 3. Repositories (`src/repositories`)
- **Interface -> Implementation Pattern (MANDATORY):** Every Repository MUST consist of a TypeScript interface defining the contract, and a separate implementation class (e.g., `interface UserRepository` and `class UserRepositoryImpl implements UserRepository`). Never create a concrete repository directly without its interface.

## 4. Dependency "Injection" — Manual Singleton Modules (`src/repositories`, `src/core/services`)

> **Why not a DI container/decorators library (`tsyringe`, `InversifyJS`, etc.)?**
> These map conceptually to Flutter's `get_it` + `injectable`, but they are **not the mainstream pattern in React Native**. The overwhelming majority of production RN codebases skip a DI container entirely and rely on plain ES module singletons instead — no extra build step (`reflect-metadata`, decorator config), no container to learn, and it's what you'll actually find in real-world RN projects. Only reach for a container library if the team has a genuine, recurring need for structured mock-injection in tests that plain module mocking can't cover — don't add it by default just because Flutter has one.

- **Pattern:** Every service/repository is instantiated **once**, in its own file, and exported as a ready-to-use singleton instance — the module itself IS the singleton.

  ```typescript
  // src/repositories/cartRepository.ts
  export interface CartRepository {
    getCart(): Promise<CartItem[]>;
  }

  class CartRepositoryImpl implements CartRepository {
    async getCart(): Promise<CartItem[]> {
      const response = await apiConsumer.get(EndPoints.cart);
      return response[ApiKeys.data] as CartItem[];
    }
  }

  // ✅ No container, no resolve() — just export the instance
  export const cartRepository: CartRepository = new CartRepositoryImpl();
  ```

- **At call sites, just import the instance directly:**
  ```typescript
  // ✅ Correct
  import { cartRepository } from '@/repositories/cartRepository';
  const items = await cartRepository.getCart();

  // ❌ Never instantiate manually at the call site
  const repo = new CartRepositoryImpl(); // — bypasses the shared singleton
  ```

- **"New instance every time" (factory) case — rare in RN:** if you genuinely need a fresh instance per use (equivalent to `@injectable()`), export a plain factory function instead of a singleton:
  ```typescript
  // src/services/exportSession.ts
  export function createExportSession(): ExportSession {
    return new ExportSession();
  }
  ```

- **Swapping implementations for tests:** since each repository file exports a single `const`, mock it at the module level with your test runner's module-mocking feature (e.g. Jest's `jest.mock('@/repositories/cartRepository')`) rather than reaching for a container.
