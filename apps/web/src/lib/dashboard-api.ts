import type { HealthCheckResponse } from '@cee/contracts';
import { apiClient } from './api-client';
import { env } from './env';

export const dashboardApi = {
  platformHealth: () =>
    apiClient<HealthCheckResponse>(new URL('/api/health/', env.apiUrl).toString(), {
      cache: 'no-store',
      timeoutMs: 8000,
    }),
};
