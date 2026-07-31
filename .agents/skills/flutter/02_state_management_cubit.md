## 3. State Management (`lib/controllers`)
Strict separation of state management responsibilities:
- `providers/`: ONLY use Providers for local app state (e.g., Theme setting, Locale/Language selection).
- `cubits/`: USE ONLY BLoC/Cubit for remote data fetching, API calls, and complex business logic.

**Every Cubit MUST handle these states:**
| State | When |
|-------|------|
| `Loading` | API call is in progress |
| `Success` | Data fetched/action completed |
| `Error` | Any failure occurred (pass the `Failure` object) |
| `Empty` *(optional)* | Explicit empty state when UI needs a distinct empty screen |

> **Empty state tip:** You don't always need a separate `Empty` state. It's often cleaner to check `state.data.isEmpty` inside the `Success` handler and show an empty widget inline. Use a dedicated `Empty` state only when the empty UI is significantly different and complex enough to warrant its own state class. Be consistent within a project — pick one approach and stick to it.

### Cubit Placement Strategy (Smart Registration — NOT Random)

Never dump all Cubits into `main.dart`. Register each Cubit at the **lowest level** where it is needed:

| Scope | Where to register | Examples |
|-------|-------------------|----------|
| **App-wide (Global)** | Root `MultiBlocProvider` in `main.dart` | `UserCubit`, `CartCubit`, `WishlistCubit`, `NotificationsCubit` |
| **Feature-wide** | `BlocProvider` wrapping the feature's route/screen | `CheckoutCubit` (only in checkout flow) |
| **Flow-scoped** | `BlocProvider.value` | Passing an existing Cubit to a new screen in a flow without recreating it |
| **Single screen** | `BlocProvider` directly on that screen | `ProductDetailsCubit`, `SearchCubit` |

**Rule for deciding Global vs Local:**
> Ask: *"Does any OTHER feature/screen need to READ this state?"*
> - **Yes** → Register globally at root so it's always alive and accessible via `context.read<MyCubit>()`
> - **No** → Register locally at the screen/feature level

**Example (E-commerce style):**
```dart
// ✅ Step 1: Register globally — no loading at startup
MultiBlocProvider(
  providers: [
    BlocProvider(create: (_) => UserCubit()),
    BlocProvider(create: (_) => CartCubit()),      // registered but NOT loaded
    BlocProvider(create: (_) => WishlistCubit()),  // registered but NOT loaded
  ],
  child: MaterialApp(...),
)

// ✅ Step 2: Load on first visit to the relevant screen
class CartScreen extends StatefulWidget { ... }
class _CartScreenState extends State<CartScreen> {
  @override
  void initState() {
    super.initState();
    context.read<CartCubit>().loadCart(); // ← first visit triggers load
  }
}

// ✅ Step 3: Guard inside the Cubit — prevents double loading
Future<void> loadCart() async {
  if (state is CartLoaded) return; // ← already loaded from a previous visit ✋
  emit(CartLoading());
  // ... API call
  emit(CartLoaded(items));
}

// ✅ Result: Any screen/widget anywhere in the app can now READ the state
// because the Cubit is global and the data is already in memory
class ProductCard extends StatelessWidget {
  Widget build(BuildContext context) {
    final isInCart = context.read<CartCubit>().isInCart(product.id);
    // ☝️ works because CartCubit is global + already loaded on first cart visit
  }
}
```

> **Key insight:** The Cubit loads **lazily on first need**, then stays alive globally for the rest of the session. Any screen after that reads from memory — no extra API calls.

```dart
// ✅ Local — only used in one screen, no need to keep alive globally
BlocProvider(
  create: (_) => ProductDetailsCubit(),
  child: ProductDetailsScreen(),
)
```

**Example: Consuming Global Cubits without re-creating them (e.g. `WishListScreen`)**
If a screen needs data from multiple global Cubits (like `CartCubit` and `WishListCubit`), **never** use `BlocProvider` to recreate them. Simply nest `BlocBuilder`s to read the existing global instances:

```dart
// ✅ Correct — reading global Cubits using nested BlocBuilders
class WishListScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return BlocBuilder<CartCubit, CartState>(
      builder: (context, cartState) {
        if (cartState is CartLoading) return const CircularProgressIndicator();
        
        return BlocBuilder<WishListCubit, WishListState>(
          builder: (context, wishListState) {
            if (wishListState is WishListLoading) return const CircularProgressIndicator();
            
            final products = context.read<WishListCubit>().favoritesList;
            // ... Build your UI using both states ...
            return Text('Cart items: ${cartState.items}, Wishlist items: ${products.length}');
          },
        );
      },
    );
  }
}
```

> **"Whoever needs it first, loads it. Everyone else benefits."**
> Any screen that needs global Cubit data MUST call `load()` in its `initState`. The guard inside the Cubit ensures the API is only called **once** per session, regardless of how many screens call it. If `ProductDetailsScreen` opens first and loads the cart — when `CartScreen` opens later, it finds the data already ready with zero extra API calls.




**Cross-Cubit Communication:**
Cubits have NO `BuildContext` — you cannot call `context.read<>()` inside a Cubit. There are two clean ways to share data:

1. **Constructor injection** (preferred for direct Cubit→Cubit dependency):
   ```dart
   // At registration in main.dart:
   BlocProvider(create: (ctx) => CartCubit(userCubit: ctx.read<UserCubit>()))
   // Never call context.read<> INSIDE the Cubit class itself
   ```

2. **`GetIt.I<>`** (preferred for Services and Repositories):
   ```dart
   // Inside any Cubit — reach for services via GetIt, not context
   final _repo = GetIt.I<CartRepository>();
   final _prefs = GetIt.I<CacheHelper>();
   ```

**Cubit Registration — Singleton vs Factory:**
- **Global Cubits** (Cart, Wishlist, User) → `BlocProvider` at root creates **one instance** that lives for the whole app session. Never use `factory` for these.
- **Local Cubits** (ProductDetails, Search) → `BlocProvider` at screen level creates a new instance each time the screen opens and disposes it when closed. This IS the correct "factory" behavior — handled automatically by BlocProvider.
  ```dart
  // ✅ Local — new instance per screen visit, auto-disposed
  BlocProvider(create: (_) => ProductDetailsCubit(), child: ProductDetailsScreen())

  // ❌ WRONG — never re-register a global cubit inside a screen
  BlocProvider(create: (_) => CartCubit(), child: CartScreen()) // creates a SECOND CartCubit!
  // ✅ RIGHT — just read the existing global one
  // CartScreen reads context.read<CartCubit>() directly — no new BlocProvider needed
  ```

**Optimistic UI Updates & Rollbacks (CRITICAL FOR UX):**
For immediate-feedback actions (e.g., Like button, changing cart quantity), the Cubit MUST implement an Optimistic Update pattern:
1. Save the previous state/value locally in the Cubit.
2. Update the state immediately and emit `Success` (so the UI updates instantly without waiting for the network).
3. Call the API.
4. If the API fails, catch the error, emit the `Error` state (or trigger a UI error message), and **rollback** the state to the saved previous value.

### Post-Task: Run Flutter Analyze
**After completing ANY Flutter code change**, run:
```
flutter analyze
```
Fix ALL warnings and errors before considering the task done. Never leave the codebase in a state that fails analysis.
