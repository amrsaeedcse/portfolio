/// Async storage wrapper helper.
/// Rule 7 from 04_ui_theme_animations_widgets.md:
/// Use cacheHelper.ts (wraps @react-native-async-storage/async-storage) for read/write operations.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { CacheKey } from './cacheKeys';

export const cacheHelper = {
  async getString(key: CacheKey): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },

  async setString(key: CacheKey, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch {}
  },

  async getObject<T>(key: CacheKey): Promise<T | null> {
    try {
      const val = await AsyncStorage.getItem(key);
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  },

  async setObject(key: CacheKey, value: any): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },

  async remove(key: CacheKey): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch {}
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch {}
  },
};
