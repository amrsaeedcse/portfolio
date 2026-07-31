/// Error translator hook.
/// Rule 2 from 01_architecture_network_di.md:
/// NEVER display raw backend error strings directly to the user. ALWAYS translate via useTranslateError().

import { useTranslation } from 'react-i18next';

export function useTranslateError() {
  const { t } = useTranslation();
  return (errorKey: string): string => {
    switch (errorKey) {
      case 'no_internet_connection':
        return t('errors.no_internet_connection');
      case 'server_error':
        return t('errors.server_error');
      case 'timeout_error':
        return t('errors.timeout_error');
      case 'failed_to_load_portfolio':
        return t('errors.failed_to_load_portfolio');
      default:
        return errorKey; // unknown key -> show as-is
    }
  };
}
