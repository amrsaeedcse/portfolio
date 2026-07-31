## 4. Routing, Deep Links & Notifications (`lib/navigation` & `lib/core/services`)
- **The app uses the `go_router` package for ALL navigation. Never use `Navigator.push()` or `Navigator.pushNamed()` directly.**
  - Use `context.go(route)` to replace the entire navigation stack.
  - Use `context.pushNamed(name, pathParameters: {...}, extra: {...})` to push onto the stack.
  - All route name strings MUST live in `AppRoutes` (`lib/navigation/app_routes.dart`). Never hardcode path strings inline.

- **BOTTOM NAVIGATION INDICES:** Never hardcode tab indices (e.g. `goTo(0)` or `goTo(3)`). ALWAYS use the named constants from `AppNavIndices` in `app_routes.dart` (e.g. `goTo(AppNavIndices.home)`, `goTo(AppNavIndices.history)`). This prevents silent routing bugs if tabs are ever reordered.

- **TAB SWITCHING — SINGLE CALL RULE (CRITICAL):**
  When switching tabs in the `StatefulShellRoute.indexedStack`, use **only** `navigationShell.goBranch(index)`. This is the single source of truth — it updates both the active page AND the navbar index together automatically.
  **ShellRoute Wrapper Rule:** The app's main layout MUST use a `StatefulShellRoute` (Wrapper) to persist the Bottom Navigation Bar across screens. Ensure that navigating between these branches includes smooth transition animations in the routing setup.
  ```dart
  // ✅ ONE call — handles both navigation and navbar sync
  navigationShell.goBranch(AppNavIndices.history);

  // ❌ WRONG — two separate calls cause the navbar and page to desync
  setState(() => _selectedIndex = AppNavIndices.history); // navbar updates
  context.go(AppRoutes.historyScreen);                    // page updates — now they can diverge!
  ```
  - `AppShell` derives the current navbar highlight directly from `navigationShell.currentIndex` — never maintain a separate `_selectedIndex` state variable.


- **Deep Link Handling Pattern (CRITICAL — follow exactly):**
  The app uses a **flag + provider** pattern to handle shared collection links (`http://loadr.app/share?data=...`) safely regardless of whether the app is open or cold-starting:
  1. **GoRouter `redirect`** intercepts `/share` routes before any screen is built.
  2. **If app is NOT initialized** (`RouterGenerationConfig.isAppInitialized == false`):
     - Store the link via `DeepLinkProvider.setDeepLink(link)` using `Future.microtask`.
     - Redirect to `AppRoutes.splashScreen` to complete initialization first.
  3. **If app IS initialized** (already past Splash):
     - Decode and display the collection dialog immediately via `SharedCollectionDialog.show()`.
     - Redirect to `AppRoutes.homeScreen`.
  4. **SplashScreen** calls `context.read<DeepLinkProvider>().consumeDeepLink()` after initialization to read and **clear** the stored link (one-shot — avoids re-processing on widget rebuild).
  - **Never read `provider.pendingLink` directly** — always use `consumeDeepLink()` to prevent double-processing.
  - `RouterGenerationConfig.isAppInitialized` is set to `true` by `SplashScreen` once initialization is complete.

- **Notifications (FCM):** handled in `notification_service.dart`. All FCM payload keys MUST be referenced via `NotificationKeys` (`lib/core/services/notification_keys.dart`). Never use raw strings like `payload['type']`.

## 8. Real-Time Communication & Sockets (`lib/core/services`)
- **Event Keys (No Hardcoding):** ALL Socket.IO event/channel name strings MUST be defined in `app_events.dart` as `static const String` fields. Never use inline strings for channels or events.

- **The Stream-Repository Pattern (CRITICAL):**
  1. **Repository Layer:** The Repository manages the actual Socket subscription and acts as the data "Pipe" (`StreamController`). It listens to the socket events and `add()`s the incoming parsed data into the `Stream`. Crucially, it MUST catch any socket connection errors, timeouts, or parsing failures and push them into the pipe using `addError()`.
  2. **Cubit Layer:** The Cubit does NOT talk to the socket directly. It listens to the Repository's `Stream`. The Cubit's subscription MUST handle both data and errors (`stream.listen(onData, onError: ...)`). When new data flows, it emits `Success`. When an error is caught from the pipe, it reacts immediately by emitting standard UI Error states.

- **Data Syncing (HTTP Fallback):** Sockets can sometimes drop messages or miss the latest state (e.g., app goes to background). You MUST always implement an HTTP fallback endpoint. The Cubit should call this standard API endpoint to fetch the latest state to ensure the UI is perfectly synced, rather than relying 100% on the socket.
