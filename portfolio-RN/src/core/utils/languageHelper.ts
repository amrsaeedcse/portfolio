/// Language switcher helper.
/// Rule 7 from 04_ui_theme_animations_widgets.md:
/// When changing locale, always update AppFonts.mainFontName alongside i18next.changeLanguage().

import i18n from '@/locales';
import { AppFonts } from '@/core/theme/appFonts';
import { cacheHelper } from '@/core/storage/cacheHelper';
import { CacheKeys } from '@/core/storage/cacheKeys';
import { I18nManager } from 'react-native';

export async function changeLanguage(lang: 'en' | 'ar'): Promise<void> {
  await i18n.changeLanguage(lang);
  await cacheHelper.setString(CacheKeys.locale, lang);

  if (lang === 'ar') {
    AppFonts.mainFontName = 'DMSans_400Regular'; // Or Arabic font when loaded
    I18nManager.forceRTL(true);
  } else {
    AppFonts.mainFontName = 'DMSans_400Regular';
    I18nManager.forceRTL(false);
  }
}

export function getCurrentLanguage(): string {
  return i18n.language || 'en';
}
