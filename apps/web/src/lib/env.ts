/**
 * Environment configuration validator
 */

export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  environment: (process.env.NEXT_PUBLIC_ENVIRONMENT || 'development') as
    'development' | 'staging' | 'production',
  isProduction: process.env.NEXT_PUBLIC_ENVIRONMENT === 'production',
  isDevelopment: process.env.NEXT_PUBLIC_ENVIRONMENT !== 'production',
} as const;
