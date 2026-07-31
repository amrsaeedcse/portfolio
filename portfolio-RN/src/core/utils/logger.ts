/// __DEV__ wrapped logger utility.
/// Rule 15 from 00_rn_non_negotiables.md:
/// Wrap all console.log() calls with if (__DEV__). Prefer a logger.debug() helper.

export const logger = {
  debug(message: string, ...optionalParams: any[]): void {
    if (__DEV__) {
      console.log(`[DEBUG] ${message}`, ...optionalParams);
    }
  },

  warn(message: string, ...optionalParams: any[]): void {
    if (__DEV__) {
      console.warn(`[WARN] ${message}`, ...optionalParams);
    }
  },

  error(message: string, ...optionalParams: any[]): void {
    if (__DEV__) {
      console.error(`[ERROR] ${message}`, ...optionalParams);
    }
  },
};
