# React & TypeScript Architecture: Network, API Consumer, Services & Error Models

This document defines the network architecture, API client abstractions, error handling, and data validation standards for React/TypeScript applications.

---

## 1. Network & API Handling (`@/services/api/`)

### API Consumer Pattern:
- All HTTP calls must go through a centralized Axios instance configured in `@/services/api/api-consumer.ts`.
- Direct `fetch()` calls or unconfigured `axios.get()` calls in components or hooks are STRICTLY FORBIDDEN.

```typescript
// @/services/api/api-consumer.ts
import axios from 'axios';
import { API_ENDPOINTS } from '@/constants/endpoints';

export const apiConsumer = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for Auth Tokens
apiConsumer.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor for Centralized Error Formatting
apiConsumer.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(AppError.fromAxiosError(error));
  }
);
```

---

## 2. API Endpoints & Payload Keys (`@/constants/endpoints.ts`)

- **Rule:** Never inline API URL strings. All endpoints and payload keys must live in `API_ENDPOINTS` and `API_KEYS`.

```typescript
export const API_ENDPOINTS = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.loadr.app/api/v1',
  DOMAIN: process.env.NEXT_PUBLIC_DOMAIN_URL || 'https://loadr.app',
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
  },
  MEDIA: {
    ANALYZE: '/media/analyze',
    DOWNLOAD: '/media/download',
  },
} as const;

export const API_KEYS = {
  DATA: 'data',
  MESSAGE: 'message',
  PAGINATION: 'pagination',
} as const;
```

---

## 3. Standardized Error Handling (`@/errors/`)

### `AppError` Hierarchy:
Define strict error classes to encapsulate backend and client failures:

```typescript
export class AppError extends Error {
  constructor(
    public override message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }

  static fromAxiosError(error: any): AppError {
    if (error.response) {
      const messageKey = error.response.data?.message || 'server_error';
      return new AppError(messageKey, error.response.status, error.response.data?.code);
    }
    if (error.code === 'ECONNABORTED') {
      return new AppError('timeout_error', 408);
    }
    return new AppError('no_internet_connection', 0);
  }
}
```

### Error Translation in UI:
All user-facing errors must be mapped through `useTranslation()`:
```tsx
import { useTranslation } from 'react-i18next';

export function ErrorBanner({ error }: { error: AppError | null }) {
  const { t } = useTranslation();
  if (!error) return null;

  return (
    <div className="rounded-md bg-destructive/10 p-3 text-destructive">
      <Typography variant="body-sm">{t(`errors.${error.message}`, { defaultValue: t('errors.unexpected_error') })}</Typography>
    </div>
  );
}
```

---

## 4. Strict Data Validation with Zod (`@/types/` & `@/schemas/`)

### Rule: Never Trust API Responses
Always parse/validate untrusted backend payloads using **Zod** schemas to prevent runtime UI crashes:

```typescript
import { z } from 'zod';

export const MediaInfoSchema = z.object({
  id: z.string().default(''),
  title: z.string().default('Untitled'),
  downloadUrl: z.string().default(''),
  thumbnail: z.string().default(''),
  duration: z.number().default(0),
});

export type MediaInfo = z.infer<typeof MediaInfoSchema>;

// Parsing function with fallback
export function parseMediaInfo(rawData: unknown): MediaInfo {
  const result = MediaInfoSchema.safeParse(rawData);
  if (!result.success) {
    console.error('API Schema mismatch:', result.error);
    return MediaInfoSchema.parse({}); // returns object filled with defaults
  }
  return result.data;
}
```

---

## 5. Service Layer Pattern (Interface -> Implementation)

Define abstract interfaces for business services to allow easy mocking and testing:

```typescript
export interface MediaService {
  analyzeUrl(url: string): Promise<MediaInfo>;
}

export class MediaServiceImpl implements MediaService {
  async analyzeUrl(url: string): Promise<MediaInfo> {
    const response = await apiConsumer.post(API_ENDPOINTS.MEDIA.ANALYZE, { url });
    return parseMediaInfo(response.data[API_KEYS.DATA]);
  }
}

export const mediaService = new MediaServiceImpl();
```
