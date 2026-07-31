## 3. State Management (`src/stores`)
Strict separation of state management responsibilities:
- `contexts/`: ONLY use React Context for local app state (e.g., Theme setting, Locale/Language selection).
- `stores/`: USE ONLY Zustand stores for remote data fetching, API calls, and complex business logic.

**Every Zustand store handling async data MUST expose its state as a Discriminated Union — never as flat optional fields:**

```typescript
// ✅ CORRECT — mirrors Flutter's sealed Cubit states (CartLoading/CartSuccess/CartError)
export type CartState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; items: CartItem[] }
  | { status: 'error'; failure: Failure };

// ❌ WRONG — TypeScript can't stop you writing an impossible combination,
// e.g. { status: 'loading', items: [...], failure: new Failure() }
interface BadCartState {
  status: 'idle' | 'loading' | 'success' | 'error';
  items: CartItem[] | null;
  failure: Failure | null;
}
```

With the discriminated union, the compiler enforces correctness at the UI layer too — you physically cannot read `state.items` unless you've already checked `state.status === 'success'`.

> **Empty state tip:** You don't always need a separate `{ status: 'empty' }` member. It's often cleaner to check `items.length === 0` inside the `'success'` branch and render an empty widget inline. Use a dedicated empty member only when the empty UI is significantly different/complex. Be consistent within a project — pick one approach and stick to it.

### Store Placement Strategy (Smart Creation — NOT Random)

Never dump all stores into one giant `rootStore.ts`. Create each store as its **own file**, scoped to where it's needed:

| Scope | Where it lives | Examples |
|-------|-----------------|----------|
| **App-wide (Global)** | `src/stores/global/` — plain Zustand `create()`, imported anywhere | `useUserStore`, `useCartStore`, `useWishlistStore`, `useNotificationsStore` |
| **Feature-wide** | `src/features/checkout/store/useCheckoutStore.ts` | `useCheckoutStore` (only used inside the checkout flow) |
| **Flow-scoped** | Same global store instance, just imported into the new screen | Passing existing state to a new screen in a flow without recreating it |
| **Single screen** | Local `useState`/`useReducer` with the same discriminated-union shape | `ProductDetailsScreen`, `SearchScreen` |

**Rule for deciding Global vs Local:**
> Ask: *"Does any OTHER feature/screen need to READ this state?"*
> - **Yes** → Create it as a global Zustand store (module-level `create()`) so it's always alive and accessible via the hook anywhere
> - **No** → Keep it local: `useState`/`useReducer` in the component

> **Key difference from Flutter/Cubit and from React Context:** Zustand stores created with plain `create()` are module-level singletons the moment the file is imported — there is **no Provider, no Context, nothing to wrap the tree with**. Any code, even outside a component (an axios interceptor, another store), can read or write it via `useCartStore.getState()` / `useCartStore.setState()`. This is exactly like a global Cubit living outside the widget tree. For a **local, per-screen** store (equivalent to a factory-scoped Cubit), just use `useState`/`useReducer` in the component — don't try to force Zustand into a "local" role, that's not what it's built for in this ecosystem.

**Example (E-commerce style):**
```typescript
// src/stores/global/useCartStore.ts
import { create } from 'zustand';
import { cartRepository } from '@/repositories/cartRepository';
import { UnexpectedFailure } from '@/core/errors/failure';

export type CartState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; items: CartItem[] }
  | { status: 'error'; failure: Failure };

interface CartStore {
  state: CartState;
  loadCart: () => Promise<void>;
  isInCart: (id: string) => boolean;
}

export const useCartStore = create<CartStore>((set, get) => ({
  state: { status: 'idle' },

  // ✅ Guard inside the store — prevents double loading
  loadCart: async () => {
    if (get().state.status === 'success') return; // ← already loaded from a previous visit ✋
    set({ state: { status: 'loading' } });
    try {
      const items = await cartRepository.getCart();
      set({ state: { status: 'success', items } });
    } catch (e) {
      set({ state: { status: 'error', failure: new UnexpectedFailure() } });
    }
  },

  isInCart: (id) => {
    const s = get().state;
    return s.status === 'success' && s.items.some((i) => i.id === id);
  },
}));

// ✅ Step: Load on first visit to the relevant screen
function CartScreen() {
  const { state, loadCart } = useCartStore();
  useEffect(() => {
    loadCart(); // ← first visit triggers load
  }, []);

  if (state.status === 'loading') return <ActivityIndicator />;
  if (state.status === 'error') return <ErrorView failure={state.failure} />;
  if (state.status === 'success') return <CartList items={state.items} />;
  return null; // idle
}

// ✅ Result: Any component anywhere in the app can now READ the state
// because the store is a global singleton and the data is already in memory
function ProductCard({ product }: { product: Product }) {
  const isInCart = useCartStore((s) => s.isInCart(product.id));
  // ☝️ works because useCartStore is global + already loaded on first cart visit
}
```

