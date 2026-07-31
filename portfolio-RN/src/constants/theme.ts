/// Global design tokens — single source of truth for all visual styles.
/// Palette: "Dark Forge" — deep obsidian background, neon teal accent, premium feel.

export const kColors = {
  // ── Background ─────────────────────────────────────────────────────────────
  bg: '#0a0a0f',
  bgCard: '#0f0f18',
  bgElevated: '#14141f',
  bgGlass: 'rgba(15,15,24,0.7)',

  // ── Accent ─────────────────────────────────────────────────────────────────
  accent: '#00FFD1',   // teal neon
  accentDim: '#00FFD122',
  accentGlow: '#00FFD144',

  // ── Semantic ────────────────────────────────────────────────────────────────
  blue: '#0ea5e9',
  purple: '#a855f7',
  green: '#10b981',
  amber: '#f59e0b',
  pink: '#ec4899',

  // ── Text ───────────────────────────────────────────────────────────────────
  textPrimary: '#f4f4f5',
  textSecondary: '#9ca3af',
  textMuted: '#4b5563',
  textAccent: '#00FFD1',

  // ── Border ─────────────────────────────────────────────────────────────────
  border: '#ffffff11',
  borderMuted: '#ffffff08',
};

export const kFonts = {
  heading: 'BebasNeue_400Regular',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodyBold: 'DMSans_700Bold',
  mono: 'SpaceMono_400Regular',
};

export const kRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 9999,
};

export const kSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
