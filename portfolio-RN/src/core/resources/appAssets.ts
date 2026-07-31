/// Central asset registry.
/// Rule 7 from 04_ui_theme_animations_widgets.md:
/// ALL asset paths/requires MUST be defined as export const fields in AppAssets. Never hardcode require() inline.

export const AppAssets = {
  // Fonts
  bebasNeue: require('../../../assets/fonts/BebasNeue-Regular.ttf'),
  dmSansRegular: require('../../../assets/fonts/DMSans-Regular.ttf'),
  dmSansMedium: require('../../../assets/fonts/DMSans-Medium.ttf'),
  dmSansBold: require('../../../assets/fonts/DMSans-Bold.ttf'),
  spaceMono: require('../../../assets/fonts/SpaceMono-Regular.ttf'),
  
  // Images (placeholders / fallbacks)
  defaultAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  placeholderProject: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
} as const;
