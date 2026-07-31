# ⚠️ NON-NEGOTIABLE RULES — READ THESE FIRST, ALWAYS FOLLOW

These are the rules most commonly violated. Before writing any code, confirm you are following ALL of them:

| # | Rule | Detail |
|---|------|--------|
| 1 | **Never use raw `<Text>`** | ALWAYS use `CustomText` from `src/components/common/CustomText.tsx` |
| 2 | **Never use `<Image source={{uri}}>`** | ALWAYS use `CachedImage` (wraps `react-native-fast-image`) from `src/components/common/CachedImage.tsx` |
| 3 | **Never hardcode strings in UI** | ALL user-visible text MUST come from `i18next` translation files (`src/locales/en.json`, `src/locales/ar.json`) via `useTranslation()` |
| 4 | **Never hardcode tab indices** | Use `AppTabs.home`, `AppTabs.history`, etc. — never `0`, `1`, `3` |
| 5 | **Never hardcode route names** | Use `AppRoutes.Home`, `AppRoutes.Analysis`, etc. from `src/navigation/routes.ts` — never raw string literals in `navigate()` |
| 6 | **Every screen/component MUST animate** | Use built-ins first → `react-native-reanimated` → `moti` |
| 7 | **Split large screens into components** | Screens > 200 lines → extract to `features/featureName/components/` |
| 8 | **Shared components go to `components/common/`** | If used in 2+ places → make generic and move there |
| 9 | **Update TASKS.md + MEMORY.md** | After EVERY completed task — not optional |
| 10 | **Never scatter raw navigation calls** | ALWAYS go through `navigate(AppRoutes.X)` / `reset(...)` using the typed `AppRoutes` constants |
| 11 | **Error keys → `useTranslateError()`** | NEVER show raw backend error strings to the user |
| 12 | **Services → import the singleton directly from its module** | NEVER instantiate services manually with `new MyService()` — import the exported instance (e.g. `import { cartRepository } from '@/repositories/cartRepository'`) |
| 13 | **Sizes → `react-native-size-matters`** | `moderateScale()` for fonts, `scale()`/`verticalScale()` for layout, `moderateScale()` for radius — never raw numbers |
| 14 | **Colors → `useAppTheme().colors.*`** | NEVER use raw hex codes or RN's default palette in UI |
| 15 | **Debug Logging** | Wrap all `console.log()` calls with `if (__DEV__)`. Prefer a `logger.debug()` helper |
| 16 | **State shape → Discriminated Unions** | Every async store state MUST be a discriminated union (`{status:'success', items}` etc.), never flat optional fields — see `02_state_management_zustand.md` |
| 17 | **No runtime Models / Parsers → use TS Interfaces** | Never create runtime model classes or companion parser functions in `src/models/` (a Flutter legacy pattern). Rely strictly on TypeScript interfaces and structural typing — see `04_ui_theme_animations_widgets.md` §13 |
