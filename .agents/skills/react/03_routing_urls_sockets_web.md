# React Web Architecture: Routing, URLs, Sockets & Web Push

This document defines standards for URL routing, query parameter parsing, real-time WebSockets, and Web Push Notifications specifically tailored for the **Web Environment**.

---

## 1. Web Routing & History (`@/constants/routes.ts`)

Unlike mobile apps which use a physical screen stack, Web apps rely on the Browser History API.

### Rules:
- All route paths MUST be declared in `@/constants/routes.ts`.
- Use **`router.push()`** for standard navigation (adds to browser history).
- Use **`router.replace()`** after auth flows or form submissions to prevent the user from clicking the browser "Back" button and resubmitting.

```typescript
export const APP_ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/auth/login',
  },
  COLLECTIONS: {
    DETAIL: (id: string) => `/collections/${id}`,
    SHARE: '/share',
  },
} as const;
```

---

## 2. Persistent Web Layouts (Shell / Navbar)

Web apps typically use a Top Navbar or a Sidebar, not a mobile bottom tab bar.
Use a Layout wrapper to persist the navigation and music/download players across route changes without re-mounting them.

```tsx
import { Outlet } from 'react-router-dom'; // or Next.js layout.tsx
import { TopNavbar } from '@/components/common/top-navbar';
import { GlobalDownloadBar } from '@/components/features/download/global-download-bar';

export function WebRootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <TopNavbar />
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
        <Outlet />
      </main>
      <GlobalDownloadBar />
    </div>
  );
}
```

---

## 3. URL Query Params (Web Alternative to "Deep Links")

On the web, we don't have mobile "Deep Link Intents". Instead, users share URLs with Query Parameters (e.g., `https://loadr.app/share?payload=123`).

### Rule for Shared URLs:
1. Do NOT store pending links in global state on the web.
2. Read the URL Search Params directly on page mount.
3. If the user is unauthenticated, save the intent in `sessionStorage` (e.g., `redirect_after_login=/share?payload=123`), send them to login, then redirect them back.

```typescript
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export function useSharedLinkHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const payload = searchParams.get('payload');
    if (payload) {
      // 1. Process the shared payload
      processSharedData(payload);
      
      // 2. Clean up the URL so the user doesn't re-trigger it on refresh
      navigate(APP_ROUTES.HOME, { replace: true });
    }
  }, [searchParams, navigate]);
}
```

---

## 4. Real-Time WebSockets (`@/services/socket/`)

WebSockets on the web can drop easily when a user switches tabs (Browser tab sleeping/throttling) or loses Wi-Fi.

### The Socket Manager & HTTP Fallback Strategy (CRITICAL):
1. **Event Keys Constants:** Define in `@/constants/socket-events.ts`.
2. **HTTP Fallback:** You **MUST** force an HTTP API refetch whenever the socket reconnects OR when the browser window regains focus (`window.addEventListener('focus')`).

```typescript
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { APP_SOCKET_EVENTS } from '@/constants/socket-events';
import { QUERY_KEYS } from '@/constants/query-keys';

export function useDownloadSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || '', {
      transports: ['websocket'],
    });

    socket.on(APP_SOCKET_EVENTS.DOWNLOAD_PROGRESS, (data) => {
      queryClient.setQueryData(QUERY_KEYS.CART.MINE, data);
    });

    // Fallback 1: On Socket Reconnect
    socket.on(APP_SOCKET_EVENTS.CONNECT, () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART.MINE });
    });

    // Fallback 2: On Browser Tab Focus (Web Specific)
    const onFocus = () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART.MINE });
    window.addEventListener('focus', onFocus);

    return () => {
      socket.disconnect();
      window.removeEventListener('focus', onFocus);
    };
  }, [queryClient]);
}
```

---

## 5. Web Push Notifications (Service Workers)

Unlike mobile FCM background handlers, Web Push requires browser permissions and a registered Service Worker.

- Request `Notification.requestPermission()` only after a user action, NEVER on immediate page load.
- All Web Push payload keys MUST be referenced via `NOTIFICATION_KEYS` (`@/constants/notification-keys.ts`).
