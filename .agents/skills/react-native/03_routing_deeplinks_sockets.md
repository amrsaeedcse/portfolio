## 4. Routing, Deep Links & Notifications (`src/navigation` & `src/core/services`)
- **The app uses `@react-navigation/native` for ALL navigation. Never call `navigation.navigate('SomeScreen')` with a raw string literal.**
  - Use `navigation.navigate(AppRoutes.Home)` for normal pushes.
  - Use `navigation.reset({ index: 0, routes: [{ name: AppRoutes.Home }] })` to replace the entire navigation stack (equivalent to `context.go()`).
  - All route name strings MUST live in `AppRoutes` (`src/navigation/routes.ts`) as a `const` object or string-literal union type. Never hardcode path strings inline.

- **BOTTOM TAB INDICES:** Never hardcode tab indices (e.g. `jumpTo(0)` or index `3`). ALWAYS use the named constants from `AppTabs` in `src/navigation/routes.ts` (e.g. `jumpTo(AppTabs.home)`, `jumpTo(AppTabs.history)`). This prevents silent routing bugs if tabs are ever reordered.

- **TAB SWITCHING — SINGLE CALL RULE (CRITICAL):**
  When switching tabs inside a `Bottom Tab Navigator`, use **only** `navigation.jumpTo(AppTabs.x)` or `navigation.navigate(AppTabs.x)` on the tab navigator's own `navigation` prop. This is the single source of truth — React Navigation updates both the active screen AND the tab bar highlight together automatically.
  **Navigator Wrapper Rule:** The app's main layout MUST use a `createBottomTabNavigator` (Wrapper) nested inside the root `NavigationContainer` to persist the Bottom Tab Bar across screens. Ensure `screenOptions={{ animation: 'shift' }}` (or an equivalent transition option) is set for smooth tab/stack transitions.
  ```typescript
  // ✅ ONE call — handled entirely by React Navigation's own state
  navigation.jumpTo(AppTabs.history);

  // ❌ WRONG — manually tracking a separate "selectedIndex" and syncing it yourself
  setSelectedIndex(AppTabs.history); // local state updates
  navigation.navigate(AppRoutes.HistoryScreen); // navigator updates — now they can diverge!
  ```
  - The active tab highlight MUST be derived from the navigator's own state (`useNavigationState` / the `state.index` passed into your custom tab bar) — never maintain a separate `selectedIndex` state variable outside it.

- **Deep Link Handling Pattern (CRITICAL — follow exactly):**
  The app uses a **flag + store** pattern to handle shared collection links (`https://loadr.app/share?data=...`) safely regardless of whether the app is open or cold-starting:
  1. The `linking` config's `subscribe`/`getInitialURL` intercepts `/share` URLs before any screen is mounted, via a custom `getStateFromPath` or a listener in `App.tsx`.
  2. **If app is NOT initialized** (`useAppInitStore.getState().isAppInitialized === false`):
     - Store the link via `useDeepLinkStore.getState().setDeepLink(link)`.
     - Let normal cold-start flow continue to `AppRoutes.Splash` to complete initialization first.
  3. **If app IS initialized** (already past Splash):
     - Decode and display the collection dialog immediately via `SharedCollectionDialog.show()`.
     - Navigate to `AppRoutes.Home`.
  4. **SplashScreen** calls `useDeepLinkStore.getState().consumeDeepLink()` after initialization to read and **clear** the stored link (one-shot — avoids re-processing on re-render).
  - **Never read `store.pendingLink` directly** — always use `consumeDeepLink()` to prevent double-processing.
  - `useAppInitStore`'s `isAppInitialized` flag is set to `true` by `SplashScreen` once initialization is complete.

- **Notifications (FCM via `@react-native-firebase/messaging`):** handled in `notificationService.ts`. All FCM payload keys MUST be referenced via `NotificationKeys` (`src/core/services/notificationKeys.ts`). Never use raw strings like `payload['type']`.

## 8. Real-Time Communication & Sockets (`src/core/services`)
- **Event Keys (No Hardcoding):** ALL Socket.IO event/channel name strings MUST be defined in `appEvents.ts` as `export const` string constants. Never use inline strings for channels or events.

- **The Observable-Repository Pattern (CRITICAL):**
  1. **Repository Layer:** The Repository manages the actual `socket.io-client` subscription and acts as the data "Pipe" — expose it as an `EventEmitter` or an RxJS `Observable`/simple pub-sub. It listens to socket events and pushes the incoming parsed data into the pipe. Crucially, it MUST catch any socket connection errors, timeouts, or parsing failures and push them into the pipe as error events (`emitter.emit('error', err)`), not throw silently.
  2. **Store Layer:** The Zustand store does NOT talk to the socket directly. It subscribes to the Repository's emitter/observable in a `useEffect` at the app or feature root, and handles both data and error events. When new data flows, it calls `set({ status: 'success', ... })`. When an error is caught from the pipe, it reacts immediately by setting the standard UI error state.

- **Data Syncing (HTTP Fallback):** Sockets can sometimes drop messages or miss the latest state (e.g., app goes to background). You MUST always implement an HTTP fallback endpoint. The store should call this standard API endpoint (e.g. on `AppState` returning to `'active'`) to fetch the latest state and ensure the UI is perfectly synced, rather than relying 100% on the socket.
