/// Axios interceptors for handling Token / Refresh Token logic.
/// Rule 1 from 01_architecture_network_di.md:
/// If the current feature does not require authentication, comment out the token-handling logic inside the interceptor rather than deleting it.

import { AxiosInstance } from 'axios';
// import { ApiKeys } from './endPoints';
// import { cacheHelper } from '../storage/cacheHelper';
// import { CacheKeys } from '../storage/cacheKeys';

export function setupInterceptors(client: AxiosInstance): void {
  client.interceptors.request.use(
    async (config) => {
      /*
      // Rule 1: Commented out token handling for portfolio (no auth required)
      const token = await cacheHelper.getString(CacheKeys.token);
      if (token && config.headers) {
        config.headers[ApiKeys.authorization] = `${ApiKeys.bearer} ${token}`;
      }
      */
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      /*
      // Rule 1: Commented out refresh token / 401 handling
      if (error.response?.status === 401) {
        // Handle token refresh or redirect to login
      }
      */
      return Promise.reject(error);
    }
  );
}
