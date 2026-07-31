# MEMORY.md — Portfolio RN

## Decisions Log
| Date | Decision | Why |
|------|----------|-----|
| 2026-07-27 | Full Architectural Folder Structure (`src/core/api`, `src/core/storage`, etc.) | Adhering strictly to user's RN skill documentation (`01_architecture`, `04_ui`) |
| 2026-07-27 | `i18next` + `react-i18next` (`src/locales/en.json`, `ar.json`) | Rule 3 from `00_rn_non_negotiables`: All user-visible text MUST come from i18next |
| 2026-07-27 | `src/navigation/routes.ts` for route/tab constants | Rule 5 from `00_rn_non_negotiables`: canonical location for routing constants |
| 2026-07-27 | Common generic components (`CustomButton`, `CustomTextField`, `AppLoader`) | Rule 14 from `04_ui`: mandatory shared components in `src/components/common/` |
| 2026-07-27 | `logger.ts` wrapper | Rule 15 from `00_rn_non_negotiables`: wrap console logs with `__DEV__` check |
| 2026-07-27 | Used `useFonts` instead of config plugin for fonts | Expo Go compatibility — config plugin needs full native build |
| 2026-07-27 | `src/app/` structure with `@/ → src/` alias | Expo Router SDK 57 supports `src/app/` automatically |
| 2026-07-27 | Static dark-only theme (no light/dark toggle) | Portfolio app — consistent brand identity, no need for light mode |
| 2026-07-27 | Reanimated 4.x `.get()` / `.set()` API | React Compiler enabled in experiments — `.value` breaks compiler |
| 2026-07-27 | Repository Pattern (`PortfolioRepositoryImpl`) without model parser classes | React Native / TS structural typing: removed legacy Flutter `models/` parsers in favor of pure TypeScript interfaces and zero-overhead data passing |
| 2026-07-28 | Web-First Adaptive Layouts (`AdaptiveContainer`, Top Navbar, Multi-Column Grids) | When `useWindowDimensions().width >= 768`, app switches from bottom mobile tabs to floating top glassmorphic navbar and renders cards in responsive 2/3-column web grids |
| 2026-07-28 | Vercel GPU-Accelerated Animations (`AmbientGlowBackground`, `CustomButton`) | Adhered strictly to `vercel-react-native-skills`: only animating transform (translateX/Y, scale) and opacity on the GPU. Created continuous floating background glow blobs and spring micro-scaling buttons |

## Known Bugs & Fixes
| Bug | Root Cause | Fix Applied |
|-----|-----------|-------------|
| TypeScript conflicts | Leftover template files from Expo Go default setup | Cleaned up unused `src/components/` template components and `src/hooks/` |
| Web bundler crash (`tslib.__extends` undefined) | Metro ESM vs CommonJS resolution conflict for `tslib` v2.8+ | Custom `metro.config.js` resolving `tslib` imports to stable CommonJS bundle |

## Current Sprint Context
- Feature: Completed Vercel GPU-Accelerated Living Backgrounds and Micro-Animations across all screens — DONE (0 TS errors, clean web export)
- Next: Final deployment staging and production launch

## Package Registry
| Package | Version | Reason |
|---------|---------|--------|
| axios | ^1.7.9 | Concrete ApiConsumer HTTP client |
| @react-native-async-storage/async-storage | ^2.1.0 | Storage wrapper for cacheHelper |
| i18next / react-i18next | ^24.2.0 | Mandatory localization system |
| moti | ^0.30.0 | Declarative entrance animations (stagger, fade) |
| expo-linear-gradient | ~57.0.1 | Background gradients |
| @shopify/flash-list | 2.0.2 | Virtualized projects list |
| react-native-size-matters | ^0.4.2 | Responsive sizing (moderateScale, scale, verticalScale) |
| zustand | ^5.0.3 | State management with Discriminated Unions |
