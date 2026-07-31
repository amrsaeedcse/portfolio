# ⚠️ REACT & TYPESCRIPT NON-NEGOTIABLE RULES — ALWAYS FOLLOW

These are the strict project standards for React & TypeScript web application development. Before writing any code, confirm you are following ALL of them:

| # | Rule | Detail |
|---|------|--------|
| 1 | **Typography Component** | NEVER use raw `<p>`, `<span>`, `<h1>`-`<h6>` tags directly in UI pages. ALWAYS use `<Typography variant="...">` from `@/components/common/typography` |
| 2 | **Image Handling** | NEVER use raw `<img>` tags. ALWAYS use `<CustomImage />` from `@/components/common/image` (includes lazy loading, fallback shimmer, & error states) |
| 3 | **Navigation & Routes** | NEVER hardcode string URLs or route paths inline. ALWAYS use constants from `APP_ROUTES` in `@/constants/routes.ts` |
| 4 | **No useEffect for Data Fetching** | NEVER use `useEffect` for API calls or remote data fetching. Remote/Server state MUST be managed via TanStack Query (`useQuery` / `useMutation`) |
| 5 | **UI State Management** | Global client UI state (Modals, Theme, User Settings) MUST be managed via Zustand stores in `@/stores/` |
| 6 | **Tailwind Tokens & Styling** | NEVER write raw Hex colors (e.g., `#FF0000`) or inline styles (`style={{...}}`). ALWAYS use Tailwind CSS classes and design system theme tokens |
| 7 | **Error Handling & i18n** | NEVER display raw backend error strings directly to the user. Wrap errors in `AppError` keys and translate via `useTranslation()` / `i18next` |
| 8 | **Mandatory Animations** | Every page and major component MUST have entrance/exit animations using Motion (`motion/react`) or Tailwind transitions |
| 9 | **Generic Reusable Components** | If a UI element is used in 2+ places, extract it to `@/components/common/` as a generic, parameterized component |
| 10 | **Component File Size Limit** | Keep component files under 200 lines. Split complex pages into smaller sub-components inside `@/components/features/[featureName]/` |
| 11 | **Strict TypeScript Types** | NEVER use `any`. Always define explicit interfaces or types for props, state, and API payload/responses |
| 12 | **Update TASKS.md + MEMORY.md** | Update task status in `TASKS.md` and log architectural decisions/bugs in `MEMORY.md` after EVERY completed task |

---

## Detailed Guidelines

### 1. Typography Component Standard
```tsx
// ❌ WRONG
<h1>Welcome back</h1>
<p className="text-gray-500">Manage your downloads here</p>

// ✅ CORRECT
import { Typography } from '@/components/common/typography';

<Typography variant="h1" className="text-primary">Welcome back</Typography>
<Typography variant="body-sm" color="muted">Manage your downloads here</Typography>
```

### 2. Custom Image Standard
```tsx
// ❌ WRONG
<img src={user.avatar} alt="User Avatar" />

// ✅ CORRECT
import { CustomImage } from '@/components/common/image';

<CustomImage src={user.avatar} alt="User Avatar" width={48} height={48} rounded="full" />
```

### 3. Route Constants Standard
```tsx
// ❌ WRONG
router.push('/dashboard/analytics');

// ✅ CORRECT
import { APP_ROUTES } from '@/constants/routes';

router.push(APP_ROUTES.DASHBOARD.ANALYTICS);
```

### 4. Data Fetching vs State Management
- **TanStack Query (React Query):** Handles all asynchronous server operations, caching, background revalidation, optimistic updates, and loading/error states for APIs.
- **Zustand:** Handles local client-side interactive state, global dialog/modal visibility, theme toggles, and user preference state.

### 5. Error Translation Flow
```tsx
// ❌ WRONG
<div>{error.response?.data?.message}</div>

// ✅ CORRECT
import { useTranslation } from 'react-i18n';
import { getTranslatedErrorMessage } from '@/utils/error-translator';

const { t } = useTranslation();
<div>{t(getTranslatedErrorMessage(error))}</div>
```

---

## Related Skills (MUST READ when applicable)

When working on a React/Web project, the following specialized skill files are available inside this same `react/` folder. You MUST consult them before writing code in these areas:

| When you need... | Read this skill |
|-----------------|----------------|
| **Animations & Page Transitions** | `react/framer-motion-animator/` — Motion variants, gestures, scroll animations, AnimatePresence |
| **3D Scenes & WebGL** | `react/threejs-fundamentals/` → then `threejs-animation/`, `threejs-geometry/`, `threejs-materials/`, `threejs-lighting/`, `threejs-shaders/`, `threejs-postprocessing/`, `threejs-textures/`, `threejs-loaders/`, `threejs-interaction/` |
| **UI/UX Design Quality** | `react/frontend-design/` — Intentional visual design, typography, avoiding generic AI aesthetics |
| **Component Composition** | `react/vercel-composition-patterns/` — Compound components, state decoupling, React 19 APIs |
| **Performance Optimization** | `react/vercel-react-best-practices/` — Bundle size, data fetching, re-render prevention |
| **View Transitions** | `react/vercel-react-view-transitions/` — Native browser View Transition API in React |
