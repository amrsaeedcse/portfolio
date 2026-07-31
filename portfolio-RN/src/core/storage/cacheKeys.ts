/// Storage key constants.
/// Rule 7 from 04_ui_theme_animations_widgets.md:
/// ALL storage keys MUST be defined in CacheKeys. Never define ad-hoc key strings inside a store or service.

export const CacheKeys = {
  token: 'TOKEN_KEY',
  refreshToken: 'REFRESH_TOKEN_KEY',
  locale: 'LOCALE_KEY',
  themeMode: 'THEME_MODE_KEY',
  cachedProjects: 'CACHED_PROJECTS',
} as const;

export type CacheKey = (typeof CacheKeys)[keyof typeof CacheKeys];
