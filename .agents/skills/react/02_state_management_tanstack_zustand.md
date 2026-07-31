# React State Management: TanStack Query, Zustand & UX Patterns

This document governs state management placement, caching strategies, Optimistic UI updates, and rapid action debouncing in React applications.

---

## 1. Global vs Local State Placement Strategy

Ask: **"Does any OTHER page or component outside this branch need to read or mutate this state?"**

- **YES → Global Client State (Zustand):** Register in `@/stores/` (e.g. Theme, User Session, Modals, Cart Drawer).
- **YES → Global Server State (TanStack Query):** Cache globally in React Query Cache using unified query keys.
- **NO → Local Component State (`useState` / `useReducer`):** Keep state inside the component file or feature folder.

---

## 2. Lazy Loading & Double-Fetch Prevention

To prevent redundant API calls when navigating between pages:

```typescript
// 1. Configure staleTime in TanStack Query to keep data fresh in memory
export function useCart() {
  return useQuery({
    queryKey: QUERY_KEYS.CART.MINE,
    queryFn: cartService.getCart,
    staleTime: 1000 * 60 * 5, // 5 minutes stale time
    gcTime: 1000 * 60 * 30,   // 30 minutes in cache
  });
}

// 2. In Zustand stores, guard against re-fetching if data is already loaded
export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  isLoaded: false,
  fetchUserOnce: async () => {
    if (get().isLoaded) return; // Guard: Already in memory!
    const user = await userService.getSelf();
    set({ user, isLoaded: true });
  },
}));
```

---

## 3. Optimistic UI Updates with Automatic Rollback

High-frequency interactive controls (e.g., Like button, Add to Cart, Increment Quantity) MUST update UI immediately before waiting for the network response.

```typescript
export function useToggleWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => wishlistService.toggle(productId),

    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.WISHLIST.ALL });
      const previousWishlist = queryClient.getQueryData<string[]>(QUERY_KEYS.WISHLIST.ALL);

      // Optimistically update UI
      queryClient.setQueryData<string[]>(QUERY_KEYS.WISHLIST.ALL, (old = []) =>
        old.includes(productId) ? old.filter((id) => id !== productId) : [...old, productId]
      );

      return { previousWishlist };
    },

    // Rollback on failure
    onError: (err, productId, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(QUERY_KEYS.WISHLIST.ALL, context.previousWishlist);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST.ALL });
    },
  });
}
```

---

## 4. Debouncing Rapid User Actions

For inputs or controls users tap rapidly (e.g., search fields, quantity spinners), use a debounced callback hook to delay API dispatch:

```typescript
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delayMs = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}
```

---

## 5. Post-Task Audit & Linting

**After completing ANY code change in React/TypeScript**, run:
```bash
npm run lint && tsc --noEmit
```
Fix all TypeScript errors and ESLint warnings before marking the task complete.

---

## Related Skills

> **For advanced React performance patterns** (eliminating request waterfalls, preventing excessive re-renders, optimizing bundle size), read `react/vercel-react-best-practices/SKILL.md`.

> **For component architecture patterns** (compound components, state decoupling, avoiding boolean prop proliferation), read `react/vercel-composition-patterns/SKILL.md`.