```typescript
// ✅ Local — only used in one screen, plain useState with the same union shape
function ProductDetailsScreen() {
  const [state, setState] = useState<ProductDetailsState>({ status: 'idle' });
  // ...
}
```

**Example: Consuming Global Stores without re-fetching (e.g. `WishListScreen`)**
If a screen needs data from multiple global stores (like `useCartStore` and `useWishlistStore`), **never** re-trigger their load unconditionally. Just select from the existing global instances:

```typescript
// ✅ Correct — reading global stores directly, guard prevents duplicate fetches
function WishListScreen() {
  const { state: cartState, loadCart } = useCartStore();
  const { state: wishState, loadWishlist } = useWishlistStore();

  useEffect(() => {
    loadCart();
    loadWishlist();
  }, []);

  if (cartState.status === 'loading' || wishState.status === 'loading') {
    return <ActivityIndicator />;
  }

  if (cartState.status === 'success' && wishState.status === 'success') {
    return (
      <CustomText
        data={`Cart items: ${cartState.items.length}, Wishlist items: ${wishState.favorites.length}`}
        fontSize={14}
      />
    );
  }
  return null;
}
```

> **"Whoever needs it first, loads it. Everyone else benefits."**
> Any screen that needs global store data MUST call its `load()` action in a `useEffect`. The guard inside the store ensures the API is only called **once** per session, regardless of how many screens call it. If `ProductDetailsScreen` opens first and loads the cart — when `CartScreen` opens later, it finds the data already ready with zero extra API calls.

**Cross-Store Communication:**
Zustand stores are plain functions/objects — no React Context needed inside them. There are two clean ways to share data:

1. **`getState()` from another store** (preferred for direct store→store dependency):
   ```typescript
   // Inside useCartStore.ts:
   loadCart: async () => {
     const userId = useUserStore.getState().user?.id;
     // Never subscribe with the hook form INSIDE another store's action — use getState()
   }
   ```

2. **Direct singleton import** (preferred for Services and Repositories — see `01_architecture_network_di.md`):
   ```typescript
   // Inside any store action — import the singleton directly, no container
   import { cartRepository } from '@/repositories/cartRepository';
   import { cacheHelper } from '@/core/storage/cacheHelper';
   ```

**Store Scope — Singleton vs Local:**
- **Global stores** (Cart, Wishlist, User) → module-level `create()` produces **one instance** that lives for the whole app session.
- **Local, screen-scoped state** (ProductDetails, Search) → plain `useState`/`useReducer` inside the component, auto-disposed on unmount. Don't create a second Zustand store just to fake "local" scope — that's fighting the tool.

**Optimistic UI Updates & Rollbacks (CRITICAL FOR UX):**
For immediate-feedback actions (e.g., Like button, changing cart quantity), the store action MUST implement an Optimistic Update pattern:
1. Save the previous state/value locally inside the action.
2. Update the state immediately via `set()` (so the UI updates instantly without waiting for the network).
3. Call the API.
4. If the API fails, catch the error, set the `{ status: 'error', failure }` state (or trigger a UI error message), and **rollback** the state to the saved previous value with another `set()`.

### Post-Task: Run Lint + Type Check
**After completing ANY React Native code change**, run:
```
npx eslint . --fix && npx tsc --noEmit
```
Fix ALL warnings and errors before considering the task done. Never leave the codebase in a state that fails lint or type-checking.
