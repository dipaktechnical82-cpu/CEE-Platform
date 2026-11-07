import type { ApiResponse, ApiErrorResponse } from '@cee/contracts';
import { env } from './env';

export class ApiClientError extends Error {
  public readonly code: string;
  public readonly details: unknown;
  public readonly status: number;

  constructor(message: string, code: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

interface RequestOptions extends RequestInit {
  timeoutMs?: number;
}

function getCsrfCookie(): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookie = document.cookie.split('; ').find((item) => item.startsWith('cee_csrf='));
  return cookie ? decodeURIComponent(cookie.slice('cee_csrf='.length)) : null;
}

async function fetchCsrfToken(signal: AbortSignal, throughBff: boolean): Promise<string> {
  const csrfUrl = throughBff
    ? new URL('/api/v1/auth/csrf/', env.appUrl).toString()
    : `${env.apiUrl.replace(/\/$/, '')}/auth/csrf/`;
  const response = await fetch(csrfUrl, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
    signal,
  });
  const payload = (await response.json()) as ApiResponse<{ csrfToken: string }>;

  if (!response.ok || !payload.success || typeof payload.data.csrfToken !== 'string') {
    throw new ApiClientError(
      'Could not initialize CSRF protection',
      'CSRF_INITIALIZATION_FAILED',
      response.status,
    );
  }

  return payload.data.csrfToken;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { timeoutMs = 15000, headers, ...rest } = options;
  const method = (rest.method ?? 'GET').toUpperCase();

  const url = endpoint.startsWith('http')
    ? endpoint
    : endpoint.startsWith('/api/v1/auth/')
      ? new URL(endpoint, env.appUrl).toString()
      : `${env.apiUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const isApiRequest = new URL(url, env.apiUrl).origin === new URL(env.apiUrl).origin;
  const isBffAuthRequest =
    endpoint.startsWith('/api/v1/auth/') && new URL(url).origin === new URL(env.appUrl).origin;
  const shouldUseCredentials = isApiRequest || isBffAuthRequest;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const requestHeaders = new Headers(headers);
  if (
    !requestHeaders.has('Content-Type') &&
    !(typeof FormData !== 'undefined' && rest.body instanceof FormData)
  ) {
    requestHeaders.set('Content-Type', 'application/json');
  }
  requestHeaders.set('Accept', requestHeaders.get('Accept') ?? 'application/json');

  try {
    if (shouldUseCredentials && !['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(method)) {
      requestHeaders.set(
        'X-CSRFToken',
        getCsrfCookie() ?? (await fetchCsrfToken(controller.signal, isBffAuthRequest)),
      );
    }

    const response = await fetch(url, {
      ...rest,
      headers: requestHeaders,
      method,
      credentials: shouldUseCredentials ? 'include' : 'omit',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    if (!isJson) {
      if (!response.ok) {
        throw new ApiClientError(
          `Server returned HTTP ${response.status}`,
          'SERVER_ERROR',
          response.status,
        );
      }
      return (await response.text()) as unknown as T;
    }

    const payload = (await response.json()) as ApiResponse<T>;

    if (!payload.success) {
      const errorPayload = (payload as ApiErrorResponse).error;
      throw new ApiClientError(
        errorPayload.message || 'API request failed',
        errorPayload.code || 'UNKNOWN_ERROR',
        response.status,
        errorPayload.details,
      );
    }

    return payload.data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiClientError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiClientError('Request timeout exceeded', 'TIMEOUT', 408);
    }

    throw new ApiClientError(
      error instanceof Error ? error.message : 'Network error occurred',
      'NETWORK_ERROR',
      0,
    );
  }
}
